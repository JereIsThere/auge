"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

const SSS_STAERKE = [0, 25, 50, 75, 100] as const;

export default function Haut() {
  const [sss, setSss] = useState(50);

  // Vereinfacht: SSS-Stärke beeinflusst, wie viel rötliches Licht
  // in den Schattenbereich "leakt".
  const tHaut: [number, number, number] = [220, 178, 145];   // helle Haut
  const tSchatten: [number, number, number] = [105, 70, 60]; // tiefer Schatten
  const tSSS: [number, number, number] = [220, 105, 95];     // Subsurface-Glühen (Hand-vor-Lampe-Rot)

  // SSS "leakt" als rötlicher Halbschatten zwischen Lokalfarbe und Schatten.
  const sssFactor = sss / 100;
  const halbSchattenMitSSS: [number, number, number] = [
    Math.round(tSchatten[0] * (1 - sssFactor) + tSSS[0] * sssFactor),
    Math.round(tSchatten[1] * (1 - sssFactor) + tSSS[1] * sssFactor),
    Math.round(tSchatten[2] * (1 - sssFactor) + tSSS[2] * sssFactor),
  ];

  const farben: [[number, number, number], string][] = [
    [tHaut, "Licht"],
    [halbSchattenMitSSS, "Übergang (mit SSS)"],
    [tSchatten, "tiefer Schatten"],
  ];

  return (
    <div className="lesson-card">
      <h2>Haut &amp; Subsurface Scattering</h2>
      <p className="lesson-description">
        Haut ist nicht opak wie Plastik — Licht dringt leicht ein,
        wird im Gewebe gestreut und kommt teilweise wieder raus. Diesen
        Effekt nennt man <strong>Subsurface Scattering (SSS)</strong>. Er
        macht den Unterschied zwischen einem lebenden Gesicht und einer
        Schaufensterpuppe.
      </p>

      <div className="info-box">
        Klassischer Test: halte deine Hand vor eine helle Lampe. Die
        Konturen leuchten rötlich-orange — das ist Licht, das durchs
        Fleisch wandert und dabei die Hämoglobin-Wellenlänge ausfiltert.
        Genau das willst du im Bild simulieren.
      </div>

      <div className="input-group">
        <label>SSS-Stärke: {sss} %</label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={sss}
          onChange={(e) => setSss(parseInt(e.target.value, 10))}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 4,
        }}
      >
        {farben.map(([rgb, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                height: 80,
                background: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
                border: "1px solid #d1d5db",
                borderRadius: 8,
              }}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: "#52525b",
                marginTop: 6,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          color: "#6b7280",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Schieb den SSS-Slider — die Mitte wandert von braun-grau
        (ohne SSS) zu warm-orange (mit SSS).
      </div>

      <h3>Wo SSS am stärksten ist</h3>
      <ol className="step-list">
        <li>
          <strong>Konturen gegen Licht</strong> — Ohren, Nasenflügel,
          Fingerkanten. Hier ist die Haut dünn und Licht kommt fast durch.
        </li>
        <li>
          <strong>Übergangszone von Licht zu Schatten</strong> — wo das
          direkte Licht aufhört, leuchtet das Hämoglobin am stärksten.
          Hier setzt der SSS-Effekt im Bild an.
        </li>
        <li>
          <strong>Tiefer Schatten</strong> — fast kein SSS mehr, weil
          überhaupt kein Licht eindringt. Hier ist Haut wieder „neutral
          dunkel".
        </li>
      </ol>

      <DepthBox variant="why" title="Warum ausgerechnet rötlich?">
        SSS streut alle Wellenlängen, aber Hämoglobin im Blut absorbiert
        kürzere Wellenlängen (Blau, Grün) deutlich stärker als längere
        (Rot). Das Licht, das wieder rauskommt, ist im roten Spektrum
        angereichert. Bei sehr dunkler Haut ist der Effekt nicht weg,
        nur subtiler — du brauchst aufmerksamere Augen, um ihn zu lesen.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich male einfach den Schatten grau"'>
        Klassischer Anfänger-Move bei Haut. Grauer Schatten = tot, leblos.
        Selbst der dunkelste Hautschatten hat noch <em>Wärme</em> —
        bräunlich, leicht violett, nie reines Grau. <strong>Procreate-Trick</strong>:
        wenn dein Schatten zu kalt wirkt, leg einen Multiply-Layer mit
        warmem Rotton drüber (z.B. Burnt Sienna) bei 20-30 % Opacity.
      </DepthBox>

      <DepthBox variant="deeper" title="Drei SSS-Schichten">
        Pixar's Render-Engine simuliert SSS in drei Schichten:
        <ul>
          <li>
            <strong>Shallow Red</strong> (~1 mm Tiefe) — Hämoglobin direkt
            unter der Oberfläche. Wandert kurz, kommt rasch zurück.
          </li>
          <li>
            <strong>Mid Yellow</strong> (~3 mm) — gelbliches Fett-/Bindegewebe.
            Macht den „goldenen" Glow an dünnen Stellen.
          </li>
          <li>
            <strong>Deep Pink</strong> (~5+ mm) — fast nichts kommt zurück,
            aber bei dünnen Stellen (Ohrlappen) das tiefe Rosa.
          </li>
        </ul>
        Für 2D-Illustration reicht <em>ein</em> Layer in warmem Rotton —
        die drei Schichten zu simulieren ist 3D-Render-Territorium.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Lichtkugel (matt vs Haut: nur Haut hat das spezifische rötliche
        Glow am Schattenrand), Layer-Modi (Add-Layer mit warmem Rotton
        auf der Übergangszone = SSS-Effekt in 5 Sekunden),
        Color-Temperature (kühles Licht + warmer SSS-Schatten = lebendig;
        warmes Licht + warmer Schatten = krank-wirkend).
      </DepthBox>
    </div>
  );
}
