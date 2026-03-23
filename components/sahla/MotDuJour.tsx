'use client';

import { useRandomMot } from '@/hooks/useRandomMot';
import { useMotLookup } from '@/hooks/useMotLookup';
import InteractivePhrase from './InteractivePhrase';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function MotDuJour() {
  const { mot, loading } = useRandomMot();
  const { lookupMot } = useMotLookup();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
        <div className="h-8 bg-gray-100 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-48" />
      </div>
    );
  }

  if (!mot) return null;

  return (
    <div className="bg-gradient-to-br from-[#1B4F72] to-[#154060] text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-4">
        <Sparkles size={16} />
        <span>Mot du jour</span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-3xl font-black">{mot.mot_arabizi}</h3>
        <Badge label={mot.categorie} className="mt-1 flex-shrink-0" />
      </div>

      <p className="text-blue-100 text-lg font-medium mb-1">{mot.traduction_fr}</p>
      {mot.traduction_en && (
        <p className="text-blue-300 text-sm mb-4">{mot.traduction_en}</p>
      )}

      {mot.exemple_arabizi && (
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-white font-medium mb-1">
            <InteractivePhrase phrase={mot.exemple_arabizi} lookupMot={lookupMot} />
          </p>
          {mot.exemple_fr && (
            <p className="text-blue-200 text-sm italic">{mot.exemple_fr}</p>
          )}
        </div>
      )}

      <Link
        href={`/dictionnaire/${mot.slug}`}
        className="inline-flex items-center gap-1 text-[#E65100] font-semibold text-sm hover:gap-2 transition-all"
      >
        Voir ce mot →
      </Link>
    </div>
  );
}
