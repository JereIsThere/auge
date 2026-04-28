// Renders markdown-only topics from pages/claude-learnings/ into static
// HTML pages under public/<topic>/index.html. Topics that already ship a
// hand-crafted index.html (e.g. art-advanced, oauth-2) are skipped.
//
// Run via: npm run render-learnings (also auto-invoked by `npm run build`).

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const learningsDir = join(ROOT, 'pages', 'claude-learnings');
const publicDir = join(ROOT, 'public');
const metadataOut = join(ROOT, 'pages', 'learnings.json');
const overridesPath = join(ROOT, 'pages', 'learnings-overrides.json');

const overrides = existsSync(overridesPath)
  ? JSON.parse(readFileSync(overridesPath, 'utf8'))
  : { sectionOrder: [], topics: {} };

const LEVELS = {
  beginner:     { emoji: '🟢', label: 'Beginner',     color: '#84cc16' },
  intermediate: { emoji: '🟡', label: 'Intermediate', color: '#f59e0b' },
  advanced:     { emoji: '🔴', label: 'Advanced',     color: '#ef4444' },
};

const PAGE_CSS = `
:root {
  --bg: #06000e;
  --surface: #0e0820;
  --border: #2a1a4a;
  --text: #c8c0d8;
  --text-strong: #fff;
  --muted: #7a6a9a;
  --purple: #a855f7;
  --cyan: #06b6d4;
  --gold: #d4a200;
  --code-bg: #15082b;
}
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.7;
  min-height: 100vh;
  padding: 2.5rem 1.5rem 6rem;
}
body::before {
  content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 300px;
}
main { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
.synthetic-header {
  margin-bottom: 1rem; padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}
.synthetic-header h1 {
  font-size: clamp(2rem, 5vw, 3rem); font-weight: 700;
  letter-spacing: .05em; color: var(--text-strong);
  text-shadow: 0 0 25px var(--cyan), 0 0 55px rgba(6,182,212,.3);
  margin-bottom: 1rem; padding-bottom: 0; border-bottom: none;
}
.synthetic-header .lede {
  color: var(--muted); font-style: italic; font-size: 1.05rem;
}
.back-link {
  display: inline-flex; align-items: center; gap: .5rem;
  font-family: 'Courier New', monospace;
  font-size: .7rem; letter-spacing: .3em; text-transform: uppercase;
  color: rgba(6,182,212,.5); text-decoration: none;
  margin-bottom: 3rem; transition: color .2s;
}
.back-link:hover { color: var(--cyan); }
article h1 {
  font-size: clamp(2rem, 5vw, 3rem); font-weight: 700;
  letter-spacing: .05em; color: var(--text-strong);
  text-shadow: 0 0 25px var(--cyan), 0 0 55px rgba(6,182,212,.3);
  margin-bottom: 1.5rem; padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}
article h2 {
  font-size: 1.5rem; color: var(--text-strong);
  margin: 2.5rem 0 1rem; padding-bottom: .5rem;
  border-bottom: 1px solid var(--border); letter-spacing: .04em;
}
article h3 {
  font-size: 1.15rem; color: var(--gold);
  margin: 1.8rem 0 .8rem; letter-spacing: .03em;
}
article h4 { font-size: 1rem; color: var(--cyan); margin: 1.2rem 0 .5rem; }
article p { margin-bottom: 1.2rem; }
article a {
  color: var(--cyan); text-decoration: none;
  border-bottom: 1px dotted rgba(6,182,212,.4);
  transition: color .2s, border-color .2s;
}
article a:hover { color: var(--gold); border-bottom-color: var(--gold); }
article ul, article ol { margin: 0 0 1.4rem 1.6rem; }
article li { margin-bottom: .5rem; }
article code {
  background: var(--code-bg); border: 1px solid var(--border);
  padding: .1rem .4rem; border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: .85em; color: #e6c8ff;
}
article pre {
  background: var(--code-bg); border: 1px solid var(--border);
  border-left: 3px solid var(--purple); border-radius: 6px;
  padding: 1rem 1.2rem; overflow-x: auto; margin-bottom: 1.5rem;
}
article pre code {
  background: transparent; border: none; padding: 0;
  color: var(--text); font-size: .85rem; line-height: 1.6;
}
article blockquote {
  border-left: 3px solid var(--gold);
  padding: .5rem 1.2rem; margin: 1rem 0;
  color: var(--muted); background: rgba(212,162,0,.05);
}
article table {
  width: 100%; border-collapse: collapse;
  margin: 1.4rem 0; font-size: .9rem;
}
article th, article td {
  padding: .6rem .9rem; text-align: left;
  border-bottom: 1px solid var(--border);
}
article th {
  color: var(--gold); letter-spacing: .05em;
  background: rgba(212,162,0,.05);
}
article tr:hover td { background: rgba(107,0,204,.05); }
article hr {
  border: none; height: 1px; margin: 2.5rem 0;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}
article strong { color: var(--text-strong); }
article em { color: var(--gold); font-style: italic; }
.level {
  margin-top: 3rem; padding-top: 1.5rem;
  border-top: 2px solid var(--level-color, var(--border));
}
.level > h2:first-child { border-bottom: none; color: var(--level-color); }
footer {
  margin-top: 4rem; padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  text-align: center; font-size: .8rem; color: var(--muted);
}
footer a { color: var(--muted); border-bottom: 1px dotted var(--muted); }
footer a:hover { color: var(--cyan); border-color: var(--cyan); }
`;

function extractFirstHeading(md) {
  const m = md.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

function extractFirstParagraph(md) {
  const stripped = md.replace(/^#\s+.+?\n+/m, '');
  const para = stripped.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith('#') && !p.startsWith('|'));
  if (!para) return '';
  return para.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function humanizeSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderTopic(slug) {
  const topicDir = join(learningsDir, slug);
  const readmePath = join(topicDir, 'README.md');
  const hasReadme = existsSync(readmePath);

  let readmeMd = '';
  let titleFromReadme = null;
  let descFromReadme = '';
  if (hasReadme) {
    readmeMd = readFileSync(readmePath, 'utf8');
    titleFromReadme = extractFirstHeading(readmeMd);
    descFromReadme = extractFirstParagraph(readmeMd);
  }

  // Collect available level sections (any subset of beginner/intermediate/advanced).
  const levelSources = Object.entries(LEVELS)
    .map(([level, meta]) => {
      const path = join(topicDir, level, 'resources.md');
      if (!existsSync(path)) return null;
      return { level, meta, md: readFileSync(path, 'utf8') };
    })
    .filter(Boolean);

  // Need at least a README or one level to render anything meaningful.
  if (!hasReadme && levelSources.length === 0) return null;

  // Title fallback: from first level's H1, then humanized slug.
  let title = titleFromReadme;
  if (!title && levelSources.length) {
    const fromLevel = extractFirstHeading(levelSources[0].md);
    if (fromLevel) {
      // Strip trailing "Beginner 🟢" / "for Beginners" / "für Beginner" /
      // "· Beginner Resources" etc. so the topic title isn't tied to a
      // specific level.
      title = fromLevel
        .replace(/\s*[·:|—-]\s*(Beginner|Intermediate|Advanced)\s+Resources.*$/i, '')
        .replace(/\s+(?:for|für)\s+(Beginners?|Intermediate|Advanced).*$/i, '')
        .replace(/\s+(Beginners?|Intermediate|Advanced)\b.*$/i, '')
        .trim();
    }
  }
  if (!title) title = humanizeSlug(slug);

  // Description fallback: from README, then first level's first paragraph.
  let desc = descFromReadme;
  if (!desc && levelSources.length) {
    desc = extractFirstParagraph(levelSources[0].md);
  }

  const readmeHtml = hasReadme ? marked.parse(readmeMd) : '';

  const sectionsHtml = levelSources
    .map(({ level, meta, md }) => `
<section class="level" style="--level-color:${meta.color}">
  <h2>${meta.emoji} ${meta.label}</h2>
  ${marked.parse(md)}
</section>`)
    .join('');

  // When there's no README, synthesize a header so the page has a title.
  const headerHtml = hasReadme ? '' : `
<header class="synthetic-header">
  <h1>${escapeHtml(title)}</h1>
  ${desc ? `<p class="lede">${escapeHtml(desc)}</p>` : ''}
</header>`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHtml(title)} — AUGE</title>
<style>${PAGE_CSS}</style>
</head>
<body>
<main>
  <a href="/" class="back-link">← AUGE</a>
  <article>
    ${headerHtml}
    ${readmeHtml}
    ${sectionsHtml}
  </article>
  <footer>
    Auto-generiert aus
    <a href="https://github.com/JereIsThere/claude-learnings/tree/main/${slug}" target="_blank" rel="noopener">claude-learnings/${slug}</a>
  </footer>
</main>
</body>
</html>`;

  return { html, title, desc };
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function main() {
  if (!existsSync(learningsDir)) {
    console.error(`claude-learnings submodule not found at ${learningsDir}. Run: git submodule update --init`);
    process.exit(1);
  }

  const allEntries = readdirSync(learningsDir);
  const topics = allEntries.filter((name) => {
    const dir = join(learningsDir, name);
    if (!statSync(dir).isDirectory()) return false;
    // Skip topics that already ship a hand-crafted index.html — those build
    // via the symlink → claude-learnings path and don't need rendering.
    if (existsSync(join(dir, 'index.html'))) return false;
    // Render anything with a README or at least one level resource file.
    const hasReadme = existsSync(join(dir, 'README.md'));
    const hasAnyLevel = ['beginner', 'intermediate', 'advanced'].some((l) =>
      existsSync(join(dir, l, 'resources.md')),
    );
    return hasReadme || hasAnyLevel;
  });

  const metadata = [];

  for (const slug of topics) {
    const result = renderTopic(slug);
    if (!result) continue;
    const { html, title, desc } = result;
    const outDir = join(publicDir, slug);
    // Clean stale state in case a previous run left something behind.
    if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);

    const o = overrides.topics?.[slug] || {};
    metadata.push({
      slug,
      title,
      desc,
      ...(o.icon ? { icon: o.icon } : {}),
      ...(o.accent ? { accent: o.accent } : {}),
      ...(o.section ? { section: o.section } : {}),
    });
  }

  // Sort by section index in sectionOrder, then alphabetically by slug;
  // unsectioned items go to the end as "Sonstiges".
  const sectionOrder = overrides.sectionOrder || [];
  const sectionIndex = (s) => {
    const i = sectionOrder.indexOf(s);
    return i === -1 ? sectionOrder.length : i;
  };
  metadata.sort((a, b) => {
    const sa = sectionIndex(a.section);
    const sb = sectionIndex(b.section);
    if (sa !== sb) return sa - sb;
    return a.slug.localeCompare(b.slug);
  });

  writeFileSync(metadataOut, JSON.stringify(metadata, null, 2));
  console.log(`✓ Rendered ${topics.length} learning paths → public/<topic>/index.html`);
  console.log(`  metadata: ${metadataOut}`);
}

main();
