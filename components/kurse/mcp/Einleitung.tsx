import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was ist MCP?</h2>
      <p className="lesson-description">
        MCP steht für <strong>Model Context Protocol</strong> — ein offenes
        Protokoll, mit dem LLM-Anwendungen einheitlich auf externe Werkzeuge,
        Daten und Prompt-Vorlagen zugreifen können. Ungefähr das, was{" "}
        <em>LSP</em> für IDEs ist, soll MCP für Agenten werden: <em>ein</em>{" "}
        Adapter statt N maßgeschneiderter Integrationen.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> Ein MCP-<em>Server</em> stellt
        Funktionen bereit (lies Datei X, ruf API Y, gib Doku Z heraus). Ein
        MCP-<em>Client</em> – meist eingebettet in einer Agent-Anwendung wie
        Claude Desktop oder Claude Code – kann diese Funktionen entdecken,
        aufrufen und das Ergebnis an das LLM weitergeben.
      </div>

      <h3>Die drei Primitives</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🛠️ Tools</div>
          <div className="actor-row">
            Vom Modell aufrufbare Funktionen mit Side Effects –
            <em>&bdquo;tu was&ldquo;</em>. Beispiel: <code>create_issue</code>,
            <code>run_query</code>, <code>send_email</code>.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">📁 Resources</div>
          <div className="actor-row">
            Lesbare Datenquellen, die vom Nutzer in den Kontext
            eingehängt werden – <em>&bdquo;hier ist Wissen&ldquo;</em>.
            Beispiel: lokale Dateien, Wiki-Seiten, DB-Zeilen.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">📜 Prompts</div>
          <div className="actor-row">
            Wiederverwendbare Prompt-Templates, die der Server anbietet —
            <em>&bdquo;so frag ich das&ldquo;</em>. Beispiel:
            <code>review-pr</code>, <code>generate-changelog</code>.
          </div>
        </div>
      </div>

      <h3>Was MCP <em>nicht</em> ist</h3>
      <ul className="step-list">
        <li>
          <strong>Kein neues LLM-Format</strong> — es geht um den <em>Kontext</em>,
          den Modell und Agent austauschen, nicht um Tokens oder Embeddings.
        </li>
        <li>
          <strong>Kein Replacement für REST/GraphQL</strong> — MCP ist die
          Schicht <em>zwischen</em> Agent und API. Die API darunter darf
          weiterhin REST sein.
        </li>
        <li>
          <strong>Kein RAG</strong> — Resources sind statisch (vom Nutzer
          eingehängt), Tools sind funktional. Embeddings-basiertes Retrieval
          baust du <em>im</em> Tool oben drauf.
        </li>
      </ul>

      <DepthBox variant="why" title="Warum überhaupt ein neues Protokoll?">
        Vor MCP musste jeder Agent jede Integration einzeln eintippen:
        OpenAI-Function-Calling für GPT, Tool-Use-Format für Claude, eine
        eigene Plugin-Struktur für jede IDE. MCP standardisiert das, sodass
        ein <em>Server</em> (z.B. ein Postgres-Server, ein
        Filesystem-Server) von <em>jedem</em> MCP-fähigen Client genutzt werden
        kann.
      </DepthBox>

      <DepthBox variant="mistake" title="MCP ≠ JSON-Schema-Tools">
        Function-Calling von OpenAI/Anthropic ist nur das Tool-Use-Format
        zwischen Modell und Wrapper. MCP ist die Schicht <em>davor</em>: wie
        der Wrapper überhaupt erfährt, welche Tools verfügbar sind, wer sie
        ausführt und wo das Ergebnis hingehört. Beides existiert parallel.
      </DepthBox>

      <DepthBox variant="deeper" title="Transport-Schichten">
        MCP läuft typischerweise als JSON-RPC über einen von drei Transports:
        <ul>
          <li>
            <strong>stdio</strong> — Server läuft als Sub-Prozess des Clients,
            kommuniziert über Standardeingabe/-ausgabe. Default für lokale
            Tools.
          </li>
          <li>
            <strong>SSE</strong> — Server-Sent Events über HTTP, für
            hosted/remote Server.
          </li>
          <li>
            <strong>Streamable HTTP</strong> — neuer, beidseitig-streamfähiger
            HTTP-Transport.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Function-Calling / Tool-Use (das &bdquo;Sprachen&ldquo;-Format
        Modell↔Wrapper), Agent-Frameworks (LangChain, CrewAI – die rufen am
        Ende auch nur Tools), und IDE-Plugins (Claude Code, Cursor — sie
        benutzen MCP als Erweiterungs-API).
      </DepthBox>
    </div>
  );
}
