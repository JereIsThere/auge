# Architecture & Patterns

Konkretere Patterns als CLAUDE.md — wo welcher Trick wohnt und warum.

## Home (`pages/index.html` + `pages/main.ts`)

### Card-Rendering
`main.ts` importiert `pages.json` (autogeneriert von vite.config.ts) und rendert eine Card pro Page in `#links-stack`. Das Card-Markup:

```html
<a href="/<name>/" class="card">
  <div class="card-preview">
    <img src="/<name>/preview.jpg" alt="" loading="lazy" onerror="this.style.display='none'">
    <span class="card-num">01</span>
  </div>
  <div class="card-body">
    <span class="card-name"><name></span>
    <span class="card-cyr"><NAME></span>
    <span class="card-arr" aria-hidden="true">→</span>
  </div>
</a>
```

`preview.jpg` ist optional — wenn die Datei fehlt, blendet `onerror` das `<img>` aus und nur die Nummer bleibt.

### Custom Cursor
- Aktivierung gated durch `matchMedia('(pointer: fine)').matches`. Wenn false → `#cur` und `#cur-dot` werden aus dem DOM entfernt, `body.cursor-hidden` NICHT gesetzt → nativer Cursor bleibt.
- Bei aktivem Custom-Cursor: `body.cursor-hidden` setzt `cursor: none` global.
- Animation per `requestAnimationFrame` mit Lerp-Faktor 0.14, Schreibweise als `translate3d` (GPU-Layer).
- Hover-State: `mouseenter` auf jedem `<a>` togglet `.cur-hover`-Klasse → CSS macht size + color change. Kein inline `style.transform` Hack mehr.

### Backdrop-Canvas
- EIN Canvas (`#cyr-canvas`) für Cyrillic-Drift UND Embers — vorher waren das zwei Canvas. Das zweite (`#ember-canvas`) wird, falls noch im DOM, in `initBackdrop()` `.remove()`'t.
- Reduced-Motion-Check vorne: `if (matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.remove(); return; }`.
- DPR-Skalierung in `resize()`: `canvas.width = w * dpr` (max 2), CSS-size separat, dann `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`.
- Glyph-Update getrennt von Render (alle ~40ms), Embers-Render läuft jeden Frame mit `dt`-Korrektur (`e.x += e.vx * (dt / 16)`).
- Embers-Count: `Math.min(80, Math.floor(w / 20))`. Glow (Radial-Gradient) nur ab Radius > 1.4 — Gradients sind teuer.
- Resize debounced über `setTimeout(resize, 120)`.

### Layered z-index (Home)
```
0   body::before (noise texture)
1   #cyr-canvas (Backdrop)
3   .grain
4   .vignette
7   .oc (corner ornaments)
9999 #cur, #cur-dot
10   .stage (Hauptinhalt)
10000 .skip-link:focus
```

## Sub-Pages (`pages/<name>/index.html`)

### Standard-Template
```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="description" content="<topic> — auge." />
    <title><topic> · auge</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <a href="#main" class="skip-link">Zum Inhalt springen</a>
    <main id="main">
      <a href="/" aria-label="Zurück zur Übersicht">← zurück</a>
      <h1><topic></h1>
      <div id="app"></div>
    </main>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### Eigene Pages mit eigener Optik (z.B. `art-advanced`)
- Eigenes `style.css` neben dem `index.html`, im `<head>` referenzieren.
- Externe Fonts: `<link rel="preconnect">` + `<link rel="stylesheet">`, niemals `@import url(...)` in CSS.
- Eigenen Skip-Link einbauen (`.skip-link`-Style aus dem geteilten oder eigenem CSS — beide vorhanden).

## Build-Pipeline

```
npm run build
└─ tsc --noEmit                   Type-Check (kein Output)
└─ vite build
   ├─ vite.config.ts wird geladen
   │  ├─ scant pages/ nach Ordnern mit index.html
   │  ├─ schreibt pages/pages.json (gitignored)
   │  └─ wipeOutBuildDir() löscht altes dist/
   ├─ Rollup baut alle Pages parallel
   └─ Output → ../public_html/    (NICHT dist/, siehe vite.config rollupOptions.output.dir)
```

`publicDir: 'public'` ist konfiguriert, derzeit aber leer — `style.css` liegt in `pages/` und wird via `root: 'pages'` als `/style.css` ausgeliefert.

## Geteilte CSS-Variablen

```css
:root {
  --cyan:   #00d4c8;   /* primärer Akzent (Glow, Sub-Cyr-Slogan) */
  --purple: #6b00cc;   /* dekorative Linien, Card-Borders */
  --gold:   #d4a200;   /* sekundärer Akzent (Cursor-Dot, Pfeile, Hover) */
  --gold-b: #f0c000;   /* heller Goldton für Hover-Highlight */
  --bg:     #06000e;   /* sehr dunkles Indigo-Schwarz */
  --fg:     #c8c0d8;   /* lavendelgrauer Default-Text */
}
```

## Deploy

`npm run deploy` läuft `npm run build && rsync -avz --delete dist/ claude-user:/home/claude-user/public_html/`.

⚠️ Achtung: `vite.config.ts` schreibt das Build aktuell direkt nach `../public_html` (nicht nach `dist/`). Der `rsync`-Befehl im `deploy`-Script zeigt aber auf `dist/`. Das ist inkonsistent und sollte beim nächsten Touch des Deploy-Scripts geradegezogen werden.

Es gibt zusätzlich `.github/workflows/deploy.yml` als CI-Variante (siehe Repo).

## Tooling-Hinweise

- `@types/node` ist nur für vite.config.ts da (das `fs`-Imports hat).
- `vite.config.ts` ist KEIN reines Config-File — es schreibt `pages.json` und löscht `dist/` als Side-Effect beim Laden. Wenn dieses Verhalten weh tut, in einen separaten Vite-Plugin extrahieren.
