"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type PromptArgument = {
  name: string;
  beschreibung: string;
  required: boolean;
  beispiel: string;
};

type PromptTemplate = {
  name: string;
  beschreibung: string;
  arguments: PromptArgument[];
  /** Mit {{platzhaltern}} */
  template: string;
};

const TEMPLATES: PromptTemplate[] = [
  {
    name: "review-pr",
    beschreibung:
      "Strukturierter Pull-Request-Review nach Hausstandards. Server liefert vorgefertigte Sektionen.",
    arguments: [
      { name: "repo", beschreibung: "owner/name", required: true, beispiel: "JereIsThere/auge-2" },
      { name: "pr", beschreibung: "PR-Nummer", required: true, beispiel: "23" },
      { name: "focus", beschreibung: "Schwerpunkt-Bereich", required: false, beispiel: "Performance" },
    ],
    template:
      'Du bist Senior-Reviewer für das Repo {{repo}}.\n\nReview PR #{{pr}}. Strukturiere die Antwort wie folgt:\n1. KORREKTHEIT — Bugs, Edge-Cases\n2. STRUKTUR — Layering, Naming\n3. TESTS — Coverage, Edge-Cases abgedeckt?\n4. STIL — Konsistenz mit Codebase\n\nFokus diesmal: {{focus}}\n\nSei direkt, lobe nicht reflexartig.',
  },
  {
    name: "generate-changelog",
    beschreibung:
      "Erzeugt Changelog-Eintrag aus Commits eines Zeitraums — im keepachangelog-Format.",
    arguments: [
      { name: "von", beschreibung: "Commit oder Tag (Start)", required: true, beispiel: "v1.4.0" },
      { name: "bis", beschreibung: "Commit oder Tag (Ende)", required: false, beispiel: "HEAD" },
    ],
    template:
      'Du bekommst gleich eine Liste von Commits zwischen {{von}} und {{bis}}. Erstelle einen Changelog-Eintrag im keepachangelog-Format:\n\n## [Unreleased]\n### Added\n### Changed\n### Fixed\n### Removed\n\nGruppiere Commits nach Inhalt, nicht nach Reihenfolge. Schlucke triviale (chore, deps-bump) in eine Sammelzeile.',
  },
  {
    name: "explain-code",
    beschreibung:
      "Erklär-Modus mit Erfahrungs-Level — Server kennt die Hausstandards für Anfänger-/Experten-Erklärungen.",
    arguments: [
      { name: "level", beschreibung: "anfänger | mittel | senior", required: true, beispiel: "anfänger" },
      { name: "sprache", beschreibung: "Programmiersprache", required: false, beispiel: "Python" },
    ],
    template:
      'Erklär den folgenden Code für ein {{level}}-Level. Sprache: {{sprache}}.\n\nFür ANFÄNGER: nutze Analogien, vermeide Jargon, erklär jeden nicht-trivialen Operator.\nFür MITTEL: konzentrier dich auf Design-Entscheidungen.\nFür SENIOR: nur die nicht-offensichtlichen Aspekte, Trade-offs, Pitfalls.\n\nMaximal 200 Wörter.',
  },
];

function fuelleTemplate(tpl: string, werte: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => werte[key] ?? `{{${key}}}`);
}

export default function Prompts() {
  const [aktiv, setAktiv] = useState(0);
  const t = TEMPLATES[aktiv];
  const initial: Record<string, string> = {};
  t.arguments.forEach((a) => (initial[a.name] = ""));
  const [werte, setWerte] = useState<Record<string, string>>(initial);

  const setWert = (name: string, w: string) => setWerte((s) => ({ ...s, [name]: w }));

  function templateWechseln(i: number) {
    setAktiv(i);
    const n: Record<string, string> = {};
    TEMPLATES[i].arguments.forEach((a) => (n[a.name] = ""));
    setWerte(n);
  }

  const gefuellt = fuelleTemplate(t.template, werte);
  const allesGefuellt = t.arguments.filter((a) => a.required).every((a) => werte[a.name]?.length > 0);

  return (
    <div className="lesson-card">
      <h2>Prompts — wiederverwendbare Templates</h2>
      <p className="lesson-description">
        Prompts sind die dritte Säule: parametrisierte Texte, die ein Server
        anbietet. Sie sind <em>nutzergetriggert</em> (oft als Slash-Command in
        der Chat-UI), nicht modellgetriggert wie Tools.
      </p>

      <div className="info-box">
        <strong>Kurzfassung:</strong> Der Server pflegt eine Bibliothek von
        Prompt-Templates mit benannten Argumenten. Der Client zeigt sie z.B. als
        &bdquo;/review-pr&ldquo; in der Slash-Command-Liste. Beim Aufruf fragt
        der Client die Argumente ab, schickt sie an den Server, und der Server
        liefert den fertigen Prompt-Text zurück — der dann ins LLM geht.
      </div>

      <h3>Template-Player</h3>
      <p style={{ fontSize: "0.9rem", color: "#475569" }}>
        Wähl ein Template, fülle die Argumente aus, sieh das Ergebnis live.
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
          {TEMPLATES.map((tpl, i) => (
            <button
              key={tpl.name}
              type="button"
              className="toggle-code"
              onClick={() => templateWechseln(i)}
              style={{
                textAlign: "left",
                background: i === aktiv ? "#ecfdf5" : "transparent",
                borderColor: i === aktiv ? "#10b981" : "#d1d5db",
                color: i === aktiv ? "#064e3b" : "#374151",
                fontWeight: i === aktiv ? 700 : 500,
                fontSize: "0.85rem",
                padding: "8px 10px",
              }}
            >
              <div style={{ fontFamily: "ui-monospace, monospace" }}>/{tpl.name}</div>
              <div style={{ marginTop: 2, fontSize: "0.78rem", opacity: 0.7 }}>
                {tpl.beschreibung}
              </div>
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: 10 }}>
            {t.beschreibung}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.arguments.map((a) => (
              <div key={a.name} className="input-group">
                <label style={{ fontSize: "0.85rem" }}>
                  <span style={{ fontFamily: "ui-monospace, monospace" }}>
                    {a.name}
                  </span>
                  {a.required && (
                    <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>
                  )}
                  <span style={{ color: "#9ca3af", marginLeft: 6, fontSize: "0.78rem" }}>
                    — {a.beschreibung}
                  </span>
                </label>
                <input
                  type="text"
                  value={werte[a.name] ?? ""}
                  placeholder={`z.B. ${a.beispiel}`}
                  onChange={(e) => setWert(a.name, e.target.value)}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#475569",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>📤 Ergebnis (geht ins LLM)</span>
              {!allesGefuellt && (
                <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>
                  Pflichtfelder noch leer
                </span>
              )}
            </div>
            <pre
              className="mono"
              style={{
                fontSize: "0.8rem",
                background: allesGefuellt ? "#f0fdf4" : "#f3f4f6",
                padding: "10px 12px",
                borderRadius: 6,
                whiteSpace: "pre-wrap",
                overflowX: "auto",
                border: allesGefuellt ? "1px solid #86efac" : "1px solid #e5e7eb",
                margin: 0,
              }}
            >
              {gefuellt}
            </pre>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Drei Lebenszyklus-Stufen</h3>
      <ul className="step-list">
        <li>
          <code>prompts/list</code> — der Client fragt zu Beginn nach allen
          verfügbaren Templates. Der Server liefert Name, Beschreibung und
          Argument-Schema.
        </li>
        <li>
          <code>prompts/get</code> — der Client fragt nach dem fertigen
          Prompt mit konkreten Argumenten. Der Server rendert das Template und
          gibt eine Message-Liste zurück (mit Rollen: user/assistant).
        </li>
        <li>
          <strong>Senden</strong> — das LLM bekommt diese Messages als
          Konversation und antwortet. Der Server ist danach raus.
        </li>
      </ul>

      <DepthBox variant="why" title="Warum auf dem Server, nicht in der Chat-Anwendung?">
        Weil der Server die Hausstandards kennt: das Postgres-Server-Team weiß
        am besten, wie ein guter Query-Review-Prompt für ihr Datenmodell
        aussieht. Statt jeden Chat-Client zu zwingen, all diese Prompts
        nachzubauen, pflegt der Server sie — ein zentraler Ort, alle Clients
        profitieren. Faktor: Wenn das Team den Prompt verbessert, müssen die
        Clients nichts updaten.
      </DepthBox>

      <DepthBox variant="mistake" title="Prompts ≠ Tools mit Text als Argument">
        Klar, technisch könntest du einen <code>review_pr</code>-Tool bauen,
        das einen vorgefertigten Prompt zurückgibt — und das Modell ruft es
        auf. Aber: Prompts sind <em>nutzer-initiiert</em>. Der Nutzer tippt{" "}
        <code>/review-pr 23</code> und weiß explizit, welche Aktion folgt. Ein
        Tool-Aufruf passiert dagegen mitten in einer LLM-Antwort, oft ohne
        dass der Nutzer es aktiv anfordert — anderes UX-Vertrauensmodell.
      </DepthBox>

      <DepthBox variant="deeper" title="Multi-Message-Prompts">
        Ein Prompt kann mehrere Messages zurückgeben — z.B. eine simulierte
        Konversation (system → user → assistant → user) als Few-Shot-Beispiel.
        Auch <em>Resources einbetten</em> ist möglich: ein Prompt-Result kann
        einen <code>resource</code>-Block enthalten mit URI; der Client liest
        die Resource und hängt sie der Konversation an. So baut man z.B. einen
        Prompt &bdquo;Reviewe die Datei X&ldquo; ohne dass der Nutzer die Datei
        manuell anhängen muss.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Slash-Commands in IDEs (Cursor, Claude Code — exakt dieses Pattern),
        Prompt-Bibliotheken wie LangChain Hub (zentralisierte Prompts, aber
        ohne MCP-Standard), und System-Prompts (ähnlicher Geist, aber statisch
        und vom Client gesetzt — Prompts hier sind dynamisch und vom Server).
      </DepthBox>
    </div>
  );
}
