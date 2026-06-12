"use client";

import { useState, type CSSProperties } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const POSITIONEN = ["static", "relative", "absolute"] as const;

export default function PositionZindex() {
  const [pos, setPos] = useState<(typeof POSITIONEN)[number]>("relative");
  const [top, setTop] = useState(20);
  const [left, setLeft] = useState(40);

  const mittelStyle: CSSProperties = {
    position: pos,
    ...(pos !== "static" ? { top, left } : {}),
    zIndex: 2,
  };

  const css = `.container { position: relative; }

.box-2 {
  position: ${pos};${
    pos !== "static" ? `\n  top: ${top}px;\n  left: ${left}px;` : ""
  }
}`;

  return (
    <div className="lesson-card">
      <h2>Position &amp; Stacking</h2>
      <p className="lesson-description">
        Mit <span className="mono">position</span> löst du ein Element aus dem
        normalen Fluss und schiebst es gezielt. Mit{" "}
        <span className="mono">z-index</span> bestimmst du, was vorne liegt.
        Klingt simpel — ist aber die Quelle der mysteriösesten Bugs
        („mein Menü liegt hinter dem Bild und nichts hilft").
      </p>

      <div className="info-box">
        Die fünf Werte: <span className="mono">static</span> (Default, im Fluss)
        · <span className="mono">relative</span> (verschoben, Platz bleibt
        reserviert) · <span className="mono">absolute</span> (aus dem Fluss, an
        nächstem positioniertem Vorfahren) ·{" "}
        <span className="mono">fixed</span> (am Viewport) ·{" "}
        <span className="mono">sticky</span> (klebt beim Scrollen).
      </div>

      <h3>Playground: wie sich das mittlere Kästchen verhält</h3>
      <div className="hc-preview" style={{ marginBottom: 14 }}>
        <div className="hc-preview-label">
          .container ist <span className="mono">position: relative</span>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 10,
            minHeight: 150,
            padding: 12,
            border: "2px dashed #fca5a5",
            borderRadius: 10,
            background: "#fef2f2",
          }}
        >
          <div className="hc-box b1">1</div>
          <div className="hc-box b2" style={mittelStyle}>
            2
          </div>
          <div className="hc-box b3">3</div>
          {pos === "absolute" ? (
            <span
              style={{
                position: "absolute",
                right: 8,
                bottom: 6,
                fontSize: "0.72rem",
                color: "#b91c1c",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Kästchen 2 ist aus dem Fluss → 1 und 3 rücken zusammen
            </span>
          ) : null}
        </div>
      </div>

      <div className="hc-controls">
        <div>
          <div className="hc-seg-label">position (Kästchen 2)</div>
          <div className="hc-seg">
            {POSITIONEN.map((p) => (
              <button
                key={p}
                type="button"
                className={`hc-chip ${pos === p ? "active" : ""}`}
                onClick={() => setPos(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>
            top: <span className="mono">{top}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={80}
            value={top}
            disabled={pos === "static"}
            onChange={(e) => setTop(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>
            left: <span className="mono">{left}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={left}
            disabled={pos === "static"}
            onChange={(e) => setLeft(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      <CodeBlock lang="css" title="dein Beispiel" code={css} />

      {pos === "static" ? (
        <div className="warn-box">
          Bei <span className="mono">static</span> werden{" "}
          <span className="mono">top</span> und{" "}
          <span className="mono">left</span> komplett ignoriert — das ist der
          Default-Fluss. Schalt auf <span className="mono">relative</span> oder{" "}
          <span className="mono">absolute</span>.
        </div>
      ) : null}

      <h3>z-index — was liegt vorne?</h3>
      <p>
        <span className="mono">z-index</span> bestimmt die Stapel-Reihenfolge —{" "}
        <strong>aber nur bei positionierten Elementen</strong> (also nicht bei{" "}
        <span className="mono">static</span>). Höher = weiter vorne.
      </p>
      <CodeBlock
        lang="css"
        code={`.modal   { position: fixed;    z-index: 100; }
.overlay { position: fixed;    z-index: 90; }
.tooltip { position: absolute; z-index: 10; }`}
      />

      <DepthBox variant="why" title="Warum ignoriert der Browser meinen z-index?">
        Der häufigste Grund: das Element ist{" "}
        <span className="mono">position: static</span> (der Default).{" "}
        <span className="mono">z-index</span> wirkt <em>nur</em> auf{" "}
        <span className="mono">relative</span>,{" "}
        <span className="mono">absolute</span>,{" "}
        <span className="mono">fixed</span> oder{" "}
        <span className="mono">sticky</span>. Setz eine Position (oft reicht{" "}
        <span className="mono">position: relative</span> ohne top/left) und der{" "}
        z-index greift plötzlich.
      </DepthBox>

      <DepthBox variant="mistake" title="z-index: 999999 löst gar nichts">
        Wenn ein Element mit <span className="mono">z-index: 9999</span> immer
        noch hinter etwas mit <span className="mono">z-index: 2</span> liegt,
        sitzt es in einem anderen <strong>Stacking Context</strong>. z-index
        vergleicht nur <em>innerhalb desselben Kontexts</em> — ein Kind kann
        seinen Eltern-Kontext nie verlassen, egal wie hoch die Zahl. Riesige
        z-index-Werte sind ein Symptom, keine Lösung — und ein klassisches
        Zeichen, dass jemand (oft eine KI) das eigentliche Problem nicht
        erkannt hat.
      </DepthBox>

      <DepthBox variant="deeper" title="Was einen Stacking Context erzeugt">
        Ein neuer Stapel-Kontext entsteht u.a. durch:
        <ul>
          <li><span className="mono">position</span> + <span className="mono">z-index</span> (außer auto)</li>
          <li><span className="mono">opacity</span> kleiner als 1</li>
          <li><span className="mono">transform</span>, <span className="mono">filter</span>, <span className="mono">perspective</span></li>
          <li><span className="mono">will-change</span>, <span className="mono">isolation: isolate</span></li>
        </ul>
        Deshalb der berüchtigte Bug: jemand setzt{" "}
        <span className="mono">transform</span> auf eine Karte (für eine
        Hover-Animation), und plötzlich verschwindet das Dropdown-Menü dahinter
        — die Karte hat einen eigenen Kontext aufgemacht.{" "}
        <span className="mono">isolation: isolate</span> ist oft die saubere
        Lösung.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <span className="mono">sticky</span> verbindet relative und fixed: das
        Element bleibt im Fluss, bis es beim Scrollen einen Schwellwert
        erreicht (<span className="mono">top: 0</span>), dann klebt es —
        perfekt für Tabellen-Header und Navigationsleisten. Im KI-Debugging sind
        z-index- und Stacking-Context-Bugs ein eigener „Verdächtiger" in unserer
        Bug-Galerie.
      </DepthBox>
    </div>
  );
}
