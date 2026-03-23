/**
 * Script d'import : dictionnaire_darija_arabizi.xlsx → Supabase
 * Usage : npm run import
 *
 * Colonnes réelles du fichier Excel :
 *
 * Dictionnaire  : ID | Mot (Arabizi) | Traduction (FR) | Translation (EN) |
 *                 Catégorie | Exemple (Arabizi) | Traduction exemple (FR) |
 *                 Notes / Variantes | Source | VERB_ID
 *
 * Conjugaison   : VERB_ID | Verbe (Arabizi) | Sens (FR) | Temps |
 *                 ana (je) | nta (tu m.) | nti (tu f.) | howa (il) | hiya (elle) |
 *                 7na (nous) | ntouma (vous) | houma (ils)
 *
 * Grammaire     : Thème | Règle | Explication | Exemple (Arabizi) |
 *                 Traduction FR | Notes
 *
 * Dialogues     : DIAL_ID | Thème | Sous-thème | Phrase (Arabizi) |
 *                 Traduction FR | Mot-à-mot | Contexte / Usage
 */

import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ── Env ──────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local introuvable.');
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    process.env[key] = val;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local\n' +
    '→ Dashboard Supabase → Settings → API → service_role (secret)'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ── Helpers ───────────────────────────────────────────────────
function slugify(text: string): string {
  return String(text).toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function themeSlugify(theme: string): string {
  return String(theme).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function str(val: unknown): string | null {
  if (val === undefined || val === null || val === '') return null;
  const s = String(val).trim();
  return s || null;
}

// ── Excel ─────────────────────────────────────────────────────
const xlsxPath = path.join(process.cwd(), 'dictionnaire_darija_arabizi.xlsx');
if (!fs.existsSync(xlsxPath)) throw new Error(`Excel introuvable : ${xlsxPath}`);

const workbook = XLSX.readFile(xlsxPath);
console.log('📖 Feuilles :', workbook.SheetNames.join(', '));

function getSheet(name: string) {
  const found = workbook.SheetNames.find((n) =>
    n === name ||
    n.toLowerCase() === name.toLowerCase() ||
    n.toLowerCase().includes(name.toLowerCase())
  );
  if (!found) throw new Error(`Feuille "${name}" introuvable.`);
  return XLSX.utils.sheet_to_json(workbook.Sheets[found], { defval: null }) as Record<string, unknown>[];
}

// ── Upsert batch ──────────────────────────────────────────────
async function upsertBatch(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string
): Promise<number> {
  if (rows.length === 0) return 0;
  const BATCH = 500;
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) {
      console.error(`  ❌ ${table} batch ${i}–${i + BATCH}: ${error.message}`);
    } else {
      total += batch.length;
    }
  }
  return total;
}

// Truncate + insert pour les tables sans clé naturelle (grammaire)
async function truncateInsert(table: string, rows: Record<string, unknown>[]): Promise<number> {
  if (rows.length === 0) return 0;
  const { error: delErr } = await supabase.from(table).delete().neq('id', 0);
  if (delErr) console.error(`  ❌ Truncate ${table}: ${delErr.message}`);
  const BATCH = 500;
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`  ❌ Insert ${table} batch ${i}: ${error.message}`);
    } else {
      total += batch.length;
    }
  }
  return total;
}

// ============================================================
// 1. DICTIONNAIRE → mots
//    Colonnes : Mot (Arabizi) | Traduction (FR) | Translation (EN) |
//               Catégorie | Exemple (Arabizi) | Traduction exemple (FR) |
//               Notes / Variantes | Source | VERB_ID
// ============================================================
async function importMots() {
  console.log('\n📚 Import Dictionnaire → mots...');
  const rows = getSheet('Dictionnaire');

  const slugCount = new Map<string, number>();

  const mots = rows.map((row) => {
    const mot_arabizi = str(row['Mot (Arabizi)']) ?? '';
    let slug = slugify(mot_arabizi);
    if (!slug) slug = `mot-${row['ID'] ?? Math.random()}`;

    // Déduplication des slugs
    const n = (slugCount.get(slug) ?? 0) + 1;
    slugCount.set(slug, n);
    if (n > 1) slug = `${slug}-${n}`;

    return {
      mot_arabizi,
      slug,
      traduction_fr:    str(row['Traduction (FR)'])           ?? '',
      traduction_en:    str(row['Translation (EN)']),
      categorie:        str(row['Catégorie']),
      exemple_arabizi:  str(row['Exemple (Arabizi)']),
      exemple_fr:       str(row['Traduction exemple (FR)']),
      notes:            str(row['Notes / Variantes']),
      source:           str(row['Source'])                    ?? 'Manuel',
      verb_id:          str(row['VERB_ID']),
    };
  }).filter((m) => m.mot_arabizi && m.traduction_fr);

  console.log(`   ${rows.length} lignes lues → ${mots.length} mots valides`);
  const count = await upsertBatch('mots', mots, 'slug');
  console.log(`  ✅ ${count} mots importés`);
}

// ============================================================
// 2. CONJUGAISON → verbes + conjugaisons
//    Colonnes : VERB_ID | Verbe (Arabizi) | Sens (FR) | Temps |
//               ana (je) | nta (tu m.) | nti (tu f.) | howa (il) | hiya (elle) |
//               7na (nous) | ntouma (vous) | houma (ils)
// ============================================================
async function importConjugaison() {
  console.log('\n🔧 Import Conjugaison → verbes + conjugaisons...');
  const rows = getSheet('Conjugaison');

  const verbesMap = new Map<string, { verb_id: string; verbe_arabizi: string; sens_fr: string }>();
  const conjugaisons: Record<string, unknown>[] = [];

  for (const row of rows) {
    const verb_id = str(row['VERB_ID']);
    if (!verb_id) continue;

    if (!verbesMap.has(verb_id)) {
      verbesMap.set(verb_id, {
        verb_id,
        verbe_arabizi: str(row['Verbe (Arabizi)']) ?? '',
        sens_fr:       str(row['Sens (FR)'])        ?? '',
      });
    }

    const temps = str(row['Temps']);
    if (temps) {
      conjugaisons.push({
        verb_id,
        temps,
        ana:    str(row['ana (je)']),
        nta:    str(row['nta (tu m.)']),
        nti:    str(row['nti (tu f.)']),
        howa:   str(row['howa (il)']),
        hiya:   str(row['hiya (elle)']),
        hna:    str(row['7na (nous)']),
        ntouma: str(row['ntouma (vous)']),
        houma:  str(row['houma (ils)']),
      });
    }
  }

  const verbes = Array.from(verbesMap.values());
  console.log(`   ${verbes.length} verbes, ${conjugaisons.length} formes conjuguées`);

  const vCount = await upsertBatch('verbes',       verbes,       'verb_id');
  const cCount = await upsertBatch('conjugaisons', conjugaisons, 'verb_id,temps');
  console.log(`  ✅ ${vCount} verbes, ${cCount} conjugaisons importés`);
}

// ============================================================
// 3. GRAMMAIRE → grammaire
//    Colonnes : Thème | Règle | Explication | Exemple (Arabizi) |
//               Traduction FR | Notes
// ============================================================
async function importGrammaire() {
  console.log('\n📖 Import Grammaire → grammaire...');
  const rows = getSheet('Grammaire');

  const regles = rows.map((row) => {
    const theme = str(row['Thème']) ?? 'Général';
    return {
      theme,
      theme_slug:      themeSlugify(theme),
      regle:           str(row['Règle'])              ?? '',
      explication:     str(row['Explication']),
      exemple_arabizi: str(row['Exemple (Arabizi)']),
      exemple_fr:      str(row['Traduction FR']),
      notes:           str(row['Notes']),
    };
  }).filter((r) => r.regle);

  console.log(`   ${regles.length} règles valides`);
  const count = await truncateInsert('grammaire', regles);
  console.log(`  ✅ ${count} règles importées`);
}

// ============================================================
// 4. DIALOGUES → dialogues
//    Colonnes : DIAL_ID | Thème | Sous-thème | Phrase (Arabizi) |
//               Traduction FR | Mot-à-mot | Contexte / Usage
// ============================================================
async function importDialogues() {
  console.log('\n💬 Import Dialogues → dialogues...');
  const rows = getSheet('Dialogues');

  const dialogues = rows.map((row) => {
    const theme = str(row['Thème']) ?? 'Divers';
    return {
      dial_id:        str(row['DIAL_ID'])            ?? '',
      theme,
      theme_slug:     themeSlugify(theme),
      sous_theme:     str(row['Sous-thème']),
      phrase_arabizi: str(row['Phrase (Arabizi)'])   ?? '',
      traduction_fr:  str(row['Traduction FR'])      ?? '',
      mot_a_mot:      str(row['Mot-à-mot']),
      contexte:       str(row['Contexte / Usage']),
    };
  }).filter((d) => d.dial_id && d.phrase_arabizi && d.traduction_fr);

  console.log(`   ${dialogues.length} phrases valides`);
  const count = await upsertBatch('dialogues', dialogues, 'dial_id');
  console.log(`  ✅ ${count} phrases importées`);
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('\n🚀 Import Sahla — démarrage');
  console.log(`   URL : ${supabaseUrl}\n`);

  await importMots();
  await importConjugaison();
  await importGrammaire();
  await importDialogues();

  console.log('\n🎉 Import terminé ! Vérifie le dashboard Supabase.\n');
}

main().catch((err) => {
  console.error('\n💥 Erreur fatale :', err.message);
  process.exit(1);
});
