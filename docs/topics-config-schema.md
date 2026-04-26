# `topics.config.json` Schema

Optionale Datei im Repo-Root. Wenn vorhanden, mergt `scripts/discover.mjs` die Werte über die auto-discovered Topic-Metadaten. Wenn nicht vorhanden, gelten die Defaults (siehe unten).

## Schema

```jsonc
{
  "<slug>": {
    "category": "string",               // optional — sonst "misc"
    "status":   "todo" | "in-progress" | "finished" | "archived",  // optional — sonst aus kind abgeleitet
    "title":    "string",               // optional — überschreibt auto-extrahierten Titel
    "description": "string",            // optional — überschreibt erste README-Zeile
    "tags":     ["string", ...],        // optional
    "order":    42                      // optional — sortiert innerhalb der Kategorie aufsteigend
  }
}
```

`<slug>` muss exakt einem Verzeichnisnamen unter `pages/` (Submodule-Topic, Standalone-Page) oder `topics/` (Coming-Soon-Scaffold) entsprechen. Slugs ohne korrespondierenden Ordner werden ignoriert (mit Warnung).

## Default-Verhalten ohne Config

| Erkannt als | status (default) | category (default) |
|---|---|---|
| `topic` (aus Submodule) | `finished` | `misc` |
| `page` (Standalone) | `finished` | `misc` |
| `comingsoon` (in `topics/`) | `todo` | `misc` |

Wenn ALLE Topics in derselben Kategorie sind (z.B. nur `misc`), rendert die Home eine flache Liste ohne Kategorie-Header.

## Beispiel

```json
{
  "regex": {
    "category": "computer-science",
    "status": "finished",
    "tags": ["text-processing", "fundamentals"],
    "order": 1
  },
  "latex": {
    "category": "writing",
    "status": "finished",
    "order": 1
  },
  "art-advanced": {
    "category": "creative",
    "status": "finished"
  },
  "watercolor-mixing": {
    "category": "creative",
    "status": "in-progress"
  },
  "discrete-math": {
    "category": "math",
    "status": "todo",
    "tags": ["foundations"]
  }
}
```

Mit obiger Config würde die Home in vier Sektionen gruppieren: `computer-science`, `writing`, `creative`, `math` — Reihenfolge der Sektionen alphabetisch (Anpassbar später per separatem `categories`-Feld, nicht im aktuellen Schema enthalten).

## Erweiterungs-Stellen (für später)

Wenn das Schema wächst, hier dokumentieren:
- Sortierung der Kategorien selbst (`{ "_meta": { "categoryOrder": [...] } }`?)
- Icons / Farben per Kategorie
- Externe Links pro Topic
- Last-Updated-Zeitstempel

Bis dahin: das obige Schema reicht für Status-Badges und dynamische Kategorie-Gruppierung.
