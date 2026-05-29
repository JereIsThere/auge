"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

type Schritt = {
  id: string;
  titel: string;
  beschreibung: string;
  beispiel: string;
};

const SCHRITTE: Schritt[] = [
  {
    id: "frage",
    titel: "Frage entgegennehmen",
    beschreibung:
      "Die Nutzerfrage wird so wie sie ist genommen — manchmal aber auch zunächst umformuliert (Query Rewriting), z.B. um Folgefragen mit dem Chat-Verlauf aufzulösen.",
    beispiel: '"Wie funktioniert eigentlich Diffie-Hellman?"',
  },
  {
    id: "embed",
    titel: "Frage einbetten",
    beschreibung:
      "Die Frage wird mit demselben Embedding-Modell, das auch für die Wissensbasis benutzt wurde, in einen Vektor übersetzt. Wichtig: dasselbe Modell für Query und Dokumente.",
    beispiel: "[0.12, -0.43, 0.88, …] (≈768 oder 1536 Dimensionen)",
  },
  {
    id: "retrieve",
    titel: "Retrieve",
    beschreibung:
      "Die Vektor-DB sucht die k Dokumente, deren Embedding der Frage am ähnlichsten ist (Cosine Similarity oder Dot Product). Typisch k = 4–10.",
    beispiel:
      "→ Doc 17 (sim 0.89), Doc 42 (0.84), Doc 03 (0.79) …",
  },
  {
    id: "rerank",
    titel: "Re-Ranking (optional)",
    beschreibung:
      "Ein Cross-Encoder vergleicht jede der Top-k Stellen direkt mit der Frage (paarweise) und sortiert genauer um. Teurer, aber qualitativ deutlich besser als reine Embedding-Ähnlichkeit.",
    beispiel: "→ Doc 42, Doc 17, Doc 03 (neue Reihenfolge)",
  },
  {
    id: "augment",
    titel: "Augment",
    beschreibung:
      "Die finalen Top-Dokumente werden in den Prompt eingebaut — typisch als nummerierte Liste mit Quellen-IDs, damit das Modell darauf verweisen kann.",
    beispiel:
      'System: "Antworte auf Basis der folgenden Auszüge: [1] … [2] …"',
  },
  {
    id: "generate",
    titel: "Generate",
    beschreibung:
      "Das LLM antwortet, idealerweise mit Quellenangaben ([1], [2]). Die Antwort kann zusätzlich post-validiert werden: kommt jede Aussage in den Quellen vor?",
    beispiel:
      '"Diffie-Hellman erlaubt zwei Parteien, sich auf ein gemeinsames Geheimnis zu einigen … [1, 2]"',
  },
];

export default function Pipeline() {
  const [aktiv, setAktiv] = useState(0);

  return (
    <div className="lesson-card">
      <h2>Die RAG-Pipeline Schritt für Schritt</h2>
      <p className="lesson-description">
        Sechs Schritte vom Klick bis zur Antwort. Klick einen an, um die
        Details zu sehen.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SCHRITTE.map((s, i) => {
          const isActive = i === aktiv;
          const isDone = i < aktiv;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setAktiv(i)}
              className={`flow-step ${isActive ? "active" : isDone ? "done" : ""}`}
              style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
            >
              <div className="flow-step-num">{i + 1}</div>
              <div className="flow-step-body">
                <div className="flow-step-title">{s.titel}</div>
                {isActive && (
                  <>
                    <div className="flow-step-desc">{s.beschreibung}</div>
                    <pre className="mono" style={{ marginTop: 8, fontSize: "0.82rem", whiteSpace: "pre-wrap" }}>
                      {s.beispiel}
                    </pre>
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
          onClick={() => setAktiv((a) => Math.min(SCHRITTE.length - 1, a + 1))}
          disabled={aktiv === SCHRITTE.length - 1}
        >
          weiter →
        </button>
      </div>

      <DepthBox variant="why" title="Warum Re-Ranking trotz Embeddings?">
        Embeddings sind ein <em>Bi-Encoder</em>-Setup: Frage und Dokumente
        werden unabhängig voneinander in Vektoren übersetzt. Das ist schnell
        (man kann die Dokument-Vektoren vorab berechnen), aber unscharf.
        Cross-Encoder schauen sich <em>Frage und Kandidat zusammen</em> an und
        liefern viel feinere Scores — kosten dafür eine LLM-artige Inference
        pro Paar. Daher: erst Embedding-Top-50 retrieven, dann mit
        Cross-Encoder auf Top-5 re-ranken.
      </DepthBox>

      <DepthBox variant="mistake" title="Verschiedene Embedding-Modelle für Query und Dokumente">
        Klassischer Fail. Wenn du die Wissensbasis mit
        <code> text-embedding-3-small </code>
        eingebettet hast, musst du die Query <em>auch</em> mit
        <code> text-embedding-3-small </code>
        einbetten — die Vektor-Räume sind nicht kompatibel zwischen
        verschiedenen Modellen oder Modell-Versionen.
      </DepthBox>

      <DepthBox variant="deeper" title="Hybrid Retrieval">
        Beste Praxis in echten Systemen: <em>BM25 (Volltextsuche)</em> +
        Embedding-Suche parallel laufen lassen, beide Ergebnislisten mit
        <em>Reciprocal Rank Fusion</em> zusammenmischen, <em>dann</em>
        re-ranken. BM25 fängt exakte Treffer (Eigennamen, Fachbegriffe), die
        Embeddings <em>nicht zuverlässig finden</em>.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Query Rewriting (HyDE: erst mit dem LLM eine hypothetische Antwort
        generieren, <em>die</em> einbetten und damit suchen), Context Window
        Management (zu viele Chunks → Modell ignoriert die Mitte —
        &bdquo;lost in the middle&ldquo;-Effekt), Citation Validation
        (post-hoc prüfen ob jede Aussage in den Quellen steht).
      </DepthBox>

      <RagQuelle
        id="gao2022-hyde"
        kernaussagen={[
          "HyDE = Hypothetical Document Embeddings: das LLM generiert zur Query eine fiktive Antwort, die wird eingebettet und damit gesucht.",
          "Funktioniert zero-shot besser als reine Query-Embeddings — kurze Fragen passen schlechter ins Embedding-Space als komplette Antwort-Absätze.",
          "Trade-off: zusätzlicher LLM-Roundtrip pro Query erhöht Latenz und Kosten.",
        ]}
      />
    </div>
  );
}
