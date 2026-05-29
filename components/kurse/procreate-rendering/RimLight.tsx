"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Setup = "kein-rim" | "rim-kalt" | "rim-warm" | "doppel-rim";

const SETUPS: { id: Setup; label: string; beschreibung: string }[] = [
  {
    id: "kein-rim",
    label: "ohne Rim Light",
    beschreibung:
      "Standard-Drei-Punkt-Beleuchtung. Figur und Hintergrund verschmelzen in den dunklen Bereichen.",
  },
  {
    id: "rim-kalt",
    label: "kalter Rim (Mond, Fenster)",
    beschreibung:
      "Kühles Lichtband am Konturrand der Figur. Trennt sie scharf vom Hintergrund. Nacht-Szenen, Innenraum mit Fensterlicht.",
  },
  {
    id: "rim-warm",
    label: "warmer Rim (Sonnenuntergang)",
    beschreibung:
      "Warmer goldener Saum entlang der Kontur. Sonnenuntergang von hinten, Gegenlicht-Portraits.",
  },
  {
    id: "doppel-rim",
    label: "doppelter Rim (Studio)",
    beschreibung:
      "Zwei farbig unterschiedliche Rim Lights (z.B. cyan + magenta). Dramatisch, sci-fi/cinematic Look.",
  },
];

const RIM_FARBE: Record<Setup, { links: string; rechts: string; opLinks: number; opRechts: number }> = {
  "kein-rim":   { links: "transparent",     rechts: "transparent",     opLinks: 0,    opRechts: 0 },
  "rim-kalt":   { links: "#bdd5ff",         rechts: "transparent",     opLinks: 0.85, opRechts: 0 },
  "rim-warm":   { links: "transparent",     rechts: "#ffb267",         opLinks: 0,    opRechts: 0.9 },
  "doppel-rim": { links: "#56eaff",         rechts: "#ff5cc7",         opLinks: 0.85, opRechts: 0.85 },
};

export default function RimLight() {
  const [setup, setSetup] = useState<Setup>("rim-kalt");
  const s = SETUPS.find((x) => x.id === setup)!;
  const rim = RIM_FARBE[setup];

  return (
    <div className="lesson-card">
      <h2>Rim Light &amp; Backlight</h2>
      <p className="lesson-description">
        Ein <strong>Rim Light</strong> (Konturlicht) ist eine zusätzliche
        Lichtquelle <em>hinter</em> der Figur, die nur den Rand erfasst.
        Der Effekt: die Silhouette wird vom Hintergrund freigestellt,
        das Bild bekommt sofort Tiefe und Drama. Ein Trick aus der
        klassischen Film-Beleuchtung — und der einfachste „Rendering-Hack"
        überhaupt.
      </p>

      <div className="input-group">
        <label>Beleuchtungs-Setup</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SETUPS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSetup(opt.id)}
              className="toggle-code"
              style={{
                background: setup === opt.id ? "#eef2ff" : "transparent",
                borderColor: setup === opt.id ? "#3b82f6" : "#d1d5db",
                color: setup === opt.id ? "#1d4ed8" : "#374151",
                fontWeight: setup === opt.id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 320 280"
        style={{
          background: "#1a1525",
          border: "1px solid #3a2f48",
          borderRadius: 10,
          width: "100%",
          maxWidth: 380,
          margin: "0 auto",
        }}
      >
        <defs>
          <radialGradient id="bg-grad" cx="0.5" cy="0.6" r="0.7">
            <stop offset="0" stopColor="#2a2240" />
            <stop offset="1" stopColor="#0d0a18" />
          </radialGradient>
          <linearGradient id="rim-links" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={rim.links} stopOpacity={rim.opLinks} />
            <stop offset="0.3" stopColor={rim.links} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rim-rechts" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor={rim.rechts} stopOpacity={rim.opRechts} />
            <stop offset="0.3" stopColor={rim.rechts} stopOpacity={0} />
          </linearGradient>
          <clipPath id="figur-clip">
            {/* Vereinfachte Figur-Silhouette: ovaler Kopf + Schulterbereich */}
            <path d="M 160 70 a 35 38 0 0 1 0 76 q 55 6 70 60 q 0 30 -70 30 q -70 0 -70 -30 q 15 -54 70 -60 z" />
          </clipPath>
        </defs>

        {/* Hintergrund */}
        <rect x="0" y="0" width="320" height="280" fill="url(#bg-grad)" />

        {/* Figur-Basis (dunkel, schwer vom BG trennbar ohne Rim) */}
        <g clipPath="url(#figur-clip)">
          <rect x="0" y="0" width="320" height="280" fill="#382c4a" />
          {/* Front-Licht etwas heller (3-Punkt) */}
          <circle cx="155" cy="110" r="55" fill="#5a4870" opacity="0.7" />
          {/* Rim-Light-Streifen */}
          <rect x="0" y="0" width="320" height="280" fill="url(#rim-links)" />
          <rect x="0" y="0" width="320" height="280" fill="url(#rim-rechts)" />
        </g>

        {/* Outline für Lesbarkeit */}
        <path
          d="M 160 70 a 35 38 0 0 1 0 76 q 55 6 70 60 q 0 30 -70 30 q -70 0 -70 -30 q 15 -54 70 -60 z"
          fill="none"
          stroke="#000"
          strokeWidth="0.8"
          opacity="0.3"
        />
      </svg>

      <div className="info-box" style={{ fontSize: "0.88rem" }}>
        {s.beschreibung}
      </div>

      <DepthBox variant="why" title="Warum funktioniert Rim Light so stark?">
        Unser Sehsystem nutzt <em>Kontrastkanten</em>, um Formen zu lesen.
        Ohne Rim Light verschmilzt die dunkle Seite der Figur mit dem
        dunklen Hintergrund — die Form „löst sich auf". Ein heller
        Konturstreifen zerschneidet diese Verschmelzung und macht die
        Silhouette wieder lesbar. Effizienz pro Pixel: kaum ein
        Rendering-Element trägt mehr zur Bildwirkung bei.
      </DepthBox>

      <DepthBox variant="mistake" title="Rim Light über die ganze Kontur ziehen">
        Typischer Fail: das Rim Light läuft 360° um die Figur und wirkt
        wie ein Heiligenschein. Lösung: <strong>nur entlang einer Kante</strong>{" "}
        — dort, wo die fiktive Hintergrund-Lichtquelle wäre. Auf der
        anderen Seite Schatten oder leichter Reflex aus der Umgebung,
        nie ein zweites identisches Rim Light (außer bei bewusstem
        Doppel-Rim-Setup, siehe oben).
      </DepthBox>

      <DepthBox variant="deeper" title="Backlight vs. Rim Light">
        Eng verwandt, aber unterschiedlich:
        <ul>
          <li>
            <strong>Backlight</strong>: Lichtquelle direkt hinter der
            Figur, vom Betrachter aus gesehen. Erzeugt Glow-Effekt
            <em>überall</em> hinter der Figur, nicht nur am Rand.
            Beispiel: Sonnenuntergang von hinten.
          </li>
          <li>
            <strong>Rim Light</strong>: Lichtquelle schräg hinten/seitlich.
            Nur die <em>Konturkante</em> wird erfasst, nicht die ganze
            Hintergrundfläche. Beispiel: Streetlight am Rand.
          </li>
        </ul>
        Im Bild verschmelzen die Begriffe oft — was zählt, ist die
        Kontrast-Funktion.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Atmospheric Perspective (Tiefe durch verblassende Werte in der
        Distanz), Color Grading (Rim Light + Color-Grading definiert
        deinen „Look": cinematic-teal-orange ist die berühmteste
        Kombi), und Layer-Modi (Add oder Color Dodge auf separatem
        Layer für das Rim-Glow — niedrig 15-25 % Opacity, mit Soft
        Round Brush von hinten an die Kontur tupfen).
      </DepthBox>
    </div>
  );
}
