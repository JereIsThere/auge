"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Schritt = {
  id: string;
  rolle: "client" | "server" | "modell" | "nutzer";
  titel: string;
  detail: string;
  payload?: string;
};

const FLOW: Schritt[] = [
  {
    id: "0",
    rolle: "nutzer",
    titel: "Nutzer schreibt eine Anfrage",
    detail:
      'Im Chat-Client tippt der Nutzer z.B. „Erstell mir ein GitHub-Issue für den Bug, den wir gerade besprochen haben."',
  },
  {
    id: "1",
    rolle: "client",
    titel: "Client fragt: tools/list",
    detail:
      "Der MCP-Client (z.B. Claude Desktop) hat zur Startzeit alle angebundenen Server nach ihren Tools gefragt.",
    payload: '{ "method": "tools/list" }',
  },
  {
    id: "2",
    rolle: "server",
    titel: "Server antwortet mit Tool-Schemata",
    detail:
      "Jeder Server schickt eine Liste mit Tool-Name, Beschreibung und JSON-Schema der Parameter.",
    payload:
      '[\n  {\n    "name": "create_issue",\n    "description": "Create a GitHub issue …",\n    "inputSchema": { "type": "object",\n      "properties": { "repo": …, "title": …, "body": … }\n    }\n  }\n]',
  },
  {
    id: "3",
    rolle: "modell",
    titel: "Modell wählt das passende Tool",
    detail:
      "Das LLM bekommt im System-Prompt die Tool-Liste und entscheidet sich für create_issue. Es generiert die Parameter im erwarteten JSON-Format.",
    payload:
      '{ "tool": "create_issue",\n  "arguments": {\n    "repo": "JereIsThere/auge",\n    "title": "Krypto-Lektion: Caesar reagiert nicht",\n    "body": "Beim Verschieben des Sliders …"\n  }\n}',
  },
  {
    id: "4",
    rolle: "client",
    titel: "Client ruft tools/call",
    detail:
      "Der Client schickt die Tool-Wahl an den richtigen Server. Vorher: ggf. Nutzer-Bestätigung (z.B. bei schreibenden Operationen).",
    payload:
      '{ "method": "tools/call",\n  "params": {\n    "name": "create_issue",\n    "arguments": { … }\n  }\n}',
  },
  {
    id: "5",
    rolle: "server",
    titel: "Server führt aus, gibt Ergebnis zurück",
    detail:
      "Der Server macht den echten API-Call (in diesem Fall an die GitHub-API) und liefert ein Content-Array zurück.",
    payload:
      '{ "content": [\n  { "type": "text",\n    "text": "Issue #42 erstellt: https://github.com/…" }\n] }',
  },
  {
    id: "6",
    rolle: "modell",
    titel: "Modell baut die Endantwort",
    detail:
      "Das LLM nimmt das Ergebnis und formuliert eine natürliche Antwort an den Nutzer.",
  },
  {
    id: "7",
    rolle: "nutzer",
    titel: "Nutzer sieht die Antwort",
    detail:
      '"Ich habe Issue #42 in JereIsThere/auge erstellt: https://github.com/…"',
  },
];

const ROLLEN_FARBE: Record<Schritt["rolle"], string> = {
  nutzer: "#94a3b8",
  client: "#3b82f6",
  modell: "#a855f7",
  server: "#10b981",
};

const ROLLEN_LABEL: Record<Schritt["rolle"], string> = {
  nutzer: "Nutzer",
  client: "Client",
  modell: "Modell",
  server: "MCP-Server",
};

export default function ToolCallFlow() {
  const [aktiv, setAktiv] = useState(0);

  return (
    <div className="lesson-card">
      <h2>Ein Tool-Call von Anfang bis Ende</h2>
      <p className="lesson-description">
        Wenn ein LLM ein MCP-Tool benutzt, kommunizieren vier Akteure
        miteinander: Nutzer, MCP-Client, LLM und MCP-Server. Klick durch die
        Schritte, um zu sehen wer wann was sagt.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FLOW.map((s, i) => {
          const isActive = i === aktiv;
          const isDone = i < aktiv;
          const farbe = ROLLEN_FARBE[s.rolle];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setAktiv(i)}
              className={`flow-step ${isActive ? "active" : isDone ? "done" : ""}`}
              style={{
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
                borderLeft: `4px solid ${farbe}`,
              }}
            >
              <div className="flow-step-num">{i + 1}</div>
              <div className="flow-step-body">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="pill"
                    style={{
                      borderColor: farbe,
                      color: farbe,
                      background: "transparent",
                    }}
                  >
                    {ROLLEN_LABEL[s.rolle]}
                  </span>
                  <div className="flow-step-title">{s.titel}</div>
                </div>
                {isActive && (
                  <>
                    <div className="flow-step-desc" style={{ marginTop: 6 }}>
                      {s.detail}
                    </div>
                    {s.payload && (
                      <pre
                        className="mono"
                        style={{
                          marginTop: 8,
                          fontSize: "0.8rem",
                          background: "#f3f4f6",
                          padding: "10px 12px",
                          borderRadius: 6,
                          whiteSpace: "pre-wrap",
                          overflowX: "auto",
                        }}
                      >
                        {s.payload}
                      </pre>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          className="toggle-code"
          onClick={() => setAktiv((a) => Math.max(0, a - 1))}
          disabled={aktiv === 0}
        >
          ← zurück
        </button>
        <button
          type="button"
          className="toggle-code"
          onClick={() => setAktiv((a) => Math.min(FLOW.length - 1, a + 1))}
          disabled={aktiv === FLOW.length - 1}
        >
          weiter →
        </button>
      </div>

      <DepthBox variant="why" title="Warum nicht das Modell direkt mit dem Server reden lassen?">
        Das LLM ist ein Textgenerator — es kann nicht von sich aus
        HTTP-Requests senden. Es schreibt nur das &bdquo;Ich-möchte-dieses-Tool-mit-diesen-Argumenten&ldquo;-JSON.
        Der Client ist der Adapter, der das in einen echten Aufruf übersetzt.
        Vorteil: alle Sicherheits-Checks (Berechtigungen, Nutzer-Bestätigung)
        leben im Client, nicht im Modell.
      </DepthBox>

      <DepthBox variant="mistake" title="Confused Deputy">
        Klassisches Risiko: Der MCP-Server hat <em>mehr</em> Berechtigungen
        als der Nutzer denkt, und das LLM ruft ihn unbeabsichtigt mit
        gefährlichen Argumenten auf (per Prompt Injection im Tool-Ergebnis).
        Daher: Tool-Aufrufe mit Side Effects sollten User-Confirmation
        einholen, bevor sie ausgeführt werden.
      </DepthBox>

      <DepthBox variant="deeper" title="Roundtrips minimieren">
        Bei vielen kleinen Tool-Calls explodiert die Latenz. Best practice:
        Tools mit <em>batch</em>-fähigen Argumenten anbieten (eine
        SQL-Query statt zehn Row-Fetches), und <em>parallel</em> aufrufbar
        machen — der Client kann mehrere tools/call gleichzeitig schicken.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        OpenAI Function-Calling (das gleiche Pattern, aber proprietär und
        ohne den Server-Teil), JSON-RPC (das MCP-Wire-Format), und
        Agent-Loops (der Client wartet auf Tool-Result und ruft das Modell
        erneut auf — bis es keine weiteren Tools mehr will).
      </DepthBox>
    </div>
  );
}
