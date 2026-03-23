import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Grammaire — Règles de la darija algérienne',
  description:
    '41 règles de grammaire pour comprendre la darija algérienne : articles, pluriels, possessifs, négation, verbes et prépositions.',
};

async function getThemes() {
  const { data } = await supabase.from('grammaire').select('theme, theme_slug');
  const map = new Map<string, { theme: string; theme_slug: string; count: number }>();
  for (const row of data ?? []) {
    const key = row.theme_slug;
    if (!map.has(key)) map.set(key, { theme: row.theme, theme_slug: row.theme_slug, count: 0 });
    map.get(key)!.count++;
  }
  return Array.from(map.values());
}

export default async function GrammairePage() {
  const themes = await getThemes();

  return (
    <div className="max-container padding-container py-8">
      <div className="flex items-center gap-3 mb-2">
        <BookText className="text-[#E65100]" size={28} />
        <h1 className="text-3xl font-black text-[#1B4F72]">Grammaire</h1>
      </div>
      <p className="text-gray-500 mb-8">
        41 règles essentielles pour maîtriser la structure de la darija
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link
            key={theme.theme_slug}
            href={`/grammaire/${theme.theme_slug}`}
            className="bg-white rounded-2xl border border-gray-100 hover:border-[#1B4F72]/30 hover:shadow-md transition-all p-6 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookText size={18} className="text-purple-600" />
              </div>
              <h2 className="font-bold text-[#1B4F72] group-hover:text-[#E65100] transition-colors">
                {theme.theme}
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              {theme.count} règle{theme.count > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
