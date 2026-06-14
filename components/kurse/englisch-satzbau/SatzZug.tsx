"use client";

import { useEffect, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// Ein Puzzle: deutsche Bedeutung, der Wort-Vorrat (Chips) und ALLE akzeptierten
// Reihenfolgen. Vergleich läuft case-insensitiv über die Wörter, damit z.B.
// „tonight" vorn wie hinten passt.
type Puzzle = {
  id: string;
  bedeutung: string;
  woerter: string[];
  loesungen: string[][];
  warum: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: "homework",
    bedeutung: "Ich muss heute Abend meine Hausaufgaben machen.",
    woerter: ["I", "have", "to", "do", "my", "homework", "tonight"],
    loesungen: [
      ["I", "have", "to", "do", "my", "homework", "tonight"],
      ["tonight", "I", "have", "to", "do", "my", "homework"],
    ],
    warum:
      "Verb + Objekt bleiben zusammen (do my homework). Die Zeit (tonight) darf " +
      "ans Ende ODER ganz nach vorn — nur nicht in die Mitte, und das Verb nicht ans Satzende.",
  },
  {
    id: "cinema",
    bedeutung: "Ich bin gestern ins Kino gegangen.",
    woerter: ["I", "went", "to", "the", "cinema", "yesterday"],
    loesungen: [
      ["I", "went", "to", "the", "cinema", "yesterday"],
      ["yesterday", "I", "went", "to", "the", "cinema"],
    ],
    warum:
      "Zeit am Ende ist der Normalfall, vorn geht auch (zur Betonung). Was nicht geht: " +
      "yesterday mitten rein oder das Verb ans Satzende schieben.",
  },
  {
    id: "coffee",
    bedeutung: "Sie trinkt jeden Morgen Kaffee.",
    woerter: ["She", "drinks", "coffee", "every", "morning"],
    loesungen: [
      ["She", "drinks", "coffee", "every", "morning"],
      ["every", "morning", "she", "drinks", "coffee"],
    ],
    warum:
      "Objekt direkt hinters Verb (drinks coffee). Die Zeit (every morning) ans Ende " +
      "oder nach vorn — aber nicht zwischen drinks und coffee.",
  },
];

type Status = "offen" | "richtig" | "falsch";

// Fisher-Yates — nur clientseitig (in useEffect) aufgerufen.
function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function capitalize(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export default function SatzZug() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [gebaut, setGebaut] = useState<number[]>([]); // indizes der platzierten Wörter
  const [status, setStatus] = useState<Status>("offen");
  // Reihenfolge der Chips im Pool. Initial deterministisch (umgekehrt) für SSR,
  // wird nach dem Mount per useEffect echt zufällig gemischt → kein Hydration-Mismatch.
  const [pool, setPool] = useState<number[]>(() =>
    PUZZLES[0].woerter.map((_, i) => i).reverse()
  );

  const puzzle = PUZZLES[puzzleIdx];

  // Bei jedem Puzzle-Wechsel (und beim ersten Mount) frisch zufällig mischen.
  useEffect(() => {
    setPool(shuffle(PUZZLES[puzzleIdx].woerter.map((_, i) => i)));
    setGebaut([]);
    setStatus("offen");
  }, [puzzleIdx]);

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
    const built = gebaut.map((i) => puzzle.woerter[i].toLowerCase());
    const ok =
      built.length === puzzle.woerter.length &&
      puzzle.loesungen.some(
        (sol) =>
          sol.length === built.length &&
          sol.every((w, k) => w.toLowerCase() === built[k])
      );
    setStatus(ok ? "richtig" : "falsch");
  }

  function zuruecksetzen() {
    setPool(shuffle(puzzle.woerter.map((_, i) => i)));
    setGebaut([]);
    setStatus("offen");
  }

  function naechstes() {
    setPuzzleIdx((p) => (p + 1) % PUZZLES.length);
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
        <strong> Wer → tut was → wem/was → wo → wann.</strong> Verb und Objekt
        bleiben dabei zusammen. Bau den Satz zusammen — wenn die Reihenfolge
        stimmt, rastet der Zug ein. Rutscht die deutsche Reihenfolge rein
        (Verb ans Ende, Zeit in die Mitte), wackelt er. Manche Sätze haben mehr
        als eine richtige Lösung.
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
            {pos === 0 ? capitalize(puzzle.woerter[wortIdx]) : puzzle.woerter[wortIdx]}
          </button>
        ))}
      </div>

      {/* Wort-Pool (zufällig gemischt) */}
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
            {puzzle.woerter[i]}
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
          disabled={gebaut.length !== puzzle.woerter.length || eingerastet}
          className="toggle-code"
          style={{
            background: eingerastet ? "#d1fae5" : "#10b981",
            borderColor: "#10b981",
            color: eingerastet ? "#047857" : "#ffffff",
            fontWeight: 700,
            opacity:
              gebaut.length !== puzzle.woerter.length && !eingerastet ? 0.5 : 1,
          }}
        >
          ✓ Prüfen
        </button>
        <button type="button" onClick={zuruecksetzen} className="toggle-code">
          ↺ Neu mischen
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
          (yesterday, tonight, every morning) wandert ans Ende oder ganz nach
          vorn — nie in die Mitte, und das Verb bleibt vorn.
        </div>
      )}

      <DepthBox variant="why" title="Warum geht die deutsche Reihenfolge nicht?">
        Deutsch ist eine <em>V2-Sprache</em> mit verschiebbaren Feldern: „Gestern
        bin ich ins Kino gegangen" stellt die Zeit nach vorn und schiebt das
        Partizip (gegangen) ans Satzende. Englisch ist viel starrer: Subjekt →
        Verb → Objekt, und Zusätze wie Ort und Zeit hängen an den Rändern. Wer die
        deutsche Beweglichkeit mitnimmt, baut Sätze, die „wackeln".
      </DepthBox>

      <DepthBox variant="mistake" title="Verb ans Ende oder Zeit in die Mitte">
        Zwei deutsche Reflexe auf einmal: „I must tonight my homework do" schiebt
        die Zeit in die Mitte <em>und</em> das Verb ans Ende. Beides geht im
        Englischen nicht. Faustregel fürs Sprechen: <strong>erst wer + was
        passiert, dann das Objekt direkt dahinter, Zeit an den Rand.</strong>
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
