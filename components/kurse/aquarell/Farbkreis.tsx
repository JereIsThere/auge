"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Farbe = {
  name: string;
  pigment: string;
  hex: string;
  winkel: number; // 0..360
};

// 12-teiliger Farbkreis (vereinfacht). Pigment-Vorschläge gängige
// Aquarell-Klassiker.
const FARBEN: Farbe[] = [
  { name: "Gelb",            pigment: "Hansa Yellow Light",  hex: "#f6e154", winkel: 0   },
  { name: "Gelb-Orange",     pigment: "Cadmium Yellow Deep", hex: "#f3b338", winkel: 30  },
  { name: "Orange",          pigment: "Cadmium Orange",      hex: "#e8742d", winkel: 60  },
  { name: "Rot-Orange",      pigment: "Pyrrol Scarlet",      hex: "#d83a26", winkel: 90  },
  { name: "Rot",             pigment: "Cadmium Red",         hex: "#c11d2b", winkel: 120 },
  { name: "Rot-Violett",     pigment: "Alizarin Crimson",    hex: "#8f1a4a", winkel: 150 },
  { name: "Violett",         pigment: "Dioxazine Violet",    hex: "#4a1b6e", winkel: 180 },
  { name: "Blau-Violett",    pigment: "Ultramarine Violet",  hex: "#3a3a8c", winkel: 210 },
  { name: "Blau",            pigment: "Ultramarine Blue",    hex: "#1f4ea8", winkel: 240 },
  { name: "Blau-Grün",       pigment: "Phthalo Blue (GS)",   hex: "#1a7da3", winkel: 270 },
  { name: "Grün",            pigment: "Phthalo Green (BS)",  hex: "#1f8a5a", winkel: 300 },
  { name: "Gelb-Grün",       pigment: "Sap Green",           hex: "#76a534", winkel: 330 },
];

const SIZE = 360;
const RADIUS_AUSSEN = 150;
const RADIUS_INNEN = 92;
const CENTER = SIZE / 2;

function komplementaer(farbe: Farbe): Farbe {
  const ziel = (farbe.winkel + 180) % 360;
  return FARBEN.reduce((a, b) =>
    Math.abs(b.winkel - ziel) < Math.abs(a.winkel - ziel) ? b : a
  );
}

function segmentPfad(winkelStart: number, winkelEnde: number): string {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const xs1 = CENTER + RADIUS_AUSSEN * Math.cos(rad(winkelStart));
  const ys1 = CENTER + RADIUS_AUSSEN * Math.sin(rad(winkelStart));
  const xs2 = CENTER + RADIUS_AUSSEN * Math.cos(rad(winkelEnde));
  const ys2 = CENTER + RADIUS_AUSSEN * Math.sin(rad(winkelEnde));
  const xi1 = CENTER + RADIUS_INNEN * Math.cos(rad(winkelEnde));
  const yi1 = CENTER + RADIUS_INNEN * Math.sin(rad(winkelEnde));
  const xi2 = CENTER + RADIUS_INNEN * Math.cos(rad(winkelStart));
  const yi2 = CENTER + RADIUS_INNEN * Math.sin(rad(winkelStart));
  return `M ${xs1} ${ys1} A ${RADIUS_AUSSEN} ${RADIUS_AUSSEN} 0 0 1 ${xs2} ${ys2} L ${xi1} ${yi1} A ${RADIUS_INNEN} ${RADIUS_INNEN} 0 0 0 ${xi2} ${yi2} Z`;
}

export default function Farbkreis() {
  const [aktiv, setAktiv] = useState<Farbe>(FARBEN[8]); // Ultramarine als Default
  const k = komplementaer(aktiv);

  return (
    <div className="lesson-card">
      <h2>Farbkreis &amp; Komplementärfarben</h2>
      <p className="lesson-description">
        Der 12-teilige Farbkreis ist die Landkarte deiner Palette.
        Klick eine Farbe — du siehst sofort, welche Farbe ihr direkt gegenüber
        liegt (die Komplementärfarbe) und welches Pigment du dafür typischerweise
        nimmst.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 380px) 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ width: "100%", maxWidth: 380 }}
        >
          {FARBEN.map((f) => {
            const istAktiv = f.name === aktiv.name;
            const istKomp = f.name === k.name;
            return (
              <g
                key={f.name}
                onClick={() => setAktiv(f)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={segmentPfad(f.winkel - 15, f.winkel + 15)}
                  fill={f.hex}
                  stroke={istAktiv ? "#111827" : istKomp ? "#fff" : "rgba(0,0,0,0.1)"}
                  strokeWidth={istAktiv ? 3 : istKomp ? 2 : 1}
                  opacity={istAktiv || istKomp ? 1 : 0.85}
                />
              </g>
            );
          })}
          {/* Verbindungslinie aktiv↔Komplementär */}
          <line
            x1={CENTER + (RADIUS_INNEN - 6) * Math.cos(((aktiv.winkel - 90) * Math.PI) / 180)}
            y1={CENTER + (RADIUS_INNEN - 6) * Math.sin(((aktiv.winkel - 90) * Math.PI) / 180)}
            x2={CENTER + (RADIUS_INNEN - 6) * Math.cos(((k.winkel - 90) * Math.PI) / 180)}
            y2={CENTER + (RADIUS_INNEN - 6) * Math.sin(((k.winkel - 90) * Math.PI) / 180)}
            stroke="#fff"
            strokeWidth={2}
            strokeDasharray="6 4"
            opacity={0.9}
          />
          {/* Zentrum-Indikator */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS_INNEN - 6} fill="#f9fafb" stroke="#e5e7eb" />
          <text
            x={CENTER}
            y={CENTER - 8}
            textAnchor="middle"
            fontSize={13}
            fontFamily="ui-monospace, monospace"
            fill="#374151"
            fontWeight={600}
          >
            {aktiv.name}
          </text>
          <text
            x={CENTER}
            y={CENTER + 8}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
          >
            ↕
          </text>
          <text
            x={CENTER}
            y={CENTER + 22}
            textAnchor="middle"
            fontSize={13}
            fontFamily="ui-monospace, monospace"
            fill="#374151"
            fontWeight={600}
          >
            {k.name}
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="result-box">
            <div className="result-label">Aktive Farbe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: aktiv.hex, border: "1px solid #d1d5db",
                }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>{aktiv.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
                  {aktiv.pigment}
                </div>
              </div>
            </div>
          </div>
          <div className="result-box" style={{ borderLeft: "3px solid #fff" }}>
            <div className="result-label">Komplementärfarbe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: k.hex, border: "1px solid #d1d5db",
                }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>{k.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
                  {k.pigment}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #d1d5db",
              height: 40,
            }}
            title="So leuchten die beiden Farben nebeneinander (Simultankontrast)"
          >
            <div style={{ flex: 1, background: aktiv.hex }} />
            <div style={{ flex: 1, background: k.hex }} />
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum funktioniert Komplementär-Kontrast so stark?">
        Unser Sehsystem hat „Gegenfarben-Zellen": eine Zelle reagiert auf
        Rot-vs-Grün, eine andere auf Blau-vs-Gelb. Wenn beide Pole nebeneinander
        liegen, feuern die Zellen gleichzeitig stark — die Farben wirken
        intensiver, als wären sie alleine. Künstler:innen nutzen das gezielt:
        ein winziger orangener Akzent in einem blauen Bild zieht das Auge an
        wie ein Magnet.
      </DepthBox>

      <DepthBox variant="mistake" title="Komplementärfarben gemischt → schöner Schatten">
        Statt Schwarz aus der Tube zu nehmen, mischen viele Aquarellist:innen
        Schatten aus komplementären Pigment-Paaren — z.B. Ultramarin +
        Gebrannter Sienna. Das ergibt einen warmen, lebendigen Grau-Ton, der
        sich harmonisch ins Bild einfügt. Schwarz aus der Tube wirkt
        dagegen oft flach und „tot".
      </DepthBox>

      <DepthBox variant="deeper" title="Warmer vs kalter Rotton">
        „Rot" ist nicht gleich „Rot" — Cadmium Red (gelblich-warm) und
        Alizarin Crimson (bläulich-kalt) verhalten sich beim Mischen
        komplett anders. Mit Cadmium Red + Cadmium Yellow bekommst du
        leuchtende Orangen, mit Alizarin + Cadmium Yellow eher schmutzige
        Brauntöne (weil die Pigmente sich ins „komplementäre Lager"
        verirren). Faustregel: warme Farbe + warme Farbe → leuchtend,
        warm + kalt → gedämpft.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Pigmentwahl (welche zwei Gelb-Pigmente du in deiner Palette hast,
        bestimmt mehr als du denkst), Glazing (Komplementärfarben übereinander
        gelegt ergeben neutrale Töne — perfekt für Schattenmodellierung),
        und Notan (welcher Wert hat welche Farbe? Ein knalliges Orange
        kann denselben Wert wie ein dunkles Blau haben).
      </DepthBox>
    </div>
  );
}
