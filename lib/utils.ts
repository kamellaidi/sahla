import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Génère un slug arabizi : conserve les chiffres (3,7,9...) qui font partie de l'arabizi */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

/** Normalise un token pour la lookup Map (lowercase, retire ponctuation) */
export function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Génère un slug à partir d'un thème (pour grammaire/dialogues) */
export function themeSlugify(theme: string): string {
  return theme
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

/** Couleur de badge par catégorie */
const CATEGORY_COLORS: Record<string, string> = {
  salutations: 'bg-green-100 text-green-800',
  famille: 'bg-pink-100 text-pink-800',
  nourriture: 'bg-yellow-100 text-yellow-800',
  verbe: 'bg-blue-100 text-blue-800',
  verbes: 'bg-blue-100 text-blue-800',
  adjectif: 'bg-purple-100 text-purple-800',
  adjectifs: 'bg-purple-100 text-purple-800',
  corps: 'bg-red-100 text-red-800',
  transport: 'bg-cyan-100 text-cyan-800',
  chiffres: 'bg-orange-100 text-orange-800',
  nombres: 'bg-orange-100 text-orange-800',
  temps: 'bg-indigo-100 text-indigo-800',
  maison: 'bg-amber-100 text-amber-800',
  travail: 'bg-slate-100 text-slate-800',
  education: 'bg-teal-100 text-teal-800',
  éducation: 'bg-teal-100 text-teal-800',
  couleurs: 'bg-rose-100 text-rose-800',
  animaux: 'bg-lime-100 text-lime-800',
  santé: 'bg-red-100 text-red-700',
  sante: 'bg-red-100 text-red-700',
  religion: 'bg-emerald-100 text-emerald-800',
  expressions: 'bg-violet-100 text-violet-800',
};

export function getCategoryColor(categorie: string | null): string {
  if (!categorie) return 'bg-gray-100 text-gray-700';
  const key = categorie.toLowerCase().trim();
  return CATEGORY_COLORS[key] ?? 'bg-gray-100 text-gray-700';
}

/** Sélectionne un mot aléatoire selon la date (seed = date du jour) */
export function getDayIndex(total: number): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return seed % total;
}
