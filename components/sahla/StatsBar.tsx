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
    { value: mots.toLocaleString('fr'), label: 'mots' },
    { value: verbes.toLocaleString('fr'), label: 'verbes conjugués' },
    { value: regles.toLocaleString('fr'), label: 'règles de grammaire' },
    { value: phrases.toLocaleString('fr'), label: 'phrases de dialogue' },
  ];

  return (
    <div className={`flex flex-wrap justify-center gap-6 sm:gap-10 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-black text-[#1B4F72]">{stat.value}</div>
          <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
