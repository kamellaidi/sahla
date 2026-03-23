interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="font-display text-2xl font-bold text-[#1A1A2E]">{title}</h2>
      {subtitle && <p className="mt-1 text-[#6B6B7B] text-sm">{subtitle}</p>}
    </div>
  );
}
