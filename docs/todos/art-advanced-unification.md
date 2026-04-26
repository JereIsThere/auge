# TODO: art-advanced — zwei Varianten konsolidieren

**Repo (Hauptprojekt):** [github.com/JereIsThere/auge](https://github.com/JereIsThere/auge)
**Submodule:** [github.com/JereIsThere/claude-learnings](https://github.com/JereIsThere/claude-learnings) — eingebunden unter `pages/claude-learnings/`

## Problem

Es existieren zwei verschiedene `art-advanced/index.html` parallel:

| Pfad | Herkunft | Charakter |
|---|---|---|
| `pages/art-advanced/index.html` | Top-Level im auge-Repo | Eigene Optik (helle Akzente, Inter+Syne Fonts), eigenes `style.css`, accordion-basiert mit drei Sektionen (Farbe / Manga / Speed). Kürzlich poliert (CSS extrahiert, Skip-Link, Focus-Styles, Reduced-Motion). |
| `pages/claude-learnings/art-advanced/index.html` | Submodule | Andere Variante derselben Idee. Optik weicht ab, Gliederung weicht ab. |

Die Inhalte überschneiden sich thematisch (beides „advanced art guide"), aber Strukturen und Texte sind unterschiedlich entstanden. Welche Version „canonical" sein soll, ist eine **inhaltliche Entscheidung**, kein Refactor.

## Warum das ein eigener Task ist

Der Hauptbau im auge-Repo (geplanter Vite-Plugin-Renderer für die übrigen Submodule-Topics) lässt `art-advanced` bewusst aus, weil:

1. Beide Pages sind **eigenständig** (kein README + Resources-Pattern wie bei `regex/`, `latex/`, …) — der generische Renderer würde sie verfehlen.
2. Eine Konsolidierung erfordert **inhaltliche Synthese** (welche Sektionen behalten? welche Beispiele sind besser?) — das gehört in den Submodule-Workflow, nicht in einen Plugin-Build.
3. Die Optik der Top-Level-Variante ist mittlerweile in den Rest des auge-Designs eingebettet (Skip-Link, `:focus-visible` aus dem geteilten Stylesheet usw.). Die Submodule-Variante kennt diese Patterns nicht.

## Empfohlene Resolution

**Variante A — Submodule wird Single Source of Truth (bevorzugt, konsistent mit den anderen Topics):**

1. Inhalte beider Varianten zusammenführen, kuratiert in `pages/claude-learnings/art-advanced/`.
2. Optik-Patterns aus dem auge-Hauptrepo übernehmen (Skip-Link, Focus-Styles, Reduced-Motion-Block, Google-Fonts-preconnect statt @import — siehe `docs/architecture.md` im auge-Repo).
3. Top-Level `pages/art-advanced/` löschen. Der geplante Vite-Plugin-Renderer kann dann `art-advanced` mit erfassen.

**Variante B — Top-Level bleibt, Submodule-Variante wird gelöscht:**

1. Im Submodule `pages/art-advanced/` entfernen.
2. Top-Level-Variante bleibt unverändert. Renderer ignoriert sie.
3. Schwächt das „Submodule = Single Source of Truth"-Prinzip auf, das für die anderen Topics gilt.

## Konkrete Schritte (für Variante A)

Im **Submodule-Repo** (`claude-learnings`):

1. Diff der beiden HTML-Dateien ziehen (nehme als Referenz die polierte Top-Level-Version aus `pages/art-advanced/index.html`):
   ```bash
   diff pages/art-advanced/index.html pages/claude-learnings/art-advanced/index.html
   ```
2. Inhaltliche Entscheidung: welche Sektionen / Beispiele übernehmen.
3. Im Submodule eine konsolidierte `art-advanced/index.html` + `art-advanced/style.css` schreiben. Konventionen aus dem auge-Hauptrepo (siehe dort `CLAUDE.md`):
   - Externe Fonts via `<link rel="preconnect">` + `<link rel="stylesheet">`, NICHT via `@import url(...)` in CSS
   - Skip-Link mit `class="skip-link"` als erstes Body-Element
   - `:focus-visible`-Styles für Tastatur-Navigation
   - `prefers-reduced-motion: reduce`-Block für alle Animationen/Transitions
   - `<meta name="color-scheme" content="dark">`, `<meta name="description">`, `<meta name="viewport">`
   - `<nav aria-label="...">` für Navigations-Bereiche
4. Submodule-Commit + Push.

Im **auge-Hauptrepo**:

1. Submodule-Pointer aktualisieren (`git submodule update --remote pages/claude-learnings && git add pages/claude-learnings && git commit`).
2. `pages/art-advanced/` (Top-Level) löschen.
3. Vite-Plugin-Renderer (sobald gebaut) so erweitern, dass er auch `pages/claude-learnings/art-advanced/` als Topic erfasst — entweder über die normale Pre-Built-HTML-Erkennung oder eine Whitelist.
4. Verifizieren: `npm run build`, `dist/art-advanced/index.html` schauen.

## Akzeptanzkriterien

- Nur EIN `art-advanced/index.html` im finalen Build (`dist/art-advanced/`).
- Page nutzt die geteilten auge-Konventionen (Skip-Link, Focus-Styles, Reduced-Motion).
- Inhalte sind das Beste aus beiden Varianten — nichts Wertvolles geht verloren.
- Auf der Home-Card-Liste taucht `art-advanced` weiterhin auf.

## Kontext / Background

Siehe im auge-Repo:
- `CLAUDE.md` — Projekt-Übersicht, Konventionen
- `docs/architecture.md` — Detail-Patterns (Cursor, Backdrop, Build-Pipeline)
- `docs/pending.md` — andere offene Tasks im selben Atemzug
