import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { GrammaireRegle } from '@/lib/types';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GrammaireRule from '@/components/sahla/GrammaireRule';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: { theme: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('grammaire')
    .select('theme')
    .eq('theme_slug', params.theme)
    .limit(1)
    .single();
  if (!data) return { title: 'Thème introuvable' };
  return {
    title: `Grammaire : ${data.theme}`,
    description: `Règles de grammaire darija pour le thème : ${data.theme}. Apprends la structure de l'arabe algérien sur Sahla.`,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from('grammaire').select('theme_slug');
  const slugs = Array.from(new Set((data ?? []).map((r) => r.theme_slug)));
  return slugs.map((slug) => ({ theme: slug }));
}

export default async function GrammaireThemePage({ params }: Props) {
  const { data } = await supabase
    .from('grammaire')
    .select('*')
    .eq('theme_slug', params.theme)
    .order('id');

  if (!data || data.length === 0) notFound();

  const regles = data as GrammaireRegle[];
  const theme = regles[0].theme;

  return (
    <div className="max-container padding-container py-8">
      <Breadcrumbs
        crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Grammaire', href: '/grammaire' },
          { label: theme },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-[#1A1A2E]">{theme}</h1>
        <p className="text-[#6B6B7B] mt-1">
          {regles.length} règle{regles.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {regles.map((regle) => (
          <GrammaireRule key={regle.id} regle={regle} />
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/grammaire"
          className="inline-flex items-center gap-1 text-sm text-[#6B6B7B] hover:text-[#C17817] transition-colors"
        >
          <ChevronLeft size={16} />
          Retour à tous les thèmes
        </Link>
      </div>
    </div>
  );
}
