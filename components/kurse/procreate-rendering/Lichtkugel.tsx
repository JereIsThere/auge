"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import "@/components/lessons/lesson.css";

type Material = "matt" | "haut" | "metall";

const MATERIAL: Record<Material, {
  titel: string;
  hl_haerte: number;   // 0 weich .. 1 hart (SVG-Gradient-Stop)
  hl_groesse: number;  // 0..1 als Anteil des Radius
  hl_intensitaet: number; // 0..1
  core_intensitaet: number;
  reflected: number;   // 0..1
  beschreibung: string;
}> = {
  matt: {
    titel: "Matt (Ton, Stoff)",
    hl_haerte: 0.7,
    hl_groesse: 0.18,
    hl_intensitaet: 0.55,
    core_intensitaet: 0.45,
    reflected: 0.18,
    beschreibung: "Diffuse Streuung: weicher Übergang, kein klares Highlight.",
  },
  haut: {
    titel: "Haut",
    hl_haerte: 0.4,
    hl_groesse: 0.28,
    hl_intensitaet: 0.65,
    core_intensitaet: 0.35,
    reflected: 0.28,
    beschreibung:
      "Subsurface Scattering: Licht dringt leicht ein und verteilt sich. " +
      "Schatten leicht rötlich (im Bild nicht simuliert).",
  },
  metall: {
    titel: "Metall (poliert)",
    hl_haerte: 0.95,
    hl_groesse: 0.1,
    hl_intensitaet: 0.95,
    core_intensitaet: 0.7,
    reflected: 0.5,
    beschreibung:
      "Scharfes, kleines Highlight. Reflected Light sehr stark, weil die " +
      "Oberfläche fast spiegelt.",
  },
};

const R = 110;
const CX = 175;
const CY = 175;

export default function Lichtkugel() {
  const [winkel, setWinkel] = useState(45);   // 0..360 (Lichtrichtung um die Kugel)
  const [hoehe, setHoehe] = useState(60);     // -90..90 (von hinten/unten zu oben)
  const [material, setMaterial] = useState<Material>("matt");

  const m = MATERIAL[material];

  // Position des Highlights auf der Kugeloberfläche
  // winkel: Azimut, hoehe: Elevation (von hinten unten zu vorn oben)
  const rad = (d: number) => (d * Math.PI) / 180;
  const cos_h = Math.cos(rad(hoehe));
  const sin_h = Math.sin(rad(hoehe));
  const cos_w = Math.cos(rad(winkel));
  const sin_w = Math.sin(rad(winkel));

  // Projektion auf 2D (Kugel von vorn betrachtet, Beleuchtung kann von schräg kommen)
  const hl_x = CX + R * cos_h * sin_w * 0.75;
  const hl_y = CY - R * sin_h * 0.75;

  // Reflected light ist auf der gegenüberliegenden Seite, leicht unter Highlight
  const ref_x = CX - (hl_x - CX) * 0.7;
  const ref_y = CY + (CY - hl_y) * 0.5 + 20;

  // Cast shadow projection (Schatten auf "Boden" unter der Kugel)
  const shadow_offset_x = -cos_h * sin_w * 60;
  const shadow_squash = Math.max(0.2, sin_h);

  const gradientId = useMemo(() => `hl-grad-${material}`, [material]);

  return (
    <div className="lesson-card">
      <h2>Die Lichtkugel</h2>
      <p className="lesson-description">
        Die einfachste Form mit allen klassischen Lichtbereichen.
        Bewege die Lichtquelle (Winkel und Höhe) und wechsle das Material —
        sieh, wie sich Highlight, Core Shadow und Reflected Light verändern.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 360px) 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <svg
          viewBox="0 0 350 380"
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
          }}
        >
          <defs>
            <radialGradient
              id={gradientId}
              cx={hl_x}
              cy={hl_y}
              r={R * 1.4}
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset={0}
                stopColor="#ffffff"
                stopOpacity={m.hl_intensitaet}
              />
              <stop
                offset={m.hl_groesse * m.hl_haerte}
                stopColor="#ffffff"
                stopOpacity={m.hl_intensitaet * 0.6}
              />
              <stop
                offset={m.hl_groesse}
                stopColor="#b0a8c8"
                stopOpacity={0.4}
              />
              <stop
                offset={0.55}
                stopColor="#2a2438"
                stopOpacity={m.core_intensitaet}
              />
              <stop
                offset={0.85}
                stopColor="#1a1525"
                stopOpacity={m.core_intensitaet * 0.85}
              />
            </radialGradient>
            <radialGradient
              id="reflected-grad"
              cx={ref_x}
              cy={ref_y}
              r={R * 0.5}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#7a6da0" stopOpacity={m.reflected} />
              <stop offset={1} stopColor="#7a6da0" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="shadow-grad" cx={0.5} cy={0.5} r={0.5}>
              <stop offset={0} stopColor="#000" stopOpacity={0.45} />
              <stop offset={1} stopColor="#000" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Boden (für cast shadow) */}
          <line x1="20" y1="305" x2="330" y2="305" stroke="#d1d5db" strokeDasharray="3 3" />

          {/* Cast shadow */}
          <ellipse
            cx={CX + shadow_offset_x}
            cy={305}
            rx={R * 0.85 * (1 / Math.max(0.4, shadow_squash))}
            ry={R * 0.22 * shadow_squash}
            fill="url(#shadow-grad)"
            opacity={Math.max(0.3, Math.min(0.9, 1 - hoehe / 90))}
          />

          {/* Kugel-Basis: mittlerer Lokalfarbton */}
          <circle cx={CX} cy={CY} r={R} fill="#5e5478" />

          {/* Reflected light layer */}
          <circle cx={CX} cy={CY} r={R} fill="url(#reflected-grad)" />

          {/* Hauptbeleuchtung */}
          <circle cx={CX} cy={CY} r={R} fill={`url(#${gradientId})`} />

          {/* Lichtquellen-Indikator außerhalb (klein) */}
          <g opacity={0.7}>
            <circle
              cx={CX + 165 * cos_h * sin_w}
              cy={CY - 165 * sin_h}
              r={6}
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth={1.5}
            />
            <line
              x1={CX + 165 * cos_h * sin_w}
              y1={CY - 165 * sin_h}
              x2={hl_x}
              y2={hl_y}
              stroke="#fbbf24"
              strokeWidth={1}
              strokeDasharray="2 3"
              opacity={0.4}
            />
          </g>

          {/* Beschriftungen */}
          <text x={hl_x + 12} y={hl_y - 8} fontSize="10" fill="#fff" fontFamily="ui-monospace, monospace">
            Highlight
          </text>
          <text x={ref_x - 10} y={ref_y + 4} fontSize="10" fill="#cbd5e1" fontFamily="ui-monospace, monospace" textAnchor="end">
            Reflected
          </text>
          <text x={CX} y={CY + R + 14} textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="ui-monospace, monospace">
            Cast Shadow
          </text>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="input-group">
            <label>Lichtrichtung (Winkel): {winkel}°</label>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={winkel}
              onChange={(e) => setWinkel(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="input-group">
            <label>Höhe der Lichtquelle: {hoehe}°</label>
            <input
              type="range"
              min={-30}
              max={90}
              step={5}
              value={hoehe}
              onChange={(e) => setHoehe(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="input-group">
            <label>Material</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(Object.keys(MATERIAL) as Material[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMaterial(id)}
                  className="toggle-code"
                  style={{
                    background: material === id ? "#eef2ff" : "transparent",
                    borderColor: material === id ? "#3b82f6" : "#d1d5db",
                    color: material === id ? "#1d4ed8" : "#374151",
                    fontWeight: material === id ? 700 : 500,
                  }}
                >
                  {MATERIAL[id].titel}
                </button>
              ))}
            </div>
          </div>
          <div className="info-box" style={{ fontSize: "0.85rem" }}>
            {m.beschreibung}
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum ist der Core Shadow dunkler als der Cast Shadow?">
        Der Core Shadow liegt am Übergang von Licht zu Schatten — er bekommt
        kein direktes Licht <em>und</em> kaum reflected Light, weil die
        Umgebung von dort aus &bdquo;weiter weg&ldquo; ist. Der Cast Shadow
        bekommt dagegen indirektes Licht von oben (Himmel, Decke) — er ist
        gleichmäßig dunkel, aber nicht so tief wie der Core. Anfänger:innen
        machen den Cast Shadow oft zu dunkel und das ganze Bild kippt.
      </DepthBox>

      <DepthBox variant="mistake" title="Highlight = einfach weiß">
        Stimmt fast nie. Ein Highlight nimmt die <em>Farbe der Lichtquelle</em>{" "}
        an: Sonne ist warmgelb, Innenraum ist orange, Mond ist blau-weiß.
        Sturer 100 %-Weiß-Highlight wirkt wie ein Sticker. Procreate-Trick:
        Eyedropper auf eine helle Stelle des Bildes (Lokalfarbe + Licht
        gemischt) und dann nur leicht heller/wärmer ziehen, statt aus dem
        Color-Picker reines Weiß zu nehmen.
      </DepthBox>

      <DepthBox variant="deeper" title="Specular vs Diffuse">
        Was du als <em>Highlight</em> siehst, ist eigentlich zwei Sachen
        überlagert:
        <ul>
          <li>
            <strong>Diffuse Reflection</strong> — das Licht wird gleichmäßig
            in alle Richtungen gestreut. Hängt nur von der Lichtrichtung ab,
            nicht vom Blickwinkel. Macht den <em>weichen</em> Aufhellungs-
            bereich.
          </li>
          <li>
            <strong>Specular Reflection</strong> — fast spiegelnde
            Reflektion, hängt sowohl von Lichtrichtung als auch Blickwinkel
            ab. Macht das <em>scharfe</em> Highlight bei glatten Oberflächen.
            Stark bei Metall, schwach bei Stoff.
          </li>
        </ul>
        Daher: Metall hat ein kleines, scharfes Highlight (specular dominiert),
        Stoff hat ein großes, weiches (nur diffuse).
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Layer-Modi (nächste Lektion — wie du in Procreate Highlights als
        Add-Layer und Schatten als Multiply-Layer baust), Farbtemperatur
        (warmes Licht ↔ kalter Schatten und umgekehrt), und „Bouncing Light"
        (in komplexeren Setups ist Reflected Light farbig von der Umgebung).
      </DepthBox>

      <Aufgabe titel="Eine Apfel-Studie" schwierigkeit="leicht" zeit="15 min">
        <p>
          Mal einen Apfel von einer einzigen Lichtquelle (links oben) auf
          weißem Hintergrund. Halte das Bild bewusst klein und schnell.
        </p>
        <AufgabeCheckliste
          items={[
            "Highlight: kleinste, hellste Stelle dort, wo die Lichtquelle direkt trifft",
            "Core Shadow: dunkelste Stelle auf der Form (nicht der Boden-Schatten!)",
            "Reflected Light: dezente Aufhellung im Schatten, vom Boden zurückgeworfen",
            "Cast Shadow: weicher Boden-Schatten in die der Lichtquelle entgegengesetzte Richtung",
          ]}
        />
      </Aufgabe>
    </div>
  );
}
