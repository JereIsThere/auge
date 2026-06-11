"use client";

import { useState, type ReactNode } from "react";
import "./ml.css";

/**
 * Code-Block für den ML-Klassifikation-Kurs. Dunkler Editor-Look in beiden
 * Themes, Sprach-Badge oben links, Copy-Button oben rechts.
 *
 * `code` wird als String übergeben (kein JSX), damit geschweifte Klammern
 * nicht interpretiert werden. Für Zeilen-Hervorhebung kann stattdessen
 * `children` mit <span className="bad|good"> genutzt werden — dann sollte
 * `copyText` den reinen Text liefern.
 */
export function CodeBlock({
  code,
  children,
  lang = "python",
  title,
  copyText,
}: {
  code?: string;
  children?: ReactNode;
  lang?: "python" | "bash" | "text";
  title?: string;
  copyText?: string;
}) {
  const [kopiert, setKopiert] = useState(false);
  const textZumKopieren = copyText ?? code ?? "";

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(textZumKopieren);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1600);
    } catch {
      /* Clipboard nicht verfügbar — still ignorieren */
    }
  }

  return (
    <div className="mlblk">
      <div className="mlblk-head">
        <span className={`mlblk-lang ${lang}`}>{lang.toUpperCase()}</span>
        {title ? <span className="mlblk-title">{title}</span> : null}
        <button
          type="button"
          onClick={kopieren}
          className={`mlblk-copy ${kopiert ? "kopiert" : ""}`}
        >
          {kopiert ? "✓ kopiert" : "kopieren"}
        </button>
      </div>
      <pre className="mlblk-pre">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}
