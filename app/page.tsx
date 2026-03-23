import type { Metadata } from 'next';
import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import StatsBar from '@/components/sahla/StatsBar';
import MotDuJour from '@/components/sahla/MotDuJour';
import ArabiziGuide from '@/components/sahla/ArabiziGuide';
import { BookOpen, GitBranch, BookText, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sahla — Apprendre la darija algérienne en arabizi',
  description:
    "La darija, c'est sahla. Apprends l'arabe algérien comme on le parle vraiment. Dictionnaire, conjugaison, grammaire et dialogues.",
};

const NAV_CARDS = [
  {
    href: '/dictionnaire',
    icon: BookOpen,
    title: 'Dictionnaire',
    desc: '2327 mots en arabizi avec traductions, exemples et conjugaisons.',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    href: '/conjugaison',
    icon: GitBranch,
    title: 'Conjugaison',
    desc: '69 verbes conjugués aux 3 temps : passé, présent et impératif.',
    color: 'bg-green-50 text-green-700 border-green-100',
    iconColor: 'text-green-600',
  },
  {
    href: '/grammaire',
    icon: BookText,
    title: 'Grammaire',
    desc: '41 règles essentielles pour comprendre la structure de la darija.',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    href: '/dialogues',
    icon: MessageCircle,
    title: 'Dialogues',
    desc: '137 phrases authentiques par thème : salutations, resto, transport...',
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    iconColor: 'text-orange-600',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4F72] via-[#1B4F72] to-[#0f3a54] text-white">
        <div className="max-container padding-container py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🇩🇿 Arabe algérien — Darija — Arabizi
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              La darija,{' '}
              <span className="text-[#E65100]">c&apos;est sahla.</span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl mb-10 leading-relaxed">
              Apprends l&apos;arabe algérien comme on le parle vraiment.
              <br className="hidden sm:block" />
              Dictionnaire, conjugaison, grammaire et dialogues.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar
                placeholder="Cherche un mot en darija ou en français..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-container padding-container py-10">
          <StatsBar />
        </div>
      </section>

      {/* Cards navigation */}
      <section className="max-container padding-container py-16">
        <h2 className="text-2xl font-bold text-[#1B4F72] mb-8 text-center">
          Tout pour apprendre la darija
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NAV_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`rounded-2xl border p-6 ${card.color} hover:shadow-md transition-all group`}
            >
              <card.icon size={28} className={`${card.iconColor} mb-4`} />
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-4">{card.desc}</p>
              <span className="text-sm font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                Explorer →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mot du jour + Guide arabizi */}
      <section className="max-container padding-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mot du jour */}
          <div className="lg:col-span-1">
            <MotDuJour />
          </div>

          {/* Guide Arabizi rapide */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B4F72]">
                  Guide Arabizi rapide
                </h2>
                <Link
                  href="/guide-arabizi"
                  className="text-sm text-[#E65100] font-medium hover:underline"
                >
                  Guide complet →
                </Link>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                L&apos;arabizi utilise des chiffres pour les sons arabes absents du français :
              </p>
              <ArabiziGuide compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
