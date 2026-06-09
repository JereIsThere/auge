<!-- NOW: M2 -->

## Backlog
> Unpriorisierte Ideen ohne aktuellen Milestone.

- [ ] /karte: Klick auf ADR-Chip öffnet ADR-Detail in Popup (statt externem Link)
- [ ] auge-Profil im docker-compose (für reine Lokal-Dev)
- [ ] casual-User Submissions-Formular (Thema einreichen)

## M1: Karte + Infrastruktur
> /karte, EcoNode-Interface, Health-Dots, ADR-Chips + Kontext-Panel, Docker + Auto-Deploy.

- [x] /karte — interaktive SVG-Karte des Ökosystems
- [x] ecosystem.ts — EcoNode mit adrs[], healthId, context[], areas[]
- [x] lib/adrs.ts — GitHub-API ADR-Metadaten
- [x] lib/service-health.ts — Health-Dots (Hand/Gehirn/Funkner)
- [x] ADR-Chips im Popup (Phase 1)
- [x] Collapsible Kontext-Panel im Popup (Phase 2)
- [x] Dockerfile (standalone Next.js, multi-stage)
- [x] notify-framework.yml → Auto-Deploy via auge-framework

## M2: Roadmaps-Seite
> Einbettung der aggregierten Repo-Roadmaps als ISR-Seite in auge.

- [ ] /roadmaps — reads from hand API (/api/roadmaps/github)
- [ ] Visualisierung der 4 Repo-Roadmaps auf auge
- [ ] Link von /karte-Node auf /roadmaps
