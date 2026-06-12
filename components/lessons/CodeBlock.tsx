"use client";

import { useState, type ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./codeblock.css";

/**
 * Geteilter Code-Block für alle Lektionen. Dunkler Editor-Look in beiden
 * Themes, Sprach-Badge oben links, Copy-Button oben rechts, Syntax-
 * Highlighting via Prism (oneDark).
 *
 * `code` wird als String übergeben (kein JSX), damit spitze/geschweifte
 * Klammern nicht interpretiert werden — dieser Pfad wird gehighlightet.
 * Für manuelle Zeilen-Hervorhebung kann stattdessen `children` mit
 * <span className="bad|good"> genutzt werden (ohne Highlighting) — dann
 * sollte `copyText` den reinen Text liefern.
 */

export type CodeLang =
  | "python"
  | "bash"
  | "html"
  | "css"
  | "js"
  | "ts"
  | "tsx"
  | "json"
  | "text";

// Prism-Sprachschlüssel je Badge-Sprache; text bleibt ohne Highlighting.
const PRISM_LANG: Record<Exclude<CodeLang, "text">, string> = {
  python: "python",
  bash: "bash",
  html: "markup",
  css: "css",
  js: "javascript",
  ts: "typescript",
  tsx: "tsx",
  json: "json",
};

export function CodeBlock({
  code,
  children,
  lang,
  title,
  copyText,
}: {
  code?: string;
  children?: ReactNode;
  lang: CodeLang;
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

  const highlight = code !== undefined && children === undefined && lang !== "text";

  return (
    <div className="cblk">
      <div className="cblk-head">
        <span className={`cblk-lang ${lang}`}>{lang.toUpperCase()}</span>
        {title ? <span className="cblk-title">{title}</span> : null}
        <button
          type="button"
          onClick={kopieren}
          className={`cblk-copy ${kopiert ? "kopiert" : ""}`}
        >
          {kopiert ? "✓ kopiert" : "kopieren"}
        </button>
      </div>
      {highlight ? (
        <SyntaxHighlighter
          language={PRISM_LANG[lang as Exclude<CodeLang, "text">]}
          style={oneDark}
          className="cblk-pre"
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: "14px 16px",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            borderRadius: 0,
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, "Fira Code", "Cascadia Code", monospace',
              fontSize: "inherit",
              background: "none",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        <pre className="cblk-pre">
          <code>{children ?? code}</code>
        </pre>
      )}
    </div>
  );
}
