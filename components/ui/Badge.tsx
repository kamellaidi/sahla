import { cn } from '@/lib/utils';

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
        'bg-[#F5EDE3] text-[#2D6A4F] border border-[#F5EDE3]',
        className
      )}
    >
      {label}
    </span>
  );
}
