import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Verbe } from '@/lib/types';
import { GitBranch } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Conjugaison — 69 verbes en darija algérienne',
  description:
    'Conjugaison de 69 verbes en darija algérienne (arabizi). Passé, présent et impératif pour chaque verbe.',
};

async function getVerbes(): Promise<Verbe[]> {
  const { data } = await supabase.from('verbes').select('*').order('verb_id');
  return data ?? [];
}

export default async function ConjugaisonPage() {
  const verbes = await getVerbes();

  return (
    <div className="max-container padding-container py-8">
      <div className="flex items-center gap-3 mb-2">
        <GitBranch className="text-[#C17817]" size={28} />
        <h1 className="font-display text-3xl font-black text-[#1A1A2E]">Conjugaison</h1>
      </div>
      <p className="text-[#6B6B7B] mb-8">
        {verbes.length} verbes conjugués en dardja — passé, présent et impératif
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {verbes.map((verbe) => (
          <Link
            key={verbe.verb_id}
            href={`/conjugaison/${verbe.verb_id}`}
            className="bg-white rounded-xl border border-[#F5EDE3] border-l-4 border-l-transparent hover:border-l-[#C17817] transition-all p-4 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-arabizi font-bold text-[#1A1A2E] group-hover:text-[#C17817] transition-colors text-base">
                {verbe.verbe_arabizi}
              </span>
              <span className="text-xs text-[#6B6B7B]/50 font-mono">{verbe.verb_id}</span>
            </div>
            <p className="text-[#6B6B7B] text-sm">{verbe.sens_fr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
