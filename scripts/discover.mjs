// Auto-Discovery & Topic-Page-Generierung.
// Wird sowohl als prebuild/predev (CLI) als auch von vite.config.ts importiert.
//
// Layout-Konvention:
//   pages/<slug>/index.html   → gerenderte oder hand-geschriebene Page (kind: topic | page)
//   topics/<slug>/            → leerer Marker-Ordner für geplanten Inhalt (kind: comingsoon)
//   pages/claude-learnings/   → Submodule, Single Source für Topic-Inhalte
//   pages/claude-learnings/schema.json → Gruppen & Labels (Quelle der Wahrheit für Kategorien)
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

function loadSchema() {
  const schemaPath = resolve(submoduleDir, 'schema.json');
  if (!existsSync(schemaPath)) return null;
  try {
    return JSON.parse(readFileSync(schemaPath, 'utf8'));
  } catch (err) {
    console.warn(`[discover] WARN: schema.json kaputt — ignoriere. (${err.message})`);
    return null;
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

function renderCategoryPage(slug, title, description) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
<title>${escapeHtml(title)} · auge</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/style.css">
</head>
<body class="topic" data-category="${escapeHtml(slug)}">
<a href="#main" class="skip-link">Zum Inhalt springen</a>
<main id="main" class="topic-page">
<a href="/" class="back" aria-label="Zurück zur Startseite">← zurück</a>
<header class="topic-header">
<h1>${escapeHtml(title)}</h1>
${description ? `<p class="topic-desc">${escapeHtml(description)}</p>` : ''}
</header>
<div id="cat-content"></div>
</main>
<script type="module" src="../category.ts"></script>
</body>
</html>`;
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

function applyConfig(meta, config, schemaCategory = null, schemaOrder = null) {
  const c = config[meta.slug];
  return {
    ...meta,
    title:       c?.title       ?? meta.title,
    description: c?.description ?? meta.description,
    status:      c?.status      ?? meta.status ?? defaultStatus(meta.kind),
    category:    c?.category    ?? schemaCategory ?? meta.category ?? 'misc',
    tags:        c?.tags,
    order:       c?.order       ?? schemaOrder ?? meta.order,
  };
}

export function discoverAndGenerate() {
  const config = loadConfig();
  const schema = loadSchema();
  const topics = [];
  const generatedSlugs = new Set();

  // Build topic→group and group→meta maps from schema
  const topicToGroup = new Map();   // slug → group object
  const topicOrder   = new Map();   // slug → index within group
  const groupMeta    = new Map();   // group.id → { label, description, order }
  if (schema?.groups) {
    schema.groups.forEach((g, groupIdx) => {
      groupMeta.set(g.id, { label: g.label, description: g.description, order: groupIdx });
      g.topics.forEach((slug, topicIdx) => {
        topicToGroup.set(slug, g);
        topicOrder.set(slug, topicIdx);
      });
    });
  }

  // Pre-populate category slugs (schema groups + _categories) to skip in standalone-page scan
  for (const id of groupMeta.keys()) generatedSlugs.add(id);
  const catConfig = config['_categories'] ?? {};
  for (const catSlug of Object.keys(catConfig)) generatedSlugs.add(catSlug);

  // 1) Submodule-Topics → generate pages/<slug>/index.html
  if (isDir(submoduleDir)) {
    for (const slug of readdirSync(submoduleDir).sort()) {
      const subPath = resolve(submoduleDir, slug);
      const readmePath = resolve(subPath, 'README.md');
      if (!isDir(subPath)) continue;
      if (slug.startsWith('.')) continue;
      if (slug === ART_ADVANCED_EXEMPT) continue;

      const readmeMd = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : null;
      const schemaMeta = schema?.topics?.[slug];
      const schemaGroup = topicToGroup.get(slug);

      // Schema label wins over README h1
      const title = schemaMeta?.label
        ?? (readmeMd ? titleFromMarkdown(readmeMd, slug) : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
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

      topics.push(applyConfig(
        { slug, kind: 'topic', title, description, levels: availableLevels },
        config,
        schemaGroup?.id ?? null,
        topicOrder.get(slug) ?? null,
      ));
    }
  }

  // 2) Standalone-Pages: alles in pages/ mit eigener index.html, das nicht generiert wurde
  for (const slug of readdirSync(pagesDir).sort()) {
    if (generatedSlugs.has(slug)) continue;
    if (slug === 'claude-learnings') continue;
    if (slug.startsWith('.')) continue;
    const dir = resolve(pagesDir, slug);
    if (!isDir(dir)) continue;
    if (!existsSync(resolve(dir, 'index.html'))) continue;
    const schemaGroup = topicToGroup.get(slug);
    topics.push(applyConfig(
      { slug, kind: 'page', title: slug, description: '' },
      config,
      schemaGroup?.id ?? null,
      topicOrder.get(slug) ?? null,
    ));
  }

  // 2b) Category pages — schema groups + _categories
  const liveCats = new Set(
    topics.filter(t => !t.category.startsWith('_')).map(t => t.category)
  );

  // Collect all category definitions: schema groups first, then _categories overrides/additions
  const allCatDefs = new Map();
  if (schema?.groups) {
    schema.groups.forEach((g, i) => {
      allCatDefs.set(g.id, { title: g.label, description: g.description, order: i });
    });
  }
  for (const [catSlug, meta] of Object.entries(catConfig)) {
    if (!allCatDefs.has(catSlug)) {
      allCatDefs.set(catSlug, {
        title: meta.title ?? catSlug.charAt(0).toUpperCase() + catSlug.slice(1),
        description: meta.description ?? '',
        order: meta.order ?? 99,
      });
    }
  }

  for (const [catSlug, cat] of allCatDefs) {
    if (!liveCats.has(catSlug)) continue;
    const outDir = resolve(pagesDir, catSlug);
    if (!isDir(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, 'index.html'), renderCategoryPage(catSlug, cat.title, cat.description));
    generatedSlugs.add(catSlug);
    topics.push({
      slug: catSlug, kind: 'category', title: cat.title, description: cat.description,
      category: '_cat', status: 'finished', order: cat.order,
    });
  }

  // 2c) domains.json — domain → groups structure for the landing accordion
  const domains = [];
  if (schema?.domains) {
    for (const domain of schema.domains) {
      const groups = (domain.groups ?? []).flatMap(gid => {
        const gMeta = allCatDefs.get(gid);
        if (!gMeta || !liveCats.has(gid)) return [];
        const liveCount = topics.filter(t => t.category === gid && t.kind !== 'comingsoon' && t.kind !== 'category').length;
        return [{ id: gid, label: gMeta.title, description: gMeta.description, liveCount }];
      });
      if (groups.length > 0) {
        domains.push({ id: domain.id, label: domain.label, description: domain.description ?? '', groups });
      }
    }
  }
  writeFileSync(resolve(pagesDir, 'domains.json'), JSON.stringify(domains, null, 2));

  // 3) Coming-Soon: Marker-Ordner unter topics/
  if (isDir(topicsDir)) {
    for (const slug of readdirSync(topicsDir).sort()) {
      const dir = resolve(topicsDir, slug);
      if (!isDir(dir)) continue;
      if (topics.some(t => t.slug === slug)) continue;
      const schemaGroup = topicToGroup.get(slug);
      topics.push(applyConfig(
        { slug, kind: 'comingsoon', title: slug, description: '' },
        config,
        schemaGroup?.id ?? null,
        topicOrder.get(slug) ?? null,
      ));
    }
  }

  // 3b) Schema topics without any folder yet → coming-soon
  if (schema?.topics) {
    for (const [slug, meta] of Object.entries(schema.topics)) {
      if (topics.some(t => t.slug === slug)) continue;
      const schemaGroup = topicToGroup.get(slug);
      topics.push(applyConfig(
        { slug, kind: 'comingsoon', title: meta.label ?? slug, description: '' },
        config,
        schemaGroup?.id ?? null,
        topicOrder.get(slug) ?? null,
      ));
    }
  }

  // Warnung: Config enthält Slugs, zu denen kein Ordner existiert
  const knownSlugs = new Set(topics.map(t => t.slug));
  for (const cfgSlug of Object.keys(config)) {
    if (cfgSlug.startsWith('_')) continue;
    if (!knownSlugs.has(cfgSlug)) {
      console.warn(`[discover] WARN: topics.config.json hat Eintrag "${cfgSlug}", aber kein Ordner unter pages/ oder topics/`);
    }
  }

  // Sortierung: Kategorie alphabetisch, dann order, dann kind, dann slug
  const kindOrder = { topic: 0, page: 1, category: 2, comingsoon: 3 };
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
  const distPath = resolve(ROOT, 'dist');
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }
}

// CLI-Modus
if (process.argv[1] && process.argv[1].endsWith('discover.mjs')) {
  const t = discoverAndGenerate();
  const cats = [...new Set(t.map(x => x.category))].sort();
  const counts = (k) => t.filter(x => x.kind === k).length;
  console.log(`[discover] ${t.length} pages — ${counts('topic')} topic, ${counts('page')} page, ${counts('category')} category, ${counts('comingsoon')} coming-soon`);
  console.log(`[discover] categories: ${cats.join(', ')}`);
}
