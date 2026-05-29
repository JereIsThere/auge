"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

type Doc = { id: string; titel: string };

const KORPUS: Doc[] = [
  { id: "D1", titel: "Einführung in Vektor-Datenbanken" },
  { id: "D2", titel: "pgvector mit Postgres 16 betreiben" },
  { id: "D3", titel: "Mathematische Grundlagen von Cosine-Similarity" },
  { id: "D4", titel: "Wie ANN-Algorithmen funktionieren" },
  { id: "D5", titel: "HNSW-Index in Faiss konfigurieren" },
  { id: "D6", titel: "Embedding-Modelle vergleichen" },
  { id: "D7", titel: "Chunking-Strategien für lange Dokumente" },
  { id: "D8", titel: "Aufbau eines Recommendation Systems" },
];

type Query = {
  text: string;
  bm25: Array<{ id: string; score: number; warum: string }>;
  vektor: Array<{ id: string; score: number; warum: string }>;
};

const QUERIES: Query[] = [
  {
    text: "pgvector",
    bm25: [
      { id: "D2", score: 0.92, warum: "Exakter Treffer im Titel" },
      { id: "D1", score: 0.18, warum: "Verwandtes Thema, schwacher Match" },
    ],
    vektor: [
      { id: "D2", score: 0.88, warum: "Semantisch direkt" },
      { id: "D1", score: 0.71, warum: "Vektor-DBs sind ähnlich" },
      { id: "D5", score: 0.65, warum: "Index-Konfiguration verwandt" },
      { id: "D4", score: 0.58, warum: "ANN-Algorithmen relevant" },
    ],
  },
  {
    text: "Warum Embeddings ähnliche Bedeutung finden",
    bm25: [
      { id: "D6", score: 0.31, warum: "Wort 'Embedding' kommt vor" },
      { id: "D3", score: 0.22, warum: "Wort 'Similarity' im Titel" },
    ],
    vektor: [
      { id: "D6", score: 0.84, warum: "Semantisch passend" },
      { id: "D3", score: 0.79, warum: "Mathematik dahinter" },
      { id: "D1", score: 0.62, warum: "Grundlagen-Lektion" },
      { id: "D4", score: 0.55, warum: "Wie Algorithmen das machen" },
    ],
  },
  {
    text: "HNSW",
    bm25: [
      { id: "D5", score: 0.95, warum: "Exakter Token-Match" },
    ],
    vektor: [
      { id: "D5", score: 0.91, warum: "Direkt benannt" },
      { id: "D4", score: 0.74, warum: "ANN-Familie" },
      { id: "D1", score: 0.6, warum: "Allgemeine Einführung" },
    ],
  },
];

// Reciprocal Rank Fusion: combinedScore = Σ 1 / (k + rank)
function rrf(query: Query, k: number = 60): Array<{ id: string; score: number }> {
  const scores = new Map<string, number>();
  query.bm25.forEach((d, i) => {
    scores.set(d.id, (scores.get(d.id) ?? 0) + 1 / (k + i + 1));
  });
  query.vektor.forEach((d, i) => {
    scores.set(d.id, (scores.get(d.id) ?? 0) + 1 / (k + i + 1));
  });
  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}

function titelVon(id: string): string {
  return KORPUS.find((d) => d.id === id)?.titel ?? id;
}

export default function Hybrid() {
  const [idx, setIdx] = useState(0);
  const q = QUERIES[idx];
  const fused = rrf(q);

  return (
    <div className="lesson-card">
      <h2>Hybrid Retrieval: BM25 + Vektor</h2>
      <p className="lesson-description">
        BM25 (klassische Volltextsuche) und Vektor-Suche haben unterschiedliche
        Stärken: BM25 ist Trumpf bei exakten Treffern (Eigennamen, Fachbegriffen),
        Vektor-Suche bei Synonymen und Paraphrasierungen. Best practice ist,
        beide parallel laufen zu lassen und die Ergebnislisten mit{" "}
        <strong>Reciprocal Rank Fusion (RRF)</strong> zu mischen.
      </p>

      <div className="input-group">
        <label>Beispiel-Query wählen</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {QUERIES.map((qq, i) => (
            <button
              key={qq.text}
              type="button"
              onClick={() => setIdx(i)}
              className="toggle-code"
              style={{
                background: idx === i ? "#eef2ff" : "transparent",
                borderColor: idx === i ? "#3b82f6" : "#d1d5db",
                color: idx === i ? "#1d4ed8" : "#374151",
              }}
            >
              &bdquo;{qq.text}&ldquo;
            </button>
          ))}
        </div>
      </div>

      <div className="result-grid">
        <div className="result-box">
          <div className="result-label">BM25 (Volltext)</div>
          <ol style={{ marginTop: 6, paddingLeft: 18, fontSize: "0.88rem" }}>
            {q.bm25.map((d) => (
              <li key={d.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{titelVon(d.id)}</span>
                <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                  Score {d.score.toFixed(2)} · {d.warum}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="result-box">
          <div className="result-label">Vektor (Embeddings)</div>
          <ol style={{ marginTop: 6, paddingLeft: 18, fontSize: "0.88rem" }}>
            {q.vektor.map((d) => (
              <li key={d.id} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{titelVon(d.id)}</span>
                <div style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                  Score {d.score.toFixed(2)} · {d.warum}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="success-box">
        <strong>Nach RRF-Fusion:</strong>
        <ol style={{ marginTop: 6, paddingLeft: 18 }}>
          {fused.slice(0, 4).map((f) => (
            <li key={f.id}>
              <span style={{ fontFamily: "ui-monospace, monospace" }}>{f.id}</span>{" "}
              — {titelVon(f.id)}{" "}
              <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                (rrf {f.score.toFixed(4)})
              </span>
            </li>
          ))}
        </ol>
      </div>

      <DepthBox variant="why" title="Warum gerade RRF, nicht Score-Addition?">
        BM25 und Vektor-Scores leben in völlig unterschiedlichen Skalen — BM25
        kann unbeschränkt nach oben gehen, Cosine ist 0–1. Direkte Addition
        ergibt Quatsch. RRF nimmt nur die <em>Ränge</em> (nicht die Scores) und
        addiert <code>1 / (k + rank)</code>. Das macht beide Listen
        skalierungsfrei vergleichbar.
      </DepthBox>

      <DepthBox variant="mistake" title="Nur Vektor reicht — angeblich">
        Klassische Falle: man baut eine glänzende Vektor-Pipeline, ignoriert
        BM25 als &bdquo;alt&ldquo;, und dann sucht der User nach
        &bdquo;PostgreSQL 17&ldquo; und findet alles über &bdquo;Datenbanken
        allgemein&ldquo; — aber nicht die spezifische Version. BM25 fängt
        diese exakten Token-Treffer zuverlässig.
      </DepthBox>

      <RagQuelle
        id="robertson2009-bm25"
        kernaussagen={[
          "Definitive Aufarbeitung des Probabilistic Relevance Framework, aus dem BM25 hervorgegangen ist.",
          "BM25 = TF mit Sättigung (k1) + Längen-Normalisierung (b) + IDF-Gewichtung. Seit ~30 Jahren der Volltext-Standard.",
          "Trotz LLM-Hype unverändert im Backend von Elasticsearch, OpenSearch, Lucene — und in jedem ernsthaften Hybrid-Setup.",
        ]}
      />

      <DepthBox variant="deeper" title="Sparse + Dense in einem Index">
        Pinecone, Qdrant und Weaviate unterstützen <em>Sparse-Dense Hybrid</em>:
        BM25 wird als sparser Vektor (Token-IDs als Indizes, TF-IDF-Werte als
        Magnituden) in derselben DB gespeichert wie der dichte Embedding-Vektor.
        Die Suche fusioniert beide in einer einzigen Query — schneller als
        zwei separate Round-Trips. Stichwort: <strong>SPLADE</strong> für
        gelernte Sparse-Repräsentationen.
      </DepthBox>

      <RagQuelle
        id="formal2021-splade"
        kernaussagen={[
          "Ersetzt klassische TF-IDF-Gewichte durch Vorhersagen aus einem BERT-Modell — gelernte sparse Term-Gewichte.",
          "Expandiert die Query um semantisch verwandte Terme (auto → fahrzeug, pkw, wagen), bleibt aber sparse + invertiert-index-kompatibel.",
          "Schließt einen großen Teil der Lücke zwischen BM25 und Dense-Retrieval — bei Sparse-Geschwindigkeit.",
        ]}
      />

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Re-Ranking (RRF-Fusion liefert Top-50, Cross-Encoder wählt daraus die
        besten 5), Query Rewriting (HyDE expandiert eine kurze Query in eine
        hypothetische Antwort, die für die Embedding-Suche besser passt) und
        Term-Boost (Wichtige Tokens im BM25-Score höher gewichten).
      </DepthBox>
    </div>
  );
}
