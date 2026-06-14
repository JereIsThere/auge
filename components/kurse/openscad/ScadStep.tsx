"use client";

import { useState, type ReactNode } from "react";
import "./openscad.css";

/**
 * Eine Code-Along-Einheit: OpenSCAD-Code links, isometrische Skizze rechts.
 * `code` ist ein reiner String (Copy-Button kopiert ihn 1:1), `figur` ist
 * das zugehörige <IsoFigure>. Auf Mobile stapeln sich beide.
 */
export function ScadStep({
  code,
  figur,
  titel,
}: {
  code: string;
  figur?: ReactNode;
  titel?: string;
}) {
  const [kopiert, setKopiert] = useState(false);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(code);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      /* Clipboard nicht verfügbar — still ignorieren */
    }
  }

  return (
    <div className="scad-step">
      <div className="scad-code">
        <div className="scad-code-head">
          <span className="scad-lang">SCAD</span>
          {titel ? <span className="scad-code-title">{titel}</span> : null}
          <button
            type="button"
            className={`scad-copy ${kopiert ? "kopiert" : ""}`}
            onClick={kopieren}
          >
            {kopiert ? "✓ kopiert" : "kopieren"}
          </button>
        </div>
        <pre className="scad-pre">
          <code>{code}</code>
        </pre>
      </div>
      {figur ? <div className="scad-figure">{figur}</div> : null}
    </div>
  );
}
