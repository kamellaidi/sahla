'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Conjugaison, Verbe } from '@/lib/types';

export function useConjugaison(verbId: string | null) {
  const [verbe, setVerbe] = useState<Verbe | null>(null);
  const [conjugaisons, setConjugaisons] = useState<Conjugaison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!verbId) return;
    async function fetch() {
      setLoading(true);
      const [{ data: verbeData }, { data: conjData, error: err }] = await Promise.all([
        supabase.from('verbes').select('*').eq('verb_id', verbId).single(),
        supabase.from('conjugaisons').select('*').eq('verb_id', verbId),
      ]);
      if (err) setError(err.message);
      setVerbe(verbeData ?? null);
      setConjugaisons(conjData ?? []);
      setLoading(false);
    }
    fetch();
  }, [verbId]);

  return { verbe, conjugaisons, loading, error };
}
