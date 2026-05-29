# Prompt — Thema-Vertiefung

Copy-paste in einen neuen Chat. Felder in `<>` ersetzen.

---

Bau das Thema `<slug>` in Auge 2 komplett aus — alle aktuellen `kommt-noch`-Stubs zu echten interaktiven Lektionen machen.

Vorbild: wie Procreate-Rendering oder Neurologie/MMC vorher ausgebaut wurde.

Pro Lektion:
- Wo möglich echte Interaktivität (Slider, SVG, Multi-State) — siehe Patterns in `auge-2/CLAUDE.md`
- Sonst DepthBox-getrieben mit klarem `why / mistake / deeper / related` (+ optional `history`)
- ~150-220 Zeilen, kompakt aber inhaltsreich

Optional dazu (sag mir was du willst):
- **Übungsaufgaben-Lektion** am Ende mit `<Aufgabe>` + `<KiReview>` (3 Aufgaben aufsteigender Schwierigkeit, jede mit maßgeschneidertem KI-Review-Prompt)
- **Pfade erweitern** — wenn das Thema jetzt mehr Lektionen hat, evtl. mehrere thematische Pfade (Einstieg / Vertiefung / Praxis) statt einem
- **Wissenschaftliche Quellen** unter `themen/<slug>/quellen.ts` + `<XQuelle>`-Wrapper, an zentralen Stellen eingebaut

Standard-Pattern wie in `auge-2/CLAUDE.md` beschrieben. Build prüfen, PR aufmachen, selber mergen und Deploy triggern. Falls Deploy nicht automatisch läuft: `gh workflow run "Deploy Auge 2.0" --ref main`.

Repo-Worktree:
`C:\Users\jgroehl\Desktop\claude-projects\.claude\worktrees\epic-montalcini-ed3684\auge-2`
