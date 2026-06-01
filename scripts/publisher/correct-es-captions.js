#!/usr/bin/env node
/**
 * correct-es-captions.js
 *
 * Reads 1_recording/captions.sbv (raw Spanish ASR), applies a curated list of
 * technical-term corrections (proper nouns, brand names, framework names, etc.)
 * derived from the already-reviewed youtube_captions_en.sbv, and writes the
 * result to 2_publisher/youtube_transcript_es.sbv.
 *
 * Usage:
 *   node scripts/publisher/correct-es-captions.js [episodeNumber]
 *
 * If episodeNumber is omitted the latest episode folder is used automatically.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Resolve episode directory
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
let episodeArg = args.find(arg => !arg.startsWith('--'));

const episodesDir = path.join(__dirname, '../../episodes');
let episodeNumber;

if (episodeArg) {
  episodeNumber = episodeArg.toString().padStart(4, '0');
} else {
  const folders = fs.readdirSync(episodesDir)
    .filter(f => fs.lstatSync(path.join(episodesDir, f)).isDirectory() && /^\d+$/.test(f))
    .map(f => parseInt(f))
    .sort((a, b) => b - a);
  if (folders.length === 0) {
    console.error('No episode folders found.');
    process.exit(1);
  }
  episodeNumber = folders[0].toString().padStart(4, '0');
}

const episodeDir = path.join(episodesDir, episodeNumber);
console.log(`Targeting Episode: ${episodeNumber} (${episodeDir})`);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const sourcePath   = path.join(episodeDir, '1_recording/captions.sbv');
const outputPath   = path.join(episodeDir, '2_publisher/youtube_captions_es.sbv');

if (!fs.existsSync(sourcePath)) {
  console.error(`Error: ${sourcePath} not found.`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Term-correction rules
//
// Each entry is [pattern, replacement].
// • Patterns are RegExp objects – use word-boundary-aware patterns where needed
//   to avoid over-replacing inside other words.
// • Entries are applied IN ORDER, so put more-specific patterns before broader ones.
// ---------------------------------------------------------------------------
const CORRECTIONS = [
  // ── Web / frontend terminology (must run BEFORE build-tooling rules) ────────
  // Core Web Vitals – must be matched BEFORE the "Bit → Vite" rule fires,
  // because the ASR form "corw bit vitals" contains the word "bit".
  [/\bcorw\s*bit\s*vitals?\b/gi,   'Core Web Vitals'],
  [/\bcover\s*wir\s*viral[se]?\b/gi,'Core Web Vitals'],
  [/\bcorweb\s*vitals?\b/gi,       'Core Web Vitals'],
  [/\bcore\s*web\s*vitals?\b/gi,   'Core Web Vitals'],

  // ── Build tooling ──────────────────────────────────────────────────────────
  // "Vitest" must come BEFORE "Vite" / "Bit" rules so it isn't clobbered.
  [/\bVitest\b/gi,                     'Vitest'],
  [/\bvitest\b/gi,                     'Vitest'],

  // "Vite" is mis-transcribed as "Bit" / "bit" throughout.
  // Guard: only when NOT preceded by "su" (to avoid "subit") or letters
  // that form another word.  Use explicit context patterns.
  [/\bBit\b(?!\s*coin|\s*map|\s*ly)/g, 'Vite'],   // capitalised "Bit" → Vite
  [/\bbit\b(?!\s*coin|\s*map|\s*ly)/g, 'Vite'],   // lowercase  "bit" → Vite (context-safe)

  // Rolldown (mis-heard as "roll down" / "roll up")
  [/\broll\s*down\b/gi,   'Rolldown'],
  [/\bRolldown\b/g,       'Rolldown'],

  // ── Frameworks & libraries ─────────────────────────────────────────────────
  // Analog – many ASR variants
  [/\bAnalga\b/g,   'Analog'],
  [/\bAnalgo\b/g,   'Analog'],
  [/\bAnalo\b/g,    'Analog'],
  [/\bAnaly\b/g,    'Analog'],
  [/\banalog\b/g,   'Analog'],   // lowercase
  [/\banalop\b/g,   'Analog'],

  // Angular – mostly correct but fix lowercase or partial misheards
  [/\bAngula\b/g,   'Angular'],
  [/\bAngulita\b/gi,'Angular'],
  [/\bAngularia\b/g,'Angular'],  // ASR hallucination for a feature name
  [/\bangular\b/g,  'Angular'],  // lowercase

  // NgRx
  [/\bNGRX\b/g,     'NgRx'],
  [/\bNGRx\b/g,     'NgRx'],
  [/\bNGRX\b/g,     'NgRx'],
  [/\bngrx\b/gi,    'NgRx'],
  [/\bNGRX\b/g,     'NgRx'],

  // NgModules
  [/\bNG modules\b/gi, 'NgModules'],
  [/\bNg modules\b/gi, 'NgModules'],
  [/\bNg Modules\b/g,  'NgModules'],

  // NgToast (toast library mentioned by Luis)
  [/\bNG Toast\b/gi,  'NgToast'],
  [/\bNg Toast\b/gi,  'NgToast'],

  // Marked.js  (mis-transcribed as Marktown, Mark J, Mark JS, MarkDown)
  [/\bMarktown\b/gi,  'Marked.js'],
  [/\bMark\s*J\b/g,   'Marked.js'],
  [/\bMark\s*JS\b/gi, 'Marked.js'],
  [/\bMark\s*J\b/g,   'Marked.js'],

  // Nitro
  [/\bnitro\b/g,  'Nitro'],

  // H3
  [/\bh3\b/g,  'H3'],

  // Next.js / NextJs
  [/\bNextJs\b/g,   'Next.js'],
  [/\bnextjs\b/gi,  'Next.js'],

  // Nx monorepo (ASR: "NX", "Monoriple", "mono RIPO", "Monoriple")
  [/\bNX\b/g,           'Nx'],
  [/\bmonoripo\b/gi,    'monorepo'],
  [/\bmono\s*ripo\b/gi, 'monorepo'],
  [/\bmonoriple\b/gi,   'monorepo'],

  // Docusaurus (ASR: "Docos", "docusaurus")
  [/\bDocos\b/gi,      'Docusaurus'],
  [/\bdocusaurus\b/gi, 'Docusaurus'],

  // Storybook
  [/\bstorybook\b/gi, 'Storybook'],

  // Astro
  [/\bastro\b/gi, 'Astro'],

  // React
  [/\breactan\b/gi, 'React'],
  [/\breact\b/gi,   'React'],

  // Vercel (ASR: "Versel", "Bersel", "Bercel")
  [/\bVersel\b/g,  'Vercel'],
  [/\bversel\b/g,  'Vercel'],
  [/\bBersel\b/g,  'Vercel'],
  [/\bBercel\b/g,  'Vercel'],

  // Netlify (ASR: "Netlif", "Netleaf", "define")
  [/\bNetlif\b/g,   'Netlify'],
  [/\bNetleaf\b/g,  'Netlify'],
  [/\bnetlify\b/gi, 'Netlify'],

  // Firebase / AWS Lambda / Google Cloud Run – fix common ASR mutations
  [/\bFirebas\b/g,    'Firebase'],
  [/\bAWS\s*Landa\b/g,'AWS Lambda'],
  [/\bCloud\s*R\b/g,  'Cloud Run'],

  // Spartan
  [/\bSpartime\b/g, 'Spartan'],
  [/\bspartan\b/gi, 'Spartan'],

  // Transloco
  [/\btransloco\b/gi, 'Transloco'],

  // Blogger
  [/\bblogger\.com\b/gi, 'Blogger'],
  [/\bblogger\b/gi,      'Blogger'],

  // WordPress
  [/\bwordpress\b/gi, 'WordPress'],

  // ── AI / LLM terminology ───────────────────────────────────────────────────
  // LLM (ASR often drops one L → "LM")
  [/\bel LM\b/g,  'el LLM'],
  [/\bun LM\b/g,  'un LLM'],

  // Copilot
  [/\bcopilot\b/gi, 'Copilot'],

  // Antigravity (AI IDE used in the episode)
  [/\bAntigravity\b/gi, 'Antigravity'],

  // ── Web / frontend terminology ─────────────────────────────────────────────
  // SSR / SSG / SEO – capitalise when standalone
  [/\bssr\b/gi, 'SSR'],
  [/\bssg\b/gi, 'SSG'],
  [/\bseo\b/gi, 'SEO'],

  // Core Web Vitals – already handled above (before Bit→Vite rule)

  // INP / FID / CLS (written out by ASR)
  [/\bfirst\s*input\s*delay\b/gi,        'First Input Delay'],
  [/\binteraction\s*to\s*next\s*p[a-z]+\b/gi, 'Interaction to Next Paint'],
  [/\bcumulative\s*fl?\w*\s*shift\b/gi,  'Cumulative Layout Shift'],

  // Hydration term
  [/\bhidrataci/gi, 'hidrataci'],   // keep Spanish but correct capitalisation context

  // piline → pipeline
  [/\bpiline\b/gi, 'pipeline'],

  // boiler play → boilerplate
  [/\bboiler\s*play\b/gi, 'boilerplate'],

  // ── People's names ─────────────────────────────────────────────────────────
  // Matthew (ASR: "Matthew" – already correct but also "Matthieu")
  // Brandon – already fine
  // Mark Thomson (ASR: "Death Rail" → DevRel)
  [/\bDeath\s*Rail\b/gi, 'DevRel'],
  [/\bMark\s*Thomson\b/g, 'Mark Thompson'],

  // Chau (co-creator of .ng files – ASR "ano chao" → "Chau")
  [/\bano\s*chao\b/gi, 'Chau'],

  // Andrés Villanueva – stays as-is (correct in source)

  // ── GitHub terminology ─────────────────────────────────────────────────────
  // "git de efecto abierto" → "issue abierto" (ASR garble)
  [/\bgit de efecto abierto\b/gi, 'issue abierto'],

  // ── Misc brand / product names ─────────────────────────────────────────────
  // Metroflog (social network – ASR is already correct, normalise capitalisation)
  [/\bmetroflog\b/gi, 'Metroflog'],

  // TypeScript
  [/\btypescript\b/gi, 'TypeScript'],

  // JavaScript
  [/\bjavascript\b/gi, 'JavaScript'],

  // Markdown
  [/\bmarkdown\b/gi, 'Markdown'],
  [/\bMackdown\b/g,  'Markdown'],

  // API
  [/\bapi\b/g, 'API'],

  // PR (pull request)
  [/\bpr\b/g, 'PR'],

  // HTML / CSS
  [/\bhtml\b/gi, 'HTML'],
  [/\bCCS\b/g,   'CSS'],
  [/\bcss\b/gi,  'CSS'],

  // CEO → SEO (common OCR/ASR swap in Spanish tech context)
  [/\bel CEO\b/g, 'el SEO'],

  // RAM
  [/\bram\b/gi, 'RAM'],
];

// ---------------------------------------------------------------------------
// Helper: apply all corrections to a block of text
// ---------------------------------------------------------------------------
function applyCorrections(text) {
  let result = text;
  for (const [pattern, replacement] of CORRECTIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Parse, correct, and write
// ---------------------------------------------------------------------------
const rawData = fs.readFileSync(sourcePath, 'utf8');
const blocks  = rawData.split('\n\n').filter(b => b.trim().length > 0);

console.log(`Loaded ${blocks.length} blocks from ${sourcePath}`);

let sbvContent = '';
let corrections = 0;

for (const block of blocks) {
  const lines     = block.split('\n');
  const timestamp = lines[0];
  const original  = lines.slice(1).join('\n');
  const corrected = applyCorrections(original);

  if (corrected !== original) corrections++;

  sbvContent += `${timestamp}\n${corrected}\n\n`;
}

sbvContent = sbvContent.trimEnd() + '\n';

fs.writeFileSync(outputPath, sbvContent, 'utf8');

console.log(`\n✅ Done! Applied corrections to ${corrections} of ${blocks.length} blocks.`);
console.log(`   Output: ${outputPath}`);
