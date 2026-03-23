import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Conjugaison, Verbe } from '@/lib/types';
import { PRONOMS, PRONOM_LABELS } from '@/lib/types';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: { verbId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('verbes')
    .select('verbe_arabizi, sens_fr')
    .eq('verb_id', params.verbId)
    .single();
  if (!data) return { title: 'Verbe introuvable' };
  return {
    title: `${data.verbe_arabizi} — Conjugaison complète`,
    description: `Conjugaison complète du verbe ${data.verbe_arabizi} (${data.sens_fr}) en darija algérienne. Passé, présent et impératif.`,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from('verbes').select('verb_id');
  return (data ?? []).map(({ verb_id }) => ({ verbId: verb_id }));
}

const TEMPS_CONFIG = {
  Passé: { bg: 'bg-[#E8F0E5]', header: 'bg-[#2D6A4F] text-white', border: 'border-[#2D6A4F]/20' },
  Présent: { bg: 'bg-[#E5EEF5]', header: 'bg-[#4A90B8] text-white', border: 'border-[#4A90B8]/20' },
  Impératif: { bg: 'bg-[#F5EDE3]', header: 'bg-[#C17817] text-white', border: 'border-[#C17817]/20' },
} as const;

type Temps = keyof typeof TEMPS_CONFIG;

export default async function ConjugaisonVerbePage({ params }: Props) {
  const [{ data: verbe }, { data: conjData }] = await Promise.all([
    supabase.from('verbes').select('*').eq('verb_id', params.verbId).single(),
    supabase.from('conjugaisons').select('*').eq('verb_id', params.verbId),
  ]);

  if (!verbe) notFound();

  const conjugaisons = (conjData ?? []) as Conjugaison[];

  // Mots liés à ce verbe
  const { data: motLies } = await supabase
    .from('mots')
    .select('id, mot_arabizi, slug, traduction_fr')
    .eq('verb_id', params.verbId)
    .limit(5);

  return (
    <div className="max-container padding-container py-8">
      <Breadcrumbs
        crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Conjugaison', href: '/conjugaison' },
          { label: verbe.verbe_arabizi },
        ]}
      />

      <div className="mb-8">
        <h1 className="font-display font-arabizi text-4xl font-black text-[#1A1A2E] mb-1">{verbe.verbe_arabizi}</h1>
        <p className="text-xl text-[#6B6B7B]">{verbe.sens_fr}</p>
        <p className="text-[#6B6B7B]/50 text-sm mt-1 font-mono">{verbe.verb_id}</p>
      </div>

      {/* Tableaux de conjugaison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {(Object.keys(TEMPS_CONFIG) as Temps[]).map((temps) => {
          const conj = conjugaisons.find((c) => c.temps === temps);
          const cfg = TEMPS_CONFIG[temps];
          return (
            <div
              key={temps}
              className={`rounded-2xl border ${cfg.border} overflow-hidden`}
            >
              <div className={`px-5 py-3 ${cfg.header}`}>
                <h2 className="font-display font-bold text-base">{temps}</h2>
              </div>
              <table className={`w-full text-sm ${cfg.bg}`}>
                <tbody>
                  {PRONOMS.map((pronom) => (
                    <tr key={pronom} className="border-b border-white/60 last:border-0">
                      <td className="px-4 py-2.5 text-[#6B6B7B] text-xs font-medium">
                        {PRONOM_LABELS[pronom]}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-[#1A1A2E] text-right font-arabizi">
                        {conj?.[pronom] ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Mots du dictionnaire liés à ce verbe */}
      {motLies && motLies.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F5EDE3] p-6">
          <h2 className="font-display font-bold text-[#1A1A2E] mb-4">Dans le dictionnaire</h2>
          <div className="flex flex-wrap gap-2">
            {motLies.map((m) => (
              <Link
                key={m.id}
                href={`/dictionnaire/${m.slug}`}
                className="inline-flex items-center gap-2 bg-[#FBF7F0] hover:bg-[#F5EDE3] border border-[#F5EDE3] rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <span className="font-arabizi font-semibold text-[#1A1A2E]">{m.mot_arabizi}</span>
                <span className="text-[#6B6B7B] text-xs">— {m.traduction_fr}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/conjugaison"
          className="inline-flex items-center gap-1 text-sm text-[#6B6B7B] hover:text-[#C17817] transition-colors"
        >
          <ChevronLeft size={16} />
          Retour à tous les verbes
        </Link>
      </div>
    </div>
  );
}
