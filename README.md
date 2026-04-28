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

## Auto-Update aus claude-learnings

`npm run auto-update` (oder direkt `bash scripts/auto-update.sh`) holt die
neueste Version des `claude-learnings`-Submoduls, baut die Site neu und
committet den Submodul-Pin im Parent. Snapshot-Rollback bei Build-Fehler.

Ausgabe ist eine Zeile JSON auf stdout, Logs gehen auf stderr:

```json
{"status":"updated","before":"abc…","after":"def…","topics_added":["nlp","statistics"],"topics_removed":[]}
```

`status` ist `idle` (nichts geändert), `updated` (neu gebaut), oder
`failed` (Build fehlgeschlagen, public_html aus Snapshot wiederhergestellt).
Exit-Codes: `0`, `0`, `1` respectively (`2` bei Fehlern vor dem Build).

### n8n / Cron / Webhook

Trigger-agnostisch — der Caller braucht nur:

- **Cron / lokale Crontab**: `0 * * * * cd /home/claude-user/auge && npm run auto-update`
- **n8n auf demselben Host**: "Execute Command" Node →
  `cd /home/claude-user/auge && npm run auto-update` → "Set" Node parsed
  stdout als JSON und branched auf `$json.status`
- **n8n auf anderem Host**: "SSH" Node mit obigem Command, sonst gleich
- **Webhook**: kleinen Wrapper schreiben, der `auto-update.sh` aufruft und
  die JSON-Zeile als Response zurückgibt
