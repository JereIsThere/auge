# auge

Multi-Page Vite/TS Projekt. Jeder Ordner unter `pages/` ist eine eigene Seite.

## Setup

```bash
npm install
```

## Dev

```bash
npm run dev
```

## Daten generieren (Python)

```bash
python scripts/generate.py
```

## Build & Deploy

```bash
npm run deploy
```

Build → `dist/` → rsync auf `claude-user:/home/claude-user/public_html/`.

## Neue Seite anlegen

1. Ordner unter `pages/` erstellen (z.B. `pages/neue-seite/`)
2. `index.html` + `main.ts` rein
3. `vite.config.ts` greift automatisch alle Ordner ab

URL: `auge.jeremias-groehl.de/neue-seite/`
