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
      <div className="bg-white rounded-2xl border border-[#F5EDE3] p-6 animate-pulse">
        <div className="h-4 bg-[#F5EDE3] rounded w-24 mb-4" />
        <div className="h-8 bg-[#F5EDE3] rounded w-32 mb-2" />
        <div className="h-4 bg-[#F5EDE3] rounded w-48" />
      </div>
    );
  }

  if (!mot) return null;

  return (
    <div className="bg-[#1A1A2E] text-white rounded-2xl p-6">
      <div className="flex items-center gap-2 text-[#C17817] text-sm font-medium mb-4">
        <Sparkles size={16} />
        <span className="font-arabizi">Mot du jour</span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display font-arabizi text-3xl font-black">{mot.mot_arabizi}</h3>
        <Badge label={mot.categorie} className="mt-1 flex-shrink-0" />
      </div>

      <p className="text-white/80 text-lg font-medium mb-1">{mot.traduction_fr}</p>
      {mot.traduction_en && (
        <p className="text-white/50 text-sm mb-4">{mot.traduction_en}</p>
      )}

      {mot.exemple_arabizi && (
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-white font-medium mb-1">
            <InteractivePhrase phrase={mot.exemple_arabizi} lookupMot={lookupMot} />
          </p>
          {mot.exemple_fr && (
            <p className="text-white/50 text-sm italic">{mot.exemple_fr}</p>
          )}
        </div>
      )}

      <Link
        href={`/dictionnaire/${mot.slug}`}
        className="inline-flex items-center gap-1 text-[#C17817] font-semibold text-sm hover:gap-2 transition-all"
      >
        Voir ce mot →
      </Link>
    </div>
  );
}
