// Auto-Discovery & Topic-Page-Generierung.
// Wird sowohl als prebuild/predev (CLI) als auch von vite.config.ts importiert.

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const pagesDir = resolve(ROOT, 'pages');
const submoduleDir = resolve(pagesDir, 'claude-learnings');
const LEVELS = ['beginner', 'intermediate', 'advanced'];

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const readIfExists = (p) => existsSync(p) ? readFileSync(p, 'utf8') : null;
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

const titleFromMarkdown = (md, fallback) => {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
};

const descriptionFromMarkdown = (md) => {
  let inFence = false;
  for (const line of md.split('\n')) {
    if (line.startsWith('```')) { inFence = !inFence; continue; }
    if (inFence) continue;
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('|') || t.startsWith('>')) continue;
    const stripped = t.replace(/[*_`[\]()]/g, '');
    return stripped.length > 160 ? stripped.slice(0, 160).trimEnd() + '…' : stripped;
  }
  return '';
};

const listExamples = (dir) =>
  isDir(dir) ? readdirSync(dir).filter(n => statSync(resolve(dir, n)).isFile()) : [];

function stripFirstH1(md) {
  // Erstes `# Heading` (das wir schon als Titel verwenden) entfernen, damit es im Body nicht doppelt erscheint.
  // Robust gegen CRLF.
  return md.replace(/^#[^\r\n]*(?:\r?\n)+/, '');
}

function renderTopicPage(title, readmeMd, levels) {
  const readmeHtml = marked.parse(stripFirstH1(readmeMd));
  const availableLevels = levels.filter(l => l.content !== null);

  const levelsHtml = availableLevels.map(l => {
    const examplesHtml = l.examples.length
      ? `<details class="examples"><summary>Examples (${l.examples.length})</summary>
<ul>${l.examples.map(e => `<li><code>${escapeHtml(e)}</code></li>`).join('')}</ul>
</details>`
      : '';
    return `<section class="level" id="${l.name}" aria-labelledby="level-${l.name}-h">
<h2 id="level-${l.name}-h" class="level-heading">${escapeHtml(l.name.charAt(0).toUpperCase() + l.name.slice(1))}</h2>
<div class="markdown-body">${marked.parse(l.content)}</div>
${examplesHtml}
</section>`;
  }).join('\n');

  const levelNav = availableLevels.length
    ? `<nav class="topic-nav" aria-label="Level">
${availableLevels.map(l => `<a href="#${l.name}">${escapeHtml(l.name)}</a>`).join('')}
</nav>`
    : '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="description" content="${escapeHtml(title)} — auge.">
<title>${escapeHtml(title)} · auge</title>
<link rel="stylesheet" href="/style.css">
</head>
<body class="topic">
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<main id="main" class="topic-page">
<a href="/" class="back" aria-label="Zurück zur Übersicht">← zurück</a>
<header class="topic-header">
<h1>${escapeHtml(title)}</h1>
${levelNav}
</header>
<article class="markdown-body topic-readme">
${readmeHtml}
</article>
${levelsHtml}
</main>
</body>
</html>`;
}

export function discoverAndGenerate() {
  const topics = [];
  const generatedSlugs = new Set();

  // 1) Submodule-Topics
  if (isDir(submoduleDir)) {
    for (const slug of readdirSync(submoduleDir).sort()) {
      const subPath = resolve(submoduleDir, slug);
      const readmePath = resolve(subPath, 'README.md');
      if (!isDir(subPath) || !existsSync(readmePath)) continue;
      if (slug === 'art-advanced') continue; // siehe docs/todos/art-advanced-unification.md

      const readmeMd = readFileSync(readmePath, 'utf8');
      const title = titleFromMarkdown(readmeMd, slug);
      const description = descriptionFromMarkdown(readmeMd);

      const levelData = LEVELS.map(level => ({
        name: level,
        content: readIfExists(resolve(subPath, level, 'resources.md')),
        examples: listExamples(resolve(subPath, level, 'examples')),
      }));
      const availableLevels = levelData.filter(l => l.content !== null).map(l => l.name);

      const outDir = resolve(pagesDir, slug);
      if (!isDir(outDir)) continue;
      writeFileSync(resolve(outDir, 'index.html'), renderTopicPage(title, readmeMd, levelData));
      generatedSlugs.add(slug);

      topics.push({ slug, kind: 'topic', title, description, levels: availableLevels });
    }
  }

  // 2/3) Standalone-Pages + Coming-Soon Scaffolds
  for (const slug of readdirSync(pagesDir).sort()) {
    if (generatedSlugs.has(slug)) continue;
    if (slug === 'claude-learnings') continue;
    const dir = resolve(pagesDir, slug);
    if (!isDir(dir)) continue;

    if (existsSync(resolve(dir, 'index.html'))) {
      topics.push({ slug, kind: 'page', title: slug, description: '' });
    } else {
      topics.push({ slug, kind: 'comingsoon', title: slug, description: '' });
    }
  }

  // Sortierung: topic > page > comingsoon, alphabetisch
  const order = { topic: 0, page: 1, comingsoon: 2 };
  topics.sort((a, b) => order[a.kind] - order[b.kind] || a.slug.localeCompare(b.slug));

  writeFileSync(resolve(pagesDir, 'pages.json'), JSON.stringify(topics, null, 2));
  return topics;
}

export function wipeOutBuildDir() {
  const distPath = resolve(ROOT, 'dist');
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }
}

// CLI-Modus: direkt ausführen
if (process.argv[1] && process.argv[1].endsWith('discover.mjs')) {
  const t = discoverAndGenerate();
  console.log(`[discover] ${t.length} pages — ${t.filter(x => x.kind === 'topic').length} topic, ${t.filter(x => x.kind === 'page').length} page, ${t.filter(x => x.kind === 'comingsoon').length} coming-soon`);
}
