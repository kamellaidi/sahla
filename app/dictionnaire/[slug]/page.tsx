import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Mot, Conjugaison, Verbe } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MotDetailClient from './MotDetailClient';

export const dynamic = 'force-dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: mot } = await supabase
    .from('mots')
    .select('mot_arabizi, traduction_fr, exemple_arabizi')
    .eq('slug', params.slug)
    .single();

  if (!mot) return { title: 'Mot introuvable' };

  const title = `${mot.mot_arabizi} — ${mot.traduction_fr}`;
  const description = `Apprends le mot ${mot.mot_arabizi} en darija algérienne. ${mot.traduction_fr}.${mot.exemple_arabizi ? ` Exemple : ${mot.exemple_arabizi}.` : ''} Conjugaison et définition sur Sahla.`;

  return {
    title,
    description,
    openGraph: { title, description },
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: mot.mot_arabizi,
        description: mot.traduction_fr,
        inDefinedTermSet: 'https://sahla.app/dictionnaire',
      }),
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from('mots').select('slug');
  return (data ?? []).map(({ slug }) => ({ slug }));
}

async function fetchMotData(slug: string) {
  const { data: mot } = await supabase.from('mots').select('*').eq('slug', slug).single();
  if (!mot) return null;

  // Verbes adjacents (prev/next par ID)
  const [{ data: prevMots }, { data: nextMots }] = await Promise.all([
    supabase.from('mots').select('slug, mot_arabizi').lt('id', mot.id).order('id', { ascending: false }).limit(1),
    supabase.from('mots').select('slug, mot_arabizi').gt('id', mot.id).order('id', { ascending: true }).limit(1),
  ]);

  // Mots de la même catégorie
  let categoryMots: Pick<Mot, 'id' | 'mot_arabizi' | 'slug' | 'traduction_fr' | 'categorie' | 'traduction_en' | 'verb_id'>[] = [];
  if (mot.categorie) {
    const { data } = await supabase
      .from('mots')
      .select('id, mot_arabizi, slug, traduction_fr, categorie, traduction_en, verb_id')
      .eq('categorie', mot.categorie)
      .neq('id', mot.id)
      .limit(6);
    categoryMots = data ?? [];
  }

  // Conjugaison si VERB_ID
  let conjugaisons: Conjugaison[] = [];
  let verbe: Verbe | null = null;
  if (mot.verb_id) {
    const [{ data: conjData }, { data: verbeData }] = await Promise.all([
      supabase.from('conjugaisons').select('*').eq('verb_id', mot.verb_id),
      supabase.from('verbes').select('*').eq('verb_id', mot.verb_id).single(),
    ]);
    conjugaisons = conjData ?? [];
    verbe = verbeData ?? null;
  }

  return {
    mot: mot as Mot,
    prev: prevMots?.[0] ?? null,
    next: nextMots?.[0] ?? null,
    categoryMots: categoryMots as Mot[],
    conjugaisons,
    verbe,
  };
}

export default async function MotPage({ params }: Props) {
  const data = await fetchMotData(params.slug);
  if (!data) notFound();

  const { mot, prev, next, categoryMots, conjugaisons, verbe } = data;

  const crumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Dictionnaire', href: '/dictionnaire' },
    ...(mot.categorie ? [{ label: mot.categorie, href: `/dictionnaire?categorie=${mot.categorie}` }] : []),
    { label: mot.mot_arabizi },
  ];

  return (
    <div className="max-container padding-container py-8">
      <Breadcrumbs crumbs={crumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* En-tête */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-3 flex-wrap mb-3">
              <h1 className="text-4xl font-black text-[#1B4F72]">{mot.mot_arabizi}</h1>
              <Badge label={mot.categorie} className="mt-2" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-1">{mot.traduction_fr}</p>
            {mot.traduction_en && (
              <p className="text-gray-400 text-base">{mot.traduction_en}</p>
            )}
            {mot.notes && (
              <p className="text-gray-500 text-sm mt-3 bg-gray-50 rounded-lg px-4 py-2 italic">
                💡 {mot.notes}
              </p>
            )}
          </div>

          {/* Phrase d'exemple interactive + conjugaison */}
          <MotDetailClient
            mot={mot}
            conjugaisons={conjugaisons}
            verbe={verbe}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mots de la même catégorie */}
          {categoryMots.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-[#1B4F72] mb-4">
                Autres mots en &quot;{mot.categorie}&quot;
              </h2>
              <div className="space-y-2">
                {categoryMots.map((m) => (
                  <Link
                    key={m.id}
                    href={`/dictionnaire/${m.slug}`}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:text-[#E65100] transition-colors group"
                  >
                    <span className="font-semibold text-sm group-hover:text-[#E65100] transition-colors">
                      {m.mot_arabizi}
                    </span>
                    <span className="text-gray-400 text-xs">{m.traduction_fr}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/dictionnaire?categorie=${mot.categorie}`}
                className="text-xs text-[#E65100] font-medium mt-3 inline-block hover:underline"
              >
                Voir tous les mots en &quot;{mot.categorie}&quot; →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation prev/next */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
        {prev ? (
          <Link
            href={`/dictionnaire/${prev.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1B4F72] transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>
              <span className="text-gray-400 block text-xs">Précédent</span>
              <span className="font-semibold">{prev.mot_arabizi}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/dictionnaire/${next.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1B4F72] transition-colors group text-right"
          >
            <span>
              <span className="text-gray-400 block text-xs">Suivant</span>
              <span className="font-semibold">{next.mot_arabizi}</span>
            </span>
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
