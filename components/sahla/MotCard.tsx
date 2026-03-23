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
      className="block bg-white rounded-xl border border-gray-100 hover:border-[#1B4F72]/30 hover:shadow-md transition-all p-4 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-bold text-[#1B4F72] group-hover:text-[#E65100] transition-colors text-base">
          {mot.mot_arabizi}
        </span>
        <Badge label={mot.categorie} />
      </div>
      <p className="text-gray-700 text-sm">{mot.traduction_fr}</p>
      {!compact && mot.traduction_en && (
        <p className="text-gray-400 text-xs mt-0.5">{mot.traduction_en}</p>
      )}
    </Link>
  );
}
