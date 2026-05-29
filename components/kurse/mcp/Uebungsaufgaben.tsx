import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_TOOL_SCHEMA = `Du bist Senior-MCP-Engineer und gibst freundliches,
strukturiertes Feedback zu Tool-Schema-Entwürfen.

ICH ÜBE: Tool-Design für MCP-Server. Speziell: wie definiert man ein
Tool so, dass ein LLM es zuverlässig und sicher aufrufen kann.

AUFGABE: Ich habe für einen Use-Case ein oder mehrere Tool-Definitionen
entworfen — mit Name, description, inputSchema (JSON-Schema) und
geplantem Verhalten. Mein Entwurf folgt.

BITTE BEWERTE MEIN DESIGN AUF:
1. Naming — sind die Tool-Namen aussagekräftig, snake_case, eindeutig?
   Erkennt ein LLM auf einen Blick, was sie tun?
2. Description — beschreibt sie für ein LLM (nicht für einen Menschen)
   was das Tool tut, WANN es zu nutzen ist, und welche Fallstricke
   existieren? Oder ist sie nur eine Zeile copy/paste?
3. Schema-Strenge — sind alle required-Felder als required markiert?
   Sind Enums/Bounds/Patterns gesetzt, wo sinnvoll? Oder läuft alles
   als freier String?
4. Idempotenz / Side Effects — ist sichtbar, ob das Tool schreibend
   ist? Würde ein Client wissen, dass User-Confirmation nötig ist?
5. Granularität — ist das Tool richtig zugeschnitten? Zu fein
   (1000 Calls für eine Aufgabe) oder zu grob (ein Tool das 5 Sachen
   gleichzeitig macht)?
6. Fehlerverhalten — was passiert bei ungültigen Inputs? Wirft das
   Tool spezifische Fehler-Codes/Messages, an denen das LLM lernen
   kann?

Gib mir am Ende die ZWEI größten Verbesserungs-Hebel — die, die am
meisten Wirkung pro Aufwand bringen würden.`;

const PROMPT_MINI_SERVER = `Du bist Senior-MCP-Engineer und reviewst
freundlich und konkret das Code-Setup von Lernenden.

ICH ÜBE: Einen minimalen MCP-Server bauen (Python FastMCP oder
TypeScript SDK). Der Server soll mindestens ein Tool und optional eine
Resource anbieten und im Inspector funktionieren.

AUFGABE: Mein Server-Code folgt (alle Files, inkl. Manifest/
Dependencies/Config). Erkläre dabei zu Beginn, in welcher Sprache du
reviewst.

BITTE BEWERTE:
1. Setup-Korrektheit — Dependencies stimmig, Versions-Pinning sinnvoll,
   Entrypoint richtig?
2. Tool-Implementierung — Schema und Handler konsistent? Type-
   Annotations vorhanden? Fehler-Pfade abgedeckt?
3. Stdio-Hygiene — gibt es print()/console.log auf stdout (was die
   Verbindung crasht)? Logging korrekt auf stderr?
4. Resource-Implementation (falls vorhanden) — URI sinnvoll? MIME-Type
   korrekt? Inhalts-Auflieferung gecacht oder Live?
5. Error-Handling — was passiert bei kaputten Inputs? Bei Network-
   Fails (falls relevant)? Bei nicht-existenter Resource?
6. Sicherheits-Check — welche Daten leaks/Side Effects sind möglich,
   die ich nicht abgedeckt habe?

Nenne mir am Ende: 1 konkrete Inspector-Anweisung zum Testen meines
Servers (welcher Tool-Call mit welchen Args, was sollte rauskommen),
1 wahrscheinlichste Fehlerquelle, die ich übersehe.`;

const PROMPT_SICHERHEITS_AUDIT = `Du bist Senior-Security-Engineer mit
Fokus auf MCP-Setups und gibst freundliches, präzises, kritisches
Audit-Feedback.

ICH ÜBE: Ein bestehendes MCP-Setup auf Sicherheitslücken zu auditieren
— mit Fokus auf Prompt Injection und Confused Deputy.

AUFGABE: Ich habe einen Setup-Plan beschrieben (welcher Server, welche
Tools, welche Berechtigungen, welche Use-Cases) und meinen Audit-
Bericht skizziert. Beides folgt.

BITTE BEWERTE MEINEN AUDIT-BERICHT:
1. Confused-Deputy-Analyse — habe ich die User-Rechte mit den Server-
   Rechten verglichen? Sind die Asymmetrien identifiziert? Habe ich
   beschrieben, wer im konkreten Tool-Call welche Identität nutzt?
2. Prompt-Injection-Oberflächen — habe ich alle Tool-Results
   identifiziert, die Daten aus nicht-vertrauenswürdigen Quellen
   ziehen (E-Mails, Issues, Web, gemeinsame Files)? Habe ich
   beschrieben, was passieren könnte?
3. Schutz-Maßnahmen — sind meine Empfehlungen konkret (z.B. „Server
   muss OAuth-Token durchreichen") oder vage (z.B. „bessere
   Sicherheit einbauen")? Welche Maßnahmen fehlen?
4. Priorisierung — habe ich die Risiken nach Likelihood × Impact
   eingeordnet? Oder behandle ich alle gleich?
5. Was übersehe ich — welche Angriffs-Vektoren habe ich nicht
   bedacht? (Side-Channel, Tool-Squatting, Server-Updates, etc.)

Spiel danach kurz Advocatus Diaboli: Was wäre das beste Argument
GEGEN meine wichtigste Empfehlung — z.B. operativ unrealistisch,
zu teuer, kein realer Bedrohungs-Pfad?`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben für MCP-Praxis</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Tiefe. Sie führen durch die drei Rollen,
        die du im Umgang mit MCP einnehmen kannst: <em>Designer</em> (Tool-
        Schema entwerfen), <em>Builder</em> (Server tatsächlich aufsetzen)
        und <em>Auditor</em> (existierendes Setup auf Sicherheit prüfen).
        Jede Aufgabe hat einen <strong>KI-Review-Prompt</strong>, der gezielt
        die Konzepte der vorherigen Lektionen abfragt.
      </p>

      <div className="info-box">
        <strong>So bekommst du am meisten raus:</strong> Mach die Aufgabe
        zuerst <em>komplett ohne</em> KI-Hilfe. Schreib deinen Entwurf, Code
        oder Audit-Bericht. Dann kopierst du den Prompt, hängst deinen Text
        dran, und kriegst strukturiertes Feedback. Erst danach: zwei
        wichtigste Hinweise einarbeiten — nicht alle, sonst lernst du nur,
        wie die KI denkt.
      </div>

      <Aufgabe titel="Aufgabe 1 — Tool-Schema entwerfen" schwierigkeit="leicht" zeit="45 min">
        <p>
          Wähl einen Use-Case aus deinem Alltag und entwirf das passende
          Tool-Set für einen MCP-Server. Beispiele:
        </p>
        <ul style={{ margin: "8px 0", paddingLeft: 20, fontSize: "0.9rem" }}>
          <li>Kalender-Server: Termine listen, anlegen, verschieben</li>
          <li>Notiz-Server (z.B. Obsidian): Notes finden, lesen, neue anlegen</li>
          <li>Home-Assistant-Server: Geräte schalten, Status abfragen</li>
          <li>Dein eigenes API-Backend für irgendetwas</li>
        </ul>
        <p>
          Liefere für 2-4 Tools jeweils Name, description (so wie das LLM sie
          sehen wird), JSON-Schema der Inputs und ein Beispiel-Aufruf.
        </p>
        <AufgabeCheckliste
          items={[
            "Mindestens 2 Tools, maximal 4",
            "Pro Tool: name (snake_case), description, inputSchema",
            "Mindestens ein Tool mit Side Effects (schreibend)",
            "Mindestens ein required-Feld pro Tool",
            "Mindestens ein Enum oder Pattern im Schema",
            "Ein Beispiel-Aufruf pro Tool (was würde das LLM produzieren?)",
          ]}
        />
        <KiReview prompt={PROMPT_TOOL_SCHEMA} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — Minimal-Server bauen" schwierigkeit="mittel" zeit="2 h">
        <p>
          Setz einen wirklich funktionierenden MCP-Server auf. Sprache deiner
          Wahl (Python oder TypeScript). Folge den 7 Schritten aus der
          Server-Bauen-Lektion. Ziel: mindestens ein Tool, das im Inspector
          aufrufbar ist und ein sinnvolles Ergebnis zurückgibt.
        </p>
        <AufgabeCheckliste
          items={[
            "Projekt-Setup (pyproject.toml oder package.json) committet",
            "Mindestens 1 Tool, mit JSON-Schema und Handler",
            "Optional: 1 Resource mit URI und Reader",
            "Logging auf stderr — kein einziges print() auf stdout",
            "Funktioniert im Inspector (Screenshot oder Logs)",
            "Optional bonus: in Claude Desktop eingehängt und genutzt",
            "README mit Setup-Anleitung",
          ]}
        />
        <KiReview prompt={PROMPT_MINI_SERVER} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — Sicherheits-Audit eines Setups" schwierigkeit="schwer" zeit="1.5 h">
        <p>
          Wähl ein MCP-Setup, das du auditierst — entweder deinen eigenen
          Server aus Aufgabe 2, oder ein fertiges Setup (z.B. Filesystem-
          Server + Postgres-Server + GitHub-Server in einem Claude Desktop).
          Schreib einen Audit-Bericht.
        </p>
        <AufgabeCheckliste
          items={[
            "Identifiziere alle Server, deren Tools und deren Backend-Rechte",
            "Pro Server: User-Rechte vs Server-Rechte (Confused-Deputy-Check)",
            "Pro Tool: kann der Tool-Output Daten aus nicht-vertrauenswürdigen Quellen enthalten? (Prompt-Injection-Check)",
            "Pro identifiziertem Risiko: konkrete Mitigation (User-Confirm, OAuth-Token-Durchreichen, Output-Filtern, etc.)",
            "Priorisierung der Risiken nach Likelihood × Impact",
            'Optional: ein Angriffs-Szenario in der Form „so würde ein Angreifer es ausnutzen, Schritt für Schritt".',
          ]}
        />
        <KiReview prompt={PROMPT_SICHERHEITS_AUDIT} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> du hast den
        kompletten Lifecycle einmal durchlaufen — vom Konzept-Design über
        die Implementierung bis zur Sicherheits-Bewertung. Das ist mehr als
        viele, die MCP-Server in Produktion betreiben. Mach Aufgabe 2 in
        zwei Wochen nochmal mit einem neuen Use-Case und vergleiche, was
        diesmal schneller geht.
      </div>
    </div>
  );
}
