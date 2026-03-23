import Link from 'next/link';
import type { Mot } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface MotCardProps {
  mot: Mot;
  compact?: boolean;
}

export default function MotCard({ mot, compact = false }: MotCardProps) {
  return (
    <Link
      href={`/dictionnaire/${mot.slug}`}
      className="block bg-white rounded-xl border border-[#F5EDE3] border-l-4 border-l-transparent hover:border-l-[#C17817] transition-all p-4 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-display font-bold text-[#1A1A2E] group-hover:text-[#C17817] transition-colors text-base font-arabizi">
          {mot.mot_arabizi}
        </span>
        <Badge label={mot.categorie} />
      </div>
      <p className="text-[#1A1A2E] text-sm">{mot.traduction_fr}</p>
      {!compact && mot.traduction_en && (
        <p className="text-[#6B6B7B] text-xs mt-0.5">{mot.traduction_en}</p>
      )}
    </Link>
  );
}
