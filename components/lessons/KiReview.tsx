"use client";

import { useState } from "react";

/**
 * KI-Review-Block für Übungsaufgaben.
 * Zeigt einen kopierbaren Prompt-Text und einen kurzen Hinweis,
 * wie der Nutzer ihn mit einem KI-Modell einsetzt.
 */
export function KiReview({
  prompt,
  hinweis,
}: {
  prompt: string;
  /** Eigener Hinweistext. Falls weggelassen, erscheint ein generischer Standard. */
  hinweis?: string;
}) {
  const [kopiert, setKopiert] = useState(false);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(prompt);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch {
      // Clipboard-API nicht verfügbar (z.B. ohne https im Localhost). Selektiere stattdessen den Text.
      const ta = document.getElementById("ki-review-prompt") as HTMLTextAreaElement | null;
      if (ta) {
        ta.focus();
        ta.select();
      }
    }
  }

  const defaultHinweis =
    "Kopiere den Prompt, öffne eine KI-deiner-Wahl (Claude, ChatGPT, Gemini, etc.), füge den Prompt ein und hänge dein Bild dran. Du bekommst eine strukturierte Rückmeldung zu den genannten Kriterien.";

  return (
    <div className="ki-review">
      <header className="ki-review-head">
        <span aria-hidden>🤖</span>
        <span>KI-Review starten</span>
      </header>

      <p className="ki-review-hinweis">{hinweis ?? defaultHinweis}</p>

      <textarea
        id="ki-review-prompt"
        className="ki-review-prompt"
        value={prompt}
        readOnly
        rows={Math.min(14, Math.max(6, prompt.split("\n").length + 1))}
      />

      <button
        type="button"
        onClick={kopieren}
        className={`ki-review-copy ${kopiert ? "kopiert" : ""}`}
      >
        {kopiert ? "✓ kopiert" : "📋 Prompt kopieren"}
      </button>
    </div>
  );
}
