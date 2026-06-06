# Auge – Architektur

<!-- Stand: nach PR #17 (Landing-Rework + Aquarell) -->


Auge ist ein handkuratiertes Lernportal. Themen sind in TypeScript-Files
modelliert (kein DB-Roundtrip), Lektionen sind interaktive React-Components.

## Routing

```
/                                         Landing – Featured-Themen + getrennter Kommt-noch-Bereich
/thema/[slug]                             Thema-Hub – Hero, Pfade, Lektions-Landkarte
/thema/[slug]/lektionen/[lektion]         Lektion – Sidebar + Component
```

Die Landing trennt **Featured** (Status `fertig` oder `in-arbeit`) von
**Kommt-noch** (Status `kommt-noch`):
- Featured: große Karten mit Icon, Pitch, Lektionsanzahl + Pfaden direkt
  klickbar (`<FeaturedKarte>`)
- Kommt-noch: kompakte gedimmte Liste, gruppiert nach Kategorie, mit
  Schema-Layout-Hinweis (`<KommtNochListe>`)

Pfade unter `app/_legacy/` (z.B. `app/_legacy/api/`, `app/_legacy/generieren/`)
werden von Next.js ignoriert (Underscore-Konvention für *private folders*).

## Verzeichnisse

```
app/
  page.tsx                                Landing
  layout.tsx                              Auge-Frame: Header, Codex-Body
  globals.css                             Tailwind + Auge-Codex-Styles
  thema/[slug]/                           Thema-Hub (Codex-Stil)
    page.tsx
    page.module.css
    lektionen/[lektion]/page.tsx          Lektion (Tailwind-Scope)

components/
  CyrillicCanvas.tsx                      Hintergrund-Effekt für Landing
  KommtNochListe.tsx                      Landing-Sektion für geplante Themen
  TopicGrid.tsx                           (alt, vor Landing-Rework, ungenutzt)
  lessons/                                Wiederverwendbare Lektions-Wrapper
    LessonsScope.tsx                      Heller/dunkler Scope-Wrapper
    LessonsSidebar.tsx                    Gruppierte Lektions-Navigation
    DepthBox.tsx                          Aufklappbare Tiefen-Boxen
    QuelleBox.tsx                         Wissenschaftliche Quelle am Ort der Referenz
    Aufgabe.tsx                           Übungsaufgabe mit Schwierigkeit + Checkliste
    KiReview.tsx                          KI-Review-Prompt mit Copy-Button
    ThemeToggle.tsx                       Dark/Light für Lektionen-Bereich
    lesson.css                            Klassen für interaktive Lessons
  kurse/                                  Handgebaute Lektions-Components
    <thema>/                              Pro Thema ein Unterordner

themen/                                   Thema-Registry (in TypeScript)
  index.ts                                Liste aller Themen
  _platzhalter.ts                         Themen ohne Lektionen (status: kommt-noch)
  <thema>/meta.ts                         Ausgearbeitetes Thema mit Gruppen + Pfaden
  <thema>/quellen.ts                      (optional) wissenschaftliche Quellen

docs/
  architektur.md                          Diese Datei
  prompts/                                Copy-Paste-Templates für neue Chats
  roadmap.md                              Was fertig, was offen, v1.0-Blocker

lib/
  schema.ts                               berechneSchemaLayout() für die Landing

types/index.ts                            Thema, Lektion, Pfad, Kategorie, ...

_legacy/                                  Schlafende Generierungs-Pipeline
                                          (siehe _legacy/README.md)
```

## Datenmodell

```ts
type Thema = {
  slug, titel, kategorie, kurzbeschreibung,
  status: 'kommt-noch' | 'in-arbeit' | 'fertig',
  gruppen: LektionsGruppe[],     // <— die Lektionen, gruppiert
  pfade?: Pfad[],                // <— kuratierte Reihenfolgen
}

type Lektion = {
  slug, titel, icon?, kurzbeschreibung?,
  loader?: () => Promise<{ default: ComponentType }>,  // dynamischer Import
  kommtNoch?: boolean,                                 // noch nicht spielbar
}
```

Lektionen sind echte React-Components, kein HTML-aus-DB. Der Loader wird
in der Lektions-Route dynamisch aufgelöst, das spart Bundle-Size pro
Lektion.

## Visueller Stil

Zwei Welten, die nebeneinander leben:

- **Auge-Frame** (Landing, Thema-Hub, Header) — mystischer Codex:
  dunkler Hintergrund `#06000e`, cyan/purple/gold Akzente, Georgia serif,
  Vignette + Noise-Overlay. Definiert in `globals.css` + CSS-Modules.
- **Lektionen-Scope** (innerhalb `/lektionen/`) — heller, freundlicher
  Lern-Look: Tailwind v4, dark/light per ThemeToggle. Aktiviert über
  `<LessonsScope>`-Wrapper mit `.lessons-scope`-Klasse.

Der Auge-Frame ist absichtlich opinionated und konstant; der Lektions-
Scope ist nüchtern und lesbar, weil dort die Aufmerksamkeit dem Inhalt
gehören soll.

## Wie ein neues Thema entsteht

1. Verzeichnis `themen/<slug>/` anlegen mit `meta.ts`:
   ```ts
   import type { Thema } from '@/types';
   const thema: Thema = {
     slug: '<slug>', titel: '...', kategorie: 'cs',
     kurzbeschreibung: '...', status: 'in-arbeit',
     gruppen: [
       { titel: 'Grundlagen', lektionen: [
         { slug: 'einleitung', titel: 'Was ist X?', icon: '📖',
           loader: () => import('@/components/kurse/<slug>/Einleitung') },
       ]},
     ],
     pfade: [/* optional */],
   };
   export default thema;
   ```
2. Lektions-Components in `components/kurse/<slug>/` ablegen
   (Tailwind + `lesson.css`-Klassen erlaubt).
3. In `themen/index.ts` importieren und in `THEMEN[]` registrieren;
   ggf. aus `_platzhalter.ts` entfernen.

## Übungsaufgaben + KI-Review

Pattern für „wende das Gelernte am eigenen Material an, ohne dass Auge
selbst bewerten muss":

```tsx
<Aufgabe titel="Café mit Schatten" schwierigkeit="leicht" zeit="45 min">
  <p>Beschreibung.</p>
  <AufgabeCheckliste items={['Pflichtelement 1', 'Pflichtelement 2']} />
  <KiReview prompt={`200-300-Wort-Prompt der die Lektions-Konzepte
abfragt und mit "nenn die zwei größten Verbesserungs-Hebel" endet.`} />
</Aufgabe>
```

Mini-Aufgaben (ohne `<KiReview>`) auch zwischen DepthBoxen sinnvoll —
größere Übungsaufgaben oft am Ende des Themas als eigene
„Übungsaufgaben"-Lektion mit 2-3 Aufgaben aufsteigender Schwierigkeit.

Vorbild: `components/kurse/procreate-rendering/Uebungsaufgaben.tsx` und
`components/kurse/neurologie-mmc/Uebungsaufgaben.tsx`.

## Wissenschaftliche Quellen

Jedes Thema kann unter `themen/<slug>/quellen.ts` eine Sammlung
typisierter `Quelle`-Objekte führen (Paper, Buch, RFC, Standard, Blog,
Talk). Im Lektions-Component wird eine Quelle am Ort der Referenz mit
einer `<QuelleBox>`-Infobox eingebettet — sie zeigt Bibliografie plus
vom Autor handgewählte Kernaussagen im Kontext der Aussage.

Datenmodell-Beispiel (Paper):

```ts
{
  id: 'liu2024-lostmiddle',
  typ: 'paper',
  autoren: ['Nelson F. Liu', ...],
  titel: 'Lost in the Middle: ...',
  jahr: 2024,
  venue: 'TACL',
  arxiv: '2307.03172',
}
```

Pro Thema gibt es einen Convenience-Wrapper (z.B.
`components/kurse/rag/RagQuelle.tsx`), der die Quelle per ID auflöst.
Verwendung in einer Lektion:

```tsx
<RagQuelle
  id="liu2024-lostmiddle"
  kernaussagen={[
    'Empirische Studie über 10 LLMs ...',
    'U-förmige Accuracy-Kurve: Pos 1 oder N ≈ 75 %, in der Mitte ≈ 50 % ...',
  ]}
/>
```

Die Kernaussagen sind bewusst pro Verwendung lokal — verschiedene
Lektionen können dieselbe Quelle für unterschiedliche Aspekte zitieren.

## Was es bewusst (noch) nicht gibt

- Keine DB-Schicht. Themen sind Code. Wenn später Nutzer-Fortschritt /
  Notizen / Verwandtschaften kommen, kann OrientDB (siehe `_legacy/`)
  zurückkommen — aber als getrenntes Modell.
- Keine LLM-Pipeline. Stufen-Generierung schläft in `_legacy/`. Falls
  später Lektions-Skelette aus Prompts entstehen sollen, ist das ein
  neues Feature, kein Wiederbeleben.
- Keine globale `/quellen`-Bibliografie-Seite. Quellen leben heute pro
  Thema; eine aggregierte Übersicht (mit "wird zitiert in …") ist eine
  natürliche nächste Iteration.

---

## Additive Architektur — Conflict-Free Contributions

Ein neues Thema soll **ausschließlich neue Dateien** erzeugen, ohne dass
bestehende zentrale Dateien angefasst werden müssen. So entstehen keine
Merge-Konflikte wenn mehrere Contributors gleichzeitig arbeiten.

### Aktueller Stand (manuell, konfliktanfällig)

Jedes neue Thema erfordert Edits in drei zentralen Dateien:

| Datei | Warum angefasst | Konfliktrisiko |
|-------|-----------------|----------------|
| `themen/index.ts` | `import` + Eintrag in `THEMEN[]` | ⚠️ hoch |
| `app/page.tsx` | Icon in `THEMA_ICON` Record | ⚠️ mittel |
| `docs/milestones.md` | Milestone-Eintrag | ℹ️ niedrig |

### Geplante Lösung: Self-Registering Themes

**Schritt 1 — Auto-Discovery in `themen/index.ts`**

Statt manueller Imports: Vite/Next.js `import.meta.glob` scannt den Ordner
automatisch. Ein neues Thema registriert sich durch seine bloße Existenz.

```ts
// themen/index.ts — niemand muss diese Datei mehr anfassen
const modules = import.meta.glob('./*/meta.ts', { eager: true }) as Record<
  string,
  { default: Thema }
>
export const THEMEN: Thema[] = Object.values(modules)
  .map(m => m.default)
  .filter(t => t.status !== 'kommt-noch')
  .sort(/* nach Prio oder Datum */)
```

**Schritt 2 — Icon in `Thema`-Typ + `meta.ts`**

`THEMA_ICON` in `app/page.tsx` entfällt. Stattdessen bekommt `types/index.ts`
ein optionales `icon`-Feld, das in jeder `meta.ts` gepflegt wird:

```ts
// types/index.ts
export interface Thema {
  // ...
  icon?: string  // Emoji für Landing-Karte, z.B. '🪟'
}

// themen/windows/meta.ts
const thema: Thema = {
  slug: 'windows',
  icon: '🪟',
  // ...
}
```

`app/page.tsx` liest dann `thema.icon ?? '📖'` — keine zentrale Map mehr.

### Bis zur Implementierung: Hinweis für Contributors

Wenn du ein Thema hinzufügst, editiere diese drei Dateien **in einem einzigen
Commit**, um den Konflikt-Scope klein zu halten:

1. `themen/index.ts` — Import + Eintrag vor `...PLATZHALTER_THEMEN`
2. `app/page.tsx` — Icon in `THEMA_ICON`
3. Dein neues `themen/<slug>/meta.ts` + `components/kurse/<slug>/`

Rebase auf `main` direkt vor dem PR öffnen — minimiert Konflikt-Fenster.
- Keine i18n. `de` only.
