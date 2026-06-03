# Auge 2 — Agent Milestones

Chronologische Liste der Meilensteine, erreicht durch die verschiedenen KI-Agenten.

---

## [01.06.2026] Gemini Integration & Landing Page Refactor
**Agent:** Gemini (Google)

### Achievements:
- **Environment Setup:** Established `GEMINI.md` and `CLAUDE.md` with strict branching and PR mandates.
- **Layout Evolution:** Refactored the Landing Page from a single-column layout to a 2/3 (Main Content) and 1/3 (Live Feed Sidebar) grid.
- **Blog System:** Implemented a new "Live Feed" component with interactive blog articles.
- **Content Creation:** Authored initial blog articles for "Lina Logic" (KI-HTML) and "Marco Matrix" (Windows Basics).
- **Deployment Ready:** Verified build and prepared the `gemini` branch for its first Pull Request.

---

## [03.06.2026] Neues Thema: Windows besser nutzen
**Agent:** Claude by Anthropic

### Achievements:
- **Neues Voll-Thema `windows`** (`status: 'fertig'`, Kategorie `cs`, Icon 🪟) — 9 Lektionen in 3 Pfaden, registriert in `themen/index.ts` und `app/page.tsx`.
- **Tastatur & Fenster (3):** Shortcuts (interaktive, filterbare Übersicht mit Suchfeld) · Fenster & virtuelle Desktops (interaktiver Snap-Layout-Visualizer) · Programme blitzschnell öffnen (Start-Such-Simulator + Win+R-Referenz + Taskleiste).
- **Terminal & PowerShell (4):** CMD/PowerShell/Terminal/WSL klar getrennt · PowerShell-Grundlagen (interaktiver Konsolen-Simulator, Verb-Noun, Aliase) · Navigieren & Dateien verwalten · Pipeline & Praxis (Where/Sort/Select, als Admin, Execution Policy).
- **Power-User & Übung (2):** Eingebaute Power-Tools (Task-Manager, Win+V, Win+Shift+S, PowerToys, winget) · Übungsaufgaben mit KI-Review-Prompts.
- **Neue wiederverwendbare Komponenten:** `Kbd`/`Combo` (Keycaps), `Terminal`/`TerminalSim` (Konsolen-Simulator), `CmdBlock` (kopierbar) + `windows.css` — dunkler Konsolen-Look in beiden Theme-Modi.
- **Inhaltlich korrekt:** echte Shortcuts, Win+R-Befehle und PowerShell-Cmdlets (Verb-Noun, Aliase, Pipeline, -WhatIf-Sicherheit, RemoteSigned).
- **Build verifiziert:** `next build` kompiliert das Thema sauber (alle Lektionen statisch generiert). Hinweis: weiterhin vorbestehender, themenfremder Build-Blocker in `app/framework/page.tsx` (Link auf nicht existierende Route `/roadmaps`).

---
