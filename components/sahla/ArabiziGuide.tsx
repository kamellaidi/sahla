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
          <tr className="bg-[#1B4F72] text-white">
            <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Chiffre</th>
            <th className="text-left px-4 py-3 font-semibold">Lettre arabe</th>
            <th className="text-left px-4 py-3 font-semibold">Exemple</th>
            {!compact && <th className="text-left px-4 py-3 font-semibold rounded-tr-lg">Note</th>}
          </tr>
        </thead>
        <tbody>
          {ARABIZI_TABLE.map((row, i) => (
            <tr
              key={row.chiffre}
              className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-4 py-3">
                <span className="text-2xl font-black text-[#E65100]">{row.chiffre}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xl font-bold text-[#1B4F72]">{row.arabe}</span>
              </td>
              <td className="px-4 py-3 font-medium text-gray-700">{row.exemple}</td>
              {!compact && <td className="px-4 py-3 text-gray-500">{row.note}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
