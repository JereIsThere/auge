"use client";

import { useState, type ReactNode } from "react";
import "./html-css.css";

/**
 * Code-Block für den HTML/CSS-Kurs. Dunkler Editor-Look in beiden Themes,
 * Sprach-Badge oben links, Copy-Button oben rechts.
 *
 * `code` wird als String übergeben (kein JSX), damit spitze Klammern und
 * geschweifte Klammern nicht interpretiert werden. Für Hervorhebungen kann
 * stattdessen `children` mit <span className="bad|good"> genutzt werden —
 * dann sollte `copyText` den reinen Text liefern.
 */
export function CodeBlock({
  code,
  children,
  lang = "html",
  title,
  copyText,
}: {
  code?: string;
  children?: ReactNode;
  lang?: "html" | "css" | "text";
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
    <div className="codeblk">
      <div className="codeblk-head">
        <span className={`codeblk-lang ${lang}`}>{lang.toUpperCase()}</span>
        {title ? <span className="codeblk-title">{title}</span> : null}
        <button
          type="button"
          onClick={kopieren}
          className={`codeblk-copy ${kopiert ? "kopiert" : ""}`}
        >
          {kopiert ? "✓ kopiert" : "kopieren"}
        </button>
      </div>
      <pre className="codeblk-pre">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}
