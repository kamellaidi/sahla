interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-[#1B4F72]">{title}</h2>
      {subtitle && <p className="mt-1 text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
}
