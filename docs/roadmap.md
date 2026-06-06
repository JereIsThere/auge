# Auge 2 — Roadmap

Lebendes Dokument. Jeder PR pflegt hier mit.

---

## ✅ Done (chronologisch)

- **PR #14** — Architektur-Skelett: handkuratierte Lektionen-Architektur, OrientDB nach `_legacy/`
- **PR #14** — Kryptografie portiert (22 Lektionen, 3 Pfade)
- **PR #14** — RAG-Starter (3 Lektionen)
- **PR #14** — MCP-Starter (3 Lektionen)
- **PR #15** — RAG-Vertiefung auf 11 Lektionen + Tailwind-Layer-Fix
- **PR #16** — RAG: 11 wissenschaftliche Quellen mit `<QuelleBox>` an zentralen Stellen
- **PR #17** — Landing-Rework Variante C (Featured + Kommt-noch-Bereich) + Aquarell-Starter
- **PR #18** — Redeploy-Fix (workflow_dispatch, gitignore für `.commit_msg.txt`)
- **PR #19** — Procreate-Rendering-Starter (3 Lektionen)
- **PR #20** — Procreate-Rendering-Vertiefung auf 12 Lektionen, 3 Pfade
- **PR #21** — Neurologie & MMC Starter (3 Lektionen)
- **PR #22** — Übungsaufgaben-Pattern (Aufgabe + KiReview Components) + Procreate-Übungslektion
- **PR #23** — Neurologie & MMC Vertiefung auf 13 Lektionen + Ergo-Übungsaufgaben
- **PR #25** — MCP-Vertiefung auf 12 Lektionen, 4 Pfade (Einstieg · Primitives · Unter der Haube · Sicherheit & Übung) + Sampling-Bonus + Übungsaufgaben mit KI-Review
- **PR #26** — Aquarell-Vertiefung auf 11 Lektionen, 4 Pfade + Übungsaufgaben mit KI-Review
- **Claude (Session 2026-06-06)** — Kryptografie: wissenschaftliche Quellen (RFCs, NIST FIPS) + Übungsaufgaben mit KI-Review

---

## 🚧 In progress / wartet auf Arbeit

### v1.0-Blocker

_keine offen — alle Kern-Themen sind ausgebaut. v1.0 ist erreicht._

### v1.1-Nice (nach v1.0)

- **Globale `/quellen`-Seite** — alle Quellen aggregiert, durchsuchbar, mit „wird zitiert in [Lektion X, Y]". Brauchen neue Route + Aggregations-Logik. Größe: 1 Session.
- **RAG-Übungsaufgaben** — „Bau ein Mini-RAG mit X Dokumenten + diesen Queries". Größe: 1 Session. *(in Arbeit)*
- **BibTeX-Export pro Quelle** — kleiner Button in `<QuelleBox>` → BibTeX im Clipboard. Größe: kleine Aufgabe.

### Sonstiges

- **Vorhandene Themen ohne Lektionen** — RegEx, DSA, TensorFlow, Git, Docker, Linux-CLI, LaTeX, Figurzeichnen, Lineare Algebra. Aktuell als Kommt-noch-Stubs sichtbar. Priorisierung offen — je nach Lust.

---

## 🐛 Kleine Aufgaben (gut für Sessions mit wenig Tokens)

- **Lektions-Inhalt fixen** wenn beim Live-Test was komisch wirkt (Tippfehler, falsches Beispiel, kaputtes SVG)
- **Quelle in einer bestehenden RAG-Lektion ergänzen** — eine weitere Quelle definieren + an passender Stelle einbauen
- **Pfade einer Lektion umsortieren** — wenn ein Pfad sich nicht rund anfühlt
- **Themen-Icon ändern** in `app/page.tsx` `THEMA_ICON`
- **Mini-Aufgabe** in einer bestehenden Lektion einbauen (siehe Lichtkugel-Apfel-Studie als Vorbild)

---

## 💡 Ideen (noch nicht eingeplant)

- **User-Fortschritt** (z.B. „gelesen"-Marker) — würde DB oder localStorage brauchen, größerer Umbau
- **Theme-Suchfunktion** — durch alle Lektionen suchen
- **Print-View** pro Lektion — für Lernen offline
- **i18n** — aktuell `de` only; Englisch wäre v2.x
- **Krypto-Lektionen in Quellen-Pattern überführen** — manche referenzieren schon Standards, formal als `<QuelleBox>` schöner
- **Generierungs-Pipeline reanimieren** — aus `_legacy/` zurückholen, aber neu konzipieren als „LLM schreibt Skelett, du verfeinerst"

---

## Wie diese Roadmap gepflegt wird

Jeder PR sollte am Ende den entsprechenden Eintrag in **Done** ergänzen und ggf. einen Punkt aus **In progress** entfernen oder die Beschreibung aktualisieren. Neue Ideen kommen unter **Ideen**, bevor sie konkret werden — und steigen auf in **In progress** sobald sie eingeplant sind.
