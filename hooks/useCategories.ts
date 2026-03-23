'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('mots')
      .select('categorie')
      .not('categorie', 'is', null)
      .then(({ data }) => {
        const unique = Array.from(new Set((data ?? []).map((r) => r.categorie as string))).sort();
        setCategories(unique);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}
