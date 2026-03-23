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
        <BookText className="text-[#C17817]" size={28} />
        <h1 className="font-display text-3xl font-black text-[#1A1A2E]">Grammaire</h1>
      </div>
      <p className="text-[#6B6B7B] mb-8">
        41 règles essentielles pour maîtriser la structure de la dardja
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link
            key={theme.theme_slug}
            href={`/grammaire/${theme.theme_slug}`}
            className="bg-white rounded-2xl border border-[#F5EDE3] border-l-4 border-l-transparent hover:border-l-[#C17817] transition-all p-6 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-[#F5EDE3] rounded-lg flex items-center justify-center">
                <BookText size={18} className="text-[#C17817]" />
              </div>
              <h2 className="font-display font-bold text-[#1A1A2E] group-hover:text-[#C17817] transition-colors">
                {theme.theme}
              </h2>
            </div>
            <p className="text-[#6B6B7B] text-sm">
              {theme.count} règle{theme.count > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
