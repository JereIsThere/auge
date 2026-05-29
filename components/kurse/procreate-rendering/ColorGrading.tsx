"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Preset = "neutral" | "teal-orange" | "warm-day" | "cold-night" | "vintage";

const PRESETS: Record<Preset, {
  label: string;
  schatten: [number, number, number];   // RGB-Shift Schatten
  mittelton: [number, number, number];  // RGB-Shift Midtones
  highlight: [number, number, number];  // RGB-Shift Highlights
  saettigung: number;                   // -100..+100
  beschreibung: string;
}> = {
  "neutral":     {
    label: "neutral (ohne Grading)",
    schatten:  [0, 0, 0],
    mittelton: [0, 0, 0],
    highlight: [0, 0, 0],
    saettigung: 0,
    beschreibung: "Reine Lokalfarben. Realistisch, aber wenig Stimmung.",
  },
  "teal-orange": {
    label: "Teal & Orange (cinematic)",
    schatten:  [-15, 0, 25],
    mittelton: [10, 5, 0],
    highlight: [20, 10, -5],
    saettigung: 15,
    beschreibung: "Hollywood-Standard seit ~2005. Komplementär-Kontrast Haut (warm) gegen Schatten/Hintergrund (kühl).",
  },
  "warm-day": {
    label: "warmer Sonnentag",
    schatten:  [10, 5, -10],
    mittelton: [20, 15, 0],
    highlight: [25, 20, 0],
    saettigung: 10,
    beschreibung: "Goldene Stunde, alles in warmen Tönen. Romantisch, nostalgisch.",
  },
  "cold-night": {
    label: "kalte Nacht",
    schatten:  [-25, -10, 15],
    mittelton: [-15, -5, 10],
    highlight: [-10, 0, 5],
    saettigung: -10,
    beschreibung: "Bläulich-grünlich, entsättigt. Düster, ruhig, gefährlich.",
  },
  "vintage": {
    label: "Vintage / Sepia",
    schatten:  [15, 5, -20],
    mittelton: [20, 10, -15],
    highlight: [25, 20, 0],
    saettigung: -25,
    beschreibung: "Filmlook der 70er. Warme Töne, entsättigt, leicht bräunlich.",
  },
};

// Beispielfarben aus einer Mini-Szene
const SZENE: { name: string; basis: [number, number, number]; bereich: "schatten" | "mittelton" | "highlight" }[] = [
  { name: "Himmel",      basis: [180, 195, 220], bereich: "highlight" },
  { name: "Wolken",      basis: [240, 235, 225], bereich: "highlight" },
  { name: "Wand",        basis: [195, 170, 145], bereich: "mittelton" },
  { name: "Haut Mitte",  basis: [210, 165, 135], bereich: "mittelton" },
  { name: "Hemd",        basis: [75,  95,  140], bereich: "mittelton" },
  { name: "Tiefe",       basis: [40,  35,  50],  bereich: "schatten"  },
];

function applyGrading(
  basis: [number, number, number],
  bereich: "schatten" | "mittelton" | "highlight",
  preset: Preset
): [number, number, number] {
  const p = PRESETS[preset];
  const shift = p[bereich];

  // 1) Color-Shift
  const r = basis[0] + shift[0];
  const g = basis[1] + shift[1];
  const b = basis[2] + shift[2];

  // 2) Sättigung (sehr vereinfacht: Annäherung an Grau für negative, weg davon für positive)
  const avg = (r + g + b) / 3;
  const satF = 1 + p.saettigung / 100;
  const finalR = avg + (r - avg) * satF;
  const finalG = avg + (g - avg) * satF;
  const finalB = avg + (b - avg) * satF;

  return [
    Math.max(0, Math.min(255, Math.round(finalR))),
    Math.max(0, Math.min(255, Math.round(finalG))),
    Math.max(0, Math.min(255, Math.round(finalB))),
  ];
}

export default function ColorGrading() {
  const [preset, setPreset] = useState<Preset>("teal-orange");
  const p = PRESETS[preset];

  const szeneMitGrading = useMemo(
    () => SZENE.map((s) => ({ ...s, ergebnis: applyGrading(s.basis, s.bereich, preset) })),
    [preset]
  );

  return (
    <div className="lesson-card">
      <h2>Color Grading am Ende</h2>
      <p className="lesson-description">
        Wenn das Rendering steht, kommt der finale Schliff:{" "}
        <strong>Color Grading</strong>. Du verschiebst gezielt die
        Farbtemperatur in Schatten, Mitteltönen und Highlights — und
        gibst dem Bild eine konsistente <em>Stimmung</em>, ohne die
        gemalten Farben neu zu mischen.
      </p>

      <div className="input-group">
        <label>Color-Grading-Preset</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(PRESETS) as Preset[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className="toggle-code"
              style={{
                background: preset === id ? "#eef2ff" : "transparent",
                borderColor: preset === id ? "#3b82f6" : "#d1d5db",
                color: preset === id ? "#1d4ed8" : "#374151",
                fontWeight: preset === id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {PRESETS[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className="info-box" style={{ fontSize: "0.88rem" }}>
        {p.beschreibung}
      </div>

      {/* Vergleich Vorher/Nachher */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 4,
        }}
      >
        {szeneMitGrading.map((s) => (
          <div key={s.name} style={{ textAlign: "center" }}>
            <div
              style={{
                height: 38,
                background: `rgb(${s.basis[0]}, ${s.basis[1]}, ${s.basis[2]})`,
                border: "1px solid #d1d5db",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
              title="vorher"
            />
            <div
              style={{
                height: 38,
                background: `rgb(${s.ergebnis[0]}, ${s.ergebnis[1]}, ${s.ergebnis[2]})`,
                border: "1px solid #d1d5db",
                borderTop: "none",
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}
              title="nachher"
            />
            <div
              style={{
                fontSize: "0.65rem",
                color: "#52525b",
                marginTop: 4,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {s.name}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "0.7rem", color: "#6b7280", textAlign: "center", marginTop: 6 }}>
        oben: Lokalfarbe vor Grading · unten: nach Anwendung
      </div>

      <h3>Wo in Procreate</h3>
      <ol className="step-list">
        <li>
          <strong>Layer-Modi-Ansatz</strong> — neuer Layer, niedrige
          Opacity (10-25 %), Mode auf <code>Color</code> oder
          <code>Soft Light</code>. Mit Soft Round breit über das ganze
          Bild ziehen. Sehr kontrollierbar.
        </li>
        <li>
          <strong>Adjustment-Ansatz</strong> — <code>Adjustments → Curves</code>{" "}
          (separate RGB-Channels manipulieren) oder
          <code>Color Balance</code> (drei Schieber für Schatten/Mitte/Highlights).
          Nicht-destruktiv durch Anwendung auf Adjustment-Layer.
        </li>
        <li>
          <strong>Gradient-Map-Ansatz</strong> —{" "}
          <code>Adjustments → Gradient Map</code> mappt Bildhelligkeit
          auf eine Farbpalette. Schneller Cinematic-Look in 5 Sekunden.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum nicht direkt die Lokalfarben anpassen?">
        Du würdest jeden Pixel einzeln anfassen — destruktiv und
        unflexibel. Color Grading auf einem separaten Layer (oder
        Adjustment) ist (1) nicht-destruktiv (jederzeit ausschaltbar),
        (2) konsistent über das ganze Bild, (3) iterativ anpassbar bis
        du den Look hast. Genau wie in Film-Post-Production.
      </DepthBox>

      <DepthBox variant="mistake" title="Color Grading zu stark">
        Anfänger:innen drehen die Opacity oft auf 60-80 % — das kippt
        in „Instagram-Filter-Look". Faustregel: <strong>Color Grading
        sollte spürbar, aber nicht offensichtlich sein</strong>. Wenn
        du den Effekt 1× ausschaltest und das Bild aussieht wie ein
        anderes, ist es zu stark. 15-30 % Layer-Opacity ist üblich.
      </DepthBox>

      <DepthBox variant="deeper" title="Teal-and-Orange in der Praxis">
        Die Logik dieses berühmten Looks: Hauttöne liegen warm (orange-rot)
        im Farbkreis. Ihre <em>Komplementärfarbe</em> ist teal/cyan.
        Wenn du also Schatten und Hintergründe ins Teal verschiebst und
        die Highlights/Haut ins Orange, erzeugst du maximalen
        Komplementär-Kontrast — Figuren springen heraus. Hollywood
        nutzt das seit „Transformers" (2007) durchgehend, mittlerweile
        leicht ermüdend, aber funktioniert immer noch.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Farbkreis (warum gerade Komplementärfarben Tiefe schaffen — wie
        in der Aquarell-Lektion), Layer-Modi (Color, Hue, Soft Light
        sind die Grading-Workhorses), und Lichtkugel + Materialien
        (Color Grading wirkt anders pro Material — Metall verzerrt mehr
        als matte Oberflächen).
      </DepthBox>
    </div>
  );
}
