"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

type Doc = {
  id: string;
  text: string;
  embScore: number; // initiales Embedding-Ranking
  ceScore: number; // nach Cross-Encoder-Reranking
};

const DOCS: Doc[] = [
  {
    id: "A",
    text: "TLS verschlüsselt die Verbindung zwischen Browser und Server mit asymmetrischer Krypto im Handshake.",
    embScore: 0.81,
    ceScore: 0.94,
  },
  {
    id: "B",
    text: "Asymmetrische Kryptographie nutzt ein Schlüsselpaar aus öffentlichem und privatem Schlüssel.",
    embScore: 0.79,
    ceScore: 0.72,
  },
  {
    id: "C",
    text: "Symmetrische Verschlüsselung ist schnell, braucht aber einen gemeinsamen Schlüssel.",
    embScore: 0.77,
    ceScore: 0.41,
  },
  {
    id: "D",
    text: "Das TLS-Protokoll führt einen Handshake durch, in dem sich beide Seiten authentifizieren.",
    embScore: 0.76,
    ceScore: 0.91,
  },
  {
    id: "E",
    text: "Hash-Funktionen wie SHA-256 sind keine Verschlüsselung — sie sind Einwegfunktionen.",
    embScore: 0.74,
    ceScore: 0.18,
  },
  {
    id: "F",
    text: "X.509-Zertifikate binden einen öffentlichen Schlüssel an eine Identität, signiert von einer CA.",
    embScore: 0.72,
    ceScore: 0.83,
  },
  {
    id: "G",
    text: "AES ist der weltweit am häufigsten genutzte symmetrische Algorithmus.",
    embScore: 0.7,
    ceScore: 0.22,
  },
];

const QUERY = "Wie läuft der TLS-Handshake ab?";

export default function CrossEncoder() {
  const [modus, setModus] = useState<"embedding" | "ce">("embedding");

  const sortiert = [...DOCS].sort((a, b) =>
    modus === "embedding" ? b.embScore - a.embScore : b.ceScore - a.ceScore
  );

  return (
    <div className="lesson-card">
      <h2>Cross-Encoder Re-Ranking</h2>
      <p className="lesson-description">
        Embedding-Suche ist schnell, aber unscharf. Ein Cross-Encoder schaut
        sich Query und Kandidat <em>zusammen</em> an und liefert deutlich
        genauere Scores — zum Preis von einer LLM-artigen Inference pro Paar.
        Daher: erst Embedding-Top-50, dann Cross-Encoder auf Top-5.
      </p>

      <div className="info-box">
        <strong>Bi-Encoder</strong>: Query und Doc werden <em>unabhängig</em>{" "}
        in Vektoren übersetzt → Cosine. Doc-Vektoren können vorab gerechnet
        werden, Query dauert {"~"}10 ms.
        <br />
        <strong>Cross-Encoder</strong>: Query + Doc werden <em>zusammen</em>{" "}
        durch ein Transformer-Modell gejagt → Score. Pro Paar {"~"}50–100 ms,
        keine Vorberechnung möglich.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 4,
        }}
      >
        <div
          style={{
            padding: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "#fafafa",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Bi-Encoder</div>
          <pre className="mono" style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.6 }}>
{`Query  → Encoder → V_q
Doc 1  → Encoder → V_1
Doc 2  → Encoder → V_2
…
Score_i = cosine(V_q, V_i)`}
          </pre>
        </div>
        <div
          style={{
            padding: 14,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "#fefce8",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Cross-Encoder</div>
          <pre className="mono" style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.6 }}>
{`[Query] [SEP] [Doc 1] → Encoder → Score_1
[Query] [SEP] [Doc 2] → Encoder → Score_2
…
(N separate Inferences nötig)`}
          </pre>
        </div>
      </div>

      <div className="input-group" style={{ marginTop: 12 }}>
        <label>Beispiel-Query</label>
        <div
          style={{
            padding: "10px 14px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.92rem",
          }}
        >
          &bdquo;{QUERY}&ldquo;
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          type="button"
          onClick={() => setModus("embedding")}
          className="toggle-code"
          style={{
            background: modus === "embedding" ? "#eef2ff" : "transparent",
            borderColor: modus === "embedding" ? "#3b82f6" : "#d1d5db",
            color: modus === "embedding" ? "#1d4ed8" : "#374151",
          }}
        >
          1. Embedding-Ranking (Top 7)
        </button>
        <button
          type="button"
          onClick={() => setModus("ce")}
          className="toggle-code"
          style={{
            background: modus === "ce" ? "#ecfdf5" : "transparent",
            borderColor: modus === "ce" ? "#10b981" : "#d1d5db",
            color: modus === "ce" ? "#047857" : "#374151",
          }}
        >
          2. Nach Cross-Encoder Re-Ranking
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sortiert.map((d, i) => {
          const score = modus === "embedding" ? d.embScore : d.ceScore;
          const relevant = modus === "ce" && score > 0.7;
          return (
            <div
              key={d.id}
              className="result-box"
              style={{
                borderLeft: relevant ? "3px solid #10b981" : "3px solid #d1d5db",
                opacity: modus === "ce" && score < 0.4 ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    width: 18,
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  className="pill"
                  style={{
                    background: "#f3f4f6",
                    borderColor: "#d1d5db",
                    color: "#374151",
                  }}
                >
                  {d.id}
                </span>
                <span style={{ flex: 1, fontSize: "0.88rem" }}>{d.text}</span>
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: relevant ? "#047857" : "#52525b",
                  }}
                >
                  {score.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <DepthBox variant="why" title="Warum macht der Cross-Encoder das besser?">
        Im Bi-Encoder muss der Query-Vektor zu <em>allen denkbaren</em> Docs
        passen. Das ist ein Generalisierungs-Kompromiss. Der Cross-Encoder
        sieht Query und Doc zusammen und kann genau auf diesen einen Vergleich
        feintunen — z.B. erkennen, dass &bdquo;TLS-Handshake&ldquo; in einer
        Frage konkret nach dem <em>Protokollablauf</em> fragt, nicht nur nach
        einer allgemeinen TLS-Erklärung.
      </DepthBox>

      <RagQuelle
        id="karpukhin2020-dpr"
        kernaussagen={[
          "Etabliert Dense Passage Retrieval (DPR): zwei BERT-Encoder, einer für die Query, einer für die Passage.",
          "Schlägt BM25 auf Open-Domain-QA-Benchmarks deutlich — beweist erstmals, dass Dense-Retrieval praktikabel ist.",
          "Der Prototyp moderner Bi-Encoder-Retrieval-Architekturen, bis heute Referenz.",
        ]}
      />

      <DepthBox variant="mistake" title="Cross-Encoder direkt auf 10.000 Docs">
        Cross-Encoder skaliert linear mit Korpus-Größe. 10.000 Docs × 50 ms =
        8 Minuten pro Query. Das ist nicht praktisch. Daher immer
        zweistufig: <em>Recall</em> (schnell, Embedding-Suche, Top-50) +{" "}
        <em>Precision</em> (langsamer, Cross-Encoder, Top-5).
      </DepthBox>

      <DepthBox variant="deeper" title="Welcher Cross-Encoder?">
        Open Source: <code>BAAI/bge-reranker-large</code>,{" "}
        <code>cross-encoder/ms-marco-MiniLM-L-12-v2</code>. Managed:
        Cohere Rerank, Voyage rerank, Jina Reranker. Faustregel: ein
        Reranker-Modell darf gerne ein Subset der Sprachen unterstützen,
        die du brauchst (Multi-Lingual-Modelle sind oft schwächer).
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        ColBERT (Late-Interaction-Modelle als Mittelweg zwischen Bi- und
        Cross-Encoder), LLM-as-Judge (das LLM selbst nach jedem Kandidaten
        fragen — teurer, aber zero-shot anpassbar), und Diversity-Reranking
        (MMR: nicht nur die ähnlichsten, sondern eine diversifizierte Auswahl).
      </DepthBox>

      <RagQuelle
        id="khattab2020-colbert"
        kernaussagen={[
          "Mittelweg zwischen Bi- und Cross-Encoder: jedes Token bekommt einen Vektor, Similarity wird per Token-pair-MaxSim gerechnet.",
          "Late Interaction = teure Vergleichs-Operation läuft erst zur Query-Zeit, aber pro-Token statt pro-Dokument-Encoding.",
          "Genauigkeit nahe an Cross-Encodern, Geschwindigkeit deutlich näher an Bi-Encodern — populär für Production-Retrieval.",
        ]}
      />
    </div>
  );
}
