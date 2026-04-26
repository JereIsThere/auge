# auge — Agent Guide

Statische Multi-Page-Website auf Vite + TypeScript + Vanilla DOM. Eine „Sammlung von Notizen, Guides und Experimenten" — jede Sub-Page lebt in `pages/<name>/`. Inhaltliche Topics werden aus dem Submodule `pages/claude-learnings/` gespeist.

## Tech-Stack

- **Vite 5** (Multi-Page, `root: 'pages'`, build → `../public_html/`)
- **TypeScript** strict, `module: ESNext`, `moduleResolution: bundler`
- **Kein Framework.** Reines DOM + `<script type="module">`. Kein React/Vue/Svelte.
- **Kein CSS-Framework.** Reines CSS in `pages/style.css` (geteilt) + per-Page-CSS optional.
- **Submodule** für inhaltliche Topics: `pages/claude-learnings/` → `github.com/JereIsThere/claude-learnings`.
- **Deploy:** `npm run deploy` → rsync auf `claude-user:/home/claude-user/public_html/`.

## Folder-Layout

```
pages/                          Was tatsächlich gerendert wird
├── index.html                  Home (auge-Landing mit Canvas-Effekten)
├── main.ts                     Home-Logik (Cursor, Backdrop, Card-Rendering)
├── style.css                   Geteiltes Stylesheet, gemounted als /style.css
├── pages.json                  AUTOGENERIERT (gitignored)
├── README.md                   Kopie des Submodule-README — kann irgendwann weg
├── art-advanced/               Standalone-Page (eigene CSS, eigener Inhalt)
│   ├── index.html
│   └── style.css
├── seite-eins/                 Boilerplate-Demo
├── seite-zwei/                 Boilerplate-Demo
├── claude-learnings/           SUBMODULE — kanonischer Inhalt für Topics
│   ├── README.md
│   ├── regex/{README.md,beginner/,intermediate/,advanced/}
│   ├── latex/...
│   ├── data-structures-algorithms/...
│   ├── tensorflow-keras/...
│   └── art-advanced/index.html (bestehende Variante im Submodule, NICHT das top-level art-advanced)
└── <topic>/                    Top-Level-Stale-Duplikate ODER vom Generator befüllt:
    ├── regex/                  → pre-submodule README + GENERIERTES index.html (gitignored)
    ├── latex/                  → dito
    ├── data-structures-algorithms/  → dito
    └── tensorflow-keras/       → dito

topics/                         Coming-Soon-Marker — leere Ordner, je 1 .gitkeep
├── api-rest/.gitkeep
├── compiler-design/.gitkeep
└── ... (19 Stück)

topics.config.json              OPTIONAL — Status/Kategorie/Tags-Overrides
                                Schema: docs/topics-config-schema.md
public/                         Vite publicDir — derzeit leer
scripts/discover.mjs            Single Source of Truth fürs Page-Inventar
vite.config.ts                  Importiert discover, baut rollup-input
```

## Auto-Discovery & Topic-Generator

`scripts/discover.mjs` ist die Single Source of Truth fürs Page-Inventar. Läuft als `prebuild`/`predev` Hook, von vite.config.ts beim Config-Load, und im Dev-Server bei jedem Submodule-`.md`-Change.

Was es tut:
1. **Submodule-Topics rendern**: Scant `pages/claude-learnings/{topic}/README.md` → für jedes Topic mit Inhalt: rendert README + `{beginner,intermediate,advanced}/resources.md` per `marked` zu `pages/<topic>/index.html` (gitignored).
2. **Standalone-Pages erkennen**: Scant `pages/<slug>/` nach Ordnern mit eigener `index.html`, die nicht generiert wurden (z.B. `art-advanced`, `seite-eins`, `seite-zwei`).
3. **Coming-Soon-Scaffolds erkennen**: Scant `topics/<slug>/` (leere Marker-Ordner für geplante Inhalte).
4. **Optionale Config mergen**: Wenn `topics.config.json` (Repo-Root) existiert, wird sie über die auto-discovered Metadaten gemergt — Schema in [docs/topics-config-schema.md](docs/topics-config-schema.md). Liefert `status` (todo/in-progress/finished/archived), `category`, `tags`, `order`.
5. **`pages.json` schreiben** — Array von `{ slug, kind, title, description, levels?, status, category, tags?, order? }`. Sortiert nach Kategorie, dann order, dann kind.

vite.config.ts ruft `discoverAndGenerate()` beim Load und filtert auf `kind ∈ {topic, page}` für die Build-Entries.

### Workflows
- **Neuen Submodule-Topic anlegen**: `pages/claude-learnings/<slug>/README.md` schreiben, im auge-Repo `mkdir pages/<slug>`, `npm run discover`. Topic erscheint sofort als Page.
- **Neuen Coming-Soon-Marker**: `mkdir topics/<slug> && touch topics/<slug>/.gitkeep`. Zeigt sich als gelockte Card.
- **Standalone-Page**: `pages/<slug>/index.html` schreiben → Build greift sie automatisch ab.
- **Status/Kategorie ändern**: `topics.config.json` editieren (siehe Schema-Doc) → re-discover.

→ `art-advanced` ist im Generator explizit ausgenommen (zwei parallele Varianten, siehe [docs/todos/art-advanced-unification.md](docs/todos/art-advanced-unification.md)).

## Konventionen

### Inhalte
- **Submodule-Content (`pages/claude-learnings/**`) NIEMALS direkt editieren** — separates Repo, separater Workflow. Read-only von hier aus.
- Inhaltliche Änderungen am Submodule passieren upstream (eigenes Repo `claude-learnings`).

### Performance (Home)
- Animationen nur via `requestAnimationFrame`, nie `setInterval`.
- Ein einziges Canvas für alle Backdrop-Layer (Cyrillic-Drift + Embers).
- DPR-aware: `cyrCanvas.width = w * dpr`, `setTransform(dpr,…)`.
- Particle-Count skaliert mit Viewport (`Math.min(80, Math.floor(w/20))`).
- Resize debounced (120 ms).
- `prefers-reduced-motion: reduce` deaktiviert Backdrop komplett (`cyrCanvas.remove()`).

### Accessibility
- Custom-Cursor läuft NUR bei `(pointer: fine)`. Sonst nativen Cursor lassen — sonst Touch-Geräte ohne Cursor.
- `cursor: none` wird per JS-Klasse `body.cursor-hidden` gesetzt, nicht statisch in CSS.
- Skip-Link auf jeder Page (`<a href="#main" class="skip-link">`).
- `:focus-visible` ist global definiert in `style.css`.
- Alle dekorativen Elemente (Ornamente, Canvas, sub-cyr Slogan) haben `aria-hidden="true"`.
- `<nav>` mit `aria-label` für die Card-Liste auf Home.

### CSS
- Geteilte Variablen in `:root` (`--cyan`, `--purple`, `--gold`, `--gold-b`, `--bg`, `--fg`).
- `body.home` für die Landing, `body:not(.home)` für Sub-Page-Defaults.
- Externe Fonts via `<link rel="preconnect">` + Stylesheet-Link, nie via `@import` in CSS (blockiert Critical Path).

### TypeScript
- `pages.json` wird zur Build-Zeit von vite.config.ts geschrieben — wenn `tsc --noEmit` schreit, weil `pages.json` fehlt: `npm run build` einmal laufen lassen oder das Snippet aus vite.config.ts manuell ausführen.

## Dev-Workflow

```bash
npm install
npm run dev        # vite, port 3001
npm run build      # tsc --noEmit && vite build → ../public_html
npm run deploy     # build + rsync zu claude-user
```

Submodule initial holen:
```bash
git submodule update --init --recursive
```

## Status quo (Stand 2026-04)

`npm run discover` ergibt aktuell: **26 Pages — 4 topic, 3 page, 19 coming-soon**, 1 Kategorie (`misc`).

- **4 Submodule-Topics** rendern automatisch: `regex`, `latex`, `data-structures-algorithms`, `tensorflow-keras`.
- **3 Standalone-Pages**: `art-advanced` (eigene Optik), `seite-eins`, `seite-zwei` (Boilerplate-Demos).
- **19 Coming-Soon-Scaffolds** in `topics/` — gelockte Cards auf der Home, kein Link.
- **Stale Top-Level-Duplikate**: `pages/regex/`, `pages/latex/`, `pages/data-structures-algorithms/`, `pages/tensorflow-keras/` enthalten EIGENE README+Resources-Dateien (Pre-Submodule-Reste). Werden vom Generator IGNORIERT — Source of Truth ist das Submodule. Nicht löschen ohne Rückfrage.
- **`topics.config.json` existiert noch nicht** — ALL Topics laufen mit Default-Status (finished für topic/page, todo für coming-soon) und Default-Kategorie `misc`. Sobald die Config kommt, wird auf der Home dynamisch nach Kategorien gruppiert.

Siehe [docs/pending.md](docs/pending.md) für offene Arbeiten und [docs/architecture.md](docs/architecture.md) für Detail-Patterns.
