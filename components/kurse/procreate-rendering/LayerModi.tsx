"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import "@/components/lessons/lesson.css";

type Mode = "normal" | "multiply" | "add" | "overlay" | "color-dodge" | "soft-light";

const MODI: { id: Mode; titel: string; einsatz: string; warnung: string }[] = [
  {
    id: "normal",
    titel: "Normal",
    einsatz: "Default. Pixel ersetzen einfach das was drunter ist.",
    warnung: "Zerstört darunterliegende Farbe — schwer rückgängig zu machen.",
  },
  {
    id: "multiply",
    titel: "Multiply (Schatten)",
    einsatz: "DAS Tool für Schatten. Multipliziert Pixel — alles wird dunkler, nie heller.",
    warnung: "Weiß auf einem Multiply-Layer hat NULL Wirkung. Schwarz → maximal dunkel.",
  },
  {
    id: "add",
    titel: "Add (Highlight, Glow)",
    einsatz: "Heller machen ohne die Lokalfarbe zu verlieren. Magie für Glow-Effekte.",
    warnung: "Übertreibt leicht — niedrige Layer-Opacity (20–40 %) ist meistens richtig.",
  },
  {
    id: "overlay",
    titel: "Overlay (Kontrast + Farbe)",
    einsatz: "Verstärkt Kontrast und schiebt die Farbe gleichzeitig. Perfekt für Color Grading am Ende.",
    warnung: "50 % Grau auf Overlay = neutral, nichts ändert sich. Mit hellem Pinsel hochziehen, mit dunklem absenken.",
  },
  {
    id: "color-dodge",
    titel: "Color Dodge (intensive Highlights)",
    einsatz: "Spotlights, Rim Light, magisches Leuchten. Brennt Highlights extrem hell.",
    warnung: "Sehr aggressiv. Niedrige Opacity (10–20 %) ist Pflicht. Sonst schreit das Bild.",
  },
  {
    id: "soft-light",
    titel: "Soft Light (sanftes Color Grading)",
    einsatz: "Wie Overlay, aber dezenter. Für atmosphärische Tönungen über das ganze Bild.",
    warnung: "Wenig sichtbarer Effekt — du brauchst kräftige Farben um was zu sehen.",
  },
];

// Mini-Simulation: zwei Beispiel-Pixel (Lokalfarbe + Layer-Pixel) → Ergebnis
function mische(modus: Mode, base: [number, number, number], blend: [number, number, number], op = 1): [number, number, number] {
  const n = (c: number) => c / 255;
  const [br, bg, bb] = base.map(n);
  const [lr, lg, lb] = blend.map(n);

  const apply = (b: number, l: number): number => {
    let result: number;
    switch (modus) {
      case "normal":      result = l; break;
      case "multiply":    result = b * l; break;
      case "add":         result = Math.min(1, b + l); break;
      case "overlay":     result = b < 0.5 ? 2 * b * l : 1 - 2 * (1 - b) * (1 - l); break;
      case "color-dodge": result = l >= 1 ? 1 : Math.min(1, b / (1 - l)); break;
      case "soft-light":  result = l < 0.5
        ? b - (1 - 2 * l) * b * (1 - b)
        : b + (2 * l - 1) * (b < 0.25
            ? ((16 * b - 12) * b + 4) * b
            : Math.sqrt(b)) - b * (2 * l - 1);
        break;
    }
    return Math.round((b * (1 - op) + result * op) * 255);
  };

  return [apply(br, lr), apply(bg, lg), apply(bb, lb)];
}

function rgb(c: [number, number, number]): string {
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

// Beispiel-Szene: ein Gesicht in Lokalfarbe + ein Layer drüber.
const BASE_SZENE: { name: string; farbe: [number, number, number] }[] = [
  { name: "Stirn",   farbe: [220, 178, 145] }, // helle Haut
  { name: "Wange",   farbe: [198, 152, 122] }, // mittlere Haut
  { name: "Kinn",    farbe: [165, 122, 96]  }, // Schatten
  { name: "Hemd",    farbe: [70,  90,  140] }, // mittelblau
  { name: "Boden",   farbe: [55,  45,  60]  }, // dunkel
];

const BLEND_PRESETS: Record<Mode, { name: string; farbe: [number, number, number] }> = {
  "normal":      { name: "weiß",            farbe: [255, 255, 255] },
  "multiply":    { name: "warmer Schatten", farbe: [110, 90, 130] },
  "add":         { name: "warmes Licht",    farbe: [180, 130, 60] },
  "overlay":     { name: "Sonnen-Wärme",    farbe: [255, 180, 100] },
  "color-dodge": { name: "Glow",            farbe: [120, 90, 50] },
  "soft-light":  { name: "kühler Look",     farbe: [80, 110, 180] },
};

export default function LayerModi() {
  const [modus, setModus] = useState<Mode>("multiply");
  const [opacity, setOpacity] = useState(80);
  const info = MODI.find((m) => m.id === modus)!;
  const blend = BLEND_PRESETS[modus];

  return (
    <div className="lesson-card">
      <h2>Layer-Modi für Rendering</h2>
      <p className="lesson-description">
        Layer-Modi sind das digitale Pendant zu Glasuren in der traditionellen
        Malerei. Statt Pixel zu ersetzen, <em>kombinieren</em> sie eine neue
        Schicht mit dem, was drunter liegt. Drei davon machen 90 % der
        Rendering-Arbeit: <strong>Multiply</strong> (Schatten),{" "}
        <strong>Add</strong> (Highlights), <strong>Overlay</strong>{" "}
        (Atmosphäre).
      </p>

      <div className="input-group">
        <label>Layer-Modus</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {MODI.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModus(m.id)}
              className="toggle-code"
              style={{
                background: modus === m.id ? "#eef2ff" : "transparent",
                borderColor: modus === m.id ? "#3b82f6" : "#d1d5db",
                color: modus === m.id ? "#1d4ed8" : "#374151",
                fontWeight: modus === m.id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {m.titel}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Layer-Opacity: {opacity} %</label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={opacity}
          onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="result-box">
        <div className="result-label">
          {modus} mit Pinselfarbe {blend.name} (
          <code style={{ fontSize: "0.78rem" }}>{rgb(blend.farbe)}</code>)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            marginTop: 10,
          }}
        >
          {BASE_SZENE.map((feld) => {
            const ergebnis = mische(modus, feld.farbe, blend.farbe, opacity / 100);
            return (
              <div key={feld.name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: 36,
                    background: rgb(feld.farbe),
                    border: "1px solid #d1d5db",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                />
                <div
                  style={{
                    height: 36,
                    background: rgb(ergebnis),
                    border: "1px solid #d1d5db",
                    borderTop: "none",
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                />
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#52525b",
                    marginTop: 4,
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {feld.name}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 8, textAlign: "center" }}>
          oben: Lokalfarbe · unten: nach Anwendung des Layers
        </div>
      </div>

      <div className="kv-table" style={{ fontSize: "0.9rem" }}>
        <dt style={{ fontFamily: "inherit" }}>Wofür:</dt>
        <dd style={{ fontFamily: "inherit" }}>{info.einsatz}</dd>
        <dt style={{ fontFamily: "inherit", color: "#b45309" }}>Watch out:</dt>
        <dd style={{ fontFamily: "inherit", color: "#78350f" }}>{info.warnung}</dd>
      </div>

      <DepthBox variant="why" title="Warum Multiply für Schatten und nicht Normal mit Grau?">
        Multiply behält die <em>Sättigung</em> und den <em>Farbcharakter</em>{" "}
        der Lokalfarbe — ein warmer Hautton bleibt warm im Schatten, ein
        blaues Hemd bleibt blau, nur dunkler. Mit Normal-Modus und Grau
        ziehst du die Sättigung raus und alles wirkt schmutzig.
      </DepthBox>

      <DepthBox variant="mistake" title="Schatten reinmalen ohne Clipping Mask">
        Klassischer Fail: du legst einen Multiply-Layer „Schatten" oben drauf
        und malst quer über alle Formen. Bei der ersten Änderung an der
        Form sind die Schatten an der falschen Stelle. <strong>Lösung:
        Clipping Mask</strong> — der Multiply-Layer ist an die Form drunter
        geklippt, malst du außerhalb der Form, hat es keinen Effekt. In
        Procreate: Layer antippen → &bdquo;Clipping Mask&ldquo;.
      </DepthBox>

      <DepthBox variant="deeper" title="Die mathematischen Formeln dahinter">
        <ul>
          <li>
            <strong>Multiply</strong>: <code>result = base × layer</code>{" "}
            (alles als 0–1 normalisiert). Daher: layer=1 (weiß) → result=base,
            layer=0 (schwarz) → result=0. Nie heller.
          </li>
          <li>
            <strong>Screen</strong> (Umkehr von Multiply): <code>result = 1 − (1−base) × (1−layer)</code>.
            Nie dunkler.
          </li>
          <li>
            <strong>Overlay</strong>: Multiply für base &lt; 0.5, Screen für
            base &gt; 0.5. Daher wirkt 50 % Grau auf Overlay neutral.
          </li>
          <li>
            <strong>Add (Linear Dodge)</strong>: <code>result = base + layer</code>{" "}
            (clamped auf 1). Stärker als Screen — pusht schnell ins Clipping.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Clipping Masks (essentielles Procreate-Pattern, um Layer-Modi
        sauber zu scopen), Alpha Lock (Multiply auf dem Form-Layer selbst
        statt auf separatem), Color Burn (extremer als Multiply — selten
        nötig), und Adjustment-Layer (Hue/Saturation, Color Balance — die
        machen ähnliche Sachen auf nicht-destruktive Weise).
      </DepthBox>

      <Aufgabe titel="Tasse mit Multiply + Add" schwierigkeit="leicht" zeit="20 min">
        <p>
          Mal eine einfache Tasse als Lokalfarbe-Flat. Bau die Beleuchtung
          dann <em>ausschließlich</em> mit zwei zusätzlichen Layern:
        </p>
        <AufgabeCheckliste
          items={[
            "Multiply-Layer (z.B. Lila-Grau): die Schattenseite der Tasse + Cast Shadow",
            "Add-Layer (z.B. warmes Beige): das Highlight auf der Lichtseite + ein dezentes Reflected Light unten",
            "Beide Layer als Clipping Mask auf die Tasse — der Cast Shadow auf einem separaten freien Multiply-Layer",
            "Layer-Opacity zwischen 30 % und 70 % halten, damit die Lokalfarbe sichtbar bleibt",
          ]}
        />
      </Aufgabe>
    </div>
  );
}
