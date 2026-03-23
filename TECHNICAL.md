# Architecture technique — sahla.dz

> Ce document est un complément au [README.md](README.md). Il s'adresse aux devs qui veulent comprendre comment le projet fonctionne sous le capot, et à ceux qui veulent expliquer les choix techniques à un public non-technique.

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure du projet](#structure-du-projet)
3. [Base de données (Supabase / PostgreSQL)](#base-de-données)
4. [Pipeline de données : Excel → Supabase](#pipeline-de-données)
5. [Routing & rendu (App Router)](#routing--rendu)
6. [Hooks — la couche data côté client](#hooks--la-couche-data-côté-client)
7. [Composants métier clés](#composants-métier-clés)
8. [Recherche intelligente](#recherche-intelligente)
9. [SEO & Metadata](#seo--metadata)
10. [Design system](#design-system)
11. [Décisions techniques notables](#décisions-techniques-notables)

---

## Vue d'ensemble

Sahla est une application Next.js 14 (App Router) qui sert un dictionnaire de darija algérienne en arabizi. Les données vivent dans une base Supabase (PostgreSQL) et sont importées depuis un fichier Excel via un script TypeScript maison.

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│  Excel XLSX │─────▶│ import-data   │─────▶│   Supabase     │
│  4 feuilles │  tsx │ (batch 500)   │      │   PostgreSQL   │
└─────────────┘      └──────────────┘      └───────┬────────┘
                                                    │
                                        ┌───────────┴───────────┐
                                        │                       │
                                   Server Components      Client Hooks
                                   (generateMetadata,     (useMots, useMotSearch,
                                    generateStaticParams)  useMotLookup...)
                                        │                       │
                                        └───────────┬───────────┘
                                                    │
                                              ┌─────▼─────┐
                                              │  Next.js   │
                                              │  App Router│
                                              │  (Vercel)  │
                                              └────────────┘
```

**En une phrase pour un non-dev :** Les données du dictionnaire sont stockées dans un fichier Excel, un script les envoie dans une base de données en ligne, et le site web les affiche de manière interactive.

---

## Structure du projet

```
app/
├── layout.tsx                       # Layout racine (Navbar + Footer + fonts Google)
├── page.tsx                         # Landing page (hero, stats, mot du jour)
├── robots.ts                        # Génère robots.txt
├── sitemap.ts                       # Génère sitemap.xml dynamiquement depuis la BDD
├── globals.css                      # Styles globaux + classes utilitaires
│
├── dictionnaire/
│   ├── page.tsx                     # Liste paginée + recherche + filtres catégorie
│   └── [slug]/
│       ├── page.tsx                 # Server Component — metadata, fetch, layout
│       └── MotDetailClient.tsx      # Client Component — InteractivePhrase, conjugaison
│
├── conjugaison/
│   ├── page.tsx                     # Grille de tous les verbes
│   └── [verbId]/page.tsx            # Tableau de conjugaison 3 temps × 8 pronoms
│
├── grammaire/
│   ├── page.tsx                     # Liste des thèmes grammaticaux
│   └── [theme]/page.tsx             # Règles par thème (collapsible)
│
├── dialogues/
│   ├── page.tsx                     # Liste des thèmes de dialogues
│   └── [theme]/
│       ├── page.tsx                 # Server Component
│       └── DialoguesThemeClient.tsx  # Client Component (InteractivePhrase)
│
└── guide-arabizi/page.tsx           # Table de correspondance chiffres → lettres arabes

components/
├── sahla/                           # Composants métier (domaine)
│   ├── InteractivePhrase.tsx        # ⭐ Tokenizer + popover mot cliquable
│   ├── ConjugaisonTable.tsx         # Onglets Passé/Présent/Impératif
│   ├── DialoguePhrase.tsx           # Ligne de dialogue interactive
│   ├── GrammaireRule.tsx            # Règle dépliable
│   ├── MotCard.tsx                  # Carte de mot (grille dictionnaire)
│   ├── MotDuJour.tsx                # Widget "Mot du jour"
│   ├── StatsBar.tsx                 # Compteurs animés (2327 mots, 69 verbes...)
│   └── ArabiziGuide.tsx             # Mini-table arabizi
├── ui/                              # Composants génériques
│   ├── SearchBar.tsx                # Input recherche avec debounce
│   ├── Badge.tsx                    # Badge catégorie coloré
│   └── Breadcrumbs.tsx              # Fil d'Ariane
└── layout/
    ├── Navbar.tsx                   # Header sticky + menu mobile
    └── Footer.tsx                   # Footer dark

hooks/                               # Custom hooks (toute la logique data)
lib/                                 # Types, client Supabase, utilitaires
scripts/                             # Import Excel + schéma SQL
```

---

## Base de données

### Schéma

5 tables, toutes en lecture publique (RLS `SELECT` avec `USING (true)`).

```sql
mots            verbes              conjugaisons
┌────────────┐  ┌──────────────┐   ┌───────────────┐
│ id (PK)    │  │ id (PK)      │   │ id (PK)       │
│ mot_arabizi│  │ verb_id (UQ) │◄──│ verb_id (FK)  │
│ slug (UQ)  │  │ verbe_arabizi│   │ temps         │
│ traduction │  │ sens_fr      │   │ ana, nta, nti │
│ categorie  │  └──────────────┘   │ howa, hiya    │
│ exemple    │                     │ hna, ntouma   │
│ verb_id ───┼──────────────────▶  │ houma         │
│ created_at │                     │ UQ(verb_id,   │
└────────────┘                     │    temps)     │
                                   └───────────────┘

dialogues                grammaire
┌──────────────┐         ┌──────────────┐
│ id (PK)      │         │ id (PK)      │
│ dial_id (UQ) │         │ theme        │
│ theme        │         │ theme_slug   │
│ theme_slug   │         │ regle        │
│ sous_theme   │         │ explication  │
│ phrase_arabizi│        │ exemple      │
│ traduction_fr│         │ notes        │
│ mot_a_mot    │         └──────────────┘
│ contexte     │
└──────────────┘
```

### Index

| Index | Table | Type | But |
|-------|-------|------|-----|
| `idx_mots_slug` | mots | B-tree | Lookup rapide par slug (pages détail) |
| `idx_mots_categorie` | mots | B-tree | Filtre par catégorie |
| `idx_mots_verb_id` | mots | B-tree | Jointure mot ↔ verbe |
| `idx_mots_search` | mots | **GIN** | Full-text search sur `mot_arabizi \|\| traduction_fr` |
| `idx_conj_verb` | conjugaisons | B-tree | Lookup conjugaisons par verbe |
| `idx_dial_theme` | dialogues | B-tree | Filtrage par thème |
| `idx_gram_theme` | grammaire | B-tree | Filtrage par thème |

### Sécurité (RLS)

Phase 1 : lecture seule publique. Toutes les tables ont `ENABLE ROW LEVEL SECURITY` avec une policy unique :

```sql
CREATE POLICY "Public read" ON mots FOR SELECT USING (true);
```

Pas de policy `INSERT/UPDATE/DELETE` → l'écriture passe uniquement via la `SUPABASE_SERVICE_ROLE_KEY` dans le script d'import.

**Pour un non-dev :** La base de données est configurée pour que tout le monde puisse lire les données, mais personne ne peut les modifier depuis le site. Seul un script d'administration peut écrire dedans.

---

## Pipeline de données

### Source : fichier Excel (4 feuilles)

| Feuille | Lignes | Table cible | Clé d'upsert |
|---------|--------|-------------|---------------|
| Dictionnaire | ~2 327 | `mots` | `slug` |
| Conjugaison | ~207 | `verbes` + `conjugaisons` | `verb_id` / `verb_id,temps` |
| Grammaire | ~41 | `grammaire` | aucune (truncate + insert) |
| Dialogues | ~137 | `dialogues` | `dial_id` |

### Script d'import (`scripts/import-data.ts`)

```
npm run import   # → tsx scripts/import-data.ts
```

**Flux :**

1. Charge `.env.local` manuellement (pas de dotenv — parsing custom)
2. Lit le fichier Excel avec `xlsx`
3. Pour chaque feuille :
   - Parse les colonnes par leur nom exact (ex: `Mot (Arabizi)`, `Traduction (FR)`)
   - Transforme : slugification, normalisation, filtrage des lignes vides
   - Envoie en base par batch de 500 lignes
4. Stratégie d'écriture :
   - **Upsert** pour `mots`, `verbes`, `conjugaisons`, `dialogues` (ON CONFLICT sur clé unique)
   - **Truncate + Insert** pour `grammaire` (pas de clé naturelle stable)

### Gestion des slugs dupliqués

```typescript
const slugCount = new Map<string, number>();
// ...
const n = (slugCount.get(slug) ?? 0) + 1;
slugCount.set(slug, n);
if (n > 1) slug = `${slug}-${n}`;
```

Si deux mots arabizi produisent le même slug (ex: homophones), le second reçoit un suffixe `-2`. Garantit l'unicité des URLs.

**Pour un non-dev :** On prend un fichier Excel avec tout le contenu du dictionnaire, et un script le convertit automatiquement pour le mettre dans la base de données. Si deux mots ont le même nom, le script les différencie automatiquement.

---

## Routing & rendu

### Modèle hybride Server / Client

Le projet utilise le pattern **Server Component pour le layout + Client Component pour l'interactivité** :

```
/dictionnaire/[slug]/page.tsx         ← Server Component
  ├── generateMetadata()              ← SEO (titre, description, schema.org)
  ├── generateStaticParams()          ← Pré-génère toutes les pages au build
  ├── fetchMotData()                  ← Requêtes Supabase (mot, prev/next, catégorie, conjugaison)
  └── <MotDetailClient />             ← Client Component (interactive)
        ├── useMotLookup()            ← Cache singleton en mémoire
        └── <InteractivePhrase />     ← Mots cliquables + popovers
```

### Patterns de rendu par page

| Page | Rendu | Data fetching | Justification |
|------|-------|---------------|---------------|
| `/` (Home) | Client | `useRandomMot()` | Mot du jour change chaque jour |
| `/dictionnaire` | Client | `useMots()`, `useMotSearch()` | Recherche live, pagination, filtres |
| `/dictionnaire/[slug]` | **Hybride** | Server fetch + client lookup | SEO (metadata) + interactivité (popovers) |
| `/conjugaison` | Client | `useConjugaisons()` | Liste dynamique |
| `/conjugaison/[verbId]` | Server | Fetch direct Supabase | Pas d'interactivité lourde |
| `/grammaire/[theme]` | Client | `useGrammaire()` | Accordéons dépliables |
| `/dialogues/[theme]` | **Hybride** | Server fetch + client lookup | SEO + mots interactifs |
| `/guide-arabizi` | Static | Aucun (données en dur) | Contenu fixe |

### Navigation entre mots (prev/next)

La page détail d'un mot récupère les mots adjacents par ID :

```typescript
// Mot précédent
supabase.from('mots').select('slug, mot_arabizi')
  .lt('id', mot.id).order('id', { ascending: false }).limit(1)

// Mot suivant
supabase.from('mots').select('slug, mot_arabizi')
  .gt('id', mot.id).order('id', { ascending: true }).limit(1)
```

**Pour un non-dev :** Chaque page du dictionnaire est pré-générée pour être rapide à charger et bien référencée par Google. Les parties interactives (mots cliquables, recherche) s'activent côté navigateur.

---

## Hooks — la couche data côté client

Tous les hooks sont dans `hooks/` et utilisent le client Supabase directement. Ils sont découplés des composants et réutilisables (pensés pour un éventuel portage React Native).

### `useMotSearch` — Recherche avec debounce

```
Utilisateur tape → 300ms pause → RPC search_mots(q) → résultats
                                        │
                                        ▼ (si erreur)
                                  Fallback ILIKE %q%
```

- Debounce de 300ms via `setTimeout` dans un `useEffect`
- Appel RPC PostgreSQL `search_mots()` qui utilise `unaccent()` + `to_tsvector`
- Fallback automatique sur `ILIKE` si la fonction RPC n'est pas déployée
- Limite : 60 résultats max

### `useMotLookup` — Cache singleton

C'est le hook le plus technique du projet. Il résout un problème classique : éviter que N composants `InteractivePhrase` sur la même page déclenchent N fetches identiques.

```
Module-level (hors React) :
  let lookupCache: Map<string, Mot> | null = null;
  let loadingPromise: Promise<void> | null = null;

Premier composant qui appelle useMotLookup() :
  → loadLookup() : fetch ALL mots → construit Map<normalizedToken, Mot>
  → stocke dans lookupCache

Composants suivants :
  → lookupCache existe déjà → retour immédiat, 0 requête
```

- **1 seul fetch** pour toute la durée de vie de l'application
- Le cache est une `Map<string, Mot>` indexée par token normalisé
- `normalizeToken("kta3,") → "kta3"` — insensible à la ponctuation
- Pattern : **singleton au niveau module** + hook React pour le state

### `useRandomMot` — Mot du jour déterministe

```typescript
function getDayIndex(total: number): number {
  const seed = year * 10000 + month * 100 + day;  // ex: 20260323
  return seed % total;                              // ex: 20260323 % 2327 = 1289
}
```

- Tous les utilisateurs voient le même mot chaque jour
- Change à minuit (basé sur `new Date()` locale)
- Filtre : seuls les mots avec un `exemple_arabizi` sont éligibles
- Technique : `COUNT` exact → calcul offset → `range(index, index)`

### Résumé des hooks

| Hook | Requête | Cache | Particularité |
|------|---------|-------|---------------|
| `useMots` | Paginé + filtre catégorie | Non | `count: 'exact'` pour pagination |
| `useMotBySlug` | Single par slug | Non | Utilisé comme vérification client |
| `useMotSearch` | RPC `search_mots` | Non | Debounce 300ms + fallback ILIKE |
| `useMotLookup` | Fetch ALL mots (1x) | **Singleton** | Map en mémoire, partagé entre composants |
| `useRandomMot` | Count + range | Non | Seed = date du jour |
| `useConjugaisons` | All verbes | Non | Trié par verb_id |
| `useConjugaison` | Verbe + conjugaisons | Non | Requêtes parallèles |
| `useDialogues` | Filtré par theme_slug | Non | Calcule les counts par thème |
| `useGrammaire` | Filtré par theme_slug | Non | Calcule les counts par thème |
| `useCategories` | Distinct catégorie | Non | Utilise `.select('categorie')` puis déduplique JS |

**Pour un non-dev :** Les hooks sont des "robinets de données" réutilisables. Chaque hook sait comment aller chercher un type de données précis (un mot, une liste, un résultat de recherche). Le plus malin est le cache de lookup : au lieu de demander 100 fois "c'est quoi ce mot ?", il charge tout le dictionnaire une seule fois et répond instantanément ensuite.

---

## Composants métier clés

### `InteractivePhrase` — le coeur de l'app

C'est le composant qui rend chaque mot d'une phrase cliquable.

**Pipeline :**

```
"Ana n7eb el 9ahwa"
       │
       ▼ tokenize()
["Ana", " ", "n7eb", " ", "el", " ", "9ahwa"]
       │
       ▼ pour chaque token
       │
       ├── isWord("Ana") → true  → lookupMot("ana") → { mot_arabizi: "ana", ... } → <button>
       ├── isWord(" ")   → false → <span> (espace)
       ├── isWord("n7eb")→ true  → lookupMot("n7eb") → { ... } → <button>
       └── isWord("el")  → true  → lookupMot("el")   → null → <span> (mot inconnu)
```

**Tokenizer :**

```typescript
// Regex qui sépare : mots (avec accents) | ponctuation | espaces
phrase.match(/[a-zA-Z0-9éàèùâêîôûëïüæœ']+|[^\sa-zA-Z0-9éàèùâêîôûëïüæœ']+|\s+/g)
```

- Supporte les caractères accentués français dans les exemples
- Préserve les espaces et la ponctuation comme tokens séparés
- Les chiffres (3, 7, 9...) font partie des mots — essentiel pour l'arabizi

**Popover :** Un popover custom (pas Radix) positionné en absolu sous le mot cliqué, avec :
- Le mot en arabizi + badge catégorie coloré
- Traduction FR + EN
- Lien vers la page complète du mot

**Fermeture :** Click outside via `mousedown` listener sur `document`.

### `ConjugaisonTable` — Onglets de conjugaison

- Utilise `@radix-ui/react-tabs` pour les onglets Passé / Présent / Impératif
- Chaque onglet est coloré (vert / bleu / orange via `conj.passe`, `conj.present`, `conj.imperatif`)
- 8 pronoms dans l'ordre : ana, nta, nti, howa, hiya, hna, ntouma, houma
- Labels bilingues : `أنا — ana (je)` (arabe + arabizi + français)

**Pour un non-dev :** Quand on lit une phrase d'exemple, chaque mot est comme un lien : on clique dessus et une bulle apparaît avec sa définition. C'est la fonctionnalité centrale de l'app — elle transforme chaque phrase en mini-leçon interactive.

---

## Recherche intelligente

### Côté PostgreSQL

```sql
-- Index GIN pour la recherche full-text
CREATE INDEX idx_mots_search ON mots USING gin(
  to_tsvector('simple', mot_arabizi || ' ' || traduction_fr)
);
```

La fonction RPC `search_mots(q)` (à déployer manuellement) utilise :
- `unaccent()` — "acheter" trouve "achète"
- `to_tsvector('simple', ...)` — tokenisation simple (pas de stemming français)
- Configuration `simple` plutôt que `french` car l'arabizi n'est pas du français

### Côté client

```
[SearchBar]
    │ onChange
    ▼
[useMotSearch]
    │ debounce 300ms
    ▼
supabase.rpc('search_mots', { q })
    │
    ├── Succès → résultats affichés
    │
    └── Erreur (RPC manquante) → fallback :
        supabase.from('mots')
          .or('mot_arabizi.ilike.%q%, traduction_fr.ilike.%q%')
          .limit(60)
```

**Pour un non-dev :** La barre de recherche comprend le français même avec des accents. Quand on tape "acheter", elle trouve aussi "achète". Si la fonctionnalité avancée de recherche n'est pas encore installée sur le serveur, elle se rabat sur une recherche plus simple automatiquement.

---

## SEO & Metadata

### Metadata dynamique par page

Chaque page `/dictionnaire/[slug]` génère :

```typescript
{
  title: "kta3 — couper",
  description: "Apprends le mot kta3 en darija algérienne. couper. Exemple : ...",
  openGraph: { title, description },
  // Schema.org DefinedTerm
  "script:ld+json": {
    "@type": "DefinedTerm",
    "name": "kta3",
    "description": "couper",
    "inDefinedTermSet": "https://sahla.app/dictionnaire"
  }
}
```

### Sitemap dynamique (`app/sitemap.ts`)

Génère un sitemap XML complet depuis la base :

```
Priority 1.0  → /
Priority 0.9  → /dictionnaire
Priority 0.8  → /conjugaison, /grammaire, /dialogues
Priority 0.7  → /dictionnaire/[slug], /guide-arabizi
Priority 0.6  → /conjugaison/[verbId], /grammaire/[theme], /dialogues/[theme]
```

Toutes les requêtes sont parallélisées via `Promise.all`.

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://sahla.app/sitemap.xml
```

**Pour un non-dev :** Chaque page du dictionnaire a un titre et une description uniques pour Google. Un fichier sitemap liste automatiquement les 2 500+ pages du site pour que les moteurs de recherche les trouvent toutes.

---

## Design system

### Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `sahla-primary` | `#C17817` | Couleur principale (boutons, liens, accents) |
| `sahla-bg` | `#FBF7F0` | Fond principal — beige chaud |
| `sahla-bgAlt` | `#F5EDE3` | Fond alternatif, bordures |
| `sahla-dark` | `#1A1A2E` | Texte principal, hero, footer |
| `sahla-olive` | `#2D6A4F` | Accent vert |
| `sahla-blue` | `#4A90B8` | Accent bleu méditerranéen |
| `conj-passe` | `#E8F0E5` | Fond onglet Passé (vert clair) |
| `conj-present` | `#E5EEF5` | Fond onglet Présent (bleu clair) |
| `conj-imperatif` | `#F5EDE3` | Fond onglet Impératif (beige) |

### Typographie

| Classe | Police | Usage |
|--------|--------|-------|
| `font-sans` | DM Sans | Corps de texte |
| `font-display` | Outfit | Titres, logo, headings |
| `font-mono` | JetBrains Mono | IDs de verbes, code |

### Couleurs de badges par catégorie

17 catégories mappées vers des couleurs Tailwind :

```
salutations → green    famille    → pink     nourriture → yellow
verbe(s)    → blue     adjectif(s)→ purple   corps      → red
transport   → cyan     chiffres   → orange   temps      → indigo
maison      → amber    travail    → slate    éducation  → teal
couleurs    → rose     animaux    → lime     santé      → red
religion    → emerald  expressions→ violet
```

Catégorie inconnue → `gray-100`.

### Classes utilitaires custom

| Classe | Rôle |
|--------|------|
| `.max-container` | `max-width` + centrage horizontal |
| `.padding-container` | Padding horizontal responsive |
| `.word-interactive` | Style des mots cliquables (underline dotted) |

**Pour un non-dev :** Le site utilise une palette de couleurs chaudes inspirée du Maghreb (beige, ambre, vert olive). Chaque catégorie de mots a sa propre couleur pour la repérer visuellement. Trois polices de caractères sont utilisées : une pour les titres, une pour le texte courant, et une à chasse fixe pour les identifiants techniques.

---

## Décisions techniques notables

### 1. Arabizi-friendly slugs

Le slugifier conserve les chiffres, essentiels en arabizi :

```
"kta3 9ahwa"  → "kta3-9ahwa"     ✅ (chiffres préservés)
"3omri"       → "3omri"           ✅ (le 3 = ع)
```

Un slugifier classique supprimerait les chiffres et casserait le sens.

### 2. Pas de ORM, pas d'abstraction — Supabase JS direct

Toutes les requêtes utilisent le client `@supabase/supabase-js` directement dans les hooks et les Server Components. Pas de couche d'abstraction, pas de repository pattern. Pour une app read-only avec des requêtes simples, c'est le bon choix.

### 3. Client Supabase unique

```typescript
// lib/supabase.ts
export const supabase = createClient(url, anonKey);
```

Un seul client instancié au niveau module, importé partout. Supabase JS gère le pooling en interne.

### 4. Grammaire : truncate + insert (pas d'upsert)

La table `grammaire` n'a pas de clé naturelle unique stable (un thème peut avoir plusieurs règles avec le même texte). Le script d'import fait un `DELETE WHERE id != 0` puis ré-insère tout. C'est safe car la table est petite (41 lignes).

### 5. Gestion d'env custom dans le script d'import

Le script d'import parse `.env.local` manuellement au lieu d'utiliser `dotenv` :

```typescript
function loadEnv() {
  const content = fs.readFileSync('.env.local', 'utf-8');
  for (const line of content.split('\n')) {
    const idx = line.indexOf('=');
    process.env[key] = val;
  }
}
```

Zéro dépendance supplémentaire pour un script CLI one-shot.

### 6. Pronoms darija avec labels trilingues

```typescript
export const PRONOM_LABELS: Record<Pronom, string> = {
  ana:    'أنا — ana (je)',
  nta:    'أنت — nta (tu masc.)',
  hna:    'حنا — 7na (nous)',
  // ...
};
```

Chaque pronom est affiché en arabe + arabizi + français. Le `7` dans `7na` (nous) est cohérent avec le système arabizi.

### 7. `force-dynamic` sur les pages détail

```typescript
export const dynamic = 'force-dynamic';
```

Les pages `/dictionnaire/[slug]` utilisent `force-dynamic` pour garantir des données fraîches à chaque requête. Combiné avec `generateStaticParams()`, Next.js pré-rend les pages au build mais les revalide à chaque visite.

---

## Pour aller plus loin

| Sujet | Fichier(s) |
|-------|-----------|
| Schéma SQL complet | `scripts/supabase-schema.sql` |
| Script d'import | `scripts/import-data.ts` |
| Types TypeScript | `lib/types.ts` |
| Client Supabase | `lib/supabase.ts` |
| Utilitaires (slug, tokens) | `lib/utils.ts` |
| Config Tailwind | `tailwind.config.ts` |
| Sitemap dynamique | `app/sitemap.ts` |
