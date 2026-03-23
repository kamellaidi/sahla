import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  MessageCircle, Bus, UtensilsCrossed, HeartPulse,
  Users, Briefcase, ShoppingCart, Home,
  Music2, BookOpen, Sun, AlertTriangle, Hand,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dialogues — Phrases de la vie quotidienne en darija',
  description:
    '137 phrases de dialogue en darija algérienne par thème : salutations, transport, restaurant, santé...',
};

const THEME_ICONS: Record<string, LucideIcon> = {
  salutations: Hand,
  transport: Bus,
  restaurant: UtensilsCrossed,
  santé: HeartPulse,
  sante: HeartPulse,
  famille: Users,
  travail: Briefcase,
  courses: ShoppingCart,
  logement: Home,
  loisirs: Music2,
  education: BookOpen,
  météo: Sun,
  meteo: Sun,
  urgences: AlertTriangle,
};

function getIcon(themeSlug: string): LucideIcon {
  return THEME_ICONS[themeSlug.toLowerCase()] ?? MessageCircle;
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
        <MessageCircle className="text-[#C17817]" size={28} />
        <h1 className="font-display text-3xl font-black text-[#1A1A2E]">Dialogues</h1>
      </div>
      <p className="text-[#6B6B7B] mb-8">
        137 phrases authentiques par thème pour parler en dardja dès aujourd&apos;hui
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const Icon = getIcon(theme.theme_slug);
          return (
            <Link
              key={theme.theme_slug}
              href={`/dialogues/${theme.theme_slug}`}
              className="bg-white rounded-2xl border border-[#F5EDE3] border-l-4 border-l-transparent hover:border-l-[#C17817] transition-all p-6 group"
            >
              <div className="w-10 h-10 bg-[#F5EDE3] rounded-xl flex items-center justify-center mb-3">
                <Icon size={20} className="text-[#C17817]" />
              </div>
              <h2 className="font-display font-bold text-[#1A1A2E] group-hover:text-[#C17817] transition-colors mb-1">
                {theme.theme}
              </h2>
              <p className="text-[#6B6B7B] text-sm">
                {theme.count} phrase{theme.count > 1 ? 's' : ''}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
