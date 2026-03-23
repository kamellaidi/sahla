'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mot } from '@/lib/types';

export function useMotBySlug(slug: string) {
  const [mot, setMot] = useState<Mot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchMot() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('mots')
        .select('*')
        .eq('slug', slug)
        .single();
      if (err) setError(err.message);
      else setMot(data);
      setLoading(false);
    }
    fetchMot();
  }, [slug]);

  return { mot, loading, error };
}
