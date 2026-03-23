const ARABIZI_TABLE = [
  { chiffre: '2', arabe: 'ء / أ', exemple: '2ana (أنا)', note: 'Hamza / Alef' },
  { chiffre: '3', arabe: 'ع', exemple: '3lach (علاش)', note: 'Ayn — son guttural' },
  { chiffre: '5', arabe: 'خ', exemple: '5oya (خويا)', note: 'Kha — comme "j" en espagnol' },
  { chiffre: '7', arabe: 'ح', exemple: '7lib (حليب)', note: 'Ha — souffle profond' },
  { chiffre: '8', arabe: 'غ', exemple: '8zal (غزال)', note: 'Ghayn — "r" grasseyé' },
  { chiffre: '9', arabe: 'ق', exemple: '9ahwa (قهوة)', note: 'Qaf — "k" du fond de la gorge' },
];

export default function ArabiziGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#1A1A2E] text-white">
            <th className="text-left px-4 py-3 font-display font-semibold rounded-tl-lg">Chiffre</th>
            <th className="text-left px-4 py-3 font-display font-semibold">Lettre arabe</th>
            <th className="text-left px-4 py-3 font-display font-semibold">Exemple</th>
            {!compact && <th className="text-left px-4 py-3 font-display font-semibold rounded-tr-lg">Note</th>}
          </tr>
        </thead>
        <tbody>
          {ARABIZI_TABLE.map((row, i) => (
            <tr
              key={row.chiffre}
              className={`border-b border-[#F5EDE3] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FBF7F0]'}`}
            >
              <td className="px-4 py-3">
                <span className="font-arabizi text-2xl font-black text-[#C17817]">{row.chiffre}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xl font-bold text-[#1A1A2E]">{row.arabe}</span>
              </td>
              <td className="px-4 py-3 font-arabizi font-medium text-[#1A1A2E]">{row.exemple}</td>
              {!compact && <td className="px-4 py-3 text-[#6B6B7B]">{row.note}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
