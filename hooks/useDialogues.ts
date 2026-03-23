'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Dialogue } from '@/lib/types';

export function useDialogues(themeSlug?: string) {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase.from('dialogues').select('*').order('id');
    if (themeSlug) query = query.eq('theme_slug', themeSlug);
    query.then(({ data }) => {
      setDialogues(data ?? []);
      setLoading(false);
    });
  }, [themeSlug]);

  return { dialogues, loading };
}

export function useDialogueThemes() {
  const [themes, setThemes] = useState<{ theme: string; theme_slug: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('dialogues')
      .select('theme, theme_slug')
      .then(({ data }) => {
        const map = new Map<string, { theme: string; theme_slug: string; count: number }>();
        for (const row of data ?? []) {
          const key = row.theme_slug;
          if (!map.has(key)) map.set(key, { theme: row.theme, theme_slug: row.theme_slug, count: 0 });
          map.get(key)!.count++;
        }
        setThemes(Array.from(map.values()));
        setLoading(false);
      });
  }, []);

  return { themes, loading };
}
