import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://sahla.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: mots }, { data: verbes }, { data: gramThemes }, { data: dialThemes }] =
    await Promise.all([
      supabase.from('mots').select('slug, created_at'),
      supabase.from('verbes').select('verb_id'),
      supabase.from('grammaire').select('theme_slug'),
      supabase.from('dialogues').select('theme_slug'),
    ]);

  const gramSlugs = Array.from(new Set((gramThemes ?? []).map((r) => r.theme_slug)));
  const dialSlugs = Array.from(new Set((dialThemes ?? []).map((r) => r.theme_slug)));

  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/dictionnaire`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/conjugaison`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/grammaire`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/dialogues`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/guide-arabizi`, lastModified: new Date(), priority: 0.7 },

    ...(mots ?? []).map((m) => ({
      url: `${BASE_URL}/dictionnaire/${m.slug}`,
      lastModified: m.created_at ? new Date(m.created_at) : new Date(),
      priority: 0.7,
    })),
    ...(verbes ?? []).map((v) => ({
      url: `${BASE_URL}/conjugaison/${v.verb_id}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    ...gramSlugs.map((slug) => ({
      url: `${BASE_URL}/grammaire/${slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    ...dialSlugs.map((slug) => ({
      url: `${BASE_URL}/dialogues/${slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ];
}
