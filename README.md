# sahla.dz

> **La dardja, c'est sahla.** — Apprends l'arabe algérien comme on le parle vraiment.

Application web d'apprentissage de la dardja algérienne écrite en arabizi.

## Fonctionnalités

- **Dictionnaire** — 2 327 mots en arabizi avec traductions FR/EN, exemples interactifs et conjugaison intégrée
- **Conjugaison** — 69 verbes × 3 temps (Passé / Présent / Impératif) × 8 pronoms
- **Grammaire** — 41 règles organisées par thème avec exemples cliquables
- **Dialogues** — 137 phrases authentiques par thème (Salutations, Transport, Restaurant…)
- **Guide Arabizi** — Correspondance chiffres → lettres arabes (3=ع, 7=ح, 9=ق…)
- **InteractivePhrase** — Chaque mot d'un exemple est cliquable → définition en popover
- **Recherche intelligente** — Insensible aux accents et à la casse (unaccent + stemming français)

## Stack

| Technologie | Rôle |
|-------------|------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Langage |
| Tailwind CSS v3 | Styles |
| Supabase (PostgreSQL) | Base de données |
| Vercel | Déploiement |
| lucide-react | Icônes |

## Design

| Token | Valeur | Usage |
|-------|--------|-------|
| `--primary` | `#C17817` | Amber — couleur principale |
| `--bg` | `#FBF7F0` | Fond chaud |
| `--bg-alt` | `#F5EDE3` | Fond alternatif / bordures |
| `--dark` | `#1A1A2E` | Texte principal / Hero |
| `--olive` | `#2D6A4F` | Accent vert |
| `--blue` | `#4A90B8` | Accent bleu méditerranéen |

Polices : **Outfit** (titres) · **DM Sans** (corps) · **JetBrains Mono** (arabizi)

## Installation

```bash
npm install
```

Copie le fichier d'exemple et remplis tes credentials Supabase :

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-clé-anon
SUPABASE_SERVICE_ROLE_KEY=ta-clé-service-role   # pour l'import uniquement
```

## Commandes

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run import     # Import Excel → Supabase
npm run inspect    # Inspecte les colonnes du fichier Excel
```

## Import des données

1. Place le fichier `dictionnaire_darija_arabizi.xlsx` à la racine
2. Exécute le script SQL `scripts/supabase-schema.sql` dans le dashboard Supabase
3. Lance la fonction de recherche intelligente (voir `scripts/supabase-schema.sql`)
4. Lance `npm run import`

## Structure

```
app/
├── page.tsx                    # Landing page
├── dictionnaire/[slug]/        # Page détail mot (composant clé)
├── conjugaison/[verbId]/       # Tableau conjugaison
├── grammaire/[theme]/          # Règles par thème
├── dialogues/[theme]/          # Phrases par thème
└── guide-arabizi/              # Guide des chiffres arabizi

components/
├── sahla/                      # Composants métier
│   ├── InteractivePhrase.tsx   # Mots cliquables dans une phrase
│   ├── ConjugaisonTable.tsx    # Tableau 3 temps × 8 pronoms
│   └── ...
├── ui/                         # SearchBar, Badge, Breadcrumbs
└── layout/                     # Navbar, Footer

hooks/                          # Logique pure (réutilisable React Native)
lib/                            # types.ts, supabase.ts, utils.ts
scripts/                        # import-data.ts, inspect-excel.ts
```

## Déploiement Vercel

Connecte le repo sur [vercel.com](https://vercel.com) et ajoute les variables d'environnement :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
