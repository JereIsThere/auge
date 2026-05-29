"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Ressource = {
  uri: string;
  name: string;
  mimeType: string;
  beschreibung: string;
  inhalt: string;
};

const RESSOURCEN: Ressource[] = [
  {
    uri: "file:///home/jere/notes/projekt-x.md",
    name: "projekt-x.md",
    mimeType: "text/markdown",
    beschreibung: "Markdown-Notiz aus dem lokalen Filesystem-Server.",
    inhalt:
      "# Projekt X\n\n- Ziel: Onboarding für neue Mitarbeitende\n- Stakeholder: Anna, Bert\n- Deadline: 2026-06-15\n\n## Offene Fragen\n- Wo kommt die Mailing-Liste her?",
  },
  {
    uri: "postgres://main/public/users",
    name: "users (Tabelle)",
    mimeType: "application/json",
    beschreibung: "Schema-Snapshot der users-Tabelle vom Postgres-Server.",
    inhalt:
      '{\n  "columns": [\n    { "name": "id", "type": "uuid", "primary": true },\n    { "name": "email", "type": "varchar(255)" },\n    { "name": "created_at", "type": "timestamptz" }\n  ],\n  "row_count_approx": 12483\n}',
  },
  {
    uri: "git://repo/auge-2/CLAUDE.md",
    name: "CLAUDE.md",
    mimeType: "text/markdown",
    beschreibung: "Datei aus dem aktuellen Git-Checkout, vom Git-Server bereitgestellt.",
    inhalt:
      "# Auge 2 — für Claude\n\nHandkuratiertes Lernportal. Themen → Gruppen → Lektionen …",
  },
  {
    uri: "screenshot://desktop/now",
    name: "Aktueller Bildschirm",
    mimeType: "image/png",
    beschreibung: "Live-Screenshot, dynamisch generiert beim Lesen.",
    inhalt: "[binary PNG-Daten, base64-codiert]",
  },
];

export default function Resources() {
  const [aktiv, setAktiv] = useState(0);
  const r = RESSOURCEN[aktiv];

  return (
    <div className="lesson-card">
      <h2>Resources — die zweite Säule</h2>
      <p className="lesson-description">
        Resources sind <em>lesbare Datenquellen</em>, die der Server bereitstellt
        und die der Nutzer (nicht das Modell!) in den Kontext einhängt. Tools
        verändern die Welt — Resources liefern Wissen.
      </p>

      <div className="info-box">
        <strong>Kurzfassung:</strong> Jede Resource hat eine <em>URI</em>
        (eindeutiger Identifier), einen MIME-Type und Inhalt. Der Client kann{" "}
        <code>resources/list</code> abfragen, eine Auswahl an den Nutzer
        anbieten, und beim Auswählen <code>resources/read</code> aufrufen — der
        Server liefert den aktuellen Inhalt.
      </div>

      <h3>Resource-Browser</h3>
      <p style={{ fontSize: "0.9rem", color: "#475569" }}>
        Klick eine URI an und sieh, was der Server zurückgibt.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: 16,
          marginTop: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RESSOURCEN.map((res, i) => (
            <button
              key={res.uri}
              type="button"
              className="toggle-code"
              onClick={() => setAktiv(i)}
              style={{
                textAlign: "left",
                background: i === aktiv ? "#eef2ff" : "transparent",
                borderColor: i === aktiv ? "#3b82f6" : "#d1d5db",
                color: i === aktiv ? "#1d4ed8" : "#374151",
                fontWeight: i === aktiv ? 700 : 500,
                fontSize: "0.85rem",
                padding: "8px 10px",
              }}
            >
              <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.78rem" }}>
                {res.uri}
              </div>
              <div style={{ marginTop: 2, fontSize: "0.78rem", opacity: 0.7 }}>
                {res.mimeType}
              </div>
            </button>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
          <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: 8 }}>
            {r.beschreibung}
          </div>
          <pre
            className="mono"
            style={{
              fontSize: "0.8rem",
              background: "#f3f4f6",
              padding: "10px 12px",
              borderRadius: 6,
              whiteSpace: "pre-wrap",
              overflowX: "auto",
              margin: 0,
            }}
          >
            {r.inhalt}
          </pre>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Resources vs. Tools — wer entscheidet?</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🛠️ Tools</div>
          <div className="actor-row">
            Das <em>Modell</em> wählt aus, ob und welches Tool aufgerufen wird.
            Side Effects möglich. Trigger: &bdquo;tu was&ldquo;.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">📁 Resources</div>
          <div className="actor-row">
            Der <em>Nutzer</em> (über die Client-UI) entscheidet, welche
            Ressourcen mit in den Kontext gehen. Reine Lesezugriffe, keine Side
            Effects. Trigger: &bdquo;hier ist Wissen&ldquo;.
          </div>
        </div>
      </div>

      <h3>Das URI-Schema</h3>
      <p>
        Resources werden über URIs identifiziert — kein vorgegebenes Schema, der
        Server darf eigene definieren. Beispiele:
      </p>
      <ul className="step-list">
        <li>
          <code>file:///abs/path/datei.md</code> — Filesystem-Server für lokale
          Dateien.
        </li>
        <li>
          <code>postgres://db/schema/tabelle</code> — DB-Server, eine Tabelle.
        </li>
        <li>
          <code>git://repo/branch/path</code> — Git-Server, Datei auf einem
          Branch.
        </li>
        <li>
          <code>custom://obsidian/note/abc-123</code> — Eigener Server für ein
          eigenes System.
        </li>
      </ul>

      <h3>Resource Templates — Wildcards für Parameter</h3>
      <p>
        Manche Server haben Resources, die <em>parametrisiert</em> sind — etwa
        eine Tabelle, in der eine Zeile per ID gelesen werden soll. Dafür gibt
        es <code>resources/templates/list</code>:
      </p>
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          background: "#f3f4f6",
          padding: "10px 12px",
          borderRadius: 6,
          whiteSpace: "pre-wrap",
        }}
      >{`{
  "uriTemplate": "postgres://main/public/users/{id}",
  "name": "User by ID",
  "description": "Eine User-Zeile anhand der UUID",
  "mimeType": "application/json"
}`}</pre>
      <p style={{ fontSize: "0.9rem", color: "#475569" }}>
        Der Client kann dem Nutzer dann ein Eingabefeld zeigen — beim Lesen
        wird <code>{`{id}`}</code> durch den eingegebenen Wert ersetzt.
      </p>

      <DepthBox variant="why" title="Warum trennen Resources und Tools überhaupt?">
        Weil sie verschiedene <em>Aufmerksamkeits-Loops</em> haben. Tools landen
        im LLM-Decision-Loop („soll ich create_issue rufen?"). Resources landen
        im User-Decision-Loop („soll ich diese Datei dranhängen?"). Würde man
        Resources als Tools modellieren (z.B. <code>read_file</code>), dann
        müsste das LLM bei jeder Anfrage selbst überlegen, welche Datei
        relevant ist — das skaliert nicht mit großen Repositories. Mit
        Resources kann der Nutzer kuratieren, das LLM bekommt die kuratierte
        Auswahl.
      </DepthBox>

      <DepthBox variant="mistake" title="Resource-Read als Tool — naheliegend, aber falsch">
        Klassischer Fehler beim Bau eines Clients: man baut <code>resources/read</code>{" "}
        als Tool und lässt das Modell entscheiden. Resultat: Token-Verbrauch
        explodiert, weil das Modell auf Verdacht Dateien anzieht, und die
        UI-Kontrolle des Nutzers verschwindet. Resources gehören in die
        Client-UI als sichtbarer Anhang — nicht in den Tool-Loop.
      </DepthBox>

      <DepthBox variant="deeper" title="Subscriptions — Live-Resources">
        MCP unterstützt <code>resources/subscribe</code>: der Client sagt dem
        Server, dass er bei Änderungen einer Resource benachrichtigt werden
        will. Der Server schickt dann <code>notifications/resources/updated</code>{" "}
        — der Client kann den Inhalt neu laden. Use-Case: ein Log-File, das
        live mitwachsen soll, oder ein DB-Snapshot, der bei Änderungen
        refresht. Funktioniert allerdings nur bei Transports mit Server→Client-
        Push (SSE, Streamable HTTP).
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        RAG (Resources sind <em>nicht</em> dasselbe — RAG fügt Embeddings-
        basiert dazu, Resources sind kuratiert), Context-Window-Management
        (große Resources kosten Tokens — Server sollten chunken oder
        zusammenfassen), und das LSP-Vorbild (LSP hat ebenfalls
        Workspace-Symbols und ein Read-Concept).
      </DepthBox>
    </div>
  );
}
