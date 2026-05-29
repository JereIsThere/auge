"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Stoff = "baumwolle" | "seide" | "leder" | "wolle";

const STOFFE: Record<Stoff, {
  titel: string;
  faltenanzahl: "viele" | "mittel" | "wenig";
  faltenform: string;
  highlight: string;
  beschreibung: string;
}> = {
  baumwolle: {
    titel: "Baumwolle / Leinen",
    faltenanzahl: "viele",
    faltenform: "weiche, runde Falten mit klaren Übergängen",
    highlight: "diffus, mittlere Helligkeit",
    beschreibung:
      "Standard-Stoff. Viele kleine Falten, weiche Schatten. Hängt klar nach Schwerkraft.",
  },
  seide: {
    titel: "Seide / Satin",
    faltenanzahl: "viele",
    faltenform: "lange, fließende Bänder mit scharfen Kanten",
    highlight: "scharf und hell, schiebt sich entlang der Faltenkante",
    beschreibung:
      "Glatt und reflektierend. Falten ziehen sich lang, Highlights wandern beim Bewegen.",
  },
  leder: {
    titel: "Leder",
    faltenanzahl: "wenig",
    faltenform: "wenige, dicke Falten mit harten Knicken",
    highlight: "spotty — kleine helle Punkte an Knickkanten",
    beschreibung:
      "Stark, dick, kaum nachgebend. Falten knicken statt zu fließen.",
  },
  wolle: {
    titel: "Wolle / Filz",
    faltenanzahl: "mittel",
    faltenform: "wenige große Wellen, weiche Übergänge ohne Kanten",
    highlight: "sehr matt — kaum sichtbar, fast nur Lokalfarbe",
    beschreibung:
      "Voluminös, lichtdämpfend. Falten sind eher Wellen als Knicke.",
  },
};

// Vereinfachte SVG-Stoffdarstellung: ein hängendes Rechteck mit Falten
function StoffSvg({ typ }: { typ: Stoff }) {
  const cfg = {
    baumwolle: { wellen: 5, amp: 8, hlOpacity: 0.25, hlSchaerfe: "blur(2px)" },
    seide:     { wellen: 4, amp: 14, hlOpacity: 0.65, hlSchaerfe: "blur(0.5px)" },
    leder:     { wellen: 2, amp: 10, hlOpacity: 0.45, hlSchaerfe: "blur(1px)" },
    wolle:     { wellen: 3, amp: 6, hlOpacity: 0.1, hlSchaerfe: "blur(4px)" },
  }[typ];

  const lokalfarbe = {
    baumwolle: "#9bb3d6",
    seide: "#c5a484",
    leder: "#7a4a2a",
    wolle: "#a89b8a",
  }[typ];

  return (
    <svg
      viewBox="0 0 280 200"
      style={{
        width: "100%",
        maxWidth: 360,
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      {/* Lokalfarbe-Hintergrund */}
      <rect x="30" y="20" width="220" height="170" fill={lokalfarbe} rx="3" />

      {/* Falten als vertikale Bänder mit Schatten + Highlight */}
      {Array.from({ length: cfg.wellen }, (_, i) => {
        const x = 30 + (i + 1) * (220 / (cfg.wellen + 1));
        return (
          <g key={i}>
            {/* Schatten links der Falte */}
            <ellipse
              cx={x - cfg.amp / 2}
              cy={105}
              rx={cfg.amp / 1.5}
              ry={80}
              fill="#000"
              opacity={0.18}
            />
            {/* Highlight rechts der Falte */}
            <ellipse
              cx={x + cfg.amp / 2}
              cy={105}
              rx={cfg.amp / 2}
              ry={75}
              fill="#fff"
              opacity={cfg.hlOpacity}
              style={{ filter: cfg.hlSchaerfe }}
            />
          </g>
        );
      })}

      {/* Untere unregelmäßige Kante */}
      <path
        d={`M 30 190 ${Array.from({ length: 5 }, (_, i) => {
          const x = 30 + (i + 1) * 44;
          const y = 190 + (i % 2 === 0 ? 5 : -2);
          return `L ${x} ${y}`;
        }).join(" ")} L 250 190 Z`}
        fill={lokalfarbe}
      />
    </svg>
  );
}

export default function Stoff() {
  const [aktiv, setAktiv] = useState<Stoff>("baumwolle");
  const s = STOFFE[aktiv];

  return (
    <div className="lesson-card">
      <h2>Stoff &amp; Falten</h2>
      <p className="lesson-description">
        Falten in Stoff folgen einer simplen Logik: <strong>Schwerkraft +
        Materialcharakter</strong>. Zwei Stücke desselben Schnittes können
        komplett verschieden aussehen, je nachdem aus welchem Material sie
        sind. Vier Klassiker im Vergleich:
      </p>

      <div className="input-group">
        <label>Material</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(STOFFE) as Stoff[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setAktiv(id)}
              className="toggle-code"
              style={{
                background: aktiv === id ? "#eef2ff" : "transparent",
                borderColor: aktiv === id ? "#3b82f6" : "#d1d5db",
                color: aktiv === id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === id ? 700 : 500,
              }}
            >
              {STOFFE[id].titel}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: 18,
          alignItems: "center",
        }}
      >
        <StoffSvg typ={aktiv} />
        <div className="kv-table" style={{ fontSize: "0.88rem" }}>
          <dt style={{ fontFamily: "inherit" }}>Faltenanzahl:</dt>
          <dd style={{ fontFamily: "inherit" }}>{s.faltenanzahl}</dd>
          <dt style={{ fontFamily: "inherit" }}>Faltenform:</dt>
          <dd style={{ fontFamily: "inherit" }}>{s.faltenform}</dd>
          <dt style={{ fontFamily: "inherit" }}>Highlight:</dt>
          <dd style={{ fontFamily: "inherit" }}>{s.highlight}</dd>
          <dt style={{ fontFamily: "inherit" }}>Charakter:</dt>
          <dd style={{ fontFamily: "inherit" }}>{s.beschreibung}</dd>
        </div>
      </div>

      <h3>Die sieben klassischen Faltentypen (Hogarth)</h3>
      <ol className="step-list">
        <li><strong>Pipe</strong> — vertikales Hängen, parallele Röhren</li>
        <li><strong>Zigzag</strong> — Wechsel-Falten an Ellbogen, Knie</li>
        <li><strong>Spiral</strong> — um zylindrische Form gewickelt (Ärmel, Hose)</li>
        <li><strong>Half-Lock</strong> — wo der Stoff geknickt + dann gezogen wird</li>
        <li><strong>Diaper</strong> — Stoff hängt zwischen zwei Aufhängepunkten</li>
        <li><strong>Drop</strong> — vom Auflagepunkt frei runter</li>
        <li><strong>Inert</strong> — Stoff liegt platt, keine aktive Spannung</li>
      </ol>

      <DepthBox variant="why" title="Warum zeigt Seide so scharfe Highlights?">
        Seidenfasern sind extrem glatt und parallel — die Oberfläche
        reflektiert fast wie ein Spiegel. Das macht die specular
        Reflection scharf und ortsgebunden (du siehst das Highlight nur
        aus einem bestimmten Blickwinkel). Bei Baumwolle sind die Fasern
        verzwirbelt und kurz — die diffuse Reflection dominiert, das
        Highlight ist weich und breit.
      </DepthBox>

      <DepthBox variant="mistake" title="Zu viele kleine Falten überall">
        Anfänger:innen malen oft <em>jede</em> denkbare Falte rein —
        besonders bei lockerem Stoff. Ergebnis: unruhiges Bild, kein
        klarer Form-Lese-Fluss. <strong>Faustregel</strong>: 3-5
        Hauptfalten pro Stoffbahn, der Rest entsteht durch implizierte
        Schattierung. <em>Less is more</em>.
      </DepthBox>

      <DepthBox variant="deeper" title="Faltenrichtung folgt dem Auflagepunkt">
        Jede Falte hat einen <em>Ursprung</em> — den Punkt, an dem der
        Stoff aufgehängt ist oder gezogen wird (Schulter, Taille, Hand,
        die einen Saum hält). Falten <em>strahlen</em> von dort aus.
        Vor jeder Detail-Falte erst den Ursprung markieren, dann Falten in
        Schwerkraft- oder Zug-Richtung zeichnen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Lichtkugel (Falten sind nichts anderes als gekrümmte Mini-Zylinder
        — dieselbe Lichtlogik), Soft Round + Hard Round Brushes
        (Falten brauchen <em>beides</em>: weichen Verlauf entlang, harte
        Kante an der Faltenspitze), Reference Companion (echte Fotos
        deines eigenen Stoffes — du siehst Falten besser als jede
        Anatomie-Buchabbildung).
      </DepthBox>

      <DepthBox variant="history" title="Burne Hogarth's Wrinkles & Drapery">
        Die sieben Faltentypen oben sind aus Hogarth's „Dynamic Wrinkles
        and Drapery" (1992). Das Buch ist immer noch der Standard-Referenz
        für Comic-Artists und Concept-Designer — die Logik gilt
        unverändert, egal ob du analog zeichnest oder in Procreate
        renderst.
      </DepthBox>
    </div>
  );
}
