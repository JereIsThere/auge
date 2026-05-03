// Generates docs/auge-status.pptx
// Run: node docs/build-pptx.cjs

const path = require('path');
process.env.NODE_PATH = 'C:/Users/jgroehl/AppData/Roaming/npm/node_modules';
require('module').Module._initPaths();

const pptxgen = require('pptxgenjs');

const COLOR = {
  bg:        '06000E',
  bgSoft:    '0E0820',
  cyan:      '00D4C8',
  cyanSoft:  '008078',
  purple:    '6B00CC',
  purpleSoft:'3A0070',
  gold:      'D4A200',
  goldBright:'F0C000',
  fg:        'C8C0D8',
  fgMuted:   '7B7593',
  white:     'FFFFFF',
};

const FONT = {
  serif: 'Georgia',
  mono:  'Consolas',
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';   // 13.3" × 7.5"
pres.title = 'auge — Status & Pläne';
pres.author = 'Claude';

const W = 13.3, H = 7.5;
const PAD = 0.7;

// ─── Helpers ─────────────────────────────────────────────────

function addBackdrop(slide, { darker = false } = {}) {
  slide.background = { color: darker ? COLOR.bg : COLOR.bg };
}

function addCornerMark(slide) {
  // Small cyan dot top-left + gold dot top-right (visual motif)
  slide.addShape(pres.shapes.OVAL, {
    x: 0.4, y: 0.4, w: 0.13, h: 0.13,
    fill: { color: COLOR.cyan }, line: { type: 'none' },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: W - 0.53, y: 0.4, w: 0.13, h: 0.13,
    fill: { color: COLOR.gold }, line: { type: 'none' },
  });
}

function addPageNumber(slide, n, total) {
  slide.addText(`${String(n).padStart(2,'0')} / ${String(total).padStart(2,'0')}`, {
    x: W - 1.6, y: H - 0.55, w: 1.2, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: COLOR.fgMuted,
    align: 'right', charSpacing: 4, margin: 0,
  });
  slide.addText('AUGE', {
    x: 0.4, y: H - 0.55, w: 1.5, h: 0.35,
    fontFace: FONT.mono, fontSize: 9, color: COLOR.fgMuted,
    align: 'left', charSpacing: 6, margin: 0,
  });
}

function sectionLabel(slide, label) {
  slide.addText(label, {
    x: PAD, y: PAD, w: 8, h: 0.4,
    fontFace: FONT.mono, fontSize: 11, color: COLOR.cyan,
    charSpacing: 8, bold: false, margin: 0,
  });
}

function slideTitle(slide, title) {
  slide.addText(title, {
    x: PAD, y: 1.15, w: W - 2 * PAD, h: 1.0,
    fontFace: FONT.serif, fontSize: 40, color: COLOR.white,
    bold: true, charSpacing: 1, margin: 0,
  });
}

const TOTAL = 8;

// ═══════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);

  // Big AUGE wordmark
  s.addText('AUGE', {
    x: 0, y: 2.4, w: W, h: 2.0,
    fontFace: FONT.serif, fontSize: 130, color: COLOR.white,
    bold: true, align: 'center', charSpacing: 30, margin: 0,
  });

  // Cyrillic slogan
  s.addText('ОКО ВИДИТ ВСЁ', {
    x: 0, y: 4.4, w: W, h: 0.4,
    fontFace: FONT.serif, fontSize: 12, color: COLOR.cyan,
    align: 'center', charSpacing: 12, transparency: 60, margin: 0,
  });

  // German subtitle
  s.addText('das auge sieht alles', {
    x: 0, y: 4.8, w: W, h: 0.4,
    fontFace: FONT.mono, fontSize: 10, color: COLOR.fgMuted,
    align: 'center', charSpacing: 8, margin: 0,
  });

  // Decorative line + ornament
  s.addShape(pres.shapes.LINE, {
    x: W/2 - 1.5, y: 5.6, w: 3, h: 0,
    line: { color: COLOR.purple, width: 1 },
  });
  s.addText('✦', {
    x: W/2 - 0.3, y: 5.45, w: 0.6, h: 0.3,
    fontSize: 14, color: COLOR.gold, align: 'center', margin: 0,
  });

  // Footer: "Status & Pläne · Stand 2026-04-27"
  s.addText('Status & Pläne · 2026-04-27', {
    x: 0, y: 6.6, w: W, h: 0.3,
    fontFace: FONT.mono, fontSize: 9, color: COLOR.fgMuted,
    align: 'center', charSpacing: 6, margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 2 — Was ist auge
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '01  ·  WAS IST AUGE');
  slideTitle(s, 'Eine Notiz-Sammlung mit\neigener Optik.');

  // Three columns: stack, pattern, zweck
  const cols = [
    { h: 'stack',   body: 'Vite 5 · TypeScript · Vanilla DOM\nKein Framework, kein CSS-Lib.\nDeploy via rsync.' },
    { h: 'pattern', body: 'Multi-Page-Setup. Jeder\nOrdner unter pages/ ist eine\neigene Page.' },
    { h: 'inhalt',  body: 'Topics kommen aus einem\nSubmodule (claude-learnings),\nrendern beim Build zu Pages.' },
  ];
  const colW = 3.7, colGap = 0.4, colY = 4.0, colH = 2.3;
  const totalW = cols.length * colW + (cols.length - 1) * colGap;
  const startX = (W - totalW) / 2;

  cols.forEach((c, i) => {
    const x = startX + i * (colW + colGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH,
      fill: { color: COLOR.bgSoft },
      line: { color: COLOR.purpleSoft, width: 1 },
    });
    // top accent stripe
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: 0.07,
      fill: { color: COLOR.gold }, line: { type: 'none' },
    });
    s.addText(c.h.toUpperCase(), {
      x: x + 0.3, y: colY + 0.3, w: colW - 0.6, h: 0.4,
      fontFace: FONT.mono, fontSize: 11, color: COLOR.cyan,
      charSpacing: 8, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.3, y: colY + 0.85, w: colW - 0.6, h: colH - 1.1,
      fontFace: FONT.serif, fontSize: 13, color: COLOR.fg,
      valign: 'top', margin: 0,
    });
  });

  addPageNumber(s, 2, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 3 — Architektur
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '02  ·  ARCHITEKTUR');
  slideTitle(s, 'Drei Quellen, ein Inventar.');

  // Left: folder layout
  s.addText('LAYOUT', {
    x: PAD, y: 2.6, w: 5, h: 0.3,
    fontFace: FONT.mono, fontSize: 10, color: COLOR.gold, charSpacing: 6, margin: 0,
  });
  const tree = [
    { t: 'pages/',                        c: COLOR.cyan, b: true },
    { t: '  ├─ index.html  main.ts',     c: COLOR.fg },
    { t: '  ├─ art-advanced/  ← page',   c: COLOR.fg },
    { t: '  ├─ regex/  ← topic (gen)',   c: COLOR.fg },
    { t: '  └─ claude-learnings/  ← submodule', c: COLOR.fg },
    { t: 'topics/',                       c: COLOR.cyan, b: true },
    { t: '  └─ <slug>/.gitkeep  ← coming-soon', c: COLOR.fg },
    { t: 'topics.config.json  (optional)', c: COLOR.gold },
  ];
  s.addText(
    tree.map((line, i) => ({
      text: line.t,
      options: {
        fontFace: FONT.mono, fontSize: 12, color: line.c, bold: line.b || false,
        breakLine: i < tree.length - 1,
      },
    })),
    { x: PAD, y: 2.95, w: 5.5, h: 3.5, margin: 0, valign: 'top' }
  );

  // Right: flow diagram
  s.addText('DISCOVERY', {
    x: 7.0, y: 2.6, w: 5, h: 0.3,
    fontFace: FONT.mono, fontSize: 10, color: COLOR.gold, charSpacing: 6, margin: 0,
  });

  const steps = [
    'pages/claude-learnings/<topic>/README.md',
    'topics/<slug>/.gitkeep',
    'pages/<slug>/index.html (standalone)',
  ];
  const labels = ['→ kind: topic + render', '→ kind: comingsoon', '→ kind: page'];
  const flowY = 3.0;
  const boxH = 0.55;
  const gap = 0.4;
  steps.forEach((step, i) => {
    const y = flowY + i * (boxH + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x: 7.0, y, w: 4.7, h: boxH,
      fill: { color: COLOR.bgSoft },
      line: { color: COLOR.purpleSoft, width: 1 },
    });
    s.addText(step, {
      x: 7.1, y: y + 0.05, w: 4.6, h: boxH - 0.1,
      fontFace: FONT.mono, fontSize: 10, color: COLOR.fg,
      valign: 'middle', margin: 0,
    });
    s.addText(labels[i], {
      x: 7.0, y: y + boxH + 0.02, w: 4.7, h: 0.3,
      fontFace: FONT.mono, fontSize: 9, color: COLOR.gold,
      margin: 0,
    });
  });

  // discover.mjs label
  s.addText('scripts/discover.mjs  →  pages.json', {
    x: 7.0, y: flowY + 3 * (boxH + gap) + 0.5, w: 5.5, h: 0.4,
    fontFace: FONT.mono, fontSize: 11, color: COLOR.cyan, bold: true, margin: 0,
  });

  addPageNumber(s, 3, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 4 — Was die Session gebaut hat (Wins)
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '03  ·  DIESE SESSION');
  slideTitle(s, 'Vier dicke Wins.');

  const wins = [
    { n: '01', t: 'Performance + A11y',
      d: 'Inline-JS aus Home extrahiert.\nrAF statt setInterval, ein Canvas\nstatt zwei, prefers-reduced-motion.\nCustom-Cursor pointer-fine-gated.\nSkip-Links + Focus-Styles.' },
    { n: '02', t: 'Submodule-Renderer',
      d: 'scripts/discover.mjs rendert die\n4 Submodule-Topics zu Pages.\nMarkdown via marked, eigene\nTypografie für Code/Tables/etc.' },
    { n: '03', t: 'topics/-Split',
      d: '19 leere Coming-Soon-Scaffolds\naus pages/ in topics/ verschoben.\npages/ ist jetzt schlank.\nMarker = nur ein .gitkeep pro Slug.' },
    { n: '04', t: 'Status + Kategorien',
      d: 'Cards bekommen Status-Badges.\nDynamische Kategorie-Gruppierung\nsobald >1 vorhanden.\ntopics.config.json als Override.' },
  ];

  const gridX = PAD, gridY = 2.7;
  const cardW = 5.85, cardH = 1.9, gx = 0.3, gy = 0.3;
  wins.forEach((w, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = gridX + col * (cardW + gx);
    const y = gridY + row * (cardH + gy);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: COLOR.bgSoft },
      line: { color: COLOR.purpleSoft, width: 1 },
    });
    // left accent
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: cardH,
      fill: { color: COLOR.gold }, line: { type: 'none' },
    });
    s.addText(w.n, {
      x: x + 0.3, y: y + 0.15, w: 0.7, h: 0.4,
      fontFace: FONT.mono, fontSize: 11, color: COLOR.gold,
      charSpacing: 4, margin: 0,
    });
    s.addText(w.t, {
      x: x + 1.0, y: y + 0.12, w: cardW - 1.2, h: 0.45,
      fontFace: FONT.serif, fontSize: 18, color: COLOR.white, bold: true, margin: 0,
    });
    s.addText(w.d, {
      x: x + 0.3, y: y + 0.65, w: cardW - 0.6, h: cardH - 0.75,
      fontFace: FONT.serif, fontSize: 11, color: COLOR.fg,
      valign: 'top', margin: 0,
    });
  });

  addPageNumber(s, 4, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 5 — Generator-Pipeline
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '04  ·  PIPELINE');
  slideTitle(s, 'Vom README zur Page.');

  // Horizontal flow: 5 boxes with arrows
  const boxes = [
    { t: 'Submodule', s: 'pages/claude-learnings/\n<topic>/README.md', c: COLOR.cyan },
    { t: 'discover.mjs', s: 'scant + lädt config\n+ ruft marked', c: COLOR.gold },
    { t: 'marked', s: 'Markdown → HTML\n(GFM, Tables, Code)', c: COLOR.cyan },
    { t: 'Template', s: 'header + readme + level\nsections + examples', c: COLOR.gold },
    { t: 'Output', s: 'pages/<slug>/index.html\n(gitignored)', c: COLOR.cyan },
  ];

  const boxW = 2.2, boxH = 1.6, gap = 0.25;
  const flowY = 3.0;
  const totalW = boxes.length * boxW + (boxes.length - 1) * gap;
  const startX = (W - totalW) / 2;

  boxes.forEach((b, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: flowY, w: boxW, h: boxH,
      fill: { color: COLOR.bgSoft },
      line: { color: b.c, width: 1 },
    });
    s.addText(b.t, {
      x: x + 0.15, y: flowY + 0.2, w: boxW - 0.3, h: 0.4,
      fontFace: FONT.serif, fontSize: 14, color: b.c, bold: true, margin: 0,
    });
    s.addText(b.s, {
      x: x + 0.15, y: flowY + 0.7, w: boxW - 0.3, h: boxH - 0.85,
      fontFace: FONT.mono, fontSize: 9, color: COLOR.fg, valign: 'top', margin: 0,
    });

    // Arrow between boxes
    if (i < boxes.length - 1) {
      s.addText('→', {
        x: x + boxW, y: flowY + boxH/2 - 0.2, w: gap, h: 0.4,
        fontFace: FONT.serif, fontSize: 18, color: COLOR.gold,
        align: 'center', valign: 'middle', margin: 0,
      });
    }
  });

  // Bottom: trigger info
  s.addText([
    { text: 'Triggert via: ', options: { color: COLOR.fgMuted, fontFace: FONT.mono, fontSize: 10 } },
    { text: 'npm run discover  ·  prebuild  ·  predev  ·  vite-Plugin bei .md-Change im Submodule', options: { color: COLOR.cyan, fontFace: FONT.mono, fontSize: 10 } },
  ], { x: PAD, y: 5.4, w: W - 2 * PAD, h: 0.4, align: 'center', margin: 0 });

  addPageNumber(s, 5, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 6 — Status quo (Stat callouts)
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '05  ·  STATUS QUO');
  slideTitle(s, 'Was aktuell läuft.');

  const stats = [
    { n: '26', l: 'pages\ngesamt',         c: COLOR.white },
    { n: '4',  l: 'topic\n(submodule)',    c: COLOR.cyan },
    { n: '3',  l: 'page\n(standalone)',    c: COLOR.gold },
    { n: '19', l: 'coming\nsoon',          c: COLOR.fgMuted },
  ];
  const statW = 2.6, gap = 0.35;
  const totalW = stats.length * statW + (stats.length - 1) * gap;
  const startX = (W - totalW) / 2;
  const y = 3.0;

  stats.forEach((st, i) => {
    const x = startX + i * (statW + gap);
    s.addText(st.n, {
      x, y, w: statW, h: 1.6,
      fontFace: FONT.serif, fontSize: 88, color: st.c,
      bold: true, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(st.l, {
      x, y: y + 1.7, w: statW, h: 0.7,
      fontFace: FONT.mono, fontSize: 10, color: COLOR.fgMuted,
      align: 'center', charSpacing: 4, margin: 0,
    });
  });

  // Below: kategorien-Hinweis
  s.addText('1 Kategorie (misc) — sobald topics.config.json kommt, gruppiert die Home dynamisch.', {
    x: PAD, y: 5.7, w: W - 2 * PAD, h: 0.4,
    fontFace: FONT.serif, fontSize: 13, color: COLOR.fgMuted,
    italic: true, align: 'center', margin: 0,
  });

  addPageNumber(s, 6, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 7 — Pläne
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '06  ·  PLÄNE');
  slideTitle(s, 'Was als nächstes ansteht.');

  const plans = [
    { p: 'PRIO',     t: 'topics.config.json schreiben',
      d: 'Echte Kategorien + Status pro Slug. Schema steht in docs/topics-config-schema.md.\nSobald die Datei da ist: npm run discover, Home gruppiert automatisch.' },
    { p: 'EXTERN',   t: 'art-advanced unifizieren',
      d: 'Zwei Varianten parallel (top-level & submodule). Handoff-Brief liegt in\ndocs/todos/art-advanced-unification.md — gehört zum claude-learnings-Maintainer.' },
    { p: 'CLEANUP',  t: 'Stale Top-Level-Duplikate',
      d: 'pages/regex/, pages/latex/, … haben Pre-Submodule-Content. Liegen aktuell\ndumm rum. Löschung wartet auf explizite Freigabe.' },
    { p: 'KLEINKRAM',t: 'Deploy + public/ aufräumen',
      d: 'vite.config schreibt nach ../public_html, npm deploy macht rsync aus dist/.\npublic/ ist konfiguriert aber leer. Eines davon braucht einen Touch.' },
  ];

  let py = 2.65;
  const rowH = 0.95;
  plans.forEach(pl => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: PAD, y: py, w: W - 2 * PAD, h: rowH,
      fill: { color: COLOR.bgSoft },
      line: { color: COLOR.purpleSoft, width: 1 },
    });
    // priority chip
    s.addShape(pres.shapes.RECTANGLE, {
      x: PAD, y: py, w: 1.3, h: rowH,
      fill: { color: COLOR.purpleSoft }, line: { type: 'none' },
    });
    s.addText(pl.p, {
      x: PAD, y: py, w: 1.3, h: rowH,
      fontFace: FONT.mono, fontSize: 10, color: COLOR.gold,
      bold: true, charSpacing: 4, align: 'center', valign: 'middle', margin: 0,
    });
    s.addText(pl.t, {
      x: PAD + 1.5, y: py + 0.12, w: W - 2 * PAD - 1.6, h: 0.35,
      fontFace: FONT.serif, fontSize: 15, color: COLOR.white, bold: true, margin: 0,
    });
    s.addText(pl.d, {
      x: PAD + 1.5, y: py + 0.45, w: W - 2 * PAD - 1.6, h: rowH - 0.5,
      fontFace: FONT.serif, fontSize: 11, color: COLOR.fg,
      valign: 'top', margin: 0,
    });
    py += rowH + 0.2;
  });

  addPageNumber(s, 7, TOTAL);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 8 — Quick Reference / Recap
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addBackdrop(s);
  addCornerMark(s);
  sectionLabel(s, '07  ·  QUICK REFERENCE');
  slideTitle(s, 'Wo was lebt.');

  // Two columns: Commands + Files
  const colY = 2.7, colH = 4.0, colW = 5.85, colGap = 0.4;
  const startX = PAD;

  // Commands
  s.addShape(pres.shapes.RECTANGLE, {
    x: startX, y: colY, w: colW, h: colH,
    fill: { color: COLOR.bgSoft }, line: { color: COLOR.cyanSoft, width: 1 },
  });
  s.addText('COMMANDS', {
    x: startX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.35,
    fontFace: FONT.mono, fontSize: 11, color: COLOR.cyan, charSpacing: 8, margin: 0,
  });
  s.addText([
    { text: 'npm run discover',   options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'scant submodule + topics/, schreibt pages.json + topic-HTMLs', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                   options: { fontSize: 8, breakLine: true } },
    { text: 'npm run dev',         options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Vite-Server + Auto-Reload bei MD-Änderung im Submodule', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                   options: { fontSize: 8, breakLine: true } },
    { text: 'npm run build',       options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'tsc --noEmit + vite build → ../public_html/', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                   options: { fontSize: 8, breakLine: true } },
    { text: 'npm run deploy',      options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Build + rsync auf claude-user (siehe Pläne — Inkonsistenz).', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg } },
  ], { x: startX + 0.3, y: colY + 0.7, w: colW - 0.6, h: colH - 0.9, valign: 'top', margin: 0 });

  // Files
  const fX = startX + colW + colGap;
  s.addShape(pres.shapes.RECTANGLE, {
    x: fX, y: colY, w: colW, h: colH,
    fill: { color: COLOR.bgSoft }, line: { color: COLOR.cyanSoft, width: 1 },
  });
  s.addText('DOCS', {
    x: fX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.35,
    fontFace: FONT.mono, fontSize: 11, color: COLOR.cyan, charSpacing: 8, margin: 0,
  });
  s.addText([
    { text: 'CLAUDE.md',                        options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Stack, Layout, Konventionen, Status quo', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                                 options: { fontSize: 8, breakLine: true } },
    { text: 'docs/architecture.md',             options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Patterns: Cursor, Backdrop, Build-Pipeline, Topic-Generator', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                                 options: { fontSize: 8, breakLine: true } },
    { text: 'docs/pending.md',                  options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Erledigt + offen + Aufräum-Kandidaten', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                                 options: { fontSize: 8, breakLine: true } },
    { text: 'docs/topics-config-schema.md',     options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Erwartetes Format der topics.config.json', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg, breakLine: true } },
    { text: ' ',                                 options: { fontSize: 8, breakLine: true } },
    { text: 'docs/todos/art-advanced-unification.md', options: { fontFace: FONT.mono, fontSize: 12, color: COLOR.gold, breakLine: true } },
    { text: 'Handoff-Brief für den Submodule-Maintainer', options: { fontFace: FONT.serif, fontSize: 10, color: COLOR.fg } },
  ], { x: fX + 0.3, y: colY + 0.7, w: colW - 0.6, h: colH - 0.9, valign: 'top', margin: 0 });

  addPageNumber(s, 8, TOTAL);
}

// ─── Save ────────────────────────────────────────────────────
const out = path.resolve(__dirname, 'auge-status.pptx');
pres.writeFile({ fileName: out }).then(() => {
  console.log('Wrote:', out);
});
