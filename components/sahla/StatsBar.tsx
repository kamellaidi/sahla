interface StatsBarProps {
  mots?: number;
  verbes?: number;
  regles?: number;
  phrases?: number;
  className?: string;
}

export default function StatsBar({
  mots = 2327,
  verbes = 69,
  regles = 41,
  phrases = 137,
  className = '',
}: StatsBarProps) {
  const stats = [
    { value: mots.toLocaleString('fr'), label: 'kelma', sublabel: 'mots' },
    { value: verbes.toLocaleString('fr'), label: 'fi3l', sublabel: 'verbes conjugués' },
    { value: regles.toLocaleString('fr'), label: '9a3ida', sublabel: 'règles de grammaire' },
    { value: phrases.toLocaleString('fr'), label: '7iwar', sublabel: 'phrases de dialogue' },
  ];

  return (
    <div className={`flex flex-wrap justify-center gap-6 sm:gap-10 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="font-display text-3xl font-black text-[#C17817]">{stat.value}</div>
          <div className="font-arabizi text-sm font-semibold text-[#1A1A2E] mt-0.5">{stat.label}</div>
          <div className="text-xs text-[#6B6B7B]">{stat.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
