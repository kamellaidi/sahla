import type { Metadata } from 'next';
import ArabiziGuide from '@/components/sahla/ArabiziGuide';
import { Hash, MoveRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guide Arabizi — Chiffres et lettres arabes',
  description:
    "Comprends l'arabizi : la correspondance entre chiffres (2, 3, 5, 7, 8, 9) et lettres arabes absentes du clavier latin.",
};

const ALPHABET_TABLE = [
  { latin: 'a', arabe: 'ا / أ', ex: 'ana' },
  { latin: 'b', arabe: 'ب', ex: 'baba' },
  { latin: 't', arabe: 'ت / ط', ex: 'tbarkallah' },
  { latin: 'th', arabe: 'ث', ex: 'thalatha' },
  { latin: 'j', arabe: 'ج', ex: 'jib' },
  { latin: 'd', arabe: 'د / ض', ex: 'dar' },
  { latin: 'dh', arabe: 'ذ', ex: 'dhak' },
  { latin: 'r', arabe: 'ر', ex: 'roh' },
  { latin: 'z', arabe: 'ز', ex: 'zine' },
  { latin: 's', arabe: 'س / ص', ex: 'sahla' },
  { latin: 'sh', arabe: 'ش', ex: 'shwiya' },
  { latin: 'f', arabe: 'ف', ex: 'fhemni' },
  { latin: 'k', arabe: 'ك', ex: 'kifash' },
  { latin: 'l', arabe: 'ل', ex: 'lazem' },
  { latin: 'm', arabe: 'م', ex: 'machi' },
  { latin: 'n', arabe: 'ن', ex: 'nta' },
  { latin: 'h', arabe: 'ه / ح', ex: 'howa' },
  { latin: 'w', arabe: 'و', ex: 'wach' },
  { latin: 'y', arabe: 'ي', ex: 'ya' },
];

export default function GuideArabiziPage() {
  return (
    <div className="max-container padding-container py-8">
      <div className="flex items-center gap-3 mb-2">
        <Hash className="text-[#C17817]" size={28} />
        <h1 className="font-display text-3xl font-black text-[#1A1A2E]">Guide Arabizi</h1>
      </div>
      <p className="text-[#6B6B7B] mb-8 max-w-2xl">
        L&apos;arabizi est un système d&apos;écriture qui transcrit l&apos;arabe avec l&apos;alphabet latin.
        Certains sons arabes absents du français sont représentés par des <strong>chiffres</strong>.
      </p>

      {/* Chiffres spéciaux */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-4">Les chiffres — sons spéciaux</h2>
        <p className="text-[#6B6B7B] text-sm mb-4">
          Ce sont les plus importants à retenir. Ces sons n&apos;existent pas en français.
        </p>
        <div className="bg-white rounded-2xl border border-[#F5EDE3] overflow-hidden">
          <ArabiziGuide />
        </div>
      </section>

      {/* Alphabet complet */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-4">Alphabet complet</h2>
        <div className="bg-white rounded-2xl border border-[#F5EDE3] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FBF7F0] border-b border-[#F5EDE3]">
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B7B]">Arabizi</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B7B]">Arabe</th>
                <th className="text-left px-4 py-3 font-semibold text-[#6B6B7B]">Exemple</th>
              </tr>
            </thead>
            <tbody>
              {ALPHABET_TABLE.map((row, i) => (
                <tr key={row.latin} className={`border-b border-[#F5EDE3] ${i % 2 === 0 ? '' : 'bg-[#FBF7F0]/50'}`}>
                  <td className="px-4 py-3 font-bold text-[#C17817] font-arabizi">{row.latin}</td>
                  <td className="px-4 py-3 text-lg">{row.arabe}</td>
                  <td className="px-4 py-3 text-[#6B6B7B] italic font-arabizi">{row.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-[#F5EDE3] rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold text-[#1A1A2E] mb-3">Conseils pour lire l&apos;arabizi</h2>
        <ul className="space-y-2 text-sm text-[#1A1A2E]">
          <li className="flex items-start gap-2">
            <MoveRight size={14} className="text-[#C17817] mt-0.5 flex-shrink-0" />
            <span>Lis toujours les chiffres comme des sons arabes, pas comme des nombres.</span>
          </li>
          <li className="flex items-start gap-2">
            <MoveRight size={14} className="text-[#C17817] mt-0.5 flex-shrink-0" />
            <span>Le <strong>3</strong> vient du fond de la gorge, un peu comme un "aaah" étranglé.</span>
          </li>
          <li className="flex items-start gap-2">
            <MoveRight size={14} className="text-[#C17817] mt-0.5 flex-shrink-0" />
            <span>Le <strong>7</strong> est un souffle fort, comme souffler sur une vitre froide.</span>
          </li>
          <li className="flex items-start gap-2">
            <MoveRight size={14} className="text-[#C17817] mt-0.5 flex-shrink-0" />
            <span>Le <strong>9</strong> est un "k" prononcé encore plus en arrière dans la gorge.</span>
          </li>
          <li className="flex items-start gap-2">
            <MoveRight size={14} className="text-[#C17817] mt-0.5 flex-shrink-0" />
            <span>Le <strong>5</strong> ressemble à un "j" espagnol ou un "ch" allemand (jota).</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
