# _legacy/

Generierungs-Pipeline aus Auge 2 (Träumer/Denker/Denker² → OrientDB).
Wird aktuell nicht genutzt — Auge ist auf handkuratierte Lektionen umgestellt.

**Was hier liegt:**
- `app/api/` — REST-Endpunkte für Themen-Erstellung und Statusabfrage
- `app/generieren/` — UI-Form zum Anlegen neuer Themen
- `lib/orientdb.ts` — OrientDB-HTTP-Adapter mit den alten Stufen-Feldern
- `data/example.json` — Seed-Daten für den USE_EXAMPLE_DATA-Modus

**Vom Build ausgeschlossen** via `tsconfig.json` (`exclude: ["_legacy/**"]`).
Der Underscore-Prefix sorgt zusätzlich dafür, dass Next.js diese Verzeichnisse
nicht als App-Router-Routen interpretiert.

**Reaktivierung:** Wenn die Generierungs-Pipeline später als neues Feature
wiederkommen soll (z.B. um Lektionen-Skelette aus einem LLM-Prompt zu
schreiben), würde sie nicht 1:1 reanimiert — das Datenmodell hat sich
inzwischen geändert (`Thema` → Lektionen statt Stufen). Der Code hier ist
eher Referenz als Lift-and-Shift.
