# Pending Work

Stand: 2026-04-27.

## Erledigt

✅ **Submodule-Renderer gebaut** — `scripts/discover.mjs` rendert die 4 Topics (`regex`, `latex`, `data-structures-algorithms`, `tensorflow-keras`) automatisch zu top-level `pages/<topic>/index.html` (gitignored). Läuft als prebuild/predev Hook und im Dev-Server bei MD-Änderungen.

✅ **Home-Cards** zeigen jetzt alle 26 Pages mit Topic-Metadata (title, description, level-badges).

✅ **Sub-Page-Typografie** — `.markdown-body` mit Styles für h1-h4, Code-Blocks, Tabellen, Blockquotes, Listen, Inline-Code, Links.

✅ **`topics/`-Restruktur** — die 19 leeren Coming-Soon-Scaffolds aus `pages/` extrahiert in eigenen `topics/`-Ordner (jeweils nur ein leerer Ordner mit `.gitkeep`, keine `beginner/intermediate/advanced/`-Subordner). `pages/` ist jetzt schlank.

✅ **Status + Kategorie-Support** — Cards haben Status-Badges (todo/in-progress/finished/archived). Home gruppiert dynamisch nach Kategorie (sobald >1 vorhanden). Schema dokumentiert in [docs/topics-config-schema.md](topics-config-schema.md).

✅ **Antworten auf (a)/(b)/(c)** umgesetzt:
- (a) Coming-Soon-Karten gelockt sichtbar
- (b) Stale Top-Level-Duplikate liegen gelassen (Generator ignoriert sie)
- (c) Eigener Task → [docs/todos/art-advanced-unification.md](todos/art-advanced-unification.md)

## Noch offen

### `topics.config.json` schreiben

Sobald die Datei mit echten Kategorie/Status-Daten kommt: ins Repo-Root legen, `npm run discover` triggert die neue Gruppierung. Schema: [docs/topics-config-schema.md](topics-config-schema.md).

### `art-advanced` Konsolidierung

Siehe [docs/todos/art-advanced-unification.md](todos/art-advanced-unification.md). Wartet auf Submodule-Maintainer.

### Aufräum-Kandidaten (Rückfrage nötig)

- `pages/README.md` — ist eine Kopie des Submodule-README, nach Renderer-Build redundant.
- `pages/regex/README.md`, `pages/latex/README.md`, `pages/data-structures-algorithms/README.md`, `pages/tensorflow-keras/README.md` (+ deren `beginner/intermediate/advanced/`-Inhalte) — Pre-Submodule-Stale-Forks. Submodule ist jetzt Single Source of Truth, diese Dateien werden nirgends mehr gelesen. Vom Nutzer als „nichts löschen, nur migrieren" markiert — bleibt liegen, bis explizite Freigabe.
- `seite-eins`, `seite-zwei` — Boilerplate-Demos.
- `scripts/generate.py` — generiert `data.json` für `seite-eins`. Wird im README erwähnt aber nicht im Build-Workflow getriggert.

### Sonstiges aus früheren Notizen

- Deploy-Script-Inkonsistenz: vite.config.ts schreibt nach `../public_html`, `package.json`'s deploy macht rsync aus `dist/`.
- `public/` ist konfiguriert aber leer — entweder rausnehmen aus vite.config.ts oder nutzen.
- Stale Branches: `copilot-tries`, `gemini-suggestions` (lokal), `origin/claude-edits` (remote).

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
