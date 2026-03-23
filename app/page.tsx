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
    desc: '2 327 mots en arabizi avec traductions, exemples et conjugaisons.',
    borderColor: 'border-[#4A90B8]/30',
    iconColor: 'text-[#4A90B8]',
  },
  {
    href: '/conjugaison',
    icon: GitBranch,
    title: 'Conjugaison',
    desc: '69 verbes conjugués aux 3 temps : passé, présent et impératif.',
    borderColor: 'border-[#2D6A4F]/30',
    iconColor: 'text-[#2D6A4F]',
  },
  {
    href: '/grammaire',
    icon: BookText,
    title: 'Grammaire',
    desc: '41 règles essentielles pour comprendre la structure de la dardja.',
    borderColor: 'border-[#C17817]/30',
    iconColor: 'text-[#C17817]',
  },
  {
    href: '/dialogues',
    icon: MessageCircle,
    title: 'Dialogues',
    desc: '137 phrases authentiques par thème : salutations, resto, transport...',
    borderColor: 'border-[#1A1A2E]/20',
    iconColor: 'text-[#1A1A2E]',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1A1A2E] text-white overflow-hidden">
        {/* SVG Berber geometric pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="berber" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                {/* Diamond */}
                <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="white" strokeWidth="1.5"/>
                {/* Inner diamond */}
                <polygon points="30,16 44,30 30,44 16,30" fill="none" stroke="white" strokeWidth="1"/>
                {/* Center dot */}
                <circle cx="30" cy="30" r="2.5" fill="white"/>
                {/* Corner triangles */}
                <polygon points="0,0 10,0 0,10" fill="white" opacity="0.5"/>
                <polygon points="60,0 50,0 60,10" fill="white" opacity="0.5"/>
                <polygon points="0,60 10,60 0,50" fill="white" opacity="0.5"/>
                <polygon points="60,60 50,60 60,50" fill="white" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#berber)"/>
          </svg>
        </div>

        <div className="relative max-container padding-container py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
              La dardja,{' '}
              <span className="text-[#C17817]">c&apos;est sahla.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl mb-10 leading-relaxed">
              Apprends l&apos;arabe algérien comme on le parle vraiment.
              <br className="hidden sm:block" />
              Dictionnaire, conjugaison, grammaire et dialogues.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar
                placeholder="Cherche un mot en dardja ou en français..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#FBF7F0] border-b border-[#F5EDE3]">
        <div className="max-container padding-container py-10">
          <StatsBar />
        </div>
      </section>

      {/* Cards navigation */}
      <section className="max-container padding-container py-16">
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-8 text-center">
          Tout pour apprendre la dardja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NAV_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`rounded-2xl border ${card.borderColor} border-l-4 border-l-transparent hover:border-l-[#C17817] bg-white p-6 transition-all group`}
            >
              <card.icon size={28} className={`${card.iconColor} mb-4`} />
              <h3 className="font-display font-bold text-lg mb-2 text-[#1A1A2E]">{card.title}</h3>
              <p className="text-sm text-[#6B6B7B] leading-relaxed mb-4">{card.desc}</p>
              <span className="text-sm font-semibold text-[#C17817] group-hover:gap-2 inline-flex items-center gap-1 transition-all">
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
            <div className="bg-white rounded-2xl border border-[#F5EDE3] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#1A1A2E]">
                  Guide Arabizi rapide
                </h2>
                <Link
                  href="/guide-arabizi"
                  className="text-sm text-[#C17817] font-medium hover:underline"
                >
                  Guide complet →
                </Link>
              </div>
              <p className="text-[#6B6B7B] text-sm mb-4">
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
