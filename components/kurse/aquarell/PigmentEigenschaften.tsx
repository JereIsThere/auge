"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Pigment = {
  name: string;
  code: string;
  hex: string;
  /** 0..100: 0 = opak, 100 = volltransparent */
  transparenz: number;
  /** 0..100: 0 = glatt, 100 = stark granulierend */
  granulierung: number;
  /** 0..100: 0 = liftet komplett, 100 = staint dauerhaft */
  faerbekraft: number;
  notiz: string;
};

const PIGMENTE: Pigment[] = [
  {
    name: "Phthalo Blue (GS)",
    code: "PB15:3",
    hex: "#0c5b8b",
    transparenz: 95,
    granulierung: 5,
    faerbekraft: 95,
    notiz: "Glas-transparent, glatt, staint sich tief ins Papier — Korrektur fast unmöglich.",
  },
  {
    name: "Ultramarine Blue",
    code: "PB29",
    hex: "#274ea8",
    transparenz: 60,
    granulierung: 85,
    faerbekraft: 30,
    notiz: "Klassischer Granulierer — lässt sich gut liften, ergibt körnige Texturen.",
  },
  {
    name: "Cobalt Blue",
    code: "PB28",
    hex: "#3163a8",
    transparenz: 50,
    granulierung: 55,
    faerbekraft: 20,
    notiz: "Mild granulierend, sehr liftbar — Aquarell-Lehrbuch-Pigment.",
  },
  {
    name: "Burnt Sienna",
    code: "PBr7",
    hex: "#a1532c",
    transparenz: 75,
    granulierung: 50,
    faerbekraft: 35,
    notiz: "Erdpigment, leicht granulierend — perfekt für neutrale Mischungen mit Ultramarin.",
  },
  {
    name: "Alizarin Crimson",
    code: "PR83",
    hex: "#9f1b3b",
    transparenz: 90,
    granulierung: 10,
    faerbekraft: 70,
    notiz: "Tief, transparent, mittel staining — historischer Klassiker (mäßig lichtecht).",
  },
  {
    name: "Cadmium Red",
    code: "PR108",
    hex: "#c12d2b",
    transparenz: 15,
    granulierung: 30,
    faerbekraft: 45,
    notiz: "Halbdeckend — mischt nicht durch Glazing, sondern überdeckt.",
  },
  {
    name: "Hansa Yellow Light",
    code: "PY3",
    hex: "#f3d83a",
    transparenz: 85,
    granulierung: 10,
    faerbekraft: 50,
    notiz: "Transparente moderne Gelb — perfekte Glazing-Farbe.",
  },
  {
    name: "Quinacridone Rose",
    code: "PV19",
    hex: "#c2348a",
    transparenz: 95,
    granulierung: 5,
    faerbekraft: 85,
    notiz: "Knall-transparent, glatt, hoch staining — leuchtet in Glazings.",
  },
];

function balken(wert: number, label: string, farbe: string) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 110, fontSize: "0.78rem", color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 10, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            width: `${wert}%`,
            height: "100%",
            background: farbe,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div style={{ width: 40, fontSize: "0.72rem", textAlign: "right", color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
        {wert}
      </div>
    </div>
  );
}

export default function PigmentEigenschaften() {
  const [aktiv, setAktiv] = useState<Pigment>(PIGMENTE[1]); // Ultramarin als Default

  // Transparenz-Demo: Pigment liegt über einem schwarzen Balken — je transparenter,
  // desto stärker scheint Schwarz durch (Pigment selbst wird dunkler-getönt).
  const transAlpha = 0.85 - aktiv.transparenz / 250;

  // Granulierungs-Demo: feTurbulence-Stärke proportional zu Granulierung
  const granScale = aktiv.granulierung / 8; // 0..12.5

  // Färbekraft-Demo: gelöschter Fleck — Rest-Sättigung = staining
  const liftRest = aktiv.faerbekraft / 100;

  return (
    <div className="lesson-card">
      <h2>Transparenz, Granulierung, Färbekraft</h2>
      <p className="lesson-description">
        Drei Pigment-Eigenschaften entscheiden mehr über dein Bild als die
        Farbe selbst. Sie stehen nicht auf der Tube — du musst sie kennen.
        Klick ein Pigment und vergleiche, wie sich dieselbe Farbe je nach
        Eigenschaft komplett anders verhält.
      </p>

      <div className="info-box">
        <strong>So liest du den Pigment-Code:</strong> P = Pigment, dann ein
        Buchstabe für die Farbgruppe (B = Blue, R = Red, Y = Yellow, V = Violet,
        Br = Brown, G = Green), und eine Nummer. <em>PB29</em> ist also
        Pigment-Blau Nr. 29 = Ultramarin. Steht auf jeder seriösen Tube.
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PIGMENTE.map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => setAktiv(p)}
            className="toggle-code"
            style={{
              background: aktiv.code === p.code ? "#eff6ff" : "transparent",
              borderColor: aktiv.code === p.code ? "#2563eb" : "#d1d5db",
              color: aktiv.code === p.code ? "#1d4ed8" : "#374151",
              fontWeight: aktiv.code === p.code ? 700 : 500,
              fontSize: "0.78rem",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: p.hex,
                border: "1px solid rgba(0,0,0,0.15)",
                display: "inline-block",
              }}
            />
            {p.name}
          </button>
        ))}
      </div>

      <div className="result-box">
        <div className="result-label">{aktiv.name} <span style={{ color: "#94a3b8", fontWeight: 500 }}>· {aktiv.code}</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {balken(aktiv.transparenz, "Transparenz", "#0ea5e9")}
          {balken(aktiv.granulierung, "Granulierung", "#a16207")}
          {balken(aktiv.faerbekraft, "Färbekraft", "#7c3aed")}
        </div>
        <div style={{ marginTop: 8, fontSize: "0.85rem", color: "#52525b", fontStyle: "italic" }}>
          {aktiv.notiz}
        </div>
      </div>

      <h3>Was die drei Werte praktisch bedeuten</h3>
      <svg
        viewBox="0 0 600 200"
        style={{
          width: "100%",
          background: "#fefce8",
          border: "1px solid #fde68a",
          borderRadius: 10,
        }}
      >
        <defs>
          <filter id="pe-granul">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale={granScale} />
          </filter>
        </defs>

        {/* Spalte 1: Transparenz — Pigment über schwarzem Balken */}
        <g>
          <text x="100" y="20" textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="#92400e">
            Transparenz
          </text>
          <text x="100" y="34" textAnchor="middle" fontSize="9" fill="#a16207">
            Pigment über schwarzem Balken
          </text>
          <rect x="30" y="50" width="140" height="120" fill="#fff" />
          <rect x="30" y="50" width="140" height="120" fill="#111827" opacity="0.95" />
          {/* schwarzer Streifen quer */}
          <rect x="30" y="95" width="140" height="30" fill="#000" />
          <rect x="30" y="50" width="140" height="120" fill={aktiv.hex} opacity={transAlpha} />
          <text x="100" y="186" textAnchor="middle" fontSize="9" fill="#52525b">
            {aktiv.transparenz > 70
              ? "Schwarz scheint durch — Glazing geht"
              : aktiv.transparenz > 35
                ? "Halbdeckend — mischt eher als zu glasieren"
                : "Opak — überdeckt, Glazing nicht möglich"}
          </text>
        </g>

        {/* Spalte 2: Granulierung — texturierter Strich */}
        <g>
          <text x="300" y="20" textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="#92400e">
            Granulierung
          </text>
          <text x="300" y="34" textAnchor="middle" fontSize="9" fill="#a16207">
            wie der Strich auf rauem Papier aussieht
          </text>
          <rect x="230" y="50" width="140" height="120" fill="#fdf6e3" />
          <g filter={aktiv.granulierung > 15 ? "url(#pe-granul)" : undefined}>
            <rect x="245" y="80" width="110" height="60" fill={aktiv.hex} opacity={0.85} />
          </g>
          <text x="300" y="186" textAnchor="middle" fontSize="9" fill="#52525b">
            {aktiv.granulierung > 70
              ? "Setzt sich in Papierfasern — Textur"
              : aktiv.granulierung > 35
                ? "Mild körnig — sichtbar bei Wasch-Flächen"
                : "Glatt — gleichmäßiger Wash"}
          </text>
        </g>

        {/* Spalte 3: Färbekraft — Versuch zu liften */}
        <g>
          <text x="500" y="20" textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="#92400e">
            Färbekraft (staining)
          </text>
          <text x="500" y="34" textAnchor="middle" fontSize="9" fill="#a16207">
            Pigment + Lift-Versuch in der Mitte
          </text>
          <rect x="430" y="50" width="140" height="120" fill="#fdf6e3" />
          <rect x="445" y="80" width="110" height="60" fill={aktiv.hex} opacity={0.85} />
          {/* Lift-Versuch: in der Mitte ein "weicher" Kreis */}
          <circle cx="500" cy="110" r="22" fill="#fdf6e3" opacity={1 - liftRest} />
          <circle cx="500" cy="110" r="22" fill={aktiv.hex} opacity={liftRest * 0.5} />
          <circle cx="500" cy="110" r="22" fill="none" stroke="#a16207" strokeWidth="1" strokeDasharray="3 3" />
          <text x="500" y="186" textAnchor="middle" fontSize="9" fill="#52525b">
            {aktiv.faerbekraft > 70
              ? "Bleibt — Lifting bringt nichts"
              : aktiv.faerbekraft > 35
                ? "Teilweise liftbar — Geist bleibt"
                : "Hebt sauber ab — perfekt für Highlights"}
          </text>
        </g>
      </svg>

      <h3>Wie du die drei Werte in der Praxis nutzt</h3>
      <ol className="step-list">
        <li>
          <strong>Glazing-Schicht</strong> → transparent + niedrige Färbekraft.
          Phthalo Blue (transparent) ist ideal — aber nur wenn du sicher bist,
          dass du nicht zurück willst (staint).
        </li>
        <li>
          <strong>Wasch-Fläche mit Atmosphäre</strong> → granulierendes
          Pigment. Ultramarin + Burnt Sienna für Wolken, Steine, Fels.
        </li>
        <li>
          <strong>Highlight rauslüften</strong> → niedrige Färbekraft.
          Cobalt Blue, Cerulean — kannst du auch noch nach Trocknung zurückholen.
        </li>
        <li>
          <strong>Deckend & sicher</strong> → opake Pigmente (Cadmium-Familie).
          Wenn Aquarell dich erschöpft, geben sie die Kontrolle zurück.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum granulieren manche Pigmente und andere nicht?">
        Granulierung hat mit der <em>Partikelgröße</em> zu tun. Ultramarin
        besteht aus relativ großen, schweren Mineralpartikeln (Lapislazuli /
        synthetisches Aluminium-Silikat) — sie sinken im Wasser ab und
        sammeln sich in den Vertiefungen rauer Papierfasern. Phthalo dagegen
        ist ein moderner organischer Farbstoff: extrem feine Partikel,
        die im Wasser schwimmen statt absinken. Faustregel: <em>Erd- und
        Mineralpigmente</em> granulieren, <em>moderne synthetische</em>
        bleiben glatt.
      </DepthBox>

      <DepthBox variant="mistake" title='Phthalo Blue "nur mal antesten"'>
        Klassiker. Phthalo ist so stark färbend und so staining, dass schon
        ein Tropfen auf der Palette alle anderen Farben verdirbt — und ein
        Phthalo-Fleck auf dem Papier bleibt für immer. Profi-Move: Phthalo
        immer am äußersten Rand der Palette, in eigenem Wasserglas.
      </DepthBox>

      <DepthBox variant="deeper" title="Single-Pigment vs Convenience-Mix">
        Manche Tubenfarben („Sap Green", „Indigo", „Payne's Gray") sind
        Mischungen aus 2-4 Pigmenten — bequem, aber unvorhersehbar wenn du
        sie mit anderen mischst. Wer kontrolliert mischen will, kauft
        <strong>single-pigment</strong>-Farben: PB29, PR108, PY3 etc. Auf
        seriösen Tuben steht das immer drauf. Ein Set aus 8-12
        Single-Pigment-Farben deckt fast alles ab.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Glazing (braucht transparente, niedrig-färbende Pigmente),
        Lifting (geht nur bei niedrig-färbenden Pigmenten),
        Wet-on-Wet (granulierende Pigmente verstärken den Effekt von
        weichem nassem Papier), Lichtechtheit (Alizarin Crimson hat
        traumhafte Eigenschaften, bleicht aber aus — Achtung!).
      </DepthBox>
    </div>
  );
}
