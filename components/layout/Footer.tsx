import Link from 'next/link';
import { Heart } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Apprendre',
    links: [
      { href: '/dictionnaire', label: 'Dictionnaire' },
      { href: '/conjugaison', label: 'Conjugaison' },
      { href: '/grammaire', label: 'Grammaire' },
      { href: '/dialogues', label: 'Dialogues' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { href: '/guide-arabizi', label: 'Guide Arabizi' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white mt-20">
      <div className="max-container padding-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Branding */}
          <div className="col-span-2 md:col-span-2">
            <div className="font-display text-2xl font-black mb-3">
              sahla<span className="text-[#C17817]">.dz</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              La dardja, c&apos;est sahla. Apprends l&apos;arabe algérien comme on le parle vraiment.
            </p>
            <p className="text-white/40 text-xs mt-3 italic font-arabizi">
              &ldquo;El-3ilm nour.&rdquo;
            </p>
            <p className="text-white/40 text-xs mt-1">
              La connaissance est lumière.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com/sahladz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C17817] hover:text-white text-sm transition-colors font-medium"
              >
                @sahladz
              </a>
            </div>
          </div>

          {/* Links */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-sm text-white/50 uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Sahla. Tous droits réservés.</span>
          <span className="inline-flex items-center gap-1.5">
            Fait avec <Heart size={12} className="text-[#C17817] fill-[#C17817]" /> pour la diaspora algérienne
          </span>
        </div>
      </div>
    </footer>
  );
}
