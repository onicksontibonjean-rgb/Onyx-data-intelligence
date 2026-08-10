import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = [
  'index.html',
  'netlify.toml',
  'package.json',
  'public/css/onyx.css',
  'public/js/01-onyx-core.js',
  'public/js/02-onyx-expert-engine.js',
  'public/js/03-onyx-adaptive-reporting.js',
  'public/js/04-onyx-report-polish.js'
];

const missing = required.filter((path) => !existsSync(path));
if (missing.length) {
  console.error('Fichiers requis manquants:');
  missing.forEach((file) => console.error(` - ${file}`));
  process.exit(1);
}

const html = readFileSync('index.html', 'utf8');
const expectedOrder = [
  'papaparse.min.js',
  'xlsx.full.min.js',
  'plotly-2.35.2.min.js',
  '01-onyx-core.js',
  '02-onyx-expert-engine.js',
  '03-onyx-adaptive-reporting.js',
  '04-onyx-report-polish.js'
];

let lastIndex = -1;
for (const token of expectedOrder) {
  const index = html.indexOf(token);
  if (index < 0) {
    console.error(`Référence absente dans index.html: ${token}`);
    process.exit(1);
  }
  if (index < lastIndex) {
    console.error(`Ordre de chargement incorrect autour de: ${token}`);
    process.exit(1);
  }
  lastIndex = index;
}

if (!html.includes('./css/onyx.css')) {
  console.error('La feuille de style Onyx n’est pas référencée.');
  process.exit(1);
}

const netlify = readFileSync('netlify.toml', 'utf8');
if (!netlify.includes('command = "npm run build"') || !netlify.includes('publish = "dist"')) {
  console.error('netlify.toml doit utiliser npm run build et publier dist.');
  process.exit(1);
}

for (const file of required.filter((path) => path.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`Erreur de syntaxe JavaScript dans ${file}`);
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
}

console.log('✓ Structure Onyx valide');
console.log('✓ Configuration Netlify valide');
console.log('✓ Ordre des moteurs JavaScript valide');
console.log('✓ Syntaxe des scripts JavaScript valide');
if (existsSync('legacy/onyx-v3-single-file.html')) {
  console.log('✓ Version legacy disponible pour retour arrière');
} else {
  console.log('ℹ Version legacy absente — optionnelle pour le déploiement');
}
