'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mot } from '@/lib/types';

interface UseMotsOptions {
  categorie?: string;
  page?: number;
  pageSize?: number;
}

export function useMots({ categorie, page = 1, pageSize = 24 }: UseMotsOptions = {}) {
  const [mots, setMots] = useState<Mot[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMots() {
      setLoading(true);
      setError(null);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('mots')
        .select('*', { count: 'exact' })
        .order('mot_arabizi', { ascending: true })
        .range(from, to);

      if (categorie) {
        query = query.eq('categorie', categorie);
      }

      const { data, error: err, count } = await query;
      if (err) {
        setError(err.message);
      } else {
        setMots(data ?? []);
        setTotal(count ?? 0);
      }
      setLoading(false);
    }
    fetchMots();
  }, [categorie, page, pageSize]);

  return { mots, total, loading, error };
}
