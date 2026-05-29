"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type MessageTyp = "request" | "response" | "error" | "notification";

type Beispiel = {
  titel: string;
  typ: MessageTyp;
  payload: string;
  erklaerung: string;
};

const BEISPIELE: Beispiel[] = [
  {
    titel: "Request",
    typ: "request",
    payload:
      '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "method": "tools/call",\n  "params": {\n    "name": "create_issue",\n    "arguments": {\n      "title": "Bug in Slider"\n    }\n  }\n}',
    erklaerung:
      "Eine Anfrage. Drei Pflichtfelder: jsonrpc, id, method. Die id wird gebraucht, damit die Antwort zugeordnet werden kann — Requests können async und out-of-order beantwortet werden.",
  },
  {
    titel: "Response (Erfolg)",
    typ: "response",
    payload:
      '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "result": {\n    "content": [\n      { "type": "text",\n        "text": "Issue #137 erstellt." }\n    ]\n  }\n}',
    erklaerung:
      "Die Antwort auf Request mit id=42. result kann beliebig strukturiert sein — was, definiert die jeweilige Methode (hier: tools/call gibt content zurück).",
  },
  {
    titel: "Response (Fehler)",
    typ: "error",
    payload:
      '{\n  "jsonrpc": "2.0",\n  "id": 42,\n  "error": {\n    "code": -32602,\n    "message": "Invalid params",\n    "data": {\n      "fehlend": "title"\n    }\n  }\n}',
    erklaerung:
      'Statt result kommt error mit numerischem Code und Nachricht. -32602 ist JSON-RPCs standardisierter Code für „Invalid params". data ist optional und enthält Details.',
  },
  {
    titel: "Notification",
    typ: "notification",
    payload:
      '{\n  "jsonrpc": "2.0",\n  "method": "notifications/tools/list_changed"\n}',
    erklaerung:
      'Eine Notification — KEIN id-Feld. Der Empfänger antwortet nicht. Hier signalisiert der Server: „die Tools haben sich geändert, frag tools/list nochmal.".',
  },
];

const FEHLER_CODES = [
  { code: -32700, name: "Parse error", erklaerung: "JSON war kaputt." },
  { code: -32600, name: "Invalid request", erklaerung: "Nicht-valide Request-Struktur." },
  { code: -32601, name: "Method not found", erklaerung: "Methode existiert nicht." },
  { code: -32602, name: "Invalid params", erklaerung: "Parameter passen nicht zum Schema." },
  { code: -32603, name: "Internal error", erklaerung: "Server-interner Fehler." },
];

const FARBE: Record<MessageTyp, string> = {
  request: "#3b82f6",
  response: "#10b981",
  error: "#dc2626",
  notification: "#a855f7",
};

export default function JsonRpc() {
  const [aktiv, setAktiv] = useState(0);
  const b = BEISPIELE[aktiv];

  return (
    <div className="lesson-card">
      <h2>JSON-RPC — das Wire-Format</h2>
      <p className="lesson-description">
        MCP ist nicht selbst ein Protokoll — es ist eine Reihe von Methoden und
        Datentypen, die <em>über</em> JSON-RPC 2.0 transportiert werden.
        JSON-RPC ist alt, simpel, und tut nur eins: strukturierte Anfragen und
        Antworten mit IDs durch einen beliebigen Kanal schicken.
      </p>

      <div className="info-box">
        <strong>Vier Message-Typen:</strong> Request (mit id, erwartet Antwort)
        · Response (Erfolg, gleiche id) · Error (statt result, gleiche id) ·
        Notification (kein id, keine Antwort). Mehr nicht.
      </div>

      <h3>Message-Player</h3>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {BEISPIELE.map((bx, i) => (
          <button
            key={bx.titel}
            type="button"
            className="toggle-code"
            onClick={() => setAktiv(i)}
            style={{
              background: i === aktiv ? "#eef2ff" : "transparent",
              borderColor: i === aktiv ? FARBE[bx.typ] : "#d1d5db",
              color: i === aktiv ? FARBE[bx.typ] : "#374151",
              fontWeight: i === aktiv ? 700 : 500,
            }}
          >
            {bx.titel}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <pre
          className="mono"
          style={{
            fontSize: "0.82rem",
            background: "#f3f4f6",
            padding: "10px 12px",
            borderRadius: 6,
            whiteSpace: "pre",
            overflowX: "auto",
            borderLeft: `4px solid ${FARBE[b.typ]}`,
            margin: 0,
          }}
        >
          {b.payload}
        </pre>
        <div
          style={{
            fontSize: "0.9rem",
            color: "#374151",
            display: "flex",
            alignItems: "flex-start",
            padding: "10px 12px",
            background: "#fafafa",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        >
          {b.erklaerung}
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Die ID — der Sortierungs-Trick</h3>
      <p>
        Eine TCP-Verbindung ist ein Stream: Bytes fließen rein, Bytes fließen
        raus. Ohne IDs hätte der Client keine Chance, zwei Antworten den
        richtigen Requests zuzuordnen — denn JSON-RPC erlaubt async und
        out-of-order. Mit IDs ist die Zuordnung trivial:
      </p>
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          background: "#f3f4f6",
          padding: "10px 12px",
          borderRadius: 6,
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >{`Client →  { id: 1, method: "tools/list" }
Client →  { id: 2, method: "resources/list" }
Server ←  { id: 2, result: [...] }        ← Antwort auf #2 zuerst!
Server ←  { id: 1, result: [...] }        ← Antwort auf #1 später`}</pre>

      <h3>Standardisierte Fehler-Codes</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto 1fr",
          gap: "8px 16px",
          fontSize: "0.88rem",
          marginTop: 8,
        }}
      >
        <div style={{ fontWeight: 600 }}>Code</div>
        <div style={{ fontWeight: 600 }}>Name</div>
        <div style={{ fontWeight: 600 }}>Bedeutung</div>
        {FEHLER_CODES.map((f) => (
          <div key={f.code} style={{ display: "contents" }}>
            <code style={{ fontFamily: "ui-monospace, monospace", color: "#dc2626" }}>
              {f.code}
            </code>
            <div>{f.name}</div>
            <div style={{ color: "#475569" }}>{f.erklaerung}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 10, fontSize: "0.85rem", color: "#475569" }}>
        Eigene Codes vergibst du in <code>-32000</code> bis <code>-32099</code> —
        das ist der Server-Error-Range, den JSON-RPC für Anwendungs-Fehler
        offenlässt.
      </p>

      <h3>Batch — mehrere Requests gleichzeitig</h3>
      <p>
        JSON-RPC erlaubt ein Array statt eines Objekts als Payload. Der Server
        verarbeitet alle und gibt ein Array von Responses zurück. Praktisch
        für Setup-Phase, wenn der Client zur gleichen Zeit nach Tools,
        Resources und Prompts fragt:
      </p>
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          background: "#f3f4f6",
          padding: "10px 12px",
          borderRadius: 6,
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >{`[
  { "jsonrpc": "2.0", "id": 1, "method": "tools/list" },
  { "jsonrpc": "2.0", "id": 2, "method": "resources/list" },
  { "jsonrpc": "2.0", "id": 3, "method": "prompts/list" }
]`}</pre>

      <DepthBox variant="why" title="Warum JSON-RPC und nicht REST oder gRPC?">
        REST braucht URLs, das passt schlecht zu stdio-Transport (keine URLs).
        gRPC hätte typsicheres Schema, aber binäre Encoding macht es für
        Menschen schwer lesbar und Debug-Tools komplex. JSON-RPC ist ein
        Kompromiss: simpel genug für Hand-Debug, mächtig genug für
        bidirektionalen async Verkehr, transport-agnostisch.
      </DepthBox>

      <DepthBox variant="mistake" title="id=0 vergessen">
        <code>0</code> ist eine gültige ID. Wenn dein Client mit{" "}
        <code>if (msg.id)</code> filtert, übersieht er Request mit id=0.
        Stattdessen: <code>if (msg.id !== undefined)</code>. Klassischer Bug,
        der nur in 1 von 10000 Sessions auftritt — und dann stundenlang
        unverständlich ist.
      </DepthBox>

      <DepthBox variant="deeper" title="String- vs. Number-IDs">
        JSON-RPC erlaubt sowohl Strings als auch Numbers als ID. SDKs sind
        unterschiedlich: das offizielle MCP-Python-SDK nutzt Numbers, das
        TypeScript-SDK Strings (UUIDs). Beim Mischen aufpassen: ein Client,
        der nur Numbers parst, kann ein Server-Result mit String-ID nicht mehr
        zuordnen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        LSP (auch JSON-RPC drunter — quasi der Vorfahre von MCP), WebSocket-
        Protokolle (oft auch JSON-RPC-artig), und gRPC (das stärker typisierte
        Pendant für Service-Welten).
      </DepthBox>
    </div>
  );
}
