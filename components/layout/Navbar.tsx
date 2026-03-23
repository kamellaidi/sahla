'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';

const NAV_LINKS = [
  { href: '/dictionnaire', label: 'Dictionnaire' },
  { href: '/conjugaison', label: 'Conjugaison' },
  { href: '/grammaire', label: 'Grammaire' },
  { href: '/dialogues', label: 'Dialogues' },
  { href: '/guide-arabizi', label: 'Guide Arabizi' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-container padding-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="text-2xl font-black text-[#1B4F72]">
              sah<span className="text-[#E65100]">·</span>la
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1B4F72] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* SearchBar desktop */}
          <div className="hidden lg:block w-64">
            <SearchBar placeholder="Cherche un mot..." compact />
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="mb-3">
              <SearchBar placeholder="Cherche un mot..." />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1B4F72] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
