"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const FARBE = {
  margin: "#fcd9a5",
  border: "#fde68a",
  padding: "#bbf7d0",
  content: "#bfdbfe",
};

function Schieber({
  label,
  value,
  set,
  max,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  max: number;
}) {
  return (
    <div className="input-group">
      <label>
        {label}: <span className="mono">{value}px</span>
      </label>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
      />
    </div>
  );
}

export default function BoxModel() {
  const [breite, setBreite] = useState(160);
  const [padding, setPadding] = useState(16);
  const [border, setBorder] = useState(4);
  const [margin, setMargin] = useState(20);
  const [borderBox, setBorderBox] = useState(false);

  // content-box: width = Inhaltsbreite; border-box: width = bis zur Außenkante
  const inhalt = borderBox
    ? Math.max(0, breite - 2 * padding - 2 * border)
    : breite;
  const elementBreite = borderBox ? breite : breite + 2 * padding + 2 * border;
  const gesamt = elementBreite + 2 * margin;

  const css = `.box {
  box-sizing: ${borderBox ? "border-box" : "content-box"};
  width: ${breite}px;
  padding: ${padding}px;
  border: ${border}px solid #f59e0b;
  margin: ${margin}px;
}`;

  return (
    <div className="lesson-card">
      <h2>Das Box-Modell</h2>
      <p className="lesson-description">
        Jedes HTML-Element ist eine rechteckige Schachtel aus vier Schichten:{" "}
        <strong>content</strong> (der Inhalt), <strong>padding</strong>{" "}
        (Innenabstand), <strong>border</strong> (Rahmen) und{" "}
        <strong>margin</strong> (Außenabstand). Wer Abstände versteht, versteht
        90 % aller „warum sitzt das nicht da, wo ich will"-Probleme.
      </p>

      <div className="info-box">
        Von innen nach außen: <strong>content → padding → border → margin</strong>.
        Padding ist <em>innerhalb</em> des Rahmens (bekommt die
        Hintergrundfarbe), margin ist <em>außerhalb</em> (immer durchsichtig).
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) minmax(220px, 280px)",
          gap: 24,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        {/* Visualisierung: konzentrische Schichten, exakt maßstabsgetreu */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 240,
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 8,
            overflow: "auto",
          }}
        >
          <div style={{ display: "inline-block", background: FARBE.margin, padding: margin }}>
            <div style={{ background: FARBE.border, padding: border }}>
              <div style={{ background: FARBE.padding, padding: padding }}>
                <div
                  style={{
                    width: inhalt,
                    height: 56,
                    background: FARBE.content,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 12,
                    color: "#1e3a8a",
                    fontWeight: 700,
                  }}
                >
                  content
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hc-controls">
          <Schieber label="width" value={breite} set={setBreite} max={240} />
          <Schieber label="padding" value={padding} set={setPadding} max={40} />
          <Schieber label="border" value={border} set={setBorder} max={20} />
          <Schieber label="margin" value={margin} set={setMargin} max={40} />
          <div className="input-group">
            <label>box-sizing</label>
            <div className="hc-seg">
              <button
                type="button"
                className={`hc-chip ${!borderBox ? "active" : ""}`}
                onClick={() => setBorderBox(false)}
              >
                content-box
              </button>
              <button
                type="button"
                className={`hc-chip ${borderBox ? "active" : ""}`}
                onClick={() => setBorderBox(true)}
              >
                border-box
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legende */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "14px 0", fontSize: "0.82rem" }}>
        {(
          [
            ["margin", "margin"],
            ["border", "border"],
            ["padding", "padding"],
            ["content", "content"],
          ] as const
        ).map(([key, label]) => (
          <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: FARBE[key],
                border: "1px solid #cbd5e1",
              }}
            />
            <span className="mono">{label}</span>
          </span>
        ))}
      </div>

      <div className="result-grid">
        <div className="result-box">
          <div className="result-label">width (CSS)</div>
          <div className="result-value mono">{breite}px</div>
        </div>
        <div className="result-box">
          <div className="result-label">Inhaltsbreite</div>
          <div className="result-value mono">{inhalt}px</div>
        </div>
        <div className="result-box">
          <div className="result-label">Element (bis Rahmen)</div>
          <div className="result-value mono">{elementBreite}px</div>
        </div>
        <div className="result-box">
          <div className="result-label">Platz inkl. margin</div>
          <div className="result-value mono">{gesamt}px</div>
        </div>
      </div>

      <CodeBlock lang="css" title="das stellst du gerade ein" code={css} />

      {!borderBox && (padding > 0 || border > 0) ? (
        <div className="warn-box">
          Achtung: <span className="mono">width: {breite}px</span>, aber das
          Element ist real <strong>{elementBreite}px</strong> breit — padding
          und border kommen <em>obendrauf</em>. Genau das überrascht Anfänger.
          Schalt auf <span className="mono">border-box</span> um.
        </div>
      ) : null}

      <DepthBox variant="why" title="Warum stellen Profis fast immer border-box ein?">
        Mit dem Default <span className="mono">content-box</span> bedeutet{" "}
        <span className="mono">width: 200px</span> die Breite des{" "}
        <em>Inhalts</em> — padding und border kommen oben drauf, die Box wird
        breiter als 200px. Das macht Layout-Mathe zur Hölle. Mit{" "}
        <span className="mono">border-box</span> meint{" "}
        <span className="mono">width: 200px</span> die Breite{" "}
        <em>bis zur Außenkante</em> — was du sagst, ist was du bekommst. Deshalb
        steht in fast jedem Projekt ganz oben:
        <CodeBlock lang="css" code={`*, *::before, *::after {\n  box-sizing: border-box;\n}`} />
      </DepthBox>

      <DepthBox variant="mistake" title="margin und padding verwechseln">
        Sie sehen im Ergebnis ähnlich aus, sind aber verschieden:{" "}
        <strong>padding</strong> ist Platz <em>innen</em>, bekommt die
        Hintergrundfarbe und vergrößert die klickbare Fläche.{" "}
        <strong>margin</strong> ist Platz <em>außen</em>, ist immer durchsichtig
        und schiebt Nachbarn weg. Faustregel: Abstand <em>zwischen</em>{" "}
        Elementen → margin. Luft <em>um den Inhalt</em> in der Box → padding.
      </DepthBox>

      <DepthBox variant="deeper" title="Margin Collapsing — der Klassiker, der verwirrt">
        Zwei vertikal benachbarte margins <em>überlappen</em>, statt sich zu
        addieren: 20px unten + 30px oben ergeben nicht 50px Abstand, sondern{" "}
        <strong>30px</strong> (das größere gewinnt). Das passiert nur vertikal
        und nur bei Block-Elementen im normalen Fluss — nicht in Flexbox oder
        Grid. Wenn dein Abstand „kleiner ist als gerechnet", ist es fast immer
        Margin Collapsing.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Das Box-Modell ist die Grundlage für Flexbox und Grid (dort steuern{" "}
        <span className="mono">gap</span> und Ausrichtung die Abstände
        eleganter als margins). Und „warum ist mein Element breiter als das
        Eltern-Element / es scrollt horizontal" ist im KI-HTML-Debugging fast
        immer ein <span className="mono">box-sizing</span>- oder
        margin-Problem.
      </DepthBox>
    </div>
  );
}
