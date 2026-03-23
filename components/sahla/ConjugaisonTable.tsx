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
    bg: 'bg-[#E8F5E9]',
    activeBg: 'bg-green-600',
    border: 'border-green-200',
  },
  Présent: {
    label: 'Présent',
    bg: 'bg-[#E3F2FD]',
    activeBg: 'bg-blue-600',
    border: 'border-blue-200',
  },
  Impératif: {
    label: 'Impératif',
    bg: 'bg-[#FFF3E0]',
    activeBg: 'bg-orange-500',
    border: 'border-orange-200',
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
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(Object.keys(TEMPS_CONFIG) as Temps[]).map((temps) => {
          const active = activeTemps === temps;
          const cfg = TEMPS_CONFIG[temps];
          return (
            <button
              key={temps}
              onClick={() => setActiveTemps(temps)}
              className={cn(
                'flex-1 py-2.5 text-sm font-semibold transition-colors',
                active ? `${cfg.activeBg} text-white` : `${cfg.bg} text-gray-600 hover:opacity-80`
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
                  <td className="px-4 py-2.5 text-gray-500 font-medium w-1/2">
                    {PRONOM_LABELS[pronom]}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-[#1B4F72]">{form ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className={`p-6 text-center text-gray-400 text-sm ${config.bg}`}>
          Pas de conjugaison disponible pour ce temps.
        </div>
      )}

      {showLink && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <Link
            href={`/conjugaison/${verbId}`}
            className="text-sm text-[#E65100] font-medium hover:underline"
          >
            Voir la conjugaison complète →
          </Link>
        </div>
      )}
    </div>
  );
}
