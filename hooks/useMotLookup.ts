'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Mot } from '@/lib/types';
import { normalizeToken } from '@/lib/utils';

// Singleton cache en mémoire (partagé entre composants, rechargé une fois)
let lookupCache: Map<string, Mot> | null = null;
let loadingPromise: Promise<void> | null = null;

async function loadLookup(): Promise<Map<string, Mot>> {
  if (lookupCache) return lookupCache;
  if (!loadingPromise) {
    loadingPromise = (async () => {
      const { data } = await supabase
        .from('mots')
        .select('id, mot_arabizi, slug, traduction_fr, categorie, traduction_en, verb_id');
      const map = new Map<string, Mot>();
      for (const mot of data ?? []) {
        map.set(normalizeToken(mot.mot_arabizi), mot as Mot);
      }
      lookupCache = map;
    })();
  }
  await loadingPromise;
  return lookupCache!;
}

export function useMotLookup() {
  const [lookup, setLookup] = useState<Map<string, Mot> | null>(lookupCache);
  const [loading, setLoading] = useState(!lookupCache);

  useEffect(() => {
    if (lookupCache) {
      setLookup(lookupCache);
      setLoading(false);
      return;
    }
    loadLookup().then((map) => {
      setLookup(map);
      setLoading(false);
    });
  }, []);

  const lookupMot = useCallback(
    (token: string): Mot | null => {
      if (!lookup) return null;
      return lookup.get(normalizeToken(token)) ?? null;
    },
    [lookup]
  );

  return { lookup, lookupMot, loading };
}
