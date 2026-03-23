'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Verbe } from '@/lib/types';

export function useConjugaisons() {
  const [verbes, setVerbes] = useState<Verbe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('verbes')
      .select('*')
      .order('verb_id')
      .then(({ data }) => {
        setVerbes(data ?? []);
        setLoading(false);
      });
  }, []);

  return { verbes, loading };
}
