import type { ReactNode } from "react";

type Schwierigkeit = "leicht" | "mittel" | "schwer";

const STERNE: Record<Schwierigkeit, string> = {
  leicht: "●○○",
  mittel: "●●○",
  schwer: "●●●",
};

const SCHWIERIGKEIT_LABEL: Record<Schwierigkeit, string> = {
  leicht: "leicht",
  mittel: "mittel",
  schwer: "schwer",
};

/**
 * Übungsaufgabe in einer Lektion. Visuell deutlich von DepthBox abgesetzt —
 * DepthBox ist Wissens-Tiefe, Aufgabe ist Werkstatt.
 */
export function Aufgabe({
  titel,
  schwierigkeit = "mittel",
  zeit,
  children,
}: {
  titel: string;
  schwierigkeit?: Schwierigkeit;
  /** z.B. "15 min" oder "1 h". */
  zeit?: string;
  children: ReactNode;
}) {
  return (
    <section className="aufgabe">
      <header className="aufgabe-head">
        <span className="aufgabe-marker" aria-hidden>🖌️</span>
        <span className="aufgabe-typ">Aufgabe</span>
        <h4 className="aufgabe-titel">{titel}</h4>
        <span
          className="aufgabe-schwierigkeit"
          title={`Schwierigkeit: ${SCHWIERIGKEIT_LABEL[schwierigkeit]}`}
          aria-label={`Schwierigkeit ${SCHWIERIGKEIT_LABEL[schwierigkeit]}`}
        >
          {STERNE[schwierigkeit]}
        </span>
        {zeit && <span className="aufgabe-zeit">⏱ {zeit}</span>}
      </header>
      <div className="aufgabe-body">{children}</div>
    </section>
  );
}

/**
 * Optional in einer Aufgabe: Liste der Pflicht-Elemente.
 * Stilistisch eine Mini-Checkliste, kein interaktives Häkchen.
 */
export function AufgabeCheckliste({ items }: { items: string[] }) {
  return (
    <ul className="aufgabe-checkliste">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}
