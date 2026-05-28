# Auge 2 — für Claude

Handkuratiertes Lernportal. Themen → Gruppen → Lektionen, alles in TypeScript-Code (keine DB). Featured + Kommt-noch auf der Landing, Lektionen mit DepthBox + Quellen + Übungsaufgaben.

**Tech:** Next.js 15.5 (App Router, standalone build, typedRoutes), React 19, Tailwind v4 (für Lektionen) + CSS-Modules (für Auge-Frame), TypeScript strict, Node ≥18.

**Live:** [auge2.jeremias-groehl.de](https://auge2.jeremias-groehl.de) — Deploy via GitHub Action bei push auf main mit Pfad-Filter `auge-2/**`. Wenn nicht triggert: `gh workflow run "Deploy Auge 2.0" --ref main`.

---

## Verzeichnis-Map (das Wesentliche)

```
auge-2/
  app/                              App-Router-Routen
    page.tsx                        Landing (Featured + Kommt-noch)
    thema/[slug]/                   Thema-Hub
    thema/[slug]/lektionen/[lektion]/   Lektion mit Sidebar
  components/
    lessons/                        WIEDERVERWENDBAR: DepthBox, QuelleBox, Aufgabe, KiReview, LessonsSidebar, LessonsScope, ThemeToggle
    kurse/<thema>/                  Lektions-Components pro Thema
    KommtNochListe.tsx              Landing-Sektion
    TopicGrid.tsx                   (alt, ungenutzt)
    CyrillicCanvas.tsx              Hero-Hintergrund
  themen/
    index.ts                        REGISTRY (alle Themen importieren + listen)
    _platzhalter.ts                 Themen ohne Lektionen (status kommt-noch)
    <thema>/meta.ts                 Thema-Definition (Gruppen, Lektionen, Pfade)
    <thema>/quellen.ts              (optional) wissenschaftliche Quellen
  lib/schema.ts                     berechneSchemaLayout (Landing-Schema-Hinweis)
  types/index.ts                    Thema, Lektion, Pfad, Quelle, Kategorie
  docs/
    architektur.md                  Detaillierte Architektur-Doku
    prompts/                        Copy-Paste Templates für neue Chats
    roadmap.md                      Was fertig, was offen, was v1.0-Blocker
  _legacy/                          Schlafende OrientDB/Generierungs-Pipeline (vom Build ausgeschlossen)
```

---

## Patterns (das was du in jeder Lektion brauchst)

### DepthBox — aufklappbare Tiefe

```tsx
import { DepthBox } from "@/components/lessons/DepthBox";

<DepthBox variant="why" title="Warum funktioniert das?">
  Erklärung der Hintergründe.
</DepthBox>
```

Varianten: `basic` 🌱 · `why` 🤔 · `mistake` ⚠️ · `deeper` 🔬 · `related` 🔗 · `history` 📜

Reihenfolge pro Lektion: `why` → `mistake` → `deeper` → `related` (→ `history` optional). Selten alle sechs.

### QuelleBox — wissenschaftliche Quelle am Ort der Referenz

```tsx
// 1. Quelle in themen/<thema>/quellen.ts definieren (typed: Quelle)
// 2. Convenience-Wrapper in components/kurse/<thema>/<Thema>Quelle.tsx
//    der ragQuelleFinden / kryptoQuelleFinden o.ä. nutzt
// 3. Verwendung in der Lektion:
<RagQuelle id="liu2024-lostmiddle" kernaussagen={[
  "Empirische Studie über 10 LLMs",
  "U-förmige Accuracy-Kurve",
  "Effekt verschwindet nicht durch größeres Kontextfenster",
]} />
```

Nur an zentralen Stellen, nicht hinter jeder Aussage.

### Aufgabe + KiReview — Übung mit KI-Feedback

```tsx
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";

<Aufgabe titel="Café mit Schatten" schwierigkeit="leicht" zeit="45 min">
  <p>Beschreibung der Aufgabe.</p>
  <AufgabeCheckliste items={[
    "Pflichtelement 1",
    "Pflichtelement 2",
  ]} />
  <KiReview prompt={`200-300-Wort-Prompt, der genau die Konzepte
der Vorgänger-Lektionen abfragt und mit "nenn die zwei größten
Verbesserungs-Hebel" endet.`} />
</Aufgabe>
```

Schwierigkeit: `leicht | mittel | schwer`. Mini-Aufgaben (ohne KiReview) auch in normale Lektionen einbaubar.

---

## Wie ich eine neue Lektion baue

1. Datei `components/kurse/<thema>/<Name>.tsx`
2. `"use client"` nur wenn `useState`/Events nötig
3. Skelett:
   ```tsx
   import { DepthBox } from "@/components/lessons/DepthBox";
   import "@/components/lessons/lesson.css";

   export default function Name() {
     return (
       <div className="lesson-card">
         <h2>Lektions-Titel</h2>
         <p className="lesson-description">Einstieg in 2-3 Sätzen.</p>
         <div className="info-box">Kurzfassung als Anker.</div>

         {/* Hauptinhalt: h3 + step-list / actors / interaktive Demo */}

         <DepthBox variant="why" title="...">...</DepthBox>
         <DepthBox variant="mistake" title="...">...</DepthBox>
         <DepthBox variant="deeper" title="...">...</DepthBox>
         <DepthBox variant="related" title="Hängt zusammen mit…">...</DepthBox>
       </div>
     );
   }
   ```
4. In `themen/<thema>/meta.ts` mit `loader: () => import('@/components/kurse/<thema>/<Name>')` registrieren
5. `npm run build` lokal (siehe Pitfalls!)

Interaktive Lektionen: `useState` für State, SVG für Visualisierung (kein Canvas), Slider via `<input type="range">`. Vorbild: `components/kurse/procreate-rendering/Lichtkugel.tsx`.

---

## Wie ich ein neues Thema baue

Vorbild: Aquarell-Starter (3 Lektionen) oder Procreate/Neuro (voll ausgebaut).

1. `themen/<slug>/meta.ts` mit `Thema`-Typ — 3-4 Lektionen reichen für den ersten PR, rest als `kommtNoch: true`-Stubs
2. `components/kurse/<slug>/<Lektion>.tsx` für die 3 Starter
3. In `themen/index.ts` importieren + in `THEMEN[]` einfügen (vor `...PLATZHALTER_THEMEN`)
4. In `themen/_platzhalter.ts` aus der Liste streichen (falls vorher dort)
5. In `app/page.tsx` `THEMA_ICON` ergänzen
6. `npm run build`, Commit, PR

Status: `in-arbeit` für Starter, später `fertig` bei Vertiefung.

---

## Common pitfalls (alle schon mal passiert)

### Quote-Bug bei deutschen „Anführungszeichen"

In JSX-**Attributen** mit `title="..."` und in **JavaScript-Strings** mit `"..."` schließen deutsche `"` den String vorzeitig:

```tsx
// ❌ KAPUTT
<DepthBox title="Was ist „X"?">     // → "Was ist „X" als String, dann "?" als JSX → Syntax-Error
const x = "Bild mit „Stempel"";     // → String endet nach Stempel, leerer String + Komma kommt

// ✅ OK
<DepthBox title="Was ist X?">
const x = "Bild mit Stempel";
// JSX-Text-Content (zwischen Tags) darf „...":
<p>Das ist der „Stempel"-Effekt.</p>
```

### `.commit_msg.txt` nicht ins Repo

Wird oft als File-Quelle für `git commit -F` benutzt (weil PowerShell-Heredoc bockt). Steht in `.gitignore`.

### Build vor Commit

`npm run build` vor jedem Commit. SWC ist beim TypeScript-Parsen strenger als IDE-Linter — manche Quote-Bugs sieht nur der Build.

### Tailwind-Layer

Custom-CSS in `globals.css` ist in `@layer base` gewrappt, damit Tailwind utilities aus `@layer utilities` darüber gewinnen. `.lessons-scope` und `.skip-link` sind bewusst unlayered (lokale Wrapper). Niemals ein universal Reset (`* { margin: 0 }`) außerhalb von `@layer base`.

### Deploy triggert nicht nach Merge

Kann passieren wenn der Merge-Commit den Pfad-Filter (`paths: 'auge-2/**'`) nicht greift. Fix:

```bash
gh workflow run "Deploy Auge 2.0" --ref main
```

---

## Branch + PR + Deploy Workflow

```bash
# Neuer Branch von main
git fetch origin main && git checkout main && git pull
git checkout -b claude-edits/<beschreibung>

# Arbeiten + Build prüfen
npm run build   # in auge-2/

# Commit (Heredoc bockt unter PowerShell — File-Variante:)
echo "feat(...): ..." > .commit_msg.txt   # mehrzeilig editieren
git add -A
git commit -F .commit_msg.txt
rm .commit_msg.txt   # in .gitignore — Sicherheitsnetz

# Push + PR
git push -u origin claude-edits/<beschreibung>
gh pr create --title "..." --body-file <body>.md

# Merge + Deploy
gh pr merge <nr> --merge   # Standard, kein squash/rebase
# Falls Deploy nicht triggert:
gh workflow run "Deploy Auge 2.0" --ref main
```

Branchname-Konvention: `claude-edits/<thema>-vertiefung`, `claude-edits/<feature>`, `claude-edits/<thema>-quellen` etc.

---

## Aktueller Stand (Stand: nach PR #26)

**Themen fertig (`status: 'fertig'`)** — alle ausgebaut auf Voll-Lektionen + Pfade:
- 🔐 Kryptografie — 22 Lektionen, 3 Pfade
- 🧬 RAG — 11 Lektionen + 11 wissenschaftliche Quellen
- 🖌️ Procreate-Rendering — 12 Lektionen + Übungsaufgaben mit KI-Review
- 🧠 Neurologie & MMC — 13 Lektionen + Ergo-Übungsaufgaben
- 🛠️ MCP — 12 Lektionen, 4 Pfade, inkl. Sampling + Sicherheits-Block + Übungsaufgaben
- 🎨 Aquarell — 11 Lektionen, 4 Pfade + Übungsaufgaben mit KI-Review

**v1.0 erreicht** — alle Kern-Themen ausgebaut. Nächste Schritte sind v1.1-Themen (siehe roadmap).

Vollständige Liste mit Prio in [`docs/roadmap.md`](./docs/roadmap.md).

---

## Wenn du wenig Tokens hast

Nimm dir was Kleines vor — Prompts in [`docs/prompts/finish-cleanup.md`](./docs/prompts/finish-cleanup.md) sortieren Aufgaben nach Größe. Beispiele für 5-10k-Token-Tasks: einzelne Lektion ausbauen, Quellen in einer Lektion ergänzen, kleinen Bug fixen.

Größere Tasks (volle Vertiefung, neues Feature) brauchen meist 30-50k Tokens — am besten zu Sessions wenn du Zeit hast.
