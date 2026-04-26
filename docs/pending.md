# Pending Work

Stand: 2026-04-27.

## Erledigt

✅ **Submodule-Renderer gebaut** — `scripts/discover.mjs` rendert die 4 Topics (`regex`, `latex`, `data-structures-algorithms`, `tensorflow-keras`) automatisch zu top-level `pages/<topic>/index.html` (gitignored). Läuft als prebuild/predev Hook und im Dev-Server bei MD-Änderungen.

✅ **Home-Cards** zeigen jetzt alle 26 Pages mit Topic-Metadata (title, description, level-badges) — gelockte Coming-Soon-Karten für die 19 leeren Scaffolds.

✅ **Sub-Page-Typografie** — `.markdown-body` mit Styles für h1-h4, Code-Blocks, Tabellen, Blockquotes, Listen, Inline-Code, Links.

✅ **Antworten auf (a)/(b)/(c)** vom 2026-04-27 umgesetzt:
- (a) Coming-Soon-Karten gelockt sichtbar
- (b) Stale Top-Level-Duplikate liegen gelassen (Generator ignoriert sie)
- (c) Eigener Task → [docs/todos/art-advanced-unification.md](todos/art-advanced-unification.md), Generator nimmt `art-advanced` explizit aus

## Noch offen — `art-advanced` Konsolidierung

Siehe [docs/todos/art-advanced-unification.md](todos/art-advanced-unification.md). Wartet auf Submodule-Maintainer.

## Kleinkram, das beim nächsten Touch erledigt werden sollte

- **Deploy-Script-Inkonsistenz**: `vite.config.ts` schreibt nach `../public_html`, aber `package.json`'s `deploy`-Script `rsync`'t aus `dist/`. Eines von beiden ist falsch.
- **Empty `public/` directory**: Vite ist auf `publicDir: 'public'` konfiguriert, aber `public/` ist leer (das alte `public/style.css` ist nach `pages/style.css` migriert). Entweder `publicDir` aus dem Config rausnehmen oder nutzen.
- **`scripts/generate.py`**: existiert, generiert `seite-eins/data.json`. Wird im README erwähnt aber nicht im Build-Workflow getriggert. Klären ob noch relevant oder Reste.
- **`pages/README.md`**: ist eine Kopie des Submodule-README — verwirrend. Nach dem Renderer-Build redundant.
- **Stale Branches**: `copilot-tries`, `gemini-suggestions` (lokal) und `origin/claude-edits` existieren. Nach dem nächsten Merge-Pass aufräumen.

## Was kürzlich erledigt wurde (Referenz)

- Inline-JS aus Home in `pages/main.ts` extrahiert + auf rAF/reduced-motion/dpr umgebaut
- Custom-Cursor pointer-fine-gated, Skip-Link + Focus-Styles
- art-advanced Inline-CSS (~280 Zeilen) ausgelagert nach `pages/art-advanced/style.css`, Google Fonts via preconnect
- Meta/SEO/a11y-Basics auf Home + seite-eins/seite-zwei
- Diese Doku-Files
