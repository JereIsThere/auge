"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

const N_CHUNKS = 10;

// Mock-U-Kurve (Liu et al., "Lost in the Middle", 2024):
// Accuracy hoch am Anfang und Ende, niedriger in der Mitte
function accuracyBeiPosition(pos: number, total: number): number {
  // pos: 1..total, normalisiert auf -1..1, Mitte = 0
  const x = (pos - 1) / (total - 1); // 0..1
  // U-Kurve: höchste Werte bei 0 und 1, tiefste bei 0.5
  // accuracy = 0.55 + 0.4 * (2x - 1)^2
  const u = (2 * x - 1) ** 2;
  return 0.55 + 0.4 * u;
}

export default function LostInMiddle() {
  const [position, setPosition] = useState(5); // 1..N_CHUNKS

  const acc = useMemo(() => accuracyBeiPosition(position, N_CHUNKS), [position]);

  return (
    <div className="lesson-card">
      <h2>Lost in the Middle</h2>
      <p className="lesson-description">
        LLMs verarbeiten lange Kontexte nicht gleichmäßig. Information am
        <strong> Anfang</strong> und <strong>Ende</strong> wird zuverlässig
        gefunden, in der <strong>Mitte</strong> oft übersehen. Stell die
        Position des relevanten Chunks ein und sieh, wie die Antwortgenauigkeit
        einbricht.
      </p>

      <div className="info-box">
        Die U-förmige Accuracy-Kurve wurde 2024 in <em>Liu et al., &bdquo;Lost
        in the Middle&ldquo;</em> dokumentiert — und in praktisch jedem
        Long-Context-Modell seitdem repliziert, auch in den großen.
      </div>

      <div className="input-group">
        <label>
          Position des relevanten Chunks im Kontext: {position} von {N_CHUNKS}
        </label>
        <input
          type="range"
          min={1}
          max={N_CHUNKS}
          step={1}
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value, 10))}
        />
      </div>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {Array.from({ length: N_CHUNKS }, (_, i) => {
          const istRelevant = i + 1 === position;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 56,
                borderRadius: 6,
                background: istRelevant ? "#10b981" : "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.78rem",
                color: istRelevant ? "white" : "#6b7280",
                fontWeight: istRelevant ? 700 : 500,
              }}
              title={istRelevant ? "relevanter Chunk" : `Chunk ${i + 1}`}
            >
              {istRelevant ? `★ ${i + 1}` : i + 1}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 16,
          borderRadius: 10,
          background:
            acc > 0.85 ? "#ecfdf5" : acc > 0.65 ? "#fffbeb" : "#fef2f2",
          border: `1px solid ${acc > 0.85 ? "#6ee7b7" : acc > 0.65 ? "#fcd34d" : "#fecaca"}`,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: acc > 0.85 ? "#047857" : acc > 0.65 ? "#a16207" : "#b91c1c",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {(acc * 100).toFixed(0)}%
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#111827" }}>
            Geschätzte Antwortgenauigkeit
          </div>
          <div style={{ fontSize: "0.85rem", color: "#52525b", marginTop: 2 }}>
            {acc > 0.85
              ? "Sweet Spot — das Modell findet die Info zuverlässig."
              : acc > 0.65
                ? "Wackelig — das Modell findet die Info nicht immer."
                : "In der Senke — das Modell übersieht die relevante Info regelmäßig."}
          </div>
        </div>
      </div>

      {/* Accuracy-Kurve als SVG */}
      <svg
        viewBox="0 0 400 120"
        style={{
          width: "100%",
          height: 120,
          background: "#fafafa",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
        }}
      >
        <line x1="20" y1="100" x2="380" y2="100" stroke="#d1d5db" />
        <line x1="20" y1="20" x2="20" y2="100" stroke="#d1d5db" />
        <text x="2" y="22" fontSize="9" fill="#6b7280">100%</text>
        <text x="2" y="103" fontSize="9" fill="#6b7280">50%</text>
        <text x="20" y="115" fontSize="9" fill="#6b7280">Anfang</text>
        <text x="180" y="115" fontSize="9" fill="#6b7280">Mitte</text>
        <text x="345" y="115" fontSize="9" fill="#6b7280">Ende</text>

        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={Array.from({ length: N_CHUNKS }, (_, i) => {
            const a = accuracyBeiPosition(i + 1, N_CHUNKS);
            const x = 20 + (360 * i) / (N_CHUNKS - 1);
            const y = 100 - (a - 0.5) * 160;
            return `${x},${y}`;
          }).join(" ")}
        />
        {/* aktiver Punkt */}
        <circle
          cx={20 + (360 * (position - 1)) / (N_CHUNKS - 1)}
          cy={100 - (acc - 0.5) * 160}
          r="5"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      <RagQuelle
        id="liu2024-lostmiddle"
        kernaussagen={[
          "Empirische Studie über 10 LLMs (GPT-3.5, GPT-4, Claude, Llama-2, etc.) auf Multi-Doc-QA und Key-Value-Retrieval.",
          "U-förmige Accuracy-Kurve: Pos 1 oder N ≈ 75 %, in der Mitte ≈ 50 % — auch bei explizit als Long-Context vermarkteten Modellen.",
          "Effekt verschwindet nicht durch reines Vergrößern des Kontext-Fensters — Position matters, length doesn't fix it.",
        ]}
      />

      <DepthBox variant="why" title="Woher kommt der Mittel-Dip?">
        Attention-Mechanismen in Transformern werden trainiert auf relativ
        kurze Kontexte; bei längeren Kontexten ist die Aufmerksamkeit oft
        oben (Anfang) und am Ende (Recency-Bias) konzentriert. Die Mitte ist
        ein &bdquo;Gefahrenzonen&ldquo;. Newer Modelle (Claude 3.5, GPT-4o,
        Gemini 1.5) sind besser, aber der Effekt bleibt messbar.
      </DepthBox>

      <DepthBox variant="mistake" title="Mehr Kontext = bessere Antwort? Nein.">
        Verlockende Idee: stopf alle Top-20 Chunks rein, das Modell wird's
        schon herausfinden. Falsch. Mehr Chunks ohne Re-Ranking macht zwei
        Probleme: (1) die wirklich wichtige Info landet in der Mitte und wird
        übersehen, (2) das Modell wird vom irrelevanten Kontext abgelenkt.
        Weniger, gut sortierte Chunks schlagen mehr, schlecht sortierte.
      </DepthBox>

      <DepthBox variant="deeper" title="Was hilft konkret">
        <ul>
          <li>
            <strong>Re-Ranking + Top-3</strong>: weniger, besser sortiert
          </li>
          <li>
            <strong>Relevante Info vorn platzieren</strong>: nach Re-Ranking
            den besten Chunk ganz oben in den Prompt setzen
          </li>
          <li>
            <strong>Wiederholung</strong>: kritische Info am Anfang UND am
            Ende des Kontexts duplizieren (klingt hacky, hilft messbar)
          </li>
          <li>
            <strong>Kontext-Komprimierung</strong>: LLMLingua o.ä. — irrelevante
            Tokens entfernen, bevor sie das Hauptmodell erreichen
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Needle-in-a-Haystack-Benchmark (testet Long-Context-Retrieval direkt),
        Context Window Caching (manche Provider cachen den Prefix — nutze die
        Stabilität, um die wichtige Info konsistent zu platzieren), und
        Stuffing vs. Iteration (mehrere kleine Aufrufe statt einer Mega-Kontext-Antwort).
      </DepthBox>
    </div>
  );
}
