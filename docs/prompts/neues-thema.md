# Prompt — neues Thema

Copy-paste in einen neuen Chat. Felder in `<>` ersetzen.

---

Baue ein neues Thema für Auge 2:

- **Slug:** `<slug-mit-bindestrichen>` (URL-tauglich)
- **Titel:** `<Anzeigename>`
- **Kategorie:** `cs | art | math | sprache | sonstiges`
- **Icon:** `<Emoji>` (für Landing-Card)
- **Kurzbeschreibung (1 Satz):** `<…>`
- **Beschreibung (2-3 Sätze für Hub):** `<…>`

3 Starter-Lektionen (im Stil von Aquarell oder MCP — Einleitung + 2 interaktive):

1. **<Lektions-Titel 1>** — Stichpunkte was rein soll, was interaktiv sein könnte
2. **<Lektions-Titel 2>** — Stichpunkte
3. **<Lektions-Titel 3>** — Stichpunkte

Geplante Folge-Lektionen (als `kommtNoch`-Stubs, 4-8 Stück) — gerne nur Titel + Kurzbeschreibung pro Stub:
- ...
- ...

Standard-Pattern wie in `auge-2/CLAUDE.md` beschrieben. Build prüfen, PR aufmachen, selber mergen und Deploy triggern. Falls Deploy nicht automatisch läuft: `gh workflow run "Deploy Auge 2.0" --ref main`.

Repo-Worktree liegt unter:
`C:\Users\jgroehl\Desktop\claude-projects\.claude\worktrees\epic-montalcini-ed3684\auge-2`

(oder im Hauptcheckout — frag im Zweifel mit `git worktree list`)
