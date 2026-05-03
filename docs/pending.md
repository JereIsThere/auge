# Pending Work

Stand: 2026-05-03.

## Erledigt

✅ **Submodule-Renderer** — `scripts/discover.mjs` rendert Submodule-Topics zu `pages/<slug>/index.html`.

✅ **Home-Cards** mit Topic-Metadata (title, description, level-badges, status-badges, Kategorie-Gruppierung).

✅ **Sub-Page-Typografie** — `.markdown-body`-Styles vollständig.

✅ **`topics/`-Restruktur** — Coming-Soon-Scaffolds in eigenem Ordner.

✅ **Status + Kategorie-Support** — `topics.config.json` angelegt, Schema dokumentiert.

✅ **17 neue Topics** — Submodule auf `traeumer-kauzruf` aktualisiert; discover.mjs macht README.md optional.

✅ **Linear Algebra** — vollständige hand-geschriebene Topic-Page.

✅ **n8n** — Workflow-Dashboard (Auth, Webhook-Trigger, Payload, Response).

✅ **`topics.config.json`** — angelegt mit Titel/Description-Overrides für `linear-algebra` und `n8n`.

✅ **vite.config.ts-Bugs gefixt** — `publicDir`-Pfad-Bug entfernt (`false` gesetzt), `rollupOptions.output.dir`-Konflikt mit `outDir` entfernt. Build landet jetzt korrekt in `dist/`, deploy-Script stimmt.

✅ **`pages/README.md` entfernt** — war veraltete Kopie des Submodule-README.

✅ **Stale Branches** — `copilot-tries`, `gemini-suggestions` (lokal) und `origin/claude-edits` existieren nicht mehr.

## Noch offen

### `art-advanced` Konsolidierung

Zwei parallele Varianten: `pages/art-advanced/` (standalone) und `pages/claude-learnings/art-advanced/` (Submodule). Wartet auf Submodule-Maintainer.
→ Details: [docs/todos/art-advanced-unification.md](todos/art-advanced-unification.md)

### Stale Top-Level-Duplikate (Rückfrage nötig)

`pages/regex/`, `pages/latex/`, `pages/data-structures-algorithms/`, `pages/tensorflow-keras/` enthalten Pre-Submodule-README + Resources-Dateien, die nirgends mehr gelesen werden. Submodule ist Single Source of Truth.
→ Auf explizite Freigabe warten bevor gelöscht.

### `seite-eins` / `generate.py`

`pages/seite-eins/main.ts` importiert `data.json`, das von `scripts/generate.py` generiert wird — aber `generate.py` ist nicht im Build-Workflow. Build schlägt fehl wenn `data.json` fehlt.
→ Entweder `generate.py` als `prebuild`-Hook eintragen oder `seite-eins` als Boilerplate entfernen.

### `seite-eins`, `seite-zwei`

Boilerplate-Demos ohne inhaltlichen Wert. Können entfernt werden wenn nicht mehr gebraucht.

### `watercolor-mixing` / `linear-algebra`

- `watercolor-mixing` — Coming-Soon-Marker, kein Submodule-Inhalt.
- `linear-algebra` — hand-geschrieben; wenn das Submodule irgendwann LA-Inhalt bekommt, Seite auf Submodule-Flow umstellen.

### topics.config.json ausbauen

Alle Topics mit sinnvollen Kategorien versehen (z.B. `math`, `computer-science`, `tools`, `creative`) damit die Home nach Kategorien gruppiert wird.
