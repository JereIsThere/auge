"use client";

import { useState } from "react";
import "./windows.css";

export type TermLine =
  | { typ: "cmd"; prompt?: string; text: string }
  | { typ: "out"; text: string }
  | { typ: "comment"; text: string };

function Zeile({ line, prompt }: { line: TermLine; prompt: string }) {
  if (line.typ === "cmd") {
    return (
      <div className="term-line">
        <span className="term-prompt">{line.prompt ?? prompt} </span>
        <span className="term-cmd">{line.text}</span>
      </div>
    );
  }
  if (line.typ === "comment") {
    return <div className="term-line term-comment"># {line.text}</div>;
  }
  return <div className="term-line term-out">{line.text}</div>;
}

/** Statisches Terminal: zeigt eine feste Session. */
export function Terminal({
  title = "Windows PowerShell",
  prompt = "PS C:\\Users\\du>",
  lines,
}: {
  title?: string;
  prompt?: string;
  lines: TermLine[];
}) {
  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dot r" />
        <span className="term-dot y" />
        <span className="term-dot g" />
        <span className="term-title">{title}</span>
      </div>
      <div className="term-body">
        {lines.map((l, i) => (
          <Zeile key={i} line={l} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}

export type SimCommand = {
  label: string;
  cmd: string;
  /** Ausgabe-Zeilen (mehrzeilig als \n). */
  out: string;
};

/**
 * Interaktiver Konsolen-Simulator: Knöpfe „führen" Befehle aus und hängen
 * Befehl + Ausgabe an den Verlauf an. Rein illustrativ — nichts läuft echt.
 */
export function TerminalSim({
  title = "Windows PowerShell",
  prompt = "PS C:\\Users\\du>",
  commands,
  intro = "Klick einen Befehl — er wird hier ausgeführt.",
}: {
  title?: string;
  prompt?: string;
  commands: SimCommand[];
  intro?: string;
}) {
  const [verlauf, setVerlauf] = useState<number[]>([]);

  return (
    <div>
      <div className="term">
        <div className="term-bar">
          <span className="term-dot r" />
          <span className="term-dot y" />
          <span className="term-dot g" />
          <span className="term-title">{title}</span>
        </div>
        <div className="term-body">
          {verlauf.length === 0 ? (
            <div className="term-line term-empty">{intro}</div>
          ) : (
            verlauf.map((idx, i) => {
              const c = commands[idx];
              return (
                <div key={i}>
                  <div className="term-line">
                    <span className="term-prompt">{prompt} </span>
                    <span className="term-cmd">{c.cmd}</span>
                  </div>
                  <div className="term-line term-out">{c.out}</div>
                </div>
              );
            })
          )}
          <div className="term-line">
            <span className="term-prompt">{prompt} </span>
            <span style={{ opacity: 0.6 }}>▏</span>
          </div>
        </div>
      </div>

      <div className="term-actions">
        {commands.map((c, i) => (
          <button
            key={i}
            type="button"
            className="win-chip"
            onClick={() => setVerlauf((v) => [...v, i])}
          >
            {c.label}
          </button>
        ))}
        {verlauf.length > 0 ? (
          <button
            type="button"
            className="win-chip"
            onClick={() => setVerlauf([])}
            style={{ marginLeft: "auto" }}
          >
            ↺ leeren
          </button>
        ) : null}
      </div>
    </div>
  );
}
