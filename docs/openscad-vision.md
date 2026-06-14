# Vision: OpenSCAD-Thema für auge

> Status: **Konzept** · Autor: Claude by Anthropic · Datum: 2026-06-14
> Entstanden aus der Frage „Code-Along mit Ziel — wie passt das in auge?"

## Die Idee in einem Satz

Ein **schlankes Code-Along**, das eine **Visitenkarten-Box** baut — ein echtes,
druckbares Teil. Bewusst kurz gehalten: eine Box ist basic. Weitere
OpenSCAD-Themen werden **später angehängt** (auge ist additiv), eine eigene
Seite signalisiert ehrlich, was hier noch *nicht* erklärt ist.

Titel-Arbeitstitel: **„OpenSCAD — Dinge programmieren statt zeichnen"**

## Warum das zu auge passt

- OpenSCAD ist selbst „Lernen durch Code" — deckt sich mit auges Charakter.
- Echter Anwendungsfall (Visitenkarten halten) statt abstraktes Beispiel →
  die Maße der Karten *motivieren* von selbst Variablen & Parametrik.
- Endet in einer **Übungsaufgabe mit KiReview** (bestehendes auge-Pattern).
- **Additiv**: klein starten, später Lektionen anhängen — genau der auge-Stil.

## Die Kern-Spannung & ihre Auflösung

OpenSCAD lebt von *Code schreiben → 3D sehen*. auge ist aber **SVG-interaktiv,
kein Canvas** (CLAUDE.md-Pitfall). Auflösung: **Hybrid, phasenweise.**

### Phase 1 — isometrische SVG-Skizzen (umgesetzt)
- Jede Code-Stufe als **handgezeichnetes isometrisches SVG** statt PNG-Render.
  Grund: echte OpenSCAD-Renders bräuchten Qt/Mesa/xvfb auf dem Server (zu viel
  Ballast, Headless unsicher). SVG ist leichter, themebar (dark/light), kein
  Asset-Pipeline — und auge-nativ (SVG-first).
- Helper `components/kurse/openscad/iso.tsx`: 30°-Iso-Projektion, Flächen per
  Painter-Algorithmus sortiert, Farben über CSS-Variablen. `solidBox()` +
  `tray()` als Geometrie-Bauer.
- Wiederkehrende Lern-Einheit: Komponente `<ScadStep>` — links der Code,
  rechts die `<IsoFigure>`. Die Box wächst sichtbar über die Lektionen.
- Bleibt 100 % statisch, DB-frei, kein WASM, kein Canvas. Voller Lerneffekt.

### Phase 2 — opt-in Live-Playground (das „KRASS"-Feature, später)
- Komponente `<ScadPlayground>`: lädt **openscad-wasm lazy** (nur per
  „Live ausprobieren"-Klick) → echtes OpenSCAD im Browser, Modell dreht sich.
- Läuft in einem **Web Worker mit Timeout** → kein eingefrorener Tab bei
  Endlosschleife / absurdem `$fn`.
- Bewusste, **lokal gekapselte Ausnahme** von der „kein Canvas"-Regel.

#### Sicherheit (geklärt)
Arbitrary Code Execution ist **gering & eingegrenzt**:
- Läuft **client-seitig** — kein Server-Endpoint führt Code aus, kein
  Server-RCE, kein Eintritt in die Infra. auge bleibt statisch.
- **WASM-Sandbox**: kein FS-, kein Netzwerkzugriff. OpenSCAD-Code ist *kein
  JS* (kein `eval`); `import()`/`surface()` sehen nur ein virtuelles FS, das
  wir befüllen.
- Läuft auf dem Rechner des Lernenden mit dessen eigenem Code — kein Shared
  Backend, kein Risiko für andere User.
- Einziges Restrisiko ist UX (Tab-Freeze) → durch Web-Worker-Timeout gelöst.

#### Impact auf auge als Ganzes
- **Lazy-loaded**: WASM (~mehrere MB) lädt nur in Live-Playground-Lektionen.
  Main-Bundle aller anderen Themen unberührt.
- „kein Canvas" gilt weiter überall sonst.
- Statischer Deploy / standalone build / DB-frei: alles unverändert.

## Zielobjekt: Visitenkarten-Box

Eine offene Box/Schale, die Standard-Visitenkarten (85 × 55 mm) hält — mit
Daumenmulde zum Herausnehmen. Gewählt, weil:
- **echter Bedarf** (Owner braucht genau das),
- die Kartenmaße + Toleranz **Variablen/Parametrik natürlich motivieren**,
- super basic → ideal als erstes OpenSCAD-Teil,
- später leicht erweiterbar (Deckel, Fächer, Logo → „noch nicht erklärt"-Seite).

## Lektionsplan (schlank: 6 Lektionen + Wegweiser-Seite)

> Die Box ist der rote Faden: jede Lektion zeigt ihren aktuellen Stand.

### Gruppe 1 — Die Box bauen
1. **Dinge programmieren statt zeichnen** — Mindset (Code statt Maus, CSG,
   parametrisch) + erster `cube` als Rohling.
   *(mistake: in Maus-Operationen denken)*
2. **Maße & Positionieren** — mm, Koordinatensystem (Z nach oben),
   `center`, `translate`. Rohling auf Kartenmaß 85 × 55 bringen.
3. **difference: aushöhlen** — `difference()` höhlt den Block zur Schale →
   das CSG-„Aha".
4. **Variablen & Toleranz** — `kartenBreite/kartenHoehe/wand/spiel` als
   Variablen oben; Spiel, damit die Karten reinpassen. Eine Zahl ändern →
   Box passt sich an.

### Gruppe 2 — Fertig & drucken
5. **Feinschliff: runde Ecken + Daumenmulde** — `hull()`/`$fn` für gerundete
   Ecken, ein Ausschnitt zum Greifen der Karten.
6. **Vom Modell zum Druck** — Preview vs Render (F5/F6), Mannigfaltigkeit,
   STL-Export. → fertige, druckbare Box.

### Übung
7. **Übungsaufgabe mit KiReview** — eigene Variante (z.B. Box für ein anderes
   Format / zweites Fach); KI-Review-Prompt zum Kopieren.

### Wegweiser
8. **Das ist hier noch nicht erklärt** — ehrliche Seite: was OpenSCAD noch
   kann und in dieser Box bewusst weggelassen wurde. Kurze Teaser-Liste, je
   eine Zeile „was es macht" + „wofür":
   `module` · `for`-Loops · `minkowski` · Deckel mit Passung · Customizer-Slider
   · Text/Logo (`text`, `linear_extrude`) · Import (SVG/DXF) · Gewinde.
   Doppelt als **Append-Roadmap** (was kommt als Nächstes) und als
   „wo geht's für mich weiter".

## Pfade

Bei 6 Lektionen bewusst schlank — entweder ganz flach (nur Gruppen) oder
ein einziger Pfad **„Die Box" 📦** (L1–L6). Pfade später ausbauen, wenn mehr
OpenSCAD-Lektionen dazukommen.

## Technik-Notizen für die Umsetzung

### Neue wiederverwendbare Komponenten
- `components/kurse/openscad/ScadStep.tsx` — Code + vor-gerendertes Bild
  nebeneinander (Phase 1, das Arbeitspferd).
- `components/kurse/openscad/ScadPlayground.tsx` — Lazy-WASM-Editor + Viewer
  (Phase 2, später).

### Asset-Pipeline (Autoring)
PNGs der Steps via OpenSCAD-CLI erzeugen, z.B.:
```
openscad -o step.png --imgsize=800,600 --colorscheme=Tomorrow step.scad
```
Bilder committen unter `public/openscad/<lektion>/<step>.png` (o.ä.).

### Registrierung (auge-Standard)
- `themen/openscad/meta.ts` neu (Vorbild: `themen/aquarell/meta.ts`).
- Kategorie: `cs` · Tags: `['3d-druck', 'cad', 'parametrik', 'code']`.
- In `themen/index.ts` importieren + vor `...PLATZHALTER_THEMEN` einfügen.
- `app/page.tsx`: `THEMA_ICON` ergänzen (Vorschlag 📦).
- Vor PR auf `origin/main` rebasen (zentrale Dateien → Konfliktfenster klein).

## Stand der Umsetzung (2026-06-14)

**Gebaut & Build grün:**
- `themen/openscad/meta.ts` — Thema registriert (Kategorie `cs`, Icon 🧊,
  Status `in-arbeit`, Pfad „Die Box").
- Komponenten: `iso.tsx`, `ScadStep.tsx`, `openscad.css`.
- Voll: L1 Einstieg · L2 Maße & Positionieren · L3 difference · L4 Variablen &
  Toleranz · Wegweiser „Das ist hier noch nicht erklärt".
- Stubs (`kommtNoch: true`): L5 Feinschliff · L6 Export · L7 Übung.
- Registriert in `themen/index.ts` + `app/page.tsx` (THEMA_ICON).

**Offen / nächste Schritte:**
- Live-Optik der Iso-Skizzen im Browser prüfen (besonders die Schale + Karten).
- Stubs L5–L7 ausbauen (Inhalte stehen im Lektionsplan oben).
- Phase-2-WASM-Playground (`<ScadPlayground>`) in eigenem PR.
- Offene Entscheidung: Three.js vs. `<model-viewer>` für den STL-Viewer.

```
Offene Entscheidung für später: Three.js vs. <model-viewer> für den
STL-Viewer in Phase 2.
```
