"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

// Mock-Retrieval: 10 abgerufene Docs, davon einige relevant
type Treffer = { id: string; relevant: boolean };

const RETRIEVED: Treffer[] = [
  { id: "D1", relevant: true },
  { id: "D2", relevant: false },
  { id: "D3", relevant: true },
  { id: "D4", relevant: true },
  { id: "D5", relevant: false },
  { id: "D6", relevant: false },
  { id: "D7", relevant: true },
  { id: "D8", relevant: false },
  { id: "D9", relevant: false },
  { id: "D10", relevant: true },
];

// Im Gesamtkorpus existieren 6 relevante Docs (D1,D3,D4,D7,D10 + 1 nicht retrieved)
const GESAMT_RELEVANT = 6;

function metriken(top: Treffer[], gesamtRelevant: number) {
  const relevantInTop = top.filter((t) => t.relevant).length;
  const precision = top.length === 0 ? 0 : relevantInTop / top.length;
  const recall = gesamtRelevant === 0 ? 0 : relevantInTop / gesamtRelevant;

  // Mean Reciprocal Rank: 1 / Position des ersten Treffers
  const erster = top.findIndex((t) => t.relevant);
  const mrr = erster === -1 ? 0 : 1 / (erster + 1);

  // nDCG@k vereinfacht: relevant = 1, sonst 0; binary version
  const dcg = top.reduce((acc, t, i) => acc + (t.relevant ? 1 / Math.log2(i + 2) : 0), 0);
  // Ideal-DCG: alle relevanten zuerst
  const idealCount = Math.min(top.length, gesamtRelevant);
  const idcg = Array.from({ length: idealCount }, (_, i) => 1 / Math.log2(i + 2)).reduce(
    (a, b) => a + b,
    0
  );
  const ndcg = idcg === 0 ? 0 : dcg / idcg;

  return { precision, recall, mrr, ndcg, relevantInTop };
}

export default function Eval() {
  const [k, setK] = useState(5);
  const top = useMemo(() => RETRIEVED.slice(0, k), [k]);
  const m = useMemo(() => metriken(top, GESAMT_RELEVANT), [top]);

  return (
    <div className="lesson-card">
      <h2>RAG-Evaluation</h2>
      <p className="lesson-description">
        Wie misst man, ob ein RAG-System gut ist? Zwei Schichten: Retrieval
        (holt es die richtigen Stücke?) und End-to-End (ist die Antwort
        korrekt + treu zum Kontext?).
      </p>

      <h3>Retrieval-Metriken (interaktiv)</h3>
      <p style={{ fontSize: "0.9rem", color: "#52525b" }}>
        10 Dokumente wurden retrieved. Davon sind insgesamt {" "}
        <strong>{RETRIEVED.filter((t) => t.relevant).length}</strong>{" "}
        relevant. Im Gesamtkorpus gibt es <strong>{GESAMT_RELEVANT}</strong>{" "}
        relevante Dokumente (eines wurde nicht gefunden).
      </p>

      <div className="input-group">
        <label>k (Anzahl betrachteter Top-Ergebnisse): {k}</label>
        <input
          type="range"
          min={1}
          max={RETRIEVED.length}
          step={1}
          value={k}
          onChange={(e) => setK(parseInt(e.target.value, 10))}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {RETRIEVED.map((t, i) => {
          const inTopK = i < k;
          return (
            <div
              key={t.id}
              className="result-box"
              style={{
                opacity: inTopK ? 1 : 0.3,
                borderLeft: t.relevant
                  ? "3px solid #10b981"
                  : "3px solid #d1d5db",
                background: inTopK ? "#f9fafb" : "white",
                padding: "8px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  fontSize: "0.85rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    width: 28,
                    color: "#6b7280",
                  }}
                >
                  #{i + 1}
                </span>
                <span style={{ fontWeight: 600, width: 40 }}>{t.id}</span>
                <span
                  className="pill"
                  style={
                    t.relevant
                      ? { background: "#ecfdf5", borderColor: "#6ee7b7", color: "#065f46" }
                      : { background: "#f3f4f6", borderColor: "#d1d5db", color: "#52525b" }
                  }
                >
                  {t.relevant ? "relevant" : "irrelevant"}
                </span>
                {inTopK && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.7rem",
                      color: "#52525b",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    in Top-{k}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="result-grid">
        <div className="result-box">
          <div className="result-label">Precision@{k}</div>
          <div className="result-value" style={{ color: "#1d4ed8" }}>
            {m.precision.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#52525b" }}>
            {m.relevantInTop} von {k} sind relevant
          </div>
        </div>
        <div className="result-box">
          <div className="result-label">Recall@{k}</div>
          <div className="result-value" style={{ color: "#7c3aed" }}>
            {m.recall.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#52525b" }}>
            {m.relevantInTop} von {GESAMT_RELEVANT} insgesamt relevanten
          </div>
        </div>
        <div className="result-box">
          <div className="result-label">MRR</div>
          <div className="result-value" style={{ color: "#dc2626" }}>
            {m.mrr.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#52525b" }}>
            1 / Position des ersten Treffers
          </div>
        </div>
        <div className="result-box">
          <div className="result-label">nDCG@{k}</div>
          <div className="result-value" style={{ color: "#047857" }}>
            {m.ndcg.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#52525b" }}>
            Ranking-Qualität (1.0 = optimal sortiert)
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>End-to-End-Metriken (RAGAS-Stil)</h3>
      <div className="kv-table" style={{ fontSize: "0.9rem" }}>
        <dt style={{ fontFamily: "inherit" }}>Faithfulness:</dt>
        <dd style={{ fontFamily: "inherit" }}>
          Stehen alle Aussagen der Antwort auch im Kontext? (0 = alles halluziniert, 1 = alles belegt)
        </dd>
        <dt style={{ fontFamily: "inherit" }}>Answer Relevancy:</dt>
        <dd style={{ fontFamily: "inherit" }}>
          Beantwortet die Antwort die Frage überhaupt?
        </dd>
        <dt style={{ fontFamily: "inherit" }}>Context Precision:</dt>
        <dd style={{ fontFamily: "inherit" }}>
          Wie viel vom abgerufenen Kontext ist tatsächlich relevant für die Antwort?
        </dd>
        <dt style={{ fontFamily: "inherit" }}>Context Recall:</dt>
        <dd style={{ fontFamily: "inherit" }}>
          Wie viel der notwendigen Information ist im Kontext gelandet? (braucht Ground-Truth)
        </dd>
      </div>

      <RagQuelle
        id="es2023-ragas"
        kernaussagen={[
          "Definiert die heute meistverbreiteten End-to-End-Metriken für RAG: Faithfulness, Answer Relevancy, Context Precision, Context Recall.",
          "Reference-free: Faithfulness und Answer Relevancy brauchen kein Ground-Truth — ein Judge-LLM zerlegt die Antwort in Behauptungen und prüft jede gegen den Kontext.",
          "Open-Source-Library (ragas) ist Standard-Tool für RAG-Eval, hat sich gegen TruLens, DeepEval etc. durchgesetzt.",
        ]}
      />

      <DepthBox variant="why" title="Warum nicht einfach nur Precision?">
        Precision allein ignoriert, wie viel du <em>verpasst</em> hast.
        Stell dir vor: 1 retrieved Dokument, 1 davon relevant → Precision = 1.0.
        Aber wenn es 9 weitere relevante Docs im Korpus gibt, hast du nur
        10 % der Wahrheit gefunden — Recall = 0.1. Recall@k zwingt dich,
        beides zu balancieren.
      </DepthBox>

      <DepthBox variant="mistake" title="Eval ohne Ground-Truth">
        Ohne ein per Hand gelabeltes Eval-Set (typisch 50–200 Query/Doc-Paare)
        kannst du Retrieval-Metriken nicht berechnen. Schritt 0 jedes
        RAG-Projekts: ein paar Stunden investieren, eine Gold-Standard-Liste
        bauen. Sonst optimierst du blind.
      </DepthBox>

      <DepthBox variant="deeper" title="MRR vs. nDCG">
        MRR fokussiert auf das <em>erste</em> relevante Ergebnis — perfekt
        für Suchanwendungen, wo die Top-1-Antwort zählt. nDCG bewertet die
        ganze Liste mit Diskontierung (oben relevant = mehr Wert als unten
        relevant). Für RAG, wo das LLM mehrere Top-k Chunks bekommt, ist nDCG
        oft aussagekräftiger.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        RAGAS (Python-Library für die End-to-End-Metriken), TruLens (ähnliche
        Idee, integriert mit LangChain), Synthetic Eval Sets (LLM erzeugt
        Fragen aus deinem Korpus — schneller, aber Bias-Risiko), und
        A/B-Tests in Production (am Ende zählt die Nutzerreaktion).
      </DepthBox>
    </div>
  );
}
