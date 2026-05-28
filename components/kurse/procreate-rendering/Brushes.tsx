"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Brush = "hard-round" | "soft-airbrush" | "soft-round" | "textured" | "wet-brush";

const BRUSHES: { id: Brush; name: string; pfad: string; einsatz: string; phase: string }[] = [
  {
    id: "hard-round",
    name: "Hard Round / Studio Pen",
    pfad: "Inking → Studio Pen",
    einsatz: "Konturen, Lineart, harte Kanten. Pressure-Sensitivity für Linienstärke.",
    phase: "Skizze · Lineart · Schatten-Hard-Edges",
  },
  {
    id: "soft-airbrush",
    name: "Soft Airbrush",
    pfad: "Airbrushing → Soft Airbrush",
    einsatz: "Weiche Übergänge, atmosphärische Schichten, Glow. Niedrige Opacity 20-40 %.",
    phase: "Rendering · Atmosphäre · Color Grading",
  },
  {
    id: "soft-round",
    name: "Soft Round",
    pfad: "Painting → Soft Brush",
    einsatz: "Volumen aufbauen, mittlere Übergänge — zwischen Airbrush und Hard Round.",
    phase: "Rendering · Hauttöne · Stoff-Falten",
  },
  {
    id: "textured",
    name: "Textured (Flat / Bristle)",
    pfad: "Painting → Flat Brush / Calligraphy → Brush",
    einsatz: "Pinselstrich-Look wie traditionelle Malerei. Macht das Bild handgemacht wirken.",
    phase: "Rendering · finale Texturen · Materialdarstellung",
  },
  {
    id: "wet-brush",
    name: "Wet Brush (Mixer)",
    pfad: "Painting → Wet Brush",
    einsatz: "Verwischt darunterliegende Farben — wie ein nasser Pinsel auf nassem Bild.",
    phase: "Übergänge sanft machen · Aquarell-artige Effekte",
  },
];

// SVG-Filter-Definitionen pro Brush-Typ
function strokePfad(brush: Brush): React.ReactNode {
  // Ein einfacher Pinselstrich von links nach rechts
  const path = "M 30 35 Q 100 12, 170 35 T 310 30";

  switch (brush) {
    case "hard-round":
      return (
        <path d={path} fill="none" stroke="#2a2438" strokeWidth={6} strokeLinecap="round" />
      );
    case "soft-airbrush":
      return (
        <>
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={28} strokeLinecap="round" opacity={0.06} />
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={20} strokeLinecap="round" opacity={0.1} />
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={12} strokeLinecap="round" opacity={0.15} />
        </>
      );
    case "soft-round":
      return (
        <>
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={14} strokeLinecap="round" opacity={0.25} />
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={8}  strokeLinecap="round" opacity={0.55} />
        </>
      );
    case "textured":
      return (
        <g filter="url(#brush-noise)">
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={10} strokeLinecap="round" />
        </g>
      );
    case "wet-brush":
      return (
        <g filter="url(#wet-displace)">
          <path d={path} fill="none" stroke="#2a2438" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
          <path d={path} fill="none" stroke="#7a6da0" strokeWidth={9} strokeLinecap="round" opacity={0.35} transform="translate(0,3)" />
        </g>
      );
  }
}

export default function Brushes() {
  const [aktiv, setAktiv] = useState<Brush>("hard-round");
  const b = BRUSHES.find((x) => x.id === aktiv)!;

  return (
    <div className="lesson-card">
      <h2>Brushes für Rendering</h2>
      <p className="lesson-description">
        Procreate liefert hunderte Brushes — für 90 % der Rendering-Arbeit
        reichen fünf Familien. Wähl einen, sieh den Strich-Charakter und
        wofür er taugt.
      </p>

      <div className="input-group">
        <label>Brush</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BRUSHES.map((br) => (
            <button
              key={br.id}
              type="button"
              onClick={() => setAktiv(br.id)}
              className="toggle-code"
              style={{
                background: aktiv === br.id ? "#eef2ff" : "transparent",
                borderColor: aktiv === br.id ? "#3b82f6" : "#d1d5db",
                color: aktiv === br.id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === br.id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {br.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 340 70"
        style={{
          background: "#fefce8",
          border: "1px solid #fcd34d",
          borderRadius: 8,
          width: "100%",
          height: 70,
        }}
      >
        <defs>
          <filter id="brush-noise">
            <feTurbulence baseFrequency="0.8" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
          <filter id="wet-displace">
            <feTurbulence baseFrequency="0.06" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        <text x="10" y="14" fontSize="9" fontFamily="ui-monospace, monospace" fill="#92400e">
          {b.name}:
        </text>
        {strokePfad(aktiv)}
      </svg>

      <div className="kv-table" style={{ fontSize: "0.9rem" }}>
        <dt style={{ fontFamily: "inherit" }}>Pfad:</dt>
        <dd style={{ fontFamily: "inherit" }}>{b.pfad}</dd>
        <dt style={{ fontFamily: "inherit" }}>Einsatz:</dt>
        <dd style={{ fontFamily: "inherit" }}>{b.einsatz}</dd>
        <dt style={{ fontFamily: "inherit" }}>Phase:</dt>
        <dd style={{ fontFamily: "inherit" }}>{b.phase}</dd>
      </div>

      <DepthBox variant="why" title="Warum brauche ich mehrere Brushes?">
        Jeder Brush hat einen eigenen <em>Charakter</em> — Hardness, Spacing,
        Pressure-Response, Textur. Mit nur einem Brush sieht jede Phase
        gleich aus, das Bild wirkt eintönig. Profis wechseln bewusst: Hard
        Round für Konturen, Soft Round für Volumen, Airbrush für Atmosphäre,
        Textured für finalen Charakter. Drei bis vier Brushes pro Bild ist
        normal.
      </DepthBox>

      <DepthBox variant="mistake" title="Nur mit Soft Airbrush rendern">
        Klassischer Anfänger-Look: alles weichgepustet wie 3D-Renderings
        aus den 1990ern. Wirkt langweilig und steril. <strong>Lösung</strong>:
        nach jedem Airbrush-Schritt mit Hard Round oder Textured nachziehen
        — harte Kanten an Schattenkanten geben dem Bild Charakter.
      </DepthBox>

      <DepthBox variant="deeper" title="Brush-Anpassung">
        Jeder Brush in Procreate lässt sich verstellen (Tap-Tap auf den
        Brush). Wichtigste Parameter:
        <ul>
          <li><strong>Spacing</strong>: Abstand zwischen Stempel-Instanzen. Niedrig = sauberer Strich, hoch = trockene Linie.</li>
          <li><strong>Streamline</strong>: Glättet die Linie, nützlich für Lineart mit zitterndem Pencil.</li>
          <li><strong>Jitter</strong>: Zufällige Variation in Größe/Farbe — bei Textured Brushes Pflicht.</li>
          <li><strong>Pressure → Opacity / Size</strong>: ob Druck die Größe oder Opazität (oder beides) steuert.</li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Brush-Studio von Drittanbietern (Max Ulichney, Lisa Bardot — die
        Standards der Community), Eyedropper-Workflow (Soft Round + Eyedropper
        zwischen jedem Strich), und Apple-Pencil-Druck-Kurve (in den
        iPad-Einstellungen für deinen persönlichen Druck-Stil kalibrierbar).
      </DepthBox>
    </div>
  );
}
