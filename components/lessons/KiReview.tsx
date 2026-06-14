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
  voiceOption = false,
  voiceHinweis,
}: {
  prompt: string;
  /** Eigener Hinweistext. Falls weggelassen, erscheint ein generischer Standard. */
  hinweis?: string;
  /** Blendet einen Text ⇄ Voice Umschalter ein (z.B. für Sprech-Übungen). */
  voiceOption?: boolean;
  /** Eigener Hinweistext für den Voice-Modus. Falls weggelassen, generischer Standard. */
  voiceHinweis?: string;
}) {
  const [kopiert, setKopiert] = useState(false);
  const [modus, setModus] = useState<"text" | "voice">("text");

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

  const defaultVoiceHinweis =
    "Öffne den Voice-Modus einer KI (z.B. ChatGPT Voice oder Gemini Live), gib den Prompt einmal ein — und sprich deine Antwort dann laut. Du hörst das Feedback und übst gleichzeitig das freie Sprechen, genau wie in der echten Prüfung.";

  const aktiverHinweis =
    modus === "voice"
      ? voiceHinweis ?? defaultVoiceHinweis
      : hinweis ?? defaultHinweis;

  return (
    <div className="ki-review">
      <header className="ki-review-head">
        <span aria-hidden>{modus === "voice" ? "🎙️" : "🤖"}</span>
        <span>{modus === "voice" ? "Sprech-Review starten" : "KI-Review starten"}</span>
      </header>

      {voiceOption && (
        <div
          role="tablist"
          aria-label="Review-Modus"
          style={{ display: "inline-flex", gap: 4, marginBottom: 10, padding: 3, background: "rgba(0,0,0,0.05)", borderRadius: 999 }}
        >
          {([
            ["text", "📋 Text"],
            ["voice", "🎙️ Voice"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={modus === id}
              onClick={() => setModus(id)}
              style={{
                border: "none",
                cursor: "pointer",
                borderRadius: 999,
                padding: "5px 14px",
                fontSize: "0.85rem",
                fontWeight: modus === id ? 700 : 500,
                background: modus === id ? "#10b981" : "transparent",
                color: modus === id ? "#ffffff" : "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <p className="ki-review-hinweis">{aktiverHinweis}</p>

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
