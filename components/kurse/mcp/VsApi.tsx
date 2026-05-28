import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Zeile = {
  aspekt: string;
  rest: string;
  mcp: string;
};

const VERGLEICH: Zeile[] = [
  {
    aspekt: "Wer entdeckt was möglich ist?",
    rest: "Nutzer/Entwickler liest die Docs.",
    mcp: "Client fragt zur Laufzeit tools/list ab — automatisch.",
  },
  {
    aspekt: "Wer ruft auf?",
    rest: "Der Client direkt, oft als HTTP-Request.",
    mcp: "Der MCP-Client als Adapter zwischen Modell und Server.",
  },
  {
    aspekt: "Format der Parameter",
    rest: "Frei — JSON, Form-Encoded, Query-String, Header, …",
    mcp: "JSON-Schema, vom Server deklariert — Modell kennt die erwarteten Felder.",
  },
  {
    aspekt: "Auth",
    rest: "Tokens im Header, jeder Client implementiert eigenes Schema.",
    mcp: "Vom Server-Setup vorgegeben; oft ein Token in der MCP-Server-Konfig.",
  },
  {
    aspekt: "Beobachtbarkeit",
    rest: "HTTP-Logs, Tracing.",
    mcp: "Jede tools/call wird durch den Client sichtbar — User sieht jedes Aufrufen.",
  },
  {
    aspekt: "Side Effects",
    rest: "Implizit (POST = schreibend, GET = lesend) — Konvention.",
    mcp: "Tools können meta-Flags setzen (z.B. requires confirmation).",
  },
  {
    aspekt: "Zielgruppe",
    rest: "Andere Programme, Skripte, Frontends.",
    mcp: "LLM-Agenten — Tool-Beschreibungen sind in natürlicher Sprache, nicht in Endpunkt-Pfaden.",
  },
  {
    aspekt: "Wenn die API sich ändert",
    rest: "Clients müssen aktualisiert werden.",
    mcp: "Server-Schema ändert sich; Client fragt erneut tools/list.",
  },
];

export default function VsApi() {
  return (
    <div className="lesson-card">
      <h2>MCP vs. klassische API</h2>
      <p className="lesson-description">
        MCP <em>ersetzt</em> keine REST- oder GraphQL-APIs — es lebt eine
        Schicht darüber. Aber im Vergleich wird klarer, was MCP eigentlich
        Neues bringt.
      </p>

      <div className="info-box">
        <strong>Faustregel:</strong> Wenn ein Mensch oder klassisches Programm
        die API benutzt → REST. Wenn ein <em>LLM-Agent</em> sie benutzt → MCP
        davor.
      </div>

      <div className="kv-table" style={{ marginTop: 12, fontSize: "0.92rem" }}>
        {VERGLEICH.flatMap((z) => [
          <dt key={`${z.aspekt}-h`} style={{ gridColumn: "1 / -1", paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
            {z.aspekt}
          </dt>,
          <div key={`${z.aspekt}-rest`}>
            <span className="pill" style={{ background: "#eef2ff", borderColor: "#c7d2fe", color: "#3730a3" }}>
              REST
            </span>
            <div style={{ marginTop: 4, fontSize: "0.88rem" }}>{z.rest}</div>
          </div>,
          <div key={`${z.aspekt}-mcp`}>
            <span className="pill" style={{ background: "#ecfdf5", borderColor: "#6ee7b7", color: "#064e3b" }}>
              MCP
            </span>
            <div style={{ marginTop: 4, fontSize: "0.88rem" }}>{z.mcp}</div>
          </div>,
        ])}
      </div>

      <h3 style={{ marginTop: 20 }}>Wann ist MCP der Overkill?</h3>
      <ul className="step-list">
        <li>
          Wenn dein Agent immer dieselbe API ruft — dann ist ein direktes Tool
          (mit OpenAI Function-Calling oder Claude Tool-Use) einfacher.
        </li>
        <li>
          Wenn die API streng vertraulich ist und du <em>nicht</em> möchtest,
          dass ein generischer Client sie nutzt — MCP-Server müssen geschützt
          werden wie jede andere API auch.
        </li>
        <li>
          Wenn der Aufruf-Mix ein reines Read-Only-Frontend ist — da reicht
          GraphQL.
        </li>
      </ul>

      <h3>Wann lohnt sich MCP besonders?</h3>
      <ul className="step-list">
        <li>
          Du baust einen lokalen Agenten (Claude Desktop, Claude Code), der
          mehrere Datenquellen und Tools beherrschen soll — Filesystem, Git,
          DB, Slack — und du willst sie nicht alle einzeln im Agent verdrahten.
        </li>
        <li>
          Du betreibst ein internes Tool, das von verschiedenen LLM-Anwendungen
          benutzt werden soll. <em>Ein</em> MCP-Server, beliebige Clients.
        </li>
        <li>
          Du möchtest, dass ein Drittanbieter-Tool von deinem Agenten benutzt
          werden kann, <em>ohne</em> es selbst in dein Codebase einzubauen.
        </li>
      </ul>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        OpenAPI/Swagger (auch ein Discovery-Format, aber für Menschen + Code),
        gRPC (typsicher, aber nicht LLM-orientiert), und das LSP-Protokoll
        (das geistige Vorbild für MCP — Editor↔Sprachserver).
      </DepthBox>
    </div>
  );
}
