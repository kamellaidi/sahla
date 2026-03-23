export interface Mot {
  id: number;
  mot_arabizi: string;
  slug: string;
  traduction_fr: string;
  traduction_en: string | null;
  categorie: string | null;
  exemple_arabizi: string | null;
  exemple_fr: string | null;
  notes: string | null;
  source: string;
  verb_id: string | null;
  created_at: string;
}

export interface Verbe {
  id: number;
  verb_id: string;
  verbe_arabizi: string;
  sens_fr: string;
}

export interface Conjugaison {
  id: number;
  verb_id: string;
  temps: 'Passé' | 'Présent' | 'Impératif';
  ana: string | null;
  nta: string | null;
  nti: string | null;
  howa: string | null;
  hiya: string | null;
  hna: string | null;
  ntouma: string | null;
  houma: string | null;
}

export interface Dialogue {
  id: number;
  dial_id: string;
  theme: string;
  theme_slug: string;
  sous_theme: string | null;
  phrase_arabizi: string;
  traduction_fr: string;
  mot_a_mot: string | null;
  contexte: string | null;
}

export interface GrammaireRegle {
  id: number;
  theme: string;
  theme_slug: string;
  regle: string;
  explication: string | null;
  exemple_arabizi: string | null;
  exemple_fr: string | null;
  notes: string | null;
}

export interface SahlaStats {
  mots: number;
  verbes: number;
  regles: number;
  phrases: number;
}

// Pronoms dans l'ordre d'affichage
export const PRONOMS = ['ana', 'nta', 'nti', 'howa', 'hiya', 'hna', 'ntouma', 'houma'] as const;
export type Pronom = (typeof PRONOMS)[number];

export const PRONOM_LABELS: Record<Pronom, string> = {
  ana: 'أنا — ana (je)',
  nta: 'أنت — nta (tu masc.)',
  nti: 'أنتي — nti (tu fém.)',
  howa: 'هو — howa (il)',
  hiya: 'هي — hiya (elle)',
  hna: 'حنا — 7na (nous)',
  ntouma: 'نتوما — ntouma (vous)',
  houma: 'هوما — houma (ils/elles)',
};
