'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mot } from '@/lib/types';
import { getDayIndex } from '@/lib/utils';

export function useRandomMot() {
  const [mot, setMot] = useState<Mot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRandom() {
      // Récupère le count puis fetch par offset (seed = date)
      const { count } = await supabase
        .from('mots')
        .select('*', { count: 'exact', head: true })
        .not('exemple_arabizi', 'is', null);

      if (!count) { setLoading(false); return; }
      const index = getDayIndex(count);

      const { data } = await supabase
        .from('mots')
        .select('*')
        .not('exemple_arabizi', 'is', null)
        .range(index, index);

      setMot(data?.[0] ?? null);
      setLoading(false);
    }
    fetchRandom();
  }, []);

  return { mot, loading };
}
