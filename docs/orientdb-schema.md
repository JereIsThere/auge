# OrientDB – Schema für Auge 2.0

OrientDB ist ein Graphen-/Dokumenten-Hybrid. Für Auge nutzen wir es als
**Wissensgraph**: Themen sind Knoten, Fakten hängen dran, Verwandtschaften
sind Kanten. Das erlaubt später Queries wie „alle Themen, die mit RegEx
verwandt sind und von Denker² abgearbeitet wurden."

---

## Vertex-Klassen (Knoten)

### `Thema`
Ein Lernthema – der zentrale Knoten. Wird vom Generierungsprozess
(Träumer → Denker → Denker²) befüllt.

| Property               | Typ                  | Beschreibung                                    |
|------------------------|----------------------|-------------------------------------------------|
| `slug`                 | STRING (unique)      | URL-freundlicher Bezeichner, z.B. `regex`       |
| `titel`                | STRING               | Anzeigename, z.B. `Reguläre Ausdrücke`          |
| `kategorie`            | STRING               | `cs` · `art` · `math` · `sprache` · `sonstiges`|
| `tags`                 | EMBEDDEDLIST STRING  | Freitext-Tags, z.B. `["python", "text"]`        |
| `status`               | STRING               | Aktueller Generierungsstatus (→ unten)          |
| `stufe1Html`           | STRING               | Träumer-Inhalt als HTML                         |
| `stufe1Zusammenfassung`| STRING               | Kurzzusammenfassung für Kartenvorschau          |
| `stufe1ErstelltAm`     | DATETIME             | Zeitstempel der Stufe-1-Generierung             |
| `stufe2Html`           | STRING               | Denker-Inhalt als HTML                          |
| `stufe2Zusammenfassung`| STRING               |                                                 |
| `stufe2ErstelltAm`     | DATETIME             |                                                 |
| `stufe3Html`           | STRING               | Denker²-Inhalt als HTML                         |
| `stufe3Zusammenfassung`| STRING               |                                                 |
| `stufe3ErstelltAm`     | DATETIME             |                                                 |
| `erstelltAm`           | DATETIME             | Erstellungszeitpunkt                            |
| `aktualisiertAm`       | DATETIME             | Letztes Update (nach jedem Generierungsschritt) |

**Status-Werte:**
```
ausstehend → traumer_laeuft → denker_laeuft → denker2_laeuft → fertig
                                                              ↘ fehler
```

### `Fakt`
Ein atomarer, verifizierbarer Fakt – wird von Denker² nach der Synthese
zurück in die DB geschrieben. Trennung von Fakt und Lerninhalt erlaubt
späteres Abrufen als strukturierte Wissensquelle (z.B. für Flashcards,
Vektordatenbank-Embedding, etc.).

| Property    | Typ      | Beschreibung                             |
|-------------|----------|------------------------------------------|
| `inhalt`    | STRING   | Der Fakt als vollständiger Satz          |
| `quelle`    | STRING   | Optionale Quelle/URL                     |
| `erstelltAm`| DATETIME | Wann Denker² diesen Fakt extrahiert hat  |

---

## Edge-Klassen (Kanten)

### `HatFakt`  (`Thema` → `Fakt`)
Verbindet ein Thema mit seinen gesicherten Fakten.
Einfache gerichtete Kante, keine eigenen Properties.

```sql
CREATE EDGE HatFakt FROM (SELECT FROM Thema WHERE slug = 'regex')
                    TO   (SELECT FROM Fakt   WHERE @rid = #20:0);
```

### `VerwandtMit`  (`Thema` → `Thema`)
Semantische Verwandtschaft zwischen Themen.
Wird zunächst manuell oder von Denker² gesetzt,
später potenziell automatisch via Embedding-Ähnlichkeit.

| Property | Typ    | Beschreibung                               |
|----------|--------|--------------------------------------------|
| `stärke` | FLOAT  | 0–1, wie eng verwandt (optional, TODO)     |
| `grund`  | STRING | Freitext warum verwandt (optional, TODO)   |

---

## Indexes

```sql
-- Pflicht: slug muss eindeutig sein (Routing + Duplikat-Check)
CREATE INDEX Thema.slug ON Thema (slug) UNIQUE;

-- Nützlich für Sortierung/Filterung nach Status
CREATE INDEX Thema.status ON Thema (status) NOTUNIQUE;

-- Nützlich für Kategorie-Abfragen (Schema-Layout-Berechnung)
CREATE INDEX Thema.kategorie ON Thema (kategorie) NOTUNIQUE;
```

---

## Setup-SQL (einmalig ausführen)

```sql
-- Vertex-Klassen
CREATE CLASS Thema EXTENDS V IF NOT EXISTS;
CREATE CLASS Fakt  EXTENDS V IF NOT EXISTS;

-- Edge-Klassen
CREATE CLASS HatFakt     EXTENDS E IF NOT EXISTS;
CREATE CLASS VerwandtMit EXTENDS E IF NOT EXISTS;

-- Properties Thema
CREATE PROPERTY Thema.slug                 STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.titel                STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.kategorie            STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.tags                 EMBEDDEDLIST IF NOT EXISTS;
CREATE PROPERTY Thema.status               STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.stufe1Html           STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.stufe1Zusammenfassung STRING  IF NOT EXISTS;
CREATE PROPERTY Thema.stufe1ErstelltAm    DATETIME  IF NOT EXISTS;
CREATE PROPERTY Thema.stufe2Html           STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.stufe2Zusammenfassung STRING  IF NOT EXISTS;
CREATE PROPERTY Thema.stufe2ErstelltAm    DATETIME  IF NOT EXISTS;
CREATE PROPERTY Thema.stufe3Html           STRING   IF NOT EXISTS;
CREATE PROPERTY Thema.stufe3Zusammenfassung STRING  IF NOT EXISTS;
CREATE PROPERTY Thema.stufe3ErstelltAm    DATETIME  IF NOT EXISTS;
CREATE PROPERTY Thema.erstelltAm          DATETIME  IF NOT EXISTS;
CREATE PROPERTY Thema.aktualisiertAm      DATETIME  IF NOT EXISTS;

-- Properties Fakt
CREATE PROPERTY Fakt.inhalt    STRING   IF NOT EXISTS;
CREATE PROPERTY Fakt.quelle    STRING   IF NOT EXISTS;
CREATE PROPERTY Fakt.erstelltAm DATETIME IF NOT EXISTS;

-- Properties VerwandtMit
CREATE PROPERTY VerwandtMit.stärke FLOAT  IF NOT EXISTS;
CREATE PROPERTY VerwandtMit.grund  STRING IF NOT EXISTS;

-- Indexes
CREATE INDEX Thema.slug      ON Thema (slug)      UNIQUE    IF NOT EXISTS;
CREATE INDEX Thema.status    ON Thema (status)    NOTUNIQUE IF NOT EXISTS;
CREATE INDEX Thema.kategorie ON Thema (kategorie) NOTUNIQUE IF NOT EXISTS;
```

---

## Wichtige Queries

```sql
-- Alle Themen, sortiert nach Erstellungsdatum
SELECT FROM Thema ORDER BY erstelltAm DESC;

-- Ein Thema mit Fakten (traversal)
SELECT *, out('HatFakt') AS fakten
FROM Thema WHERE slug = 'regex';

-- Verteilung nach Kategorie (für Schema-Layout)
SELECT kategorie, count(*) AS anzahl
FROM Thema GROUP BY kategorie ORDER BY anzahl DESC;

-- Alle noch nicht fertigen Themen
SELECT slug, titel, status FROM Thema
WHERE status <> 'fertig' ORDER BY erstelltAm ASC;

-- Verwandte Themen (1 Hop)
SELECT out('VerwandtMit').titel AS verwandte
FROM Thema WHERE slug = 'regex';

-- Fakten eines Themas direkt
SELECT expand(out('HatFakt'))
FROM Thema WHERE slug = 'datenstrukturen-algorithmen';
```

---

## Verbindung zur App

`lib/orientdb.ts` spricht die OrientDB **HTTP REST API** an:

```
POST http://{host}:{port}/query/{database}/sql
Authorization: Basic <base64(user:pass)>
Body: { "query": "SELECT * FROM Thema" }
```

Umgebungsvariablen (in `.env.local` auf dem Server):

```env
ORIENTDB_HOST=localhost
ORIENTDB_PORT=2480
ORIENTDB_DATABASE=auge
ORIENTDB_USERNAME=root
ORIENTDB_PASSWORD=...

# Fallback für lokale Entwicklung ohne DB:
USE_EXAMPLE_DATA=true
```

---

## Gedanken zur Weiterentwicklung

- **Embedding-Index**: Thema-Titel + Fakten-Inhalte als Vektor speichern
  → semantische `VerwandtMit`-Kanten automatisch berechnen
- **Flashcard-Export**: `SELECT FROM Fakt` → Anki-Deck generieren
- **Versionierung**: Statt HTML zu überschreiben, alte Stufen als
  `StufeHistorie`-Vertex archivieren (Denker kann später nochmal iterieren)
- **Multi-Sprache**: `sprache`-Property am Thema für i18n-Inhalte
