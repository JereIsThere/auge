# Auge 2 — Gemini Edition

Handkuratiertes Lernportal. Themen → Gruppen → Lektionen, alles in TypeScript-Code (keine DB).

## Core Mandates & Workflow

- **Branching Policy:**
  - Gemini MUST ONLY work on the `gemini` branch.
  - Claude MUST ONLY work on the `claude` branch.
  - Never merge to `main` without explicit user instruction.
- **Mandatory Reading:** Before starting any task, Gemini agents MUST read this file and adhere to the architectural patterns described herein.
- **Tech Stack:** Next.js 15.5 (App Router, standalone), React 19, Tailwind v4 (Lessons), CSS Modules (Auge-Frame), TypeScript strict.

## Verzeichnis-Struktur

- `app/thema/[slug]/lektionen/[lektion]/`: Lektions-Routen.
- `components/lessons/`: Wiederverwendbare UI-Elemente (`DepthBox`, `QuelleBox`, `Aufgabe`, `KiReview`).
- `components/kurse/<thema>/`: Die eigentlichen Lektions-Inhalte.
- `themen/`: Metadaten und Registry.

## Patterns & Komponenten

### DepthBox
Einklappbare Zusatzinfos.
- Varianten: `basic`, `why`, `mistake`, `deeper`, `related`, `history`.

### QuelleBox
Wissenschaftliche Belege.
- Definition in `themen/<thema>/quellen.ts`.
- Nutzung via `components/kurse/<thema>/<Thema>Quelle.tsx`.

### Aufgabe & KiReview
Interaktive Übungen.
- `Aufgabe` mit `schwierigkeit` (`leicht`, `mittel`, `schwer`).
- `KiReview` für KI-basiertes Feedback (Prompt-basiert).

## Entwicklung neuer Lektionen

1. Neue Component in `components/kurse/<thema>/<Name>.tsx`.
2. Lektion in `themen/<thema>/meta.ts` registrieren.
3. Route in `app/thema/[slug]/lektionen/[lektion]/page.tsx` wird automatisch bedient.
