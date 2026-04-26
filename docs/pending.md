# Pending Work

Stand: 2026-04-26. Was offen ist und worauf der Nutzer noch antworten muss, bevor weitergebaut wird.

## Großes offenes Thema: Submodule-Topics rendern

Aktuell: Vom Submodule `pages/claude-learnings/` werden NULL Pages gerendert. Es gibt 4 echte Topics mit Inhalt (`regex`, `latex`, `data-structures-algorithms`, `tensorflow-keras`) plus eine fertige `art-advanced/index.html`-Variante. Auf der Home tauchen sie nicht auf.

**Geplante Architektur** (vom Nutzer genehmigt im Konzept, wartet auf Detail-Antworten):

1. **Vite-Plugin** als Pre-Build-Schritt:
   - Scant `pages/claude-learnings/{topic}/README.md`
   - Generiert pro Topic `pages/<topic>/index.html` ins Top-Level (gitignored)
   - Inhalt: gerendetes README + die drei Level-Sektionen (`beginner/intermediate/advanced`) mit ihren `resources.md` und Liste der `examples/` (mit Syntax-Highlighting für die Code-Snippets)

2. **Markdown-Renderer**: `marked` (~30 KB, kein DOM-Cost)

3. **Home polishen**: Cards bekommen Topic-Name, Kurzbeschreibung (erste Zeile aus README), Level-Badges. Leere Scaffolds tauchen NICHT auf.

4. **Sub-Page-Template polishen**: Typografie für h2/h3, Listen, Tabellen, Code-Blocks, Blockquotes, Sidebar-Nav für Level-Sprünge.

5. **`art-advanced` bleibt eigenständig** (eigene Optik, eigenes CSS, nicht generiert).

6. **`seite-eins` / `seite-zwei`** sind Boilerplate-Demos — separater Job.

## Drei offene Fragen an den Nutzer

Vor dem Bau des Renderers warten wir auf Antworten:

- **(a) Leere Scaffolds** (`pages/api-rest/`, `pages/nlp/`, `pages/pandas-data-wrangling/`, …, ~17 Stück, alle ohne README): Als „🔒 coming soon"-Karten anzeigen oder komplett ausblenden, bis Inhalt da ist?

- **(b) Top-Level Stale-Duplikate** (`pages/regex/`, `pages/latex/`, `pages/data-structures-algorithms/`, `pages/tensorflow-keras/`): Diese enthalten EIGENE Inhaltsdateien, die vom Submodule abweichen (vermutlich Pre-Submodule-Reste). Nach erfolgreicher Migration zur Submodule-Source löschen, oder erstmal liegen lassen?

- **(c) `art-advanced` aus Submodule**: Im Submodule liegt unter `pages/claude-learnings/art-advanced/index.html` eine eigene fertige Variante dieser Page. Soll sie zusätzlich/stattdessen in die Topic-Liste, oder bleibt das top-level `pages/art-advanced/` (mit eigener polierter Optik) die einzige Variante?

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
