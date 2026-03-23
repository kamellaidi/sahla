/**
 * Inspecte le fichier Excel et affiche les noms de colonnes + premières lignes
 * Usage : npx tsx scripts/inspect-excel.ts
 */
import * as XLSX from 'xlsx';
import * as path from 'path';

const xlsxPath = path.join(process.cwd(), 'dictionnaire_darija_arabizi.xlsx');
const workbook = XLSX.readFile(xlsxPath);

console.log('\n📋 FEUILLES DÉTECTÉES :', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null }) as Record<string, unknown>[];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📄 Feuille : "${sheetName}" — ${rows.length} lignes`);
  if (rows.length === 0) { console.log('   (vide)'); continue; }

  console.log('   Colonnes :', Object.keys(rows[0]).join(' | '));
  console.log('\n   Ligne 1 :');
  for (const [key, val] of Object.entries(rows[0])) {
    console.log(`     ${key} = ${JSON.stringify(val)}`);
  }
  if (rows.length > 1) {
    console.log('\n   Ligne 2 :');
    for (const [key, val] of Object.entries(rows[1])) {
      console.log(`     ${key} = ${JSON.stringify(val)}`);
    }
  }
}
