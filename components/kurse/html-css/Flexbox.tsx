"use client";

import { useState, type CSSProperties } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const DIRECTIONS = ["row", "row-reverse", "column", "column-reverse"] as const;
const JUSTIFY = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
] as const;
const ALIGN = ["stretch", "flex-start", "center", "flex-end"] as const;
const WRAP = ["nowrap", "wrap"] as const;

function Seg<T extends string>({
  label,
  options,
  value,
  set,
}: {
  label: string;
  options: readonly T[];
  value: T;
  set: (v: T) => void;
}) {
  return (
    <div>
      <div className="hc-seg-label">{label}</div>
      <div className="hc-seg">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`hc-chip ${value === o ? "active" : ""}`}
            onClick={() => set(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Flexbox() {
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>("row");
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>("flex-start");
  const [align, setAlign] = useState<(typeof ALIGN)[number]>("stretch");
  const [wrap, setWrap] = useState<(typeof WRAP)[number]>("nowrap");
  const [anzahl, setAnzahl] = useState(4);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    gap: 10,
    minHeight: 220,
    padding: 12,
    border: "2px dashed #c4b5fd",
    borderRadius: 10,
    background: "#faf5ff",
  };

  const css = `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: 10px;
}`;

  return (
    <div className="lesson-card">
      <h2>Flexbox</h2>
      <p className="lesson-description">
        Flexbox ordnet Elemente entlang <strong>einer Achse</strong> an — eine
        Reihe oder eine Spalte. Es ist das Werkzeug für Navigationsleisten,
        Button-Gruppen, Karten nebeneinander, Zentrieren. Der Trick: du denkst
        in <em>Hauptachse</em> und <em>Querachse</em>.
      </p>

      <div className="info-box">
        <strong>Zwei Rollen:</strong> der <span className="mono">display: flex</span>{" "}
        Container steuert die Anordnung,{" "}
        <span className="mono">justify-content</span> verteilt entlang der{" "}
        Hauptachse, <span className="mono">align-items</span> entlang der
        Querachse. Dreht <span className="mono">flex-direction</span> auf{" "}
        <span className="mono">column</span>, vertauschen sich die beiden.
      </div>

      <h3>Playground</h3>
      <div className="hc-preview" style={{ marginBottom: 14 }}>
        <div className="hc-preview-label">
          Hauptachse:{" "}
          {direction.startsWith("row") ? "horizontal ↔" : "vertikal ↕"}
        </div>
        <div style={containerStyle}>
          {Array.from({ length: anzahl }, (_, i) => (
            <div key={i} className={`hc-box b${(i % 6) + 1}`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="hc-controls">
        <Seg label="flex-direction" options={DIRECTIONS} value={direction} set={setDirection} />
        <Seg label="justify-content (Hauptachse)" options={JUSTIFY} value={justify} set={setJustify} />
        <Seg label="align-items (Querachse)" options={ALIGN} value={align} set={setAlign} />
        <Seg label="flex-wrap" options={WRAP} value={wrap} set={setWrap} />
        <div className="input-group">
          <label>
            Anzahl Elemente: <span className="mono">{anzahl}</span>
          </label>
          <input
            type="range"
            min={1}
            max={6}
            value={anzahl}
            onChange={(e) => setAnzahl(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      <CodeBlock lang="css" title="dein aktuelles Layout" code={css} />

      <h3>Das wichtigste Rezept: zentrieren</h3>
      <p>
        Die berühmteste Flexbox-Anwendung — etwas exakt mittig setzen, beide
        Achsen:
      </p>
      <CodeBlock
        lang="css"
        code={`.center {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertikal */
}`}
      />

      <DepthBox variant="why" title="Warum war Zentrieren früher so schwer — und jetzt nicht mehr?">
        Vor Flexbox musste man vertikales Zentrieren mit Tricks erschlagen:{" "}
        <span className="mono">line-height</span>, absolute Positionierung plus{" "}
        negative margins, Tabellen-Hacks. Alle zerbrechlich. Flexbox macht aus
        „vertikal zentrieren" eine Eigenschaft (<span className="mono">align-items: center</span>),
        weil der Container die Größe seiner Kinder <em>kennt</em> und den Raum
        aktiv verteilt. Das ist der Kern: Flexbox <em>verhandelt</em> Platz,
        statt ihn starr zuzuweisen.
      </DepthBox>

      <DepthBox variant="mistake" title="justify und align verwechseln">
        Der häufigste Flexbox-Frust:{" "}
        <span className="mono">justify-content</span> wirkt auf die{" "}
        <em>Hauptachse</em>, <span className="mono">align-items</span> auf die{" "}
        <em>Querachse</em> — und die Hauptachse hängt an{" "}
        <span className="mono">flex-direction</span>. Bei{" "}
        <span className="mono">row</span> zentriert{" "}
        <span className="mono">justify-content</span> horizontal; bei{" "}
        <span className="mono">column</span> plötzlich vertikal. Wenn deine
        Zentrierung „in die falsche Richtung" geht, hast du fast immer eine
        column-direction übersehen.
      </DepthBox>

      <DepthBox variant="deeper" title="flex-grow, flex-shrink, flex-basis">
        Die Eigenschaften an den <em>Kindern</em> steuern, wie sie Platz teilen:
        <ul>
          <li>
            <span className="mono">flex-grow: 1</span> — „nimm dir freien Platz".
            Ein Kind mit grow 1 dehnt sich, der Rest bleibt.
          </li>
          <li>
            <span className="mono">flex-shrink</span> — wie stark darf ein Kind
            schrumpfen, wenn der Platz knapp wird (Default 1).
          </li>
          <li>
            <span className="mono">flex-basis</span> — die Ausgangsgröße vor dem
            Wachsen/Schrumpfen.
          </li>
        </ul>
        Die Kurzform <span className="mono">flex: 1</span> heißt
        „grow 1, shrink 1, basis 0" — das klassische „füll den Rest". Eine
        Sidebar mit fixer Breite plus ein Inhalt mit{" "}
        <span className="mono">flex: 1</span> ist das halbe Web.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Flexbox ist <em>eindimensional</em> (eine Achse). Sobald du echte Zeilen{" "}
        <em>und</em> Spalten gleichzeitig brauchst (ein Raster), ist{" "}
        <strong>Grid</strong> das bessere Werkzeug — die nächste Lektion. In
        der Praxis kombiniert man beide: Grid fürs Seitenlayout, Flexbox für die
        Kleinteile darin.
      </DepthBox>
    </div>
  );
}
