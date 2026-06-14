"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// Ein Puzzle: deutsche Bedeutung + die richtige englische Reihenfolge.
// Der „deutsche Reflex" zeigt, wie man es aus dem Deutschen heraus falsch baut.
type Puzzle = {
  id: string;
  bedeutung: string;
  richtig: string[];
  deutscherReflex: string;
  warum: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: "yesterday",
    bedeutung: "Ich bin gestern ins Kino gegangen.",
    richtig: ["I", "went", "to", "the", "cinema", "yesterday"],
    deutscherReflex: "Yesterday I went to the cinema  …oder…  I have yesterday gone",
    warum:
      "Im Deutschen kann die Zeitangabe nach vorn (Gestern bin ich…). " +
      "Englisch mag Zeit am liebsten ans Ende: …yesterday.",
  },
  {
    id: "homework",
    bedeutung: "Ich muss heute Abend meine Hausaufgaben machen.",
    richtig: ["I", "have", "to", "do", "my", "homework", "tonight"],
    deutscherReflex: "I must tonight my homework do",
    warum:
      "Im Deutschen wandert das Verb (machen) ans Ende. Englisch hält " +
      "Verb + Objekt zusammen: do my homework — und die Zeit kommt hinten dran.",
  },
  {
    id: "coffee",
    bedeutung: "Sie trinkt jeden Morgen Kaffee.",
    richtig: ["She", "drinks", "coffee", "every", "morning"],
    deutscherReflex: "She drinks every morning coffee",
    warum:
      "Objekt zuerst (coffee), dann die Zeit (every morning). " +
      "Die deutsche Reihenfolge schiebt die Zeit zu früh rein.",
  },
];

type Status = "offen" | "richtig" | "falsch";

export default function SatzZug() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [gebaut, setGebaut] = useState<number[]>([]); // indizes der platzierten Wörter
  const [status, setStatus] = useState<Status>("offen");

  const puzzle = PUZZLES[puzzleIdx];

  // Gemischte Wörter (deterministisch pro Puzzle, damit kein Hydration-Mismatch).
  const pool = useMemo(() => {
    const indizes = puzzle.richtig.map((_, i) => i);
    // einfacher, stabiler Shuffle anhand der Puzzle-Position
    const gemischt = [...indizes].sort(
      (a, b) =>
        ((a * 7 + puzzleIdx * 13) % puzzle.richtig.length) -
        ((b * 7 + puzzleIdx * 13) % puzzle.richtig.length)
    );
    return gemischt;
  }, [puzzle, puzzleIdx]);

  const verfuegbar = pool.filter((i) => !gebaut.includes(i));

  function platzieren(i: number) {
    if (status === "richtig") return;
    setGebaut((g) => [...g, i]);
    setStatus("offen");
  }

  function entfernen(pos: number) {
    if (status === "richtig") return;
    setGebaut((g) => g.filter((_, p) => p !== pos));
    setStatus("offen");
  }

  function pruefen() {
    const richtig =
      gebaut.length === puzzle.richtig.length &&
      gebaut.every((wortIdx, pos) => wortIdx === pos);
    setStatus(richtig ? "richtig" : "falsch");
  }

  function zuruecksetzen() {
    setGebaut([]);
    setStatus("offen");
  }

  function naechstes() {
    setPuzzleIdx((p) => (p + 1) % PUZZLES.length);
    setGebaut([]);
    setStatus("offen");
  }

  const wackelt = status === "falsch";
  const eingerastet = status === "richtig";

  return (
    <div className="lesson-card">
      {/* lokale Keyframes für „wackeln" / „einrasten" — kein globales CSS nötig */}
      <style>{`
        @keyframes zug-wackeln {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        @keyframes zug-einrasten {
          0% { transform: scale(1); }
          40% { transform: scale(1.035); }
          100% { transform: scale(1); }
        }
      `}</style>

      <h2>Der Satz-Zug</h2>
      <p className="lesson-description">
        Englische Sätze sind ein Zug mit fester Waggon-Reihenfolge:
        <strong> Wer → tut was → wem/was → wo → wann.</strong> Du kannst die
        Waggons nicht umkoppeln. Bau den Satz zusammen — wenn die Reihenfolge
        stimmt, rastet der Zug ein. Wenn die deutsche Reihenfolge reinrutscht,
        wackelt er.
      </p>

      <div className="info-box">
        Bedeutung: <strong>{puzzle.bedeutung}</strong>
      </div>

      {/* Gebauter Satz (die Schiene) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          minHeight: 64,
          alignItems: "center",
          padding: "14px 16px",
          margin: "10px 0",
          borderRadius: 12,
          border: `2px ${eingerastet ? "solid" : "dashed"} ${
            eingerastet ? "#10b981" : wackelt ? "#ef4444" : "#cbd5e1"
          }`,
          background: eingerastet ? "#ecfdf5" : wackelt ? "#fef2f2" : "#f9fafb",
          animation: wackelt
            ? "zug-wackeln 0.4s ease"
            : eingerastet
            ? "zug-einrasten 0.4s ease"
            : "none",
        }}
      >
        {gebaut.length === 0 && (
          <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
            Klick die Wörter unten in der richtigen Reihenfolge an…
          </span>
        )}
        {gebaut.map((wortIdx, pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => entfernen(pos)}
            className="toggle-code"
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "1.05rem",
              background: "#ffffff",
              borderColor: eingerastet ? "#10b981" : "#94a3b8",
              cursor: eingerastet ? "default" : "pointer",
            }}
            title={eingerastet ? "" : "Klick zum Zurücklegen"}
          >
            {puzzle.richtig[wortIdx]}
          </button>
        ))}
      </div>

      {/* Wort-Pool */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "6px 0 14px" }}>
        {verfuegbar.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => platzieren(i)}
            className="toggle-code"
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "1.05rem",
              background: "#eef2ff",
              borderColor: "#a5b4fc",
              color: "#3730a3",
            }}
          >
            {puzzle.richtig[i]}
          </button>
        ))}
        {verfuegbar.length === 0 && status !== "richtig" && (
          <span style={{ color: "#9ca3af", fontStyle: "italic", alignSelf: "center" }}>
            Alle Wörter platziert — jetzt prüfen.
          </span>
        )}
      </div>

      {/* Aktionen */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={pruefen}
          disabled={gebaut.length !== puzzle.richtig.length || eingerastet}
          className="toggle-code"
          style={{
            background: eingerastet ? "#d1fae5" : "#10b981",
            borderColor: "#10b981",
            color: eingerastet ? "#047857" : "#ffffff",
            fontWeight: 700,
            opacity:
              gebaut.length !== puzzle.richtig.length && !eingerastet ? 0.5 : 1,
          }}
        >
          ✓ Prüfen
        </button>
        <button type="button" onClick={zuruecksetzen} className="toggle-code">
          ↺ Neu
        </button>
        {eingerastet && (
          <button
            type="button"
            onClick={naechstes}
            className="toggle-code"
            style={{ background: "#eef2ff", borderColor: "#6366f1", color: "#3730a3", fontWeight: 700 }}
          >
            → Nächster Satz
          </button>
        )}
      </div>

      {/* Feedback */}
      {eingerastet && (
        <div className="info-box" style={{ marginTop: 14, background: "#ecfdf5", borderColor: "#10b981" }}>
          🟢 Eingerastet! Die Waggons sitzen. {puzzle.warum}
        </div>
      )}
      {wackelt && (
        <div className="info-box" style={{ marginTop: 14, background: "#fef2f2", borderColor: "#ef4444" }}>
          🔴 Wackelt noch. Tipp: Verb + Objekt bleiben zusammen, die Zeitangabe
          (yesterday, tonight, every morning) wandert ans Ende — nicht nach vorn
          wie im Deutschen.
        </div>
      )}

      <DepthBox variant="why" title="Warum geht die deutsche Reihenfolge nicht?">
        Deutsch ist eine <em>V2-Sprache</em> mit verschiebbaren Feldern: „Gestern
        bin ich ins Kino gegangen" stellt die Zeit nach vorn und schiebt das
        Partizip (gegangen) ans Satzende. Englisch ist viel starrer: Subjekt →
        Verb → Objekt, und Zusätze wie Ort und Zeit hängen hinten dran. Wer die
        deutsche Beweglichkeit mitnimmt, baut Sätze, die „wackeln".
      </DepthBox>

      <DepthBox variant="mistake" title="Die Zeitangabe nach vorn ziehen">
        „Yesterday I have to the cinema gone" ist gleich doppelt deutsch: Zeit
        vorn <em>und</em> Verb hinten. Beides geht im Englischen nicht im selben
        Atemzug. Faustregel fürs Sprechen: <strong>erst wer + was passiert,
        dann wo, dann wann.</strong>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        „Fragen bauen" (das Hilfsverb rutscht vor das Subjekt — eine weitere
        feste Bewegung) und „Nebensätze anhängen" (im Deutschen wandert das Verb
        ans Ende, im Englischen bleibt es vorn). Beide Folge-Lektionen in diesem
        Kanal bauen auf dem Waggon-Bild auf.
      </DepthBox>
    </div>
  );
}
