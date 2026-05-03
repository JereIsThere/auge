// Auto-Discovery & Topic-Page-Generierung.
// Wird sowohl als prebuild/predev (CLI) als auch von vite.config.ts importiert.
//
// Layout-Konvention:
//   pages/<slug>/index.html   → gerenderte oder hand-geschriebene Page (kind: topic | page)
//   topics/<slug>/            → leerer Marker-Ordner für geplanten Inhalt (kind: comingsoon)
//   pages/claude-learnings/   → Submodule, Single Source für Topic-Inhalte
//   topics.config.json        → optionale Metadaten-Overrides (Schema: docs/topics-config-schema.md)

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const pagesDir = resolve(ROOT, 'pages');
const topicsDir = resolve(ROOT, 'topics');
const submoduleDir = resolve(pagesDir, 'claude-learnings');
const configPath = resolve(ROOT, 'topics.config.json');
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const ART_ADVANCED_EXEMPT = 'art-advanced'; // siehe docs/todos/art-advanced-unification.md

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const readIfExists = (p) => existsSync(p) ? readFileSync(p, 'utf8') : null;
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

function loadConfig() {
  if (!existsSync(configPath)) return {};
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.warn(`[discover] WARN: topics.config.json ist kaputt — ignoriere. (${err.message})`);
    return {};
  }
}

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
  return md.replace(/^#[^\r\n]*(?:\r?\n)+/, '');
}

function renderTopicPage(title, readmeMd, levels) {
  const readmeHtml = readmeMd ? marked.parse(stripFirstH1(readmeMd)) : '';
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
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
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

function defaultStatus(kind) {
  return kind === 'comingsoon' ? 'todo' : 'finished';
}

function applyConfig(meta, config) {
  const c = config[meta.slug];
  if (!c) {
    return {
      ...meta,
      status: meta.status ?? defaultStatus(meta.kind),
      category: meta.category ?? 'misc',
    };
  }
  return {
    ...meta,
    title: c.title ?? meta.title,
    description: c.description ?? meta.description,
    status: c.status ?? meta.status ?? defaultStatus(meta.kind),
    category: c.category ?? meta.category ?? 'misc',
    tags: c.tags,
    order: c.order,
  };
}

export function discoverAndGenerate() {
  const config = loadConfig();
  const topics = [];
  const generatedSlugs = new Set();

  // 1) Submodule-Topics → generate pages/<slug>/index.html
  if (isDir(submoduleDir)) {
    for (const slug of readdirSync(submoduleDir).sort()) {
      const subPath = resolve(submoduleDir, slug);
      const readmePath = resolve(subPath, 'README.md');
      if (!isDir(subPath)) continue;
      if (slug === ART_ADVANCED_EXEMPT) continue;

      const readmeMd = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : null;
      const title = readmeMd ? titleFromMarkdown(readmeMd, slug) : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const description = readmeMd ? descriptionFromMarkdown(readmeMd) : '';

      const levelData = LEVELS.map(level => ({
        name: level,
        content: readIfExists(resolve(subPath, level, 'resources.md')),
        examples: listExamples(resolve(subPath, level, 'examples')),
      }));
      const availableLevels = levelData.filter(l => l.content !== null).map(l => l.name);

      const outDir = resolve(pagesDir, slug);
      if (!isDir(outDir)) mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, 'index.html'), renderTopicPage(title, readmeMd, levelData));
      generatedSlugs.add(slug);

      topics.push(applyConfig({ slug, kind: 'topic', title, description, levels: availableLevels }, config));
    }
  }

  // 2) Standalone-Pages: alles in pages/ mit eigener index.html, das nicht generiert wurde
  for (const slug of readdirSync(pagesDir).sort()) {
    if (generatedSlugs.has(slug)) continue;
    if (slug === 'claude-learnings') continue;
    const dir = resolve(pagesDir, slug);
    if (!isDir(dir)) continue;
    if (!existsSync(resolve(dir, 'index.html'))) continue;
    topics.push(applyConfig({ slug, kind: 'page', title: slug, description: '' }, config));
  }

  // 3) Coming-Soon: alle Marker-Ordner unter topics/
  if (isDir(topicsDir)) {
    for (const slug of readdirSync(topicsDir).sort()) {
      const dir = resolve(topicsDir, slug);
      if (!isDir(dir)) continue;
      // Falls jemand zufällig denselben Slug auch in pages/ angelegt hat: pages gewinnt
      if (topics.some(t => t.slug === slug)) continue;
      topics.push(applyConfig({ slug, kind: 'comingsoon', title: slug, description: '' }, config));
    }
  }

  // Warnung: Config enthält Slugs, zu denen kein Ordner existiert
  const knownSlugs = new Set(topics.map(t => t.slug));
  for (const cfgSlug of Object.keys(config)) {
    if (cfgSlug.startsWith('_')) continue; // reserviert für meta-felder
    if (!knownSlugs.has(cfgSlug)) {
      console.warn(`[discover] WARN: topics.config.json hat Eintrag "${cfgSlug}", aber kein Ordner unter pages/ oder topics/`);
    }
  }

  // Sortierung: nach Kategorie alphabetisch, innerhalb nach order (asc) > kind (topic > page > comingsoon) > slug
  const kindOrder = { topic: 0, page: 1, comingsoon: 2 };
  topics.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    if (kindOrder[a.kind] !== kindOrder[b.kind]) return kindOrder[a.kind] - kindOrder[b.kind];
    return a.slug.localeCompare(b.slug);
  });

  writeFileSync(resolve(pagesDir, 'pages.json'), JSON.stringify(topics, null, 2));
  return topics;
}

export function wipeOutBuildDir() {
  const buildPath = '/var/www/auge';
  if (existsSync(buildPath)) {
    rmSync(buildPath, { recursive: true, force: true });
  }
}

// CLI-Modus
if (process.argv[1] && process.argv[1].endsWith('discover.mjs')) {
  const t = discoverAndGenerate();
  const cats = [...new Set(t.map(x => x.category))].sort();
  const counts = (k) => t.filter(x => x.kind === k).length;
  console.log(`[discover] ${t.length} pages — ${counts('topic')} topic, ${counts('page')} page, ${counts('comingsoon')} coming-soon`);
  console.log(`[discover] categories: ${cats.join(', ')}`);
}
