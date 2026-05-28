"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

type Wort = {
  text: string;
  x: number; // -1 .. 1
  y: number; // -1 .. 1
  gruppe: "tier" | "fahrzeug" | "gefuehl" | "essen";
};

// Handgemachte 2D-Embeddings: ähnliche Bedeutung = nahe Punkte.
// Echte Embeddings haben 768–1536 Dimensionen; diese hier sind
// nur didaktisch.
const WOERTER: Wort[] = [
  { text: "hund", x: 0.7, y: 0.55, gruppe: "tier" },
  { text: "katze", x: 0.78, y: 0.42, gruppe: "tier" },
  { text: "vogel", x: 0.55, y: 0.7, gruppe: "tier" },
  { text: "auto", x: -0.6, y: 0.6, gruppe: "fahrzeug" },
  { text: "fahrzeug", x: -0.7, y: 0.55, gruppe: "fahrzeug" },
  { text: "fahrrad", x: -0.55, y: 0.78, gruppe: "fahrzeug" },
  { text: "liebe", x: 0.4, y: -0.65, gruppe: "gefuehl" },
  { text: "freude", x: 0.55, y: -0.55, gruppe: "gefuehl" },
  { text: "schmerz", x: 0.3, y: -0.78, gruppe: "gefuehl" },
  { text: "brot", x: -0.55, y: -0.5, gruppe: "essen" },
  { text: "apfel", x: -0.68, y: -0.42, gruppe: "essen" },
  { text: "pasta", x: -0.45, y: -0.65, gruppe: "essen" },
];

const GRUPPE_FARBE: Record<Wort["gruppe"], string> = {
  tier: "#10b981",
  fahrzeug: "#3b82f6",
  gefuehl: "#ec4899",
  essen: "#f59e0b",
};

function cosine(a: Wort, b: Wort): number {
  const dot = a.x * b.x + a.y * b.y;
  const ma = Math.hypot(a.x, a.y);
  const mb = Math.hypot(b.x, b.y);
  return dot / (ma * mb);
}

const PLOT = 360; // px

export default function Embeddings() {
  const [aktiv, setAktiv] = useState<string>("hund");

  const aktuell = WOERTER.find((w) => w.text === aktiv) ?? WOERTER[0];
  const aehnlichkeiten = WOERTER
    .filter((w) => w.text !== aktuell.text)
    .map((w) => ({ wort: w, sim: cosine(aktuell, w) }))
    .sort((a, b) => b.sim - a.sim);

  // Konvertiere -1..1 -> 0..PLOT
  const toPx = (v: number) => ((v + 1) / 2) * PLOT;

  return (
    <div className="lesson-card">
      <h2>Embeddings</h2>
      <p className="lesson-description">
        Ein Embedding ist eine Übersetzung von Text in einen Zahlenvektor —
        so, dass <strong>ähnliche Bedeutung in der Geometrie nahe beieinander
        liegt</strong>. Klick auf ein Wort, um zu sehen, was &bdquo;nah&ldquo;
        und &bdquo;fern&ldquo; bedeutet.
      </p>

      <div className="info-box">
        Hier siehst du eine künstliche 2D-Welt mit 12 Wörtern. Echte
        Embedding-Modelle (z.B. <code>text-embedding-3-small</code>) nutzen{" "}
        <strong>1536 Dimensionen</strong> — die Idee bleibt aber die selbe.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
        <svg
          viewBox={`-20 -20 ${PLOT + 40} ${PLOT + 40}`}
          style={{
            width: "100%",
            maxWidth: 480,
            margin: "0 auto",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
          }}
        >
          <line x1={PLOT / 2} y1={0} x2={PLOT / 2} y2={PLOT} stroke="#e5e7eb" strokeWidth={1} />
          <line x1={0} y1={PLOT / 2} x2={PLOT} y2={PLOT / 2} stroke="#e5e7eb" strokeWidth={1} />
          {WOERTER.map((w) => {
            const istAktiv = w.text === aktuell.text;
            const farbe = GRUPPE_FARBE[w.gruppe];
            return (
              <g
                key={w.text}
                style={{ cursor: "pointer" }}
                onClick={() => setAktiv(w.text)}
              >
                {istAktiv && (
                  <circle
                    cx={toPx(w.x)}
                    cy={PLOT - toPx(w.y)}
                    r={14}
                    fill={farbe}
                    opacity={0.25}
                  />
                )}
                <circle
                  cx={toPx(w.x)}
                  cy={PLOT - toPx(w.y)}
                  r={istAktiv ? 7 : 5}
                  fill={farbe}
                  stroke={istAktiv ? "#111827" : "white"}
                  strokeWidth={istAktiv ? 2 : 1.5}
                />
                <text
                  x={toPx(w.x) + 9}
                  y={PLOT - toPx(w.y) + 4}
                  fontSize={12}
                  fontFamily="ui-monospace, monospace"
                  fill={istAktiv ? "#111827" : "#52525b"}
                  fontWeight={istAktiv ? 700 : 500}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {w.text}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="result-box">
          <div className="result-label">
            Cosine-Ähnlichkeit zu &bdquo;{aktuell.text}&ldquo;
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
            {aehnlichkeiten.map(({ wort, sim }) => (
              <div
                key={wort.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.88rem",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                <span style={{ width: 80, color: GRUPPE_FARBE[wort.gruppe] }}>{wort.text}</span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "#e5e7eb",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, (sim + 1) * 50)}%`,
                      height: "100%",
                      background: GRUPPE_FARBE[wort.gruppe],
                      borderRadius: 99,
                    }}
                  />
                </div>
                <span style={{ width: 50, textAlign: "right" }}>
                  {sim.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum ist Cosine die richtige Wahl?">
        Cosine misst nur den <em>Winkel</em> zwischen zwei Vektoren, nicht ihre
        Länge. Bei Text-Embeddings ist die Länge oft irrelevant (länger ≠
        bedeutsamer), während die Richtung die Semantik trägt. Für
        L2-normalisierte Embeddings (was die meisten Modelle ausgeben) ist
        Cosine außerdem mathematisch äquivalent zum Dot-Product — aber
        schneller zu rechnen.
      </DepthBox>

      <DepthBox variant="mistake" title="Embedding-Modelle nicht mischen">
        Wenn deine Wissensbasis mit <code>text-embedding-3-small</code>{" "}
        eingebettet wurde, <strong>muss</strong> auch die Query mit demselben
        Modell eingebettet werden. Die Vektor-Räume verschiedener Modelle (oder
        sogar verschiedener Versionen desselben Modells) sind nicht
        kompatibel — sie sind komplett anders trainiert.
      </DepthBox>

      <DepthBox variant="deeper" title="Wie viele Dimensionen?">
        Klassisch: 768 (BERT-Stil), 1024, 1536 (OpenAI text-embedding-3-small),
        3072 (text-embedding-3-large). Mehr Dimensionen = feinere Auflösung,
        aber teurer (Speicher in der Vektor-DB, Latenz beim Vergleich). OpenAI
        unterstützt <code>dimensions</code> als API-Parameter — du kannst
        3072-dim Embeddings <em>truncaten</em> auf 256, mit minimalem
        Qualitäts-Verlust durch Matryoshka-Training.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Vektor-Datenbanken (die müssen die Distanz schnell finden — typisch
        mit HNSW-Index, O(log n)), Quantization (von float32 zu int8 spart
        4× Speicher), und Sentence-Transformers (die populärsten
        Open-Source-Embedding-Modelle, z.B. <code>all-MiniLM-L6-v2</code>).
      </DepthBox>

      <DepthBox variant="history" title="Vom Wort zum Satz">
        Word2Vec (2013) war der Durchbruch: einzelne Wörter als Vektoren. Aber
        ein Wort hat in verschiedenen Kontexten verschiedene Bedeutungen
        (&bdquo;Bank&ldquo;). BERT (2018) brachte
        <em>kontextuelle Embeddings</em> — derselbe Token bekommt
        unterschiedliche Vektoren je nach Satz. Heutige Embedding-Modelle für
        RAG (text-embedding-3, BGE, E5) sind speziell für{" "}
        <em>Satz/Absatz-Ähnlichkeit</em> trainiert, nicht für einzelne Wörter.
      </DepthBox>

      <RagQuelle
        id="reimers2019-sbert"
        kernaussagen={[
          "Macht aus BERT eine effiziente Satz-Embedding-Maschine durch Siamese-Twin-Training.",
          "Vorher: BERT-Cross-Encoder pro Satzpaar (langsam). Nachher: ein Vektor pro Satz, Vergleich via Cosine (5 ms statt 65 h für 10k Sätze).",
          "Grundlage praktisch aller modernen Open-Source-Embedding-Modelle (BGE, E5, all-MiniLM).",
        ]}
      />

      <RagQuelle
        id="openai2024-embedding3"
        kernaussagen={[
          "Führt text-embedding-3-small (1536 dim) und text-embedding-3-large (3072 dim) ein.",
          "Matryoshka-Representation-Learning: Embeddings können auf kürzere Längen (z.B. 256) truncated werden mit minimalem Qualitätsverlust.",
          "Über den dimensions-Parameter direkt steuerbar — spart Speicher in der Vektor-DB.",
        ]}
      />
    </div>
  );
}
