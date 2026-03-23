import Link from 'next/link';

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
    <footer className="bg-[#1B4F72] text-white mt-20">
      <div className="max-container padding-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Branding */}
          <div className="col-span-2 md:col-span-2">
            <div className="text-2xl font-black mb-3">
              sah<span className="text-[#E65100]">·</span>la
            </div>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              La darija, c&apos;est sahla. Apprends l&apos;arabe algérien comme on le parle vraiment.
            </p>
            <p className="text-blue-300 text-xs mt-4">
              Fait avec ❤️ pour la diaspora algérienne
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com/sahlaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white text-sm transition-colors"
              >
                @sahlaapp
              </a>
            </div>
          </div>

          {/* Links */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-blue-200 uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-300">
          <span>© {new Date().getFullYear()} Sahla. Tous droits réservés.</span>
          <span>La darija, c&apos;est sahla. 🇩🇿</span>
        </div>
      </div>
    </footer>
  );
}
