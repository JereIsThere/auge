"use client";

import { useState, type CSSProperties } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

export default function Grid() {
  const [spalten, setSpalten] = useState(3);
  const [gap, setGap] = useState(10);
  const [spanItem, setSpanItem] = useState(true);

  const anzahl = 7;

  const containerStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${spalten}, 1fr)`,
    gap,
    padding: 12,
    border: "2px dashed #93c5fd",
    borderRadius: 10,
    background: "#eff6ff",
  };

  const css = `.grid {
  display: grid;
  grid-template-columns: repeat(${spalten}, 1fr);
  gap: ${gap}px;
}${spanItem ? `\n\n.grid .featured {\n  grid-column: span 2;\n}` : ""}`;

  return (
    <div className="lesson-card">
      <h2>CSS Grid</h2>
      <p className="lesson-description">
        Grid ordnet Elemente in <strong>zwei Dimensionen</strong> an — Zeilen{" "}
        <em>und</em> Spalten zugleich. Wo Flexbox „eine Reihe ausrichten" ist,
        ist Grid „ein Raster aufspannen". Es ist das Werkzeug für ganze
        Seitenlayouts, Karten-Galerien und Dashboards.
      </p>

      <div className="info-box">
        Du definierst das Raster am <strong>Container</strong> mit{" "}
        <span className="mono">grid-template-columns</span>. Die Einheit{" "}
        <span className="mono">fr</span> heißt „ein Anteil des freien Platzes" —{" "}
        <span className="mono">repeat(3, 1fr)</span> macht drei gleich breite
        Spalten, die sich den Platz teilen.
      </div>

      <h3>Playground</h3>
      <div className="hc-preview" style={{ marginBottom: 14 }}>
        <div className="hc-preview-label">
          {spalten} Spalten · gap {gap}px
        </div>
        <div style={containerStyle}>
          {Array.from({ length: anzahl }, (_, i) => {
            const featured = spanItem && i === 0;
            return (
              <div
                key={i}
                className={`hc-box b${(i % 6) + 1}`}
                style={featured ? { gridColumn: "span 2" } : undefined}
              >
                {featured ? "span 2" : i + 1}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hc-controls">
        <div className="input-group">
          <label>
            Spalten: <span className="mono">repeat({spalten}, 1fr)</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={spalten}
            onChange={(e) => setSpalten(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>
            gap: <span className="mono">{gap}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={24}
            value={gap}
            onChange={(e) => setGap(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>Erstes Element über zwei Spalten</label>
          <div className="hc-seg">
            <button
              type="button"
              className={`hc-chip ${spanItem ? "active" : ""}`}
              onClick={() => setSpanItem(true)}
            >
              grid-column: span 2
            </button>
            <button
              type="button"
              className={`hc-chip ${!spanItem ? "active" : ""}`}
              onClick={() => setSpanItem(false)}
            >
              normal
            </button>
          </div>
        </div>
      </div>

      <CodeBlock lang="css" title="dein aktuelles Raster" code={css} />

      <h3>Das responsive Auto-Raster (ohne Media Queries)</h3>
      <p>
        Eine der mächtigsten Zeilen in CSS: ein Raster, das die Spaltenzahl{" "}
        <em>von selbst</em> an die Breite anpasst.
      </p>
      <CodeBlock
        lang="css"
        code={`.galerie {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}`}
      />
      <p style={{ fontSize: "0.85rem", color: "#475569" }}>
        Lies es als: „so viele Spalten wie passen, jede mindestens 180px breit,
        sonst teilt euch den Rest gleichmäßig". Auf dem Handy wird das eine
        Spalte, auf dem Desktop fünf — ganz ohne Breakpoints.
      </p>

      <DepthBox variant="why" title="Wann Grid, wann Flexbox?">
        Faustregel: <strong>Grid für das Layout in zwei Richtungen</strong>{" "}
        (das Seitenraster, eine Galerie),{" "}
        <strong>Flexbox für eine Richtung</strong> (eine Toolbar, Buttons in
        einer Reihe). Ein anderer Blick: Bei Grid gibst du das{" "}
        <em>Raster</em> vor und die Inhalte ordnen sich ein („layout-first").
        Bei Flexbox bestimmen die <em>Inhalte</em> und ihre Größen den Fluss
        („content-first"). Beide schließen sich nicht aus — ein Grid-Item ist
        oft selbst ein Flex-Container.
      </DepthBox>

      <DepthBox variant="mistake" title="Höhen von Hand setzen statt das Raster machen lassen">
        Anfänger (und manche KI) bauen Karten-Galerien mit fixen{" "}
        <span className="mono">width: 33%</span> plus{" "}
        <span className="mono">float</span> und kämpfen dann mit Umbrüchen und
        Abständen. Grid mit <span className="mono">auto-fit / minmax</span>{" "}
        erledigt das in zwei Zeilen und bleibt responsive. Wenn du in KI-Code
        viele <span className="mono">width: 33.33%</span> oder{" "}
        <span className="mono">float</span> sieht, ist das ein Kandidat zum
        Vereinfachen.
      </DepthBox>

      <DepthBox variant="deeper" title="Linien, Bereiche & grid-template-areas">
        Grid nummeriert die <em>Linien</em> zwischen den Spalten/Zeilen. Ein
        Item kann von Linie 1 bis 3 reichen:{" "}
        <span className="mono">grid-column: 1 / 3</span>. Für ganze Layouts gibt
        es benannte Bereiche:
        <CodeBlock
          lang="css"
          code={`.app {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }`}
        />
        Das ist Layout, das man <em>lesen</em> kann — die ASCII-Skizze{" "}
        <em>ist</em> das Layout.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <span className="mono">gap</span>, <span className="mono">fr</span> und{" "}
        <span className="mono">minmax</span> kommen in „Responsive" wieder. Und
        beim Lesen von KI-Layouts ist die erste Frage oft: „ist das ein
        Grid- oder ein Flex-Container?" — die DevTools markieren beide mit einem
        eigenen Badge.
      </DepthBox>
    </div>
  );
}
