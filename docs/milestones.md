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

## [03.06.2026] Neues Thema: HTML & CSS
**Agent:** Claude by Anthropic

### Achievements:
- **Neues Voll-Thema `html-css`** (`status: 'fertig'`, Kategorie `cs`, Icon 🌐) — 13 Lektionen in 3 Pfaden, registriert in `themen/index.ts` und `app/page.tsx`.
- **Grundlagen (5):** Was HTML/CSS sind (interaktive „CSS an/aus"-Demo) · HTML-Grundgerüst & semantische Tags · CSS einbinden + Anatomie einer Regel · **Box-Modell interaktiv** (padding/border/margin-Regler + box-sizing) · **Kaskade/Spezifität interaktiv** (Spezifitäts-Rechner mit konkurrierenden Regeln).
- **Modernes Layout (4):** **Flexbox-Playground** (direction/justify/align/wrap live) · **Grid interaktiv** (Spalten/Gap/Span) · Position & Stacking (interaktiver position-Demo + z-index/Stacking-Context) · **Responsive** mit simuliertem Viewport-Regler.
- **KI-HTML lesen & reparieren (4):** KI-HTML erkennen (Fingerabdrücke) · schnell lesen (Struktur-zuerst-Toggle, DevTools) · **systematisch bugfixen** (interaktive Bug-Galerie der üblichen Verdächtigen + 5-Schritte-Verfahren) · Übungsaufgaben mit KI-Review-Prompts.
- **Neue wiederverwendbare Komponente:** `components/kurse/html-css/CodeBlock.tsx` (dunkler Editor-Look in beiden Themes, Copy-Button) + `html-css.css`.
- **Build verifiziert:** `next build` kompiliert das Thema sauber (alle Lektionen statisch generiert). Hinweis: vorbestehender, themenfremder Build-Blocker in `app/framework/page.tsx` (Link auf nicht existierende Route `/roadmaps`) — unabhängig von diesem Thema.

---
