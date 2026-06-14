import type { ReactNode } from "react";

/**
 * Mini-Isometrie für die OpenSCAD-Lektionen.
 *
 * Statt echter PNG-Renders (bräuchte OpenSCAD + Mesa/xvfb auf dem Server)
 * zeichnen wir die Box-Stadien als isometrisches SVG — themebar über
 * CSS-Variablen (siehe openscad.css), kein Canvas, kein Asset-Pipeline.
 * Phase 2 (WASM-Live-Playground) liefert später die echten Modelle.
 *
 * Projektion: klassische 30°-Isometrie. Sichtbare Flächen werden per
 * Painter-Algorithmus (Schwerpunkt-Tiefe) sortiert — so stimmt die
 * Überdeckung ohne Z-Buffer.
 */

const COS = 0.8660254037844387; // cos 30°
const SIN = 0.5; // sin 30°

export type P3 = [number, number, number];
export type Role = "top" | "right" | "front" | "wall" | "floor" | "card";

/** 3D-Punkt → 2D-Bildkoordinate (Iso, Y-Achse zeigt im Bild nach unten). */
export function proj(p: P3, s = 1): [number, number] {
  return [(p[0] - p[1]) * COS * s, ((p[0] + p[1]) * SIN - p[2]) * s];
}

export interface Face {
  pts: P3[];
  role: Role;
}

function tiefe(pts: P3[]): number {
  let k = 0;
  for (const [x, y, z] of pts) k += x + y + z;
  return k / pts.length;
}

// ── Geometrie-Bauer ────────────────────────────────────────────────────

/** Voller Quader — nur die drei sichtbaren Flächen. */
export function solidBox([ox, oy, oz]: P3, [w, d, h]: P3): Face[] {
  const P = (x: number, y: number, z: number): P3 => [ox + x, oy + y, oz + z];
  return [
    { role: "top", pts: [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)] },
    { role: "right", pts: [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)] },
    { role: "front", pts: [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)] },
  ];
}

/** Offene Schale (oben offen) mit Wandstärke `wand`. */
export function tray(
  [ox, oy, oz]: P3,
  [w, d, h]: P3,
  wand: number
): Face[] {
  const P = (x: number, y: number, z: number): P3 => [ox + x, oy + y, oz + z];
  const t = wand; // Bodenstärke = Wandstärke
  const xi0 = wand,
    xi1 = w - wand,
    yi0 = wand,
    yi1 = d - wand;
  return [
    // sichtbare Außenseiten
    { role: "right", pts: [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)] },
    { role: "front", pts: [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)] },
    // Rand (Rahmen oben, z=h) — vier Streifen
    { role: "top", pts: [P(0, 0, h), P(w, 0, h), P(w, yi0, h), P(0, yi0, h)] },
    { role: "top", pts: [P(0, yi1, h), P(w, yi1, h), P(w, d, h), P(0, d, h)] },
    { role: "top", pts: [P(0, yi0, h), P(xi0, yi0, h), P(xi0, yi1, h), P(0, yi1, h)] },
    { role: "top", pts: [P(xi1, yi0, h), P(w, yi0, h), P(w, yi1, h), P(xi1, yi1, h)] },
    // Innenboden
    { role: "floor", pts: [P(xi0, yi0, t), P(xi1, yi0, t), P(xi1, yi1, t), P(xi0, yi1, t)] },
    // sichtbare Innenwände (die beiden hinteren)
    { role: "wall", pts: [P(xi0, yi0, t), P(xi0, yi1, t), P(xi0, yi1, h), P(xi0, yi0, h)] },
    { role: "wall", pts: [P(xi0, yi0, t), P(xi1, yi0, t), P(xi1, yi0, h), P(xi0, yi0, h)] },
  ];
}

// ── Renderer ───────────────────────────────────────────────────────────

export function IsoFigure({
  faces,
  scale = 1,
  width = 360,
  height = 260,
  cx,
  cy,
  caption,
  children,
}: {
  faces: Face[];
  scale?: number;
  width?: number;
  height?: number;
  cx: number;
  cy: number;
  caption?: string;
  /** Zusätzliche SVG-Elemente (Maßlinien, Labels) im selben Koordinatenraum. */
  children?: ReactNode;
}) {
  const sortiert = [...faces].sort((a, b) => tiefe(a.pts) - tiefe(b.pts));
  return (
    <div className="iso">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="iso-svg"
        role="img"
        aria-label={caption ?? "Isometrische 3D-Skizze"}
      >
        <g transform={`translate(${cx} ${cy})`}>
          {sortiert.map((f, i) => (
            <polygon
              key={i}
              points={f.pts.map((p) => proj(p, scale).join(",")).join(" ")}
              fill={`var(--iso-${f.role})`}
              stroke="var(--iso-edge)"
              strokeWidth={1.2}
              strokeLinejoin="round"
            />
          ))}
          {children}
        </g>
      </svg>
      {caption ? <p className="iso-caption">{caption}</p> : null}
    </div>
  );
}
