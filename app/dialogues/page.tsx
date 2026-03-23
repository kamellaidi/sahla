import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dialogues — Phrases de la vie quotidienne en darija',
  description:
    '137 phrases de dialogue en darija algérienne par thème : salutations, transport, restaurant, santé...',
};

const THEME_ICONS: Record<string, string> = {
  salutations: '👋',
  transport: '🚌',
  restaurant: '🍽️',
  santé: '🏥',
  sante: '🏥',
  famille: '👨‍👩‍👧',
  travail: '💼',
  courses: '🛒',
  logement: '🏠',
  loisirs: '🎉',
  education: '📚',
  météo: '☀️',
  meteo: '☀️',
  urgences: '🚨',
};

function getIcon(themeSlug: string): string {
  return THEME_ICONS[themeSlug.toLowerCase()] ?? '💬';
}

async function getThemes() {
  const { data } = await supabase.from('dialogues').select('theme, theme_slug');
  const map = new Map<string, { theme: string; theme_slug: string; count: number }>();
  for (const row of data ?? []) {
    const key = row.theme_slug;
    if (!map.has(key)) map.set(key, { theme: row.theme, theme_slug: row.theme_slug, count: 0 });
    map.get(key)!.count++;
  }
  return Array.from(map.values());
}

export default async function DialoguesPage() {
  const themes = await getThemes();

  return (
    <div className="max-container padding-container py-8">
      <div className="flex items-center gap-3 mb-2">
        <MessageCircle className="text-[#E65100]" size={28} />
        <h1 className="text-3xl font-black text-[#1B4F72]">Dialogues</h1>
      </div>
      <p className="text-gray-500 mb-8">
        137 phrases authentiques par thème pour parler en darija dès aujourd&apos;hui
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link
            key={theme.theme_slug}
            href={`/dialogues/${theme.theme_slug}`}
            className="bg-white rounded-2xl border border-gray-100 hover:border-[#1B4F72]/30 hover:shadow-md transition-all p-6 group"
          >
            <div className="text-3xl mb-3">{getIcon(theme.theme_slug)}</div>
            <h2 className="font-bold text-[#1B4F72] group-hover:text-[#E65100] transition-colors mb-1">
              {theme.theme}
            </h2>
            <p className="text-gray-400 text-sm">
              {theme.count} phrase{theme.count > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
