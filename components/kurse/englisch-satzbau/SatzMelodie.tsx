"use client";

import { useEffect, useRef, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// Ein Wort im Satz. stark = Inhaltswort (kriegt den Schlag),
// schwach = Funktionswort (huscht durch).
type Wort = { text: string; stark: boolean };

type Satz = { id: string; woerter: Wort[]; hinweis: string };

const SAETZE: Satz[] = [
  {
    id: "store",
    hinweis: "Drei Schläge: WANT · GO · STORE. Der Rest wird durchgenuschelt.",
    woerter: [
      { text: "I", stark: false },
      { text: "want", stark: true },
      { text: "to", stark: false },
      { text: "go", stark: true },
      { text: "to", stark: false },
      { text: "the", stark: false },
      { text: "store", stark: true },
    ],
  },
  {
    id: "weekend",
    hinweis: "FRIENDS · BEACH · WEEKEND tragen den Takt — and, the, at, my fallen weg.",
    woerter: [
      { text: "My", stark: false },
      { text: "friends", stark: true },
      { text: "and", stark: false },
      { text: "I", stark: false },
      { text: "went", stark: true },
      { text: "to", stark: false },
      { text: "the", stark: false },
      { text: "beach", stark: true },
      { text: "at", stark: false },
      { text: "the", stark: false },
      { text: "weekend", stark: true },
    ],
  },
  {
    id: "think",
    hinweis: "THINK · BETTER · WAIT — typische Examens-Phrase, vier Wörter tragen sie.",
    woerter: [
      { text: "I", stark: false },
      { text: "think", stark: true },
      { text: "it", stark: false },
      { text: "would", stark: false },
      { text: "be", stark: false },
      { text: "better", stark: true },
      { text: "to", stark: false },
      { text: "wait", stark: true },
    ],
  },
];

// Dauer pro Wort (ms): starke Wörter „landen" und halten, schwache flitzen.
const DAUER_STARK = 520;
const DAUER_SCHWACH = 140;

export default function SatzMelodie() {
  const [satzId, setSatzId] = useState<string>(SAETZE[0].id);
  const [aktiv, setAktiv] = useState<number>(-1); // index des gerade „klingenden" Wortes
  const [laeuft, setLaeuft] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const satz = SAETZE.find((s) => s.id === satzId) ?? SAETZE[0];

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setLaeuft(false);
    setAktiv(-1);
  }

  function abspielen() {
    stop();
    setLaeuft(true);
    let i = 0;
    const schritt = () => {
      if (i >= satz.woerter.length) {
        setLaeuft(false);
        setAktiv(-1);
        timerRef.current = null;
        return;
      }
      setAktiv(i);
      const dauer = satz.woerter[i].stark ? DAUER_STARK : DAUER_SCHWACH;
      i += 1;
      timerRef.current = setTimeout(schritt, dauer);
    };
    schritt();
  }

  // Beim Wechsel des Satzes oder Unmount sauber stoppen.
  useEffect(() => stop, [satzId]);

  // Anzahl der Schläge (starke Wörter) — kleine Metronom-Anzeige.
  const schlaege = satz.woerter.filter((w) => w.stark).length;

  return (
    <div className="lesson-card">
      <h2>Die Satz-Melodie</h2>
      <p className="lesson-description">
        Englisch hat einen Beat. Ein paar betonte Wörter kommen in regelmäßigem
        Abstand — der Rest wird dazwischen zusammengequetscht. Wer jede Silbe
        gleich schwer spricht, klingt roboterhaft. Drück auf Play und sieh (und
        fühl), welche Wörter den Schlag tragen.
      </p>

      <div className="info-box">
        Inhaltswörter (Verb, Nomen, „wichtige" Wörter) kriegen den Schlag.
        Funktionswörter (to, the, of, and, it) huschen unbetont durch.
      </div>

      {/* Satz-Auswahl */}
      <div className="input-group">
        <label>Satz wählen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SAETZE.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSatzId(s.id)}
              className="toggle-code"
              style={{
                background: satzId === s.id ? "#ecfdf5" : "transparent",
                borderColor: satzId === s.id ? "#10b981" : "#d1d5db",
                color: satzId === s.id ? "#047857" : "#374151",
                fontWeight: satzId === s.id ? 700 : 500,
              }}
            >
              {s.woerter.map((w) => w.text).join(" ").slice(0, 22)}…
            </button>
          ))}
        </div>
      </div>

      {/* Die Wörter als Chips, betonte größer */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 8,
          padding: "28px 16px",
          margin: "8px 0",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          minHeight: 90,
        }}
      >
        {satz.woerter.map((w, i) => {
          const istAktiv = i === aktiv;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transition: "transform 90ms ease, background 90ms ease, color 90ms ease",
                fontFamily: "ui-monospace, monospace",
                fontWeight: w.stark ? 700 : 400,
                fontSize: w.stark ? "1.5rem" : "0.95rem",
                opacity: w.stark ? 1 : 0.55,
                color: istAktiv ? "#047857" : w.stark ? "#111827" : "#6b7280",
                background: istAktiv ? "#a7f3d0" : "transparent",
                borderRadius: 8,
                padding: istAktiv ? "2px 8px" : "2px 4px",
                transform: istAktiv
                  ? `translateY(-6px) scale(${w.stark ? 1.18 : 1.05})`
                  : "none",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>

      {/* Metronom-Punkte */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "6px 0 14px" }}>
        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Schläge:</span>
        {Array.from({ length: schlaege }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#10b981",
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          onClick={laeuft ? stop : abspielen}
          className="toggle-code"
          style={{
            background: laeuft ? "#fee2e2" : "#10b981",
            borderColor: laeuft ? "#ef4444" : "#10b981",
            color: laeuft ? "#b91c1c" : "#ffffff",
            fontWeight: 700,
            padding: "8px 18px",
          }}
        >
          {laeuft ? "⏹ Stop" : "▶ Rhythmus abspielen"}
        </button>
        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{satz.hinweis}</span>
      </div>

      <DepthBox variant="why" title="Warum klingt es eigentlich roboterhaft?">
        Englisch ist eine <em>stress-timed language</em>: die betonten Silben
        kommen in ungefähr gleichen Zeitabständen, egal wie viele unbetonte
        dazwischen liegen. Deutsch ist da ähnlich, aber Lernende sprechen oft
        jedes Wort gleich deutlich aus — dann fehlt der Beat, und genau das
        hören Muttersprachler als „Akzent" oder „abgehackt", noch bevor ein
        einziges Wort falsch ist.
      </DepthBox>

      <DepthBox variant="mistake" title="Jedes Wort gleich betonen">
        Der häufigste Reflex: „to", „the", „of" so deutlich sprechen wie ein
        Inhaltswort. Klingt überdeutlich und unnatürlich. Trick: die kleinen
        Wörter bewusst <em>verschlucken</em> — „wanna go to the store" ist näher
        am echten Sprechen als die Schulbuch-Aussprache jeder Silbe.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        „Schwache Wörter verschlucken" (nächste Lektion in diesem Kanal — wie
        to/of/the zu „tə/əv/ðə" werden) und der Frage-Melodie (geht die Stimme
        am Ende hoch oder runter?). Beides macht den Unterschied zwischen
        „korrekt" und „klingt wie ein Muttersprachler".
      </DepthBox>
    </div>
  );
}
