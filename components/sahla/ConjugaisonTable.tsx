'use client';

import { useState } from 'react';
import type { Conjugaison } from '@/lib/types';
import { PRONOMS, PRONOM_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConjugaisonTableProps {
  conjugaisons: Conjugaison[];
  verbId: string;
  verbeArabizi?: string;
  showLink?: boolean;
}

const TEMPS_CONFIG = {
  Passé: {
    label: 'Passé',
    bg: 'bg-[#E8F0E5]',
    activeBg: 'bg-[#2D6A4F]',
    border: 'border-[#2D6A4F]/20',
  },
  Présent: {
    label: 'Présent',
    bg: 'bg-[#E5EEF5]',
    activeBg: 'bg-[#4A90B8]',
    border: 'border-[#4A90B8]/20',
  },
  Impératif: {
    label: 'Impératif',
    bg: 'bg-[#F5EDE3]',
    activeBg: 'bg-[#C17817]',
    border: 'border-[#C17817]/20',
  },
} as const;

type Temps = keyof typeof TEMPS_CONFIG;

export default function ConjugaisonTable({
  conjugaisons,
  verbId,
  verbeArabizi,
  showLink = true,
}: ConjugaisonTableProps) {
  const [activeTemps, setActiveTemps] = useState<Temps>('Passé');

  const conj = conjugaisons.find((c) => c.temps === activeTemps);
  const config = TEMPS_CONFIG[activeTemps];

  return (
    <div className="rounded-xl border border-[#F5EDE3] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#F5EDE3]">
        {(Object.keys(TEMPS_CONFIG) as Temps[]).map((temps) => {
          const active = activeTemps === temps;
          const cfg = TEMPS_CONFIG[temps];
          return (
            <button
              key={temps}
              onClick={() => setActiveTemps(temps)}
              className={cn(
                'flex-1 py-2.5 text-sm font-semibold transition-colors font-display',
                active ? `${cfg.activeBg} text-white` : `${cfg.bg} text-[#6B6B7B] hover:opacity-80`
              )}
            >
              {temps}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {conj ? (
        <table className={`w-full text-sm ${config.bg}`}>
          <tbody>
            {PRONOMS.map((pronom) => {
              const form = conj[pronom];
              return (
                <tr key={pronom} className="border-b border-white/50 last:border-0">
                  <td className="px-4 py-2.5 text-[#6B6B7B] font-medium w-1/2">
                    {PRONOM_LABELS[pronom]}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-[#1A1A2E] font-arabizi">{form ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className={`p-6 text-center text-[#6B6B7B] text-sm ${config.bg}`}>
          Pas de conjugaison disponible pour ce temps.
        </div>
      )}

      {showLink && (
        <div className="px-4 py-3 bg-[#FBF7F0] border-t border-[#F5EDE3]">
          <Link
            href={`/conjugaison/${verbId}`}
            className="text-sm text-[#C17817] font-medium hover:underline"
          >
            Voir la conjugaison complète →
          </Link>
        </div>
      )}
    </div>
  );
}
