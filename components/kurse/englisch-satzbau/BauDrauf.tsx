"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

// Ein Gerüst: fester Anfang + eine Lücke mit Füll-Optionen.
type Geruest = {
  id: string;
  vorne: string;
  fueller: string[];
};

const GERUESTE: Geruest[] = [
  {
    id: "iftime",
    vorne: "If I had more time, I would",
    fueller: ["travel more", "learn the guitar", "read every day", "sleep in"],
  },
  {
    id: "think",
    vorne: "I think the best thing about it is that",
    fueller: ["it saves time", "everyone can join", "it is free", "it just works"],
  },
  {
    id: "honest",
    vorne: "To be honest, I would say that",
    fueller: ["it depends", "I am not sure yet", "both have a point", "it is worth a try"],
  },
];

// Connector-Bausteine, die den Satz „länger machen".
const CONNECTORS: { text: string; weiter: string }[] = [
  { text: "because", weiter: "it really matters to me" },
  { text: "which means", weiter: "I would have to plan ahead" },
  { text: "even though", weiter: "it is not always easy" },
  { text: "so that", weiter: "I could enjoy it properly" },
];

export default function BauDrauf() {
  const [geruestId, setGeruestId] = useState(GERUESTE[0].id);
  const [fueller, setFueller] = useState<string | null>(null);
  const [anhang, setAnhang] = useState<string[]>([]);

  const geruest = GERUESTE.find((g) => g.id === geruestId) ?? GERUESTE[0];

  function geruestWechseln(id: string) {
    setGeruestId(id);
    setFueller(null);
    setAnhang([]);
  }

  function verlaengern() {
    const naechster = CONNECTORS[anhang.length % CONNECTORS.length];
    setAnhang((a) => [...a, `${naechster.text} ${naechster.weiter}`]);
  }

  const satz =
    `${geruest.vorne} ${fueller ?? "___"}` +
    (anhang.length ? " " + anhang.join(", ") : "") +
    ".";

  const wortZahl = satz.replace(/[^A-Za-z]+/g, " ").trim().split(/\s+/).length;

  return (
    <div className="lesson-card">
      <h2>Bau drauf — ein Gerüst, zehn Sätze</h2>
      <p className="lesson-description">
        Im Sprechen baut keiner Wort für Wort. Man nimmt ein fertiges Gerüst,
        füllt die Lücke — und macht den Satz dann <em>länger</em>. Das Erstaunliche:
        Mit Gerüst sind lange Sätze leichter, nicht schwerer. Probier es aus.
      </p>

      {/* Gerüst wählen */}
      <div className="input-group">
        <label>Gerüst wählen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {GERUESTE.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => geruestWechseln(g.id)}
              className="toggle-code"
              style={{
                background: geruestId === g.id ? "#ecfdf5" : "transparent",
                borderColor: geruestId === g.id ? "#10b981" : "#d1d5db",
                color: geruestId === g.id ? "#047857" : "#374151",
                fontWeight: geruestId === g.id ? 700 : 500,
              }}
            >
              {g.vorne}…
            </button>
          ))}
        </div>
      </div>

      {/* Lücke füllen */}
      <div className="input-group">
        <label>1. Lücke füllen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {geruest.fueller.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFueller(f)}
              className="toggle-code"
              style={{
                background: fueller === f ? "#eef2ff" : "transparent",
                borderColor: fueller === f ? "#6366f1" : "#d1d5db",
                color: fueller === f ? "#3730a3" : "#374151",
                fontWeight: fueller === f ? 700 : 500,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Verlängern */}
      <div className="input-group">
        <label>2. Länger machen (Connector dranhängen)</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={verlaengern}
            disabled={!fueller}
            className="toggle-code"
            style={{
              background: fueller ? "#10b981" : "#e5e7eb",
              borderColor: fueller ? "#10b981" : "#d1d5db",
              color: fueller ? "#ffffff" : "#9ca3af",
              fontWeight: 700,
              cursor: fueller ? "pointer" : "not-allowed",
            }}
          >
            ＋ mach ihn länger
          </button>
          {anhang.length > 0 && (
            <button
              type="button"
              onClick={() => setAnhang([])}
              className="toggle-code"
            >
              ↺ kürzen
            </button>
          )}
          <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            {fueller ? `${wortZahl} Wörter` : "erst die Lücke füllen"}
          </span>
        </div>
      </div>

      {/* Der wachsende Satz */}
      <div
        style={{
          marginTop: 8,
          padding: "20px 18px",
          borderRadius: 12,
          border: "2px solid #10b981",
          background: "#f0fdf4",
          fontFamily: "ui-monospace, monospace",
          fontSize: "1.15rem",
          lineHeight: 1.6,
          color: "#064e3b",
        }}
      >
        {satz}
      </div>

      <DepthBox variant="why" title="Warum ist ein längerer Satz leichter?">
        Weil das Gerüst die Struktur schon trägt. „If I had more time, I would
        travel more" ist ein kompletter, korrekter Satz — und „because it really
        matters to me" ist nur ein angehängter Baustein, kein neuer Satz, den du
        von Grund auf bauen musst. Im Examen wirkt das flüssig und durchdacht,
        obwohl du eigentlich nur Bausteine aneinanderhängst.
      </DepthBox>

      <DepthBox variant="mistake" title="Kurze, abgehackte Sätze für sicher halten">
        Viele halten sich im Examen an Drei-Wort-Sätze, um Fehler zu vermeiden —
        und klingen dadurch unsicher und einsilbig. Genau diese Connectors
        (because, which means, even though, so that) heben das Niveau, ohne dass
        du kompliziertere Grammatik brauchst. Ein gut verbundener Satz schlägt
        drei abgehackte.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        „Sentence-Starter fürs Examen" (noch mehr fertige Anfänge zum
        Zeitgewinn) und der „Bildbeschreibung mit KI-Prüfer", wo du genau diese
        Gerüste an echten Prüfungsaufgaben übst. Beide kommen in diesem Kanal
        noch dazu.
      </DepthBox>

      <Aufgabe titel="Dein Wochenende in 5 Sätzen" schwierigkeit="leicht" zeit="15 min">
        <p>
          Erzähl von deinem letzten Wochenende — laut, nicht geschrieben. Nimm
          dich mit dem Handy auf oder sprich frei. Ziel: fünf Sätze, jeder mit
          mindestens einem Connector (because / which means / even though / so
          that / although).
        </p>
        <AufgabeCheckliste
          items={[
            "5 Sätze, frei gesprochen (nicht abgelesen)",
            "Jeder Satz hat mindestens einen Connector",
            "Mindestens ein Satz nutzt ein Gerüst von oben",
            "Die Zeitangabe steht am Ende, nicht vorn",
          ]}
        />
        <KiReview
          hinweis="Sprich deine 5 Sätze und tipp sie (oder eine Transkription) zusammen mit diesem Prompt in eine KI-deiner-Wahl (Claude, ChatGPT, Gemini). Du bekommst Prüfer-Feedback genau auf den Satzbau."
          prompt={`Du bist ein wohlwollender, aber genauer Prüfer für eine mündliche Englischprüfung.
Ich schicke dir 5 Sätze über mein letztes Wochenende, frei gesprochen.

Bewerte NUR den Satzbau, nicht den Inhalt. Achte auf:
1. Wortstellung — Subjekt, Verb, Objekt in der richtigen Reihenfolge? Zeitangabe am Ende?
2. Verbindungen — sind die Sätze mit Connectors (because, which means, even though, so that) sinnvoll verbunden, oder abgehackt?
3. Typische deutsche Fehler — Verb am Satzende, Zeitangabe nach vorn gezogen, fehlendes Hilfsverb.

Gib mir zu jedem Satz eine kurze Rückmeldung (klingt natürlich / wackelt — und warum).
Schreib die Korrektur immer als ganzen, flüssig klingenden Satz, nicht nur als Regel.
Beende deine Antwort mit den ZWEI größten Verbesserungs-Hebeln für mein Mündliches.

Hier sind meine 5 Sätze:`}
        />
      </Aufgabe>
    </div>
  );
}
