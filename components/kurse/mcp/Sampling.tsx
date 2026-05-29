"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Schritt = {
  id: number;
  rolle: "server" | "client" | "modell" | "nutzer";
  titel: string;
  detail: string;
  payload?: string;
};

const FLOW: Schritt[] = [
  {
    id: 0,
    rolle: "server",
    titel: "Server steht vor einer Aufgabe, die ein LLM braucht",
    detail:
      "Ein File-Indexer-Server soll für jede neue Markdown-Datei eine Zusammenfassung erzeugen. Statt selbst ein LLM zu hosten, bittet er den Client.",
  },
  {
    id: 1,
    rolle: "server",
    titel: "Server schickt sampling/createMessage",
    detail:
      "Der Server schickt eine Anfrage mit Messages, modelHints und maxTokens an den Client. Der Server kann ein bestimmtes Modell anregen, der Client entscheidet aber selbst.",
    payload:
      '{ "method": "sampling/createMessage",\n  "params": {\n    "messages": [\n      { "role": "user", "content": {\n        "type": "text",\n        "text": "Fasse zusammen: …" } }\n    ],\n    "modelPreferences": {\n      "hints": [{ "name": "claude-3-5-haiku" }],\n      "costPriority": 0.6,\n      "speedPriority": 0.8\n    },\n    "maxTokens": 200\n  }\n}',
  },
  {
    id: 2,
    rolle: "client",
    titel: "Client zeigt Nutzer-Confirmation",
    detail:
      "Der Client erkennt: hier will ein Server LLM-Inferenz auslösen — das kostet Geld und Aufmerksamkeit. Default: Nutzer-Confirm einholen, optional whitelisten.",
  },
  {
    id: 3,
    rolle: "client",
    titel: "Client wählt Modell + ruft LLM",
    detail:
      "Der Client schaut auf modelHints, mappt sie auf das, was er zur Verfügung hat, und feuert eine echte LLM-Inferenz. Der Server sieht nichts davon, kennt das Modell ggf. gar nicht.",
  },
  {
    id: 4,
    rolle: "modell",
    titel: "LLM antwortet",
    detail:
      "Das Modell generiert die Antwort. Der Client kann sie noch filtern (z.B. PII rausfiltern), bevor sie an den Server zurückgeht.",
  },
  {
    id: 5,
    rolle: "client",
    titel: "Client schickt Ergebnis zurück",
    detail:
      "Per JSON-RPC-Response. Der Server kriegt das, was das Modell gesagt hat — keine Token-Counts, keine Internals.",
    payload:
      '{ "result": {\n    "role": "assistant",\n    "content": {\n      "type": "text",\n      "text": "Drei-Satz-Zusammenfassung …"\n    },\n    "model": "claude-3-5-haiku-20241022",\n    "stopReason": "endTurn"\n  }\n}',
  },
  {
    id: 6,
    rolle: "server",
    titel: "Server nutzt die Antwort",
    detail:
      "Der File-Indexer speichert die Zusammenfassung in seiner DB und meldet sich erst dann zurück, wenn der nächste Tool-Call kommt.",
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

export default function Sampling() {
  const [aktiv, setAktiv] = useState(0);

  return (
    <div className="lesson-card">
      <h2>Sampling — die Rück-Richtung</h2>
      <p className="lesson-description">
        Bislang ging der Pfeil immer in eine Richtung: Client → Server. Sampling
        dreht ihn um — der <em>Server</em> fragt den Client, ob er für ihn das
        LLM laufen lassen würde. Eine elegante Lösung, die LLM-Kosten an einer
        Stelle bündelt und Server LLM-frei lässt.
      </p>

      <div className="info-box">
        <strong>Warum überhaupt?</strong> Stell dir vor, ein MCP-Server für
        ein Bug-Tracker-System will ankommende Tickets klassifizieren. Er
        bräuchte dafür ein LLM — aber dann müsste der Server-Anbieter eigene
        API-Keys verwalten, eigene Inferenz-Kosten tragen. Mit Sampling sagt
        er stattdessen: &bdquo;hey Client, lass mich kurz dein LLM nutzen, hier
        sind die Messages.&ldquo;
      </div>

      <h3>Der Flow</h3>
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

      <h3 style={{ marginTop: 24 }}>Was modelPreferences bedeutet</h3>
      <ul className="step-list">
        <li>
          <strong>hints</strong> — Name-Patterns („claude-3-5", „gpt-4"), die
          der Server gerne hätte. Der Client mappt sie auf das, was er hat.
        </li>
        <li>
          <strong>costPriority</strong> (0..1) — wie wichtig ist günstig?
          Hoch = nimm das billigste Modell, das die Aufgabe wahrscheinlich
          schafft.
        </li>
        <li>
          <strong>speedPriority</strong> (0..1) — wie wichtig ist schnell?
        </li>
        <li>
          <strong>intelligencePriority</strong> (0..1) — wie wichtig ist
          Schärfe? Hoch = nimm das größte Modell, das du hast.
        </li>
      </ul>
      <p style={{ fontSize: "0.9rem", color: "#475569" }}>
        Der Client gewichtet das alles und entscheidet selbst — ein Server hat
        keinen Anspruch auf ein bestimmtes Modell.
      </p>

      <DepthBox variant="why" title="Warum nicht einfach selbst ein LLM laufen lassen?">
        Drei Gründe. <strong>Kosten:</strong> ein Server für 1000 Nutzer
        müsste 1000 Inferenz-Kontingente haben — der Client hat eines.{" "}
        <strong>Schlüssel-Verwaltung:</strong> jeder Server bräuchte eigene
        API-Keys, eigene Abrechnung. <strong>Konsistenz:</strong> der Nutzer
        hat sich für ein Modell entschieden (Claude, GPT, lokal); der Server
        soll diese Wahl respektieren statt ein zweites Modell ins Spiel zu
        bringen.
      </DepthBox>

      <DepthBox variant="mistake" title="Sampling ohne Nutzer-Sichtbarkeit">
        Ein Server könnte 100 sampling/createMessage-Calls hintereinander
        schicken und stille Kosten produzieren. Ein guter Client zeigt jede
        Sampling-Anfrage zumindest als Counter („3 Sampling-Calls seit
        Verbindung") — bei sensiblen Domains besser als Modal mit Approval.
        Ohne diese Bremse hat ein bösartiger Server eine Hebelwirkung auf den
        Geldbeutel des Nutzers.
      </DepthBox>

      <DepthBox variant="deeper" title="Wann statt eigenem LLM, wann nicht">
        Sampling lohnt sich für <em>kontextbezogene</em> Inferenz — der
        Server hat Kontext, den der Client nicht hat (z.B. Tickets, DB-Zeilen).
        Sampling lohnt sich <em>nicht</em>, wenn der Server eine sehr
        spezifische Inferenz braucht (z.B. fine-tuned auf seine Domain) — da
        ist eigenes Hosting besser. Heuristik: General-Purpose-Aufgabe →
        Sampling. Spezial-Aufgabe → eigenes Modell.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Confused Deputy (Sampling kann auch missbraucht werden — der Server
        könnte versuchen, durch geschickte Messages den Nutzer-Loop zu
        manipulieren), Token-Kosten-Management (Client-seitige Caps pro Server
        sind eine bewährte Schutzmaßnahme), und Roots (das andere
        Server→Client-Primitive — Server kann den Client nach erlaubten
        Filesystem-Pfaden fragen).
      </DepthBox>
    </div>
  );
}
