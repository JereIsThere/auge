"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

// Ein Gerüst: fester Anfang, eine Lücke (mit Füll-Optionen) und passende
// Anbau-Teile, die den Satz natürlich verlängern. Die Anbauten sind auf das
// Gerüst zugeschnitten, nicht auf die Lücke — so klingen alle Kombis flüssig.
type Geruest = {
  id: string;
  vorne: string;
  fueller: string[];
  anbau: string[];
};

const GERUESTE: Geruest[] = [
  {
    id: "iftime",
    vorne: "If I had more time, I would",
    fueller: ["travel more", "learn the guitar", "read every day", "sleep in"],
    anbau: [
      "but my schedule is packed right now",
      "which is something I really miss",
      "because there is never enough of it",
      "so I could finally slow down",
    ],
  },
  {
    id: "best",
    vorne: "I think the best thing about it is that",
    fueller: ["it saves time", "everyone can join", "it is free", "it just works"],
    anbau: [
      "which makes a real difference",
      "even though not everyone agrees",
      "and that is hard to beat",
      "especially for beginners",
    ],
  },
  {
    id: "honest",
    vorne: "To be honest, I would say that",
    fueller: ["it depends", "I am not sure yet", "both sides have a point", "it is worth a try"],
    anbau: [
      "but I could be wrong",
      "because I have seen it myself",
      "even if it sounds simple",
      "and most people feel the same",
    ],
  },
];

export default function BauDrauf() {
  const [geruestId, setGeruestId] = useState(GERUESTE[0].id);
  const [fueller, setFueller] = useState<string | null>(null);
  const [anbau, setAnbau] = useState<string | null>(null);

  const geruest = GERUESTE.find((g) => g.id === geruestId) ?? GERUESTE[0];

  function geruestWechseln(id: string) {
    setGeruestId(id);
    setFueller(null);
    setAnbau(null);
  }

  const satz =
    `${geruest.vorne} ${fueller ?? "___"}` +
    (anbau ? `, ${anbau}` : "") +
    ".";

  const wortZahl = satz.replace(/[^A-Za-z]+/g, " ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="lesson-card">
      <h2>Bau drauf — ein Gerüst, zehn Sätze</h2>
      <p className="lesson-description">
        Im Sprechen baut keiner Wort für Wort. Man nimmt ein fertiges Gerüst,
        füllt die Lücke — und hängt dann <em>einen</em> Baustein dran, der den
        Satz länger macht. Das Erstaunliche: Mit Gerüst sind lange Sätze
        leichter, nicht schwerer. Probier die Kombinationen durch.
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

      {/* Länger machen — einen Anbau wählen (austauschbar) */}
      <div className="input-group">
        <label>2. Länger machen — einen Anbau wählen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {geruest.anbau.map((a) => {
            const aktiv = anbau === a;
            return (
              <button
                key={a}
                type="button"
                disabled={!fueller}
                onClick={() => setAnbau(aktiv ? null : a)}
                className="toggle-code"
                style={{
                  background: aktiv ? "#10b981" : fueller ? "transparent" : "#f3f4f6",
                  borderColor: aktiv ? "#10b981" : "#d1d5db",
                  color: aktiv ? "#ffffff" : fueller ? "#374151" : "#9ca3af",
                  fontWeight: aktiv ? 700 : 500,
                  cursor: fueller ? "pointer" : "not-allowed",
                }}
              >
                …{a}
              </button>
            );
          })}
        </div>
        {!fueller && (
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Erst die Lücke füllen, dann wird der Anbau aktiv.
          </span>
        )}
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
      {fueller && (
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 6 }}>
          {wortZahl} Wörter {anbau ? "— der Anbau hat ihn fast verdoppelt." : "— jetzt einen Anbau dranhängen."}
        </p>
      )}

      <DepthBox variant="why" title="Warum ist ein längerer Satz leichter?">
        Weil das Gerüst die Struktur schon trägt. „If I had more time, I would
        travel more" ist ein kompletter, korrekter Satz — und „which is something
        I really miss" ist nur ein angehängter Baustein, kein neuer Satz, den du
        von Grund auf bauen musst. Im Examen wirkt das flüssig und durchdacht,
        obwohl du eigentlich nur Bausteine aneinanderhängst.
      </DepthBox>

      <DepthBox variant="mistake" title="Kurze, abgehackte Sätze für sicher halten">
        Viele halten sich im Examen an Drei-Wort-Sätze, um Fehler zu vermeiden —
        und klingen dadurch unsicher und einsilbig. Genau diese Anbauten
        (because, which, even though, so) heben das Niveau, ohne dass du
        kompliziertere Grammatik brauchst. Ein gut verbundener Satz schlägt drei
        abgehackte. Tipp: <em>einen</em> Anbau pro Satz reicht — zwei werden
        schnell holprig.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        „Sentence-Starter fürs Examen" (noch mehr fertige Anfänge zum
        Zeitgewinn) und die „Bildbeschreibung mit KI-Prüfer", wo du genau diese
        Gerüste an echten Prüfungsaufgaben übst. Beide kommen in diesem Kanal
        noch dazu.
      </DepthBox>

      <Aufgabe titel="Dein Wochenende in 5 Sätzen" schwierigkeit="leicht" zeit="15 min">
        <p>
          Erzähl von deinem letzten Wochenende — laut, nicht geschrieben. Ziel:
          fünf Sätze, jeder mit einem Anbau (because / which / even though / so /
          although). Nutz die Gerüste von oben als Starthilfe.
        </p>
        <AufgabeCheckliste
          items={[
            "5 Sätze, frei gesprochen (nicht abgelesen)",
            "Jeder Satz hat genau einen Anbau",
            "Mindestens ein Satz nutzt ein Gerüst von oben",
            "Die Zeitangabe steht am Rand, nicht in der Mitte",
          ]}
        />
        <KiReview
          voiceOption
          hinweis="Tipp deine 5 Sätze (oder eine Transkription) zusammen mit diesem Prompt in eine KI-deiner-Wahl. Du bekommst Prüfer-Feedback genau auf den Satzbau."
          voiceHinweis="Fürs Mündliche am besten: öffne den Voice-Modus einer KI (ChatGPT Voice, Gemini Live), gib den Prompt einmal ein — und sprich deine 5 Sätze dann frei. Du übst das echte Sprechen und hörst das Feedback direkt zurück."
          prompt={`Du bist ein wohlwollender, aber genauer Prüfer für eine mündliche Englischprüfung.
Ich gebe dir 5 Sätze über mein letztes Wochenende, frei gesprochen.

Bewerte NUR den Satzbau, nicht den Inhalt. Achte auf:
1. Wortstellung — Subjekt, Verb, Objekt in der richtigen Reihenfolge? Zeitangabe am Rand (vorn oder hinten), nicht in der Mitte?
2. Verbindungen — sind die Sätze mit einem Anbau (because, which, even though, so) sinnvoll verlängert, oder abgehackt?
3. Typische deutsche Fehler — Verb am Satzende, Zeitangabe in der Mitte, fehlendes Hilfsverb.

Gib mir zu jedem Satz eine kurze Rückmeldung (klingt natürlich / wackelt — und warum).
Schreib die Korrektur immer als ganzen, flüssig klingenden Satz, nicht nur als Regel.
Wenn wir im Sprech-Modus sind, antworte ruhig auch gesprochen und stell mir eine kleine Nachfrage, damit ich weiterreden muss.
Beende deine Antwort mit den ZWEI größten Verbesserungs-Hebeln für mein Mündliches.

Hier sind meine 5 Sätze:`}
        />
      </Aufgabe>
    </div>
  );
}
