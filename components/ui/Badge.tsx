import { cn, getCategoryColor } from '@/lib/utils';

interface BadgeProps {
  label: string | null;
  className?: string;
}

export default function Badge({ label, className }: BadgeProps) {
  if (!label) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        getCategoryColor(label),
        className
      )}
    >
      {label}
    </span>
  );
}
