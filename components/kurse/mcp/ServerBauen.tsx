"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Sprache = "python" | "typescript";

type Schritt = {
  titel: string;
  beschreibung: string;
  code: { python: string; typescript: string };
};

const SCHRITTE: Schritt[] = [
  {
    titel: "1. Projekt anlegen + SDK installieren",
    beschreibung:
      "Beide SDKs sind offiziell vom MCP-Team. Python nutzt FastMCP-Pattern (Decorators), TS nutzt eine Builder-API.",
    code: {
      python:
        "# pyproject.toml + venv anlegen\nuv init mein-server && cd mein-server\nuv add mcp",
      typescript:
        "# Node-Projekt + TS-Setup\nnpm init -y\nnpm install @modelcontextprotocol/sdk zod\nnpm install -D typescript @types/node tsx",
    },
  },
  {
    titel: "2. Server-Instanz erstellen",
    beschreibung:
      "Du gibst dem Server einen Namen und eine Version. Die identifizieren ihn beim Client.",
    code: {
      python:
        'from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP("mein-server", version="0.1.0")',
      typescript:
        'import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";\n\nconst server = new McpServer({\n  name: "mein-server",\n  version: "0.1.0",\n});',
    },
  },
  {
    titel: "3. Ein erstes Tool registrieren",
    beschreibung:
      "Das Tool bekommt Name, Beschreibung, Input-Schema und eine Handler-Funktion. Der Schema-Typ ist JSON-Schema — beide SDKs leiten es aus Type-Annotations bzw. zod ab.",
    code: {
      python:
        '@mcp.tool()\ndef add(a: int, b: int) -> int:\n    """Addiert zwei Zahlen."""\n    return a + b',
      typescript:
        'import { z } from "zod";\n\nserver.tool(\n  "add",\n  "Addiert zwei Zahlen",\n  { a: z.number(), b: z.number() },\n  async ({ a, b }) => ({\n    content: [{ type: "text", text: `${a + b}` }],\n  })\n);',
    },
  },
  {
    titel: "4. Optional: eine Resource",
    beschreibung:
      "Resources haben URI und Reader. Beide SDKs sind hier dünn — kümmer dich um Caching selbst, wenn nötig.",
    code: {
      python:
        '@mcp.resource("config://app")\ndef get_config() -> str:\n    """Liefert die aktuelle App-Konfig."""\n    return open("config.json").read()',
      typescript:
        'server.resource(\n  "config",\n  "config://app",\n  async () => ({\n    contents: [{\n      uri: "config://app",\n      mimeType: "application/json",\n      text: await fs.readFile("config.json", "utf-8"),\n    }],\n  })\n);',
    },
  },
  {
    titel: "5. Server starten (stdio)",
    beschreibung:
      "Im Entwicklungsmodus startet man den Server über stdio. Der Client (oder MCP-Inspector zum Debuggen) startet den Prozess und pipt stdin/stdout.",
    code: {
      python:
        'if __name__ == "__main__":\n    mcp.run()  # stdio ist Default',
      typescript:
        'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";\n\nconst transport = new StdioServerTransport();\nawait server.connect(transport);',
    },
  },
  {
    titel: "6. Testen mit dem MCP Inspector",
    beschreibung:
      "Der Inspector ist eine kleine Web-UI, die wie ein MCP-Client wirkt. Damit testest du Tools und Resources ohne Claude Desktop.",
    code: {
      python:
        "# Im Server-Verzeichnis:\nnpx @modelcontextprotocol/inspector uv run server.py",
      typescript:
        "# Im Server-Verzeichnis:\nnpx @modelcontextprotocol/inspector tsx src/server.ts",
    },
  },
  {
    titel: "7. In Claude Desktop einhängen",
    beschreibung:
      "Damit der echte Client deinen Server nutzt: in der Config-Datei eintragen. Pfad: macOS ~/Library/Application Support/Claude/claude_desktop_config.json; Windows %APPDATA%/Claude/claude_desktop_config.json.",
    code: {
      python:
        '{\n  "mcpServers": {\n    "mein-server": {\n      "command": "uv",\n      "args": ["--directory", "/abs/pfad", "run", "server.py"]\n    }\n  }\n}',
      typescript:
        '{\n  "mcpServers": {\n    "mein-server": {\n      "command": "node",\n      "args": ["/abs/pfad/dist/server.js"]\n    }\n  }\n}',
    },
  },
];

export default function ServerBauen() {
  const [sprache, setSprache] = useState<Sprache>("python");
  const [schritt, setSchritt] = useState(0);
  const s = SCHRITTE[schritt];

  return (
    <div className="lesson-card">
      <h2>Einen eigenen Server bauen</h2>
      <p className="lesson-description">
        Sieben Schritte von leerem Ordner zu einem MCP-Server, der in Claude
        Desktop läuft. Code-Beispiele in Python (FastMCP-SDK) und TypeScript —
        wähle deine Sprache.
      </p>

      <div className="info-box">
        <strong>Faustregel zur Sprach-Wahl:</strong> Python ist mit FastMCP
        am schnellsten zum Prototyp. TypeScript lohnt sich, wenn der Server
        sowieso schon in einer JS-Codebase lebt oder du Streaming-Tools mit
        komplexen Response-Typen brauchst.
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {(["python", "typescript"] as Sprache[]).map((id) => (
          <button
            key={id}
            type="button"
            className="toggle-code"
            onClick={() => setSprache(id)}
            style={{
              background: sprache === id ? "#eef2ff" : "transparent",
              borderColor: sprache === id ? "#3b82f6" : "#d1d5db",
              color: sprache === id ? "#1d4ed8" : "#374151",
              fontWeight: sprache === id ? 700 : 500,
            }}
          >
            {id === "python" ? "🐍 Python" : "⚙️ TypeScript"}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Schritt {schritt + 1} / {SCHRITTE.length}</h3>
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "12px 14px",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.titel}</div>
        <div style={{ fontSize: "0.9rem", color: "#475569", marginBottom: 10 }}>
          {s.beschreibung}
        </div>
        <pre
          className="mono"
          style={{
            fontSize: "0.82rem",
            background: "#1a1a1a",
            color: "#e5e7eb",
            padding: "10px 14px",
            borderRadius: 6,
            whiteSpace: "pre",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {s.code[sprache]}
        </pre>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          className="toggle-code"
          onClick={() => setSchritt((x) => Math.max(0, x - 1))}
          disabled={schritt === 0}
        >
          ← zurück
        </button>
        <button
          type="button"
          className="toggle-code"
          onClick={() => setSchritt((x) => Math.min(SCHRITTE.length - 1, x + 1))}
          disabled={schritt === SCHRITTE.length - 1}
        >
          weiter →
        </button>
        <div style={{ display: "flex", gap: 4, marginLeft: "auto", flexWrap: "wrap" }}>
          {SCHRITTE.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSchritt(i)}
              aria-label={`Schritt ${i + 1}`}
              style={{
                width: 24,
                height: 24,
                border: "1px solid #d1d5db",
                borderRadius: 4,
                background: i === schritt ? "#3b82f6" : i < schritt ? "#dbeafe" : "white",
                color: i === schritt ? "white" : "#475569",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Was du in jedem Schritt geprüft haben solltest</h3>
      <ul className="step-list">
        <li>
          <strong>Schritt 3:</strong> Tool taucht im Inspector unter „Tools" auf,
          mit korrektem Schema.
        </li>
        <li>
          <strong>Schritt 5:</strong> Inspector verbindet sich, du siehst{" "}
          <code>initialize</code> erfolgreich im Logs-Panel.
        </li>
        <li>
          <strong>Schritt 6:</strong> Tool-Call gibt das erwartete Ergebnis
          zurück — sonst meist ein Schema-Mismatch oder ein Print-auf-stdout-
          Bug.
        </li>
        <li>
          <strong>Schritt 7:</strong> Claude Desktop neugestartet, in der
          Chat-UI siehst du das 🔌-Icon mit deinem Server-Namen.
        </li>
      </ul>

      <DepthBox variant="why" title="Warum FastMCP statt der Low-Level-API?">
        Beide SDKs haben zwei Schichten: eine Low-Level-API, die JSON-RPC
        direkt rein/raus pumpt, und eine High-Level-Convenience (FastMCP in
        Python, McpServer in TS). Die Low-Level-API ist für Spezialfälle —
        z.B. wenn du ein eigenes Routing brauchst oder mehrere Server in einem
        Prozess hostest. Für 95% aller Server reicht die High-Level-API.
      </DepthBox>

      <DepthBox variant="mistake" title="Das Tool kommt nicht durch — Checkliste">
        Wenn Claude Desktop dein Tool nicht zeigt, geh diese Liste durch:
        <ul>
          <li>
            <strong>Pfad absolut?</strong> Relative Pfade in der Config
            funktionieren nicht — Claude Desktop hat ein anderes Working-
            Directory.
          </li>
          <li>
            <strong>Logging auf stderr?</strong> Print/console.log gehen
            standardmäßig auf stdout und crashen die Verbindung.
          </li>
          <li>
            <strong>Permissions?</strong> Auf macOS muss die Executable
            ausgeführt werden dürfen. Auf Windows aufpassen mit
            Path-Quoting.
          </li>
          <li>
            <strong>Server gecrasht beim Start?</strong> Lass den Inspector
            laufen und schau dir die stderr-Logs an.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="deeper" title="Capabilities und initialize">
        Vor dem ersten Tool-Call macht jedes Client/Server-Paar einen
        Handshake: <code>initialize</code>-Request mit Protokoll-Version und{" "}
        <code>capabilities</code>-Object. Der Server antwortet mit seinen
        Capabilities (z.B. <code>tools</code>, <code>resources</code>,{" "}
        <code>prompts</code>, <code>sampling</code>). Erst dann darf der
        Client weitere Methoden rufen. Das FastMCP-SDK regelt das automatisch
        — du merkst es nur, wenn du die Low-Level-API benutzt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Function-Calling-SDKs (sehr ähnliche Decorators in z.B. LangChain),
        OpenAPI-Codegen (umgekehrte Richtung: aus existierender API einen
        Server generieren), und Server-Templates (das MCP-Team pflegt
        Boilerplate-Repos für Python/TS/Java/Kotlin/Swift).
      </DepthBox>
    </div>
  );
}
