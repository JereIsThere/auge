"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// Wir simulieren eine kleine "Wald-Szene": 4 Blatt-Ebenen, jede mit eigener
// Hintergrund-Schicht. Slider 0..4 = wie viele Schichten schon gemalt sind.
type Ebene = {
  schichthex: string;  // Farbe der jeweiligen Hintergrund-Schicht
  blaetter: { cx: number; cy: number; rx: number; ry: number; rot: number }[];
};

const EBENEN: Ebene[] = [
  {
    schichthex: "#dbeab4", // hellgrün
    blaetter: [
      { cx: 110, cy: 80,  rx: 30, ry: 15, rot: -20 },
      { cx: 220, cy: 70,  rx: 28, ry: 14, rot: 25  },
      { cx: 280, cy: 140, rx: 32, ry: 16, rot: -10 },
      { cx: 80,  cy: 160, rx: 26, ry: 13, rot: 30  },
    ],
  },
  {
    schichthex: "#9bbc6c",
    blaetter: [
      { cx: 160, cy: 110, rx: 26, ry: 13, rot: 15  },
      { cx: 240, cy: 200, rx: 30, ry: 15, rot: -25 },
      { cx: 60,  cy: 100, rx: 24, ry: 12, rot: 40  },
    ],
  },
  {
    schichthex: "#5d8a3d",
    blaetter: [
      { cx: 200, cy: 130, rx: 22, ry: 11, rot: -35 },
      { cx: 130, cy: 210, rx: 26, ry: 13, rot: 20  },
      { cx: 270, cy: 90,  rx: 20, ry: 10, rot: 50  },
    ],
  },
  {
    schichthex: "#2f4f2a",
    blaetter: [
      { cx: 100, cy: 130, rx: 18, ry: 9,  rot: 45  },
      { cx: 250, cy: 170, rx: 22, ry: 11, rot: -10 },
    ],
  },
];

const TOTAL = EBENEN.length;

export default function NegativMalen() {
  const [schicht, setSchicht] = useState(0); // 0..TOTAL

  return (
    <div className="lesson-card">
      <h2>Negative Painting</h2>
      <p className="lesson-description">
        Statt das Blatt zu malen, malst du die <em>Lücken um das Blatt herum</em>.
        Das Blatt entsteht als Aussparung — durch das, was drumrum kommt. Klingt
        kontraintuitiv, ist aber eine der elegantesten Aquarell-Techniken für
        Tiefe und Lichtspiele.
      </p>

      <div className="info-box">
        <strong>Das Prinzip in einem Satz:</strong> hellere Form bleibt unangerührt,
        dunklerer Hintergrund kommt drumrum. Wiederhole das, und es entsteht
        eine Schichten-Tiefe, die mit normalem Malen kaum hinzukriegen ist.
      </div>

      <h3>Schicht für Schicht — schieb den Slider</h3>
      <div className="input-group">
        <label>Schicht: {schicht} von {TOTAL}</label>
        <input
          type="range"
          min={0}
          max={TOTAL}
          step={1}
          value={schicht}
          onChange={(e) => setSchicht(parseInt(e.target.value, 10))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#9ca3af", fontFamily: "ui-monospace, monospace" }}>
          <button type="button" onClick={() => setSchicht(0)} style={btnStyle(schicht === 0)}>0 · leer</button>
          <button type="button" onClick={() => setSchicht(1)} style={btnStyle(schicht === 1)}>1 · vordere Blätter</button>
          <button type="button" onClick={() => setSchicht(2)} style={btnStyle(schicht === 2)}>2 · Mitte</button>
          <button type="button" onClick={() => setSchicht(3)} style={btnStyle(schicht === 3)}>3 · hinten</button>
          <button type="button" onClick={() => setSchicht(4)} style={btnStyle(schicht === 4)}>4 · Tiefe</button>
        </div>
      </div>

      <svg
        viewBox="0 0 360 260"
        style={{
          width: "100%",
          background: "#fdf6e3",
          border: "1px solid #d6c896",
          borderRadius: 10,
        }}
      >
        <defs>
          {/* Wir bauen für jede Schicht eine Maske, die alle bereits gemalten
              "Vordergrund-Blätter" als Aussparungen enthält. */}
          {EBENEN.map((_, i) => (
            <mask key={i} id={`mask-${i}`}>
              <rect x="0" y="0" width="360" height="260" fill="white" />
              {/* alle Blätter VOR dieser Schicht ausschneiden */}
              {EBENEN.slice(0, i).flatMap((e, j) =>
                e.blaetter.map((b, k) => (
                  <ellipse
                    key={`${j}-${k}`}
                    cx={b.cx}
                    cy={b.cy}
                    rx={b.rx + 2}
                    ry={b.ry + 2}
                    transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
                    fill="black"
                  />
                ))
              )}
            </mask>
          ))}
        </defs>

        {/* Schichten — jede ist ein Rechteck mit Maske für ältere Blätter */}
        {EBENEN.slice(0, schicht).map((e, i) => (
          <rect
            key={i}
            x="0"
            y="0"
            width="360"
            height="260"
            fill={e.schichthex}
            mask={`url(#mask-${i})`}
            opacity={0.92}
          />
        ))}

        {/* Hilfslinien: zukünftige Blätter ganz dünn andeuten */}
        {schicht < TOTAL && EBENEN.slice(schicht).flatMap((e, i) =>
          e.blaetter.map((b, k) => (
            <ellipse
              key={`fut-${i}-${k}`}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
              fill="none"
              stroke="#a16207"
              strokeWidth="0.5"
              strokeDasharray="2 3"
              opacity="0.4"
            />
          ))
        )}

        <text x="180" y="250" textAnchor="middle" fontSize="10" fill="#52525b" fontFamily="ui-monospace, monospace">
          {schicht === 0
            ? "Leeres Papier — gestrichelt: noch unbemalte Blätter"
            : schicht === TOTAL
              ? `Fertig — alle ${TOTAL} Schichten ergeben Tiefe`
              : `Schicht ${schicht}: Hintergrund um die helleren Blätter herum`}
        </text>
      </svg>

      <h3>Die Schritte einer Negative-Painting-Sequenz</h3>
      <ol className="step-list">
        <li>
          <strong>Erste Wasch-Schicht (hellster Ton)</strong> — das gesamte
          Papier oder den Bereich gleichmäßig. Vollständig trocknen lassen.
        </li>
        <li>
          <strong>Hellste Formen aussuchen</strong> — die Blätter / Objekte,
          die <em>am hellsten</em> bleiben sollen, mental markieren.
        </li>
        <li>
          <strong>Zweite Schicht: drum herum malen</strong> — etwas dunkler
          als die erste, alles <em>außer</em> den markierten Formen. Wieder
          trocknen.
        </li>
        <li>
          <strong>Schritte wiederholen</strong> — jede weitere Schicht
          dunkler, immer mehr Formen kommen als Aussparung dazu. So entstehen
          3-5 Tiefenebenen.
        </li>
        <li>
          <strong>Letzte Akzente</strong> — feine dunkle Linien (Äste, Ränder)
          mit dünnem Pinsel. Jetzt erst, ganz am Ende.
        </li>
      </ol>

      <div className="warn-box" style={{ fontSize: "0.88rem" }}>
        <strong>Kritisches Detail:</strong> jede Schicht muss <em>komplett trocken</em>
        sein. Wenn die zweite Schicht in feuchten ersten reinläuft, verschmieren
        die Kanten und der ganze Effekt geht verloren. Bei feuchtem Wetter:
        Föhn, oder ein paar Minuten Geduld pro Schicht.
      </div>

      <DepthBox variant="why" title="Warum wirkt Negative Painting so tief?">
        Wir lesen helle Bereiche als <em>näher</em>, dunklere als <em>weiter
        hinten</em> (atmosphärische Perspektive). Wenn du Schicht für Schicht
        die Werte dunkler werden lässt, ordnet das Auge die hellen Formen
        automatisch vorne ein — auch wenn alle gleich groß und in derselben
        Ebene gemalt sind. Mit nur 4 Schichten kannst du visuell 4 Tiefen-
        ebenen erzeugen, die mit „normaler" Malerei viel aufwendiger wären.
      </DepthBox>

      <DepthBox variant="mistake" title="Pinsel-Linien um Formen herum">
        Klassischer Fehler: zu klein gedacht, mit kleinem Pinsel die Kanten
        nachzeichnen. Sieht dann wie ausgemaltes Malbuch aus. Negative
        Painting funktioniert nur mit <strong>großzügigen, weichen Pinselzügen</strong> —
        großer Rundpinsel, viel Wasser, die Form ergibt sich aus dem, was
        nicht angetroffen wird. Wenn deine Kante hart und „angemalt" wirkt,
        machst du es zu kontrolliert.
      </DepthBox>

      <DepthBox variant="deeper" title="Wertstruktur planen">
        Negative Painting funktioniert nur mit klarer <em>Werthierarchie</em>:
        Schicht 1 = Wert 9 (sehr hell), Schicht 2 = Wert 7, Schicht 3 = Wert 5,
        Schicht 4 = Wert 2 (sehr dunkel). Wenn die Werte zu nah beieinander
        liegen, verliert das Bild Tiefe — alle Schichten kleben zusammen.
        Faustregel: <strong>mindestens 2 Wertstufen</strong> zwischen den
        Schichten. Skizziere die Wertstruktur (Notan!) bevor du anfängst.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Notan (Wertstruktur-Planung ist Voraussetzung), Glazing (jede Schicht
        ist effektiv eine Glazing), Aussparung (Form durch das, was du
        <em>nicht</em> malst), Komposition (welche Formen liegen vorne,
        welche hinten — das musst du vorher entscheiden).
      </DepthBox>

      <DepthBox variant="history" title="Wer Negative Painting prägte">
        Die Technik kommt aus der chinesischen und japanischen Tuschemalerei,
        wo das <em>Weiß des Papiers</em> traditionell für Wolken, Nebel und
        Wasser steht. In der westlichen Aquarell-Tradition haben Maler wie
        <strong>Linda Kemp</strong> (Lehrbuch „Watercolor Painting Outside the
        Lines", 2002) die Technik systematisiert und für Pflanzen-, Wald-
        und Naturmotive populär gemacht.
      </DepthBox>
    </div>
  );
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    color: active ? "#2563eb" : "#9ca3af",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: active ? 700 : 400,
    padding: 0,
  };
}
