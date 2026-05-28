"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Transport = "stdio" | "sse" | "streamable";

type Eigenschaft = {
  titel: string;
  stdio: string;
  sse: string;
  streamable: string;
};

const EIGENSCHAFTEN: Eigenschaft[] = [
  {
    titel: "Wo läuft der Server?",
    stdio: "Sub-Prozess des Clients, auf demselben Rechner.",
    sse: "Hosted, irgendwo erreichbar über HTTPS.",
    streamable: "Hosted, irgendwo erreichbar über HTTPS.",
  },
  {
    titel: "Verbindungs-Aufbau",
    stdio: "Client startet den Prozess, pipt stdin/stdout.",
    sse: "Client öffnet zwei HTTP-Endpunkte (GET für SSE, POST für Requests).",
    streamable: "Client öffnet einen HTTP-Endpunkt; Antworten können Stream oder JSON sein.",
  },
  {
    titel: "Server → Client Push (Notifications)",
    stdio: "Über stdout — funktioniert sofort.",
    sse: "Über den GET-Stream — funktioniert.",
    streamable: "Über den Response-Stream — funktioniert.",
  },
  {
    titel: "Authentifizierung",
    stdio: "Keine — wer den Prozess starten kann, vertraut man.",
    sse: "Bearer-Token im Header, OAuth möglich.",
    streamable: "Bearer-Token im Header, OAuth möglich.",
  },
  {
    titel: "Latenz",
    stdio: "Mikrosekunden — kein Netzwerk dazwischen.",
    sse: "Netzwerk-RTT — TLS-Handshake einmal, dann jeder Roundtrip.",
    streamable: "Netzwerk-RTT, aber kein doppelter Endpoint mehr.",
  },
  {
    titel: "Wer hostet?",
    stdio: "Nutzer hat den Server-Code lokal installiert.",
    sse: "Anbieter hostet — Notion, Linear, Slack-MCP.",
    streamable: "Anbieter hostet — die neuere Variante für SaaS-Server.",
  },
];

const SUSTROOM: Record<Transport, { titel: string; farbe: string; use: string[] }> = {
  stdio: {
    titel: "stdio",
    farbe: "#10b981",
    use: [
      "Filesystem-Server für lokale Dateien",
      "Git-Server für lokales Repo",
      "Postgres-Server mit lokaler DB-Verbindung",
      "Allgemein: alles was Maschinen-Zugriff braucht",
    ],
  },
  sse: {
    titel: "SSE (alt)",
    farbe: "#3b82f6",
    use: [
      "Anbieter-gehostete Server (Notion, Linear)",
      "Server, der mehrere Nutzer gleichzeitig bedient",
      "Wenn die Spec noch SSE verlangt (ältere SDK-Versionen)",
    ],
  },
  streamable: {
    titel: "Streamable HTTP",
    farbe: "#a855f7",
    use: [
      "Neue hosted Server (ab Spec Rev 2025-03-26)",
      "Lambda/Edge-Function-Deployments",
      "Wenn ein einzelner Endpunkt einfacher zu deployen ist",
    ],
  },
};

export default function Transport() {
  const [aktiv, setAktiv] = useState<Transport>("stdio");
  const t = SUSTROOM[aktiv];

  return (
    <div className="lesson-card">
      <h2>Transport — wie die Bytes fließen</h2>
      <p className="lesson-description">
        MCP-Messages sind JSON-RPC — aber wie kommen sie vom Client zum Server?
        Drei Transports stehen zur Wahl. Jeder für ein anderes Setup: lokal,
        gehostet (alt), gehostet (neu).
      </p>

      <div className="info-box">
        <strong>Entscheidungs-Regel:</strong> Läuft der Server auf demselben
        Rechner wie der Nutzer? → stdio. Wird er als Service angeboten, neu
        deployed? → Streamable HTTP. Ältere SaaS-Server? → SSE.
      </div>

      <h3>Vergleichs-Switcher</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {(Object.keys(SUSTROOM) as Transport[]).map((id) => (
          <button
            key={id}
            type="button"
            className="toggle-code"
            onClick={() => setAktiv(id)}
            style={{
              background: aktiv === id ? "#eef2ff" : "transparent",
              borderColor: aktiv === id ? SUSTROOM[id].farbe : "#d1d5db",
              color: aktiv === id ? SUSTROOM[id].farbe : "#374151",
              fontWeight: aktiv === id ? 700 : 500,
              padding: "8px 14px",
            }}
          >
            {SUSTROOM[id].titel}
          </button>
        ))}
      </div>

      <div className="kv-table" style={{ fontSize: "0.9rem" }}>
        {EIGENSCHAFTEN.map((e) => (
          <div key={e.titel} style={{ display: "contents" }}>
            <dt
              style={{
                gridColumn: "1 / -1",
                paddingTop: 10,
                borderTop: "1px solid #e5e7eb",
                fontWeight: 600,
              }}
            >
              {e.titel}
            </dt>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.88rem", color: "#1f2937" }}>{e[aktiv]}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 24 }}>Wofür {t.titel} passt</h3>
      <ul className="step-list">
        {t.use.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </ul>

      <h3>So sieht die Config aus</h3>
      <p style={{ fontSize: "0.9rem", color: "#475569" }}>
        In Claude Desktop liegt sie in <code>claude_desktop_config.json</code>.
        Die Form unterscheidet sich klar nach Transport:
      </p>

      <h4 style={{ marginTop: 12 }}>stdio</h4>
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          background: "#f3f4f6",
          padding: "10px 12px",
          borderRadius: 6,
          whiteSpace: "pre",
          overflowX: "auto",
          borderLeft: "4px solid #10b981",
        }}
      >{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/jere"],
      "env": { "DEBUG": "1" }
    }
  }
}`}</pre>

      <h4>SSE / Streamable HTTP</h4>
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          background: "#f3f4f6",
          padding: "10px 12px",
          borderRadius: 6,
          whiteSpace: "pre",
          overflowX: "auto",
          borderLeft: "4px solid #3b82f6",
        }}
      >{`{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/sse",
      "headers": {
        "Authorization": "Bearer ntn_xxxxx"
      }
    }
  }
}`}</pre>

      <DepthBox variant="why" title="Warum überhaupt drei? Reicht nicht einer?">
        Weil drei sehr verschiedene Welten existieren. Lokale Tools brauchen
        Filesystem-Zugriff und sollen sofort starten — da ist HTTP overkill,
        stdio passt perfekt. SaaS-Server brauchen Netzwerk und Auth — da
        passt HTTP. Und Streamable HTTP gibt es, weil SSE zwei Endpunkte
        verlangte (einer für Push, einer für Requests) — das ließ sich in
        Serverless-Architekturen kaum mappen. Streamable HTTP hat nur einen
        Endpunkt und ist einfacher zu deployen.
      </DepthBox>

      <DepthBox variant="mistake" title="stdio-Server haben fast-zero Auth">
        Es gibt keinen Token, keine Berechtigungs-Schicht zwischen Client und
        stdio-Server. Wer den Server starten kann, kann ihn auch alles tun
        lassen, wofür der Server-Code Rechte hat. Das ist nicht
        zwangsläufig schlecht — der Nutzer hat den Server ja selbst installiert.
        Aber: schadhafte stdio-Server haben dieselben Rechte wie der
        Nutzer-Account. Genau wie eine NPM-Package. Daher: installiere nur
        Server aus vertrauenswürdigen Quellen.
      </DepthBox>

      <DepthBox variant="deeper" title="Was stdout darf — und was nicht">
        Beim stdio-Transport ist stdout für JSON-RPC reserviert. Das heißt:
        ein <code>print(&quot;debug&quot;)</code> im Server-Code würde der
        Client als Müll-JSON-RPC parsen und die Verbindung crashen. Logging
        muss über stderr gehen. Klassischer Anfänger-Bug: Python-Server, der
        irgendwo <code>print(...)</code> hat — der MCP-Inspector zeigt
        rätselhafte „Invalid JSON"-Errors.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Process-Management (stdio-Server sind Sub-Prozesse — der Client muss
        sie starten, killen, neustarten), HTTP-Reverse-Proxies (bei Hosted
        Servern oft mit nginx/Caddy vor dem MCP-Endpoint), und
        OAuth-Flows (SaaS-Server brauchen oft mehr als ein statisches
        Bearer-Token — siehe MCP Authorization Spec).
      </DepthBox>
    </div>
  );
}
