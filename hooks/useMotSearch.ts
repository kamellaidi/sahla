'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mot } from '@/lib/types';

export function useMotSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Mot[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    // Utilise la fonction Postgres `search_mots` qui applique unaccent()
    // → "acheter" trouve "achète", "achetez", etc.
    const { data, error } = await supabase.rpc('search_mots', { q: q.trim() });

    if (error) {
      // Fallback si la fonction RPC n'existe pas encore
      console.warn('search_mots RPC indisponible, fallback ilike :', error.message);
      const { data: fallback } = await supabase
        .from('mots')
        .select('*')
        .or(`mot_arabizi.ilike.%${q}%,traduction_fr.ilike.%${q}%`)
        .order('mot_arabizi')
        .limit(60);
      setResults(fallback ?? []);
    } else {
      setResults((data as Mot[]) ?? []);
    }

    setLoading(false);
  }, []);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return { query, setQuery, results, loading };
}
