<!-- NOW: M2 -->

## Backlog
> Unpriorisierte Ideen ohne aktuellen Milestone.

- [ ] /karte: Klick auf ADR-Chip öffnet ADR-Detail in Popup (statt externem Link)
- [ ] auge-Profil im docker-compose (für reine Lokal-Dev)
- [ ] casual-User Submissions-Formular (Thema einreichen)
- [ ] deploy/ von `auge2` auf `auge` umbenennen — systemd-Unit `auge2.service`, nginx `server_name auge2.jeremias-groehl.de`, Pfad `/var/www/auge2`, SSH-Key `auge2_deploy` (deploy/setup.sh, nginx.conf, init.sh, init.ps1, auge2.service). ⚠️ Braucht koordinierte Server-Migration (Unit umbenennen, Pfad umziehen, certbot neu), sonst bricht der Deploy — daher nicht ad-hoc. Public-URL ist bereits `auge.jeremias-groehl.de`.

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

## M3: Landing-Polish
> Landing-Page besser gruppieren und entrümpeln.

- [x] Featured-Grid nach Kategorie gruppieren (Sektions-Header in Kategorie-Farbe, analog KommtNochListe)
- [x] Themen innerhalb der Kategorie nach spielbaren Lektionen sortieren
- [x] ci: kaputtes deploy.yml repariert (0s-Failures auf jedem Push)
- [x] Featured-Karten entlüften: Pfade-Pills entfernt (Pfade-Anzahl bleibt in der Zahlen-Zeile)
- [x] Kompakt-Karten: 3 Spalten statt 2, Pitch auf 2 Zeilen geclampt
- [x] ThemenPie: Donut-Chart der Lektions-Verteilung, Slices + Legende verlinken per Anker auf die Karten
- [x] KI-Blog klickbar: /blog-Index + /blog/[slug]-Artikel (Loader-Pattern), BlogFeed-Karten + CTA verlinkt
- [x] CodeBlock vereinheitlicht: ein geteiltes components/lessons/CodeBlock mit Prism-Highlighting (oneDark), ml-klassifikation + html-css migriert
- [ ] Kryptografie-Lektionen von inline SyntaxHighlighter (oneLight) auf lessons/CodeBlock umziehen
- [ ] Optional: Hero-Reihe — cta1/cta2 als große Karten, Rest kompakt (Variante B)
- [ ] Weitere KI-Blogger-Posts (je einer pro neuem Thema?)
