"use client";

import { useState } from "react";
import "./windows.css";

/**
 * Kopierbarer Befehls-/Code-Block im Konsolen-Look. `tag` ist das Label
 * oben links (z.B. "PowerShell", "CMD", "Ausführen").
 */
export function CmdBlock({
  code,
  tag = "PowerShell",
  title,
}: {
  code: string;
  tag?: string;
  title?: string;
}) {
  const [kopiert, setKopiert] = useState(false);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(code);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1600);
    } catch {
      /* Clipboard nicht verfügbar — still ignorieren */
    }
  }

  return (
    <div className="cmdblk">
      <div className="cmdblk-head">
        <span className="cmdblk-tag">{tag}</span>
        {title ? <span className="cmdblk-title">{title}</span> : null}
        <button
          type="button"
          onClick={kopieren}
          className={`cmdblk-copy ${kopiert ? "kopiert" : ""}`}
        >
          {kopiert ? "✓ kopiert" : "kopieren"}
        </button>
      </div>
      <pre className="cmdblk-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
