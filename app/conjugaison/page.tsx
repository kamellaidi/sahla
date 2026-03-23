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
        <GitBranch className="text-[#E65100]" size={28} />
        <h1 className="text-3xl font-black text-[#1B4F72]">Conjugaison</h1>
      </div>
      <p className="text-gray-500 mb-8">
        {verbes.length} verbes conjugués en darija — passé, présent et impératif
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {verbes.map((verbe) => (
          <Link
            key={verbe.verb_id}
            href={`/conjugaison/${verbe.verb_id}`}
            className="bg-white rounded-xl border border-gray-100 hover:border-[#1B4F72]/30 hover:shadow-md transition-all p-4 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#1B4F72] group-hover:text-[#E65100] transition-colors text-base">
                {verbe.verbe_arabizi}
              </span>
              <span className="text-xs text-gray-300 font-mono">{verbe.verb_id}</span>
            </div>
            <p className="text-gray-600 text-sm">{verbe.sens_fr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
