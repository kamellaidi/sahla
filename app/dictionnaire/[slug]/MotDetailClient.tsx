'use client';

import { useMotLookup } from '@/hooks/useMotLookup';
import InteractivePhrase from '@/components/sahla/InteractivePhrase';
import ConjugaisonTable from '@/components/sahla/ConjugaisonTable';
import type { Mot, Conjugaison, Verbe } from '@/lib/types';
import Link from 'next/link';

interface MotDetailClientProps {
  mot: Mot;
  conjugaisons: Conjugaison[];
  verbe: Verbe | null;
}

export default function MotDetailClient({ mot, conjugaisons, verbe }: MotDetailClientProps) {
  const { lookupMot } = useMotLookup();

  return (
    <>
      {/* Phrase d'exemple */}
      {mot.exemple_arabizi && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Exemple d&apos;utilisation
          </h2>
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            <InteractivePhrase phrase={mot.exemple_arabizi} lookupMot={lookupMot} />
          </p>
          {mot.exemple_fr && (
            <p className="text-gray-500 text-sm italic mt-2">{mot.exemple_fr}</p>
          )}
          <p className="text-gray-400 text-xs mt-3">
            💡 Clique sur les mots soulignés pour voir leur définition
          </p>
        </div>
      )}

      {/* Conjugaison (conditionnelle) */}
      {mot.verb_id && conjugaisons.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1B4F72]">
              Conjugaison
              {verbe && (
                <span className="text-gray-400 font-normal ml-2 text-sm">
                  — {verbe.sens_fr}
                </span>
              )}
            </h2>
            <Link
              href={`/conjugaison/${mot.verb_id}`}
              className="text-xs text-[#E65100] font-medium hover:underline"
            >
              Tableau complet →
            </Link>
          </div>
          <ConjugaisonTable
            conjugaisons={conjugaisons}
            verbId={mot.verb_id}
            verbeArabizi={mot.mot_arabizi}
            showLink={false}
          />
        </div>
      )}
    </>
  );
}
