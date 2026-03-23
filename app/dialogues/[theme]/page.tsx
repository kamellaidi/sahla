import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Dialogue } from '@/lib/types';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import DialoguesThemeClient from './DialoguesThemeClient';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: { theme: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('dialogues')
    .select('theme')
    .eq('theme_slug', params.theme)
    .limit(1)
    .single();
  if (!data) return { title: 'Thème introuvable' };
  return {
    title: `Dialogues : ${data.theme}`,
    description: `Phrases de dialogue en darija algérienne sur le thème "${data.theme}". Apprends à communiquer naturellement avec Sahla.`,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from('dialogues').select('theme_slug');
  const slugs = Array.from(new Set((data ?? []).map((r) => r.theme_slug)));
  return slugs.map((slug) => ({ theme: slug }));
}

export default async function DialoguesThemePage({ params }: Props) {
  const { data } = await supabase
    .from('dialogues')
    .select('*')
    .eq('theme_slug', params.theme)
    .order('id');

  if (!data || data.length === 0) notFound();

  const dialogues = data as Dialogue[];
  const theme = dialogues[0].theme;

  return (
    <div className="max-container padding-container py-8">
      <Breadcrumbs
        crumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Dialogues', href: '/dialogues' },
          { label: theme },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1B4F72]">{theme}</h1>
        <p className="text-gray-500 mt-1">
          {dialogues.length} phrase{dialogues.length > 1 ? 's' : ''}
        </p>
      </div>

      <DialoguesThemeClient dialogues={dialogues} />

      <div className="mt-10">
        <Link
          href="/dialogues"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B4F72] transition-colors"
        >
          <ChevronLeft size={16} />
          Retour à tous les thèmes
        </Link>
      </div>
    </div>
  );
}
