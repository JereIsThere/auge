"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Griff = {
  id: string;
  name: string;
  beschreibung: string;
  beispiel: string;
  muskeln: string;
  cortex: string;
};

const GRIFFE: Griff[] = [
  {
    id: "pinzette",
    name: "Pinzettengriff (Tip-to-Tip)",
    beschreibung:
      "Daumenspitze trifft Zeigefingerspitze. Sehr feinmotorisch, präzise — aber kraftarm.",
    beispiel: "Nadel einfädeln, Krümel aufheben, kleine Schrauben halten.",
    muskeln:
      "Intrinsische Handmuskulatur (interossei, lumbricales) + Daumenballen (thenar). Wenig extrinsisch beteiligt.",
    cortex:
      "Massive Cortex-Repräsentation. Eine der letzten Funktionen, die sich nach Schlaganfall wieder einstellt.",
  },
  {
    id: "schluessel",
    name: "Schlüsselgriff (Lateral Pinch)",
    beschreibung:
      "Daumen drückt seitlich gegen die radiale Seite des Zeigefingers. Stabiler als Pinzette, kraftvoller.",
    beispiel: "Schlüssel im Schloss drehen, Reißverschluss bedienen, Münze halten.",
    muskeln:
      "Daumenadduktor (M. adductor pollicis) + 1. Interosseus. Index-Finger leicht gebeugt.",
    cortex:
      "Schon mit etwas mehr proximalem Input möglich. Häufig erstes Greifmuster, das nach Reha wiederkommt.",
  },
  {
    id: "drei-finger",
    name: "Drei-Finger-Griff (Tripod)",
    beschreibung:
      "Daumen + Zeige + Mittelfinger bilden ein Dreieck. Kombiniert Stabilität mit Feinmotorik.",
    beispiel: "Stift halten zum Schreiben, Pinsel führen, Werkzeug-Spitzen.",
    muskeln:
      "Komplexes Zusammenspiel — Daumen-Opposition + Index/Mittel-Beugung. Hoher Kontrollbedarf.",
    cortex:
      "Sehr cortex-intensiv. Schreibstörungen nach Schlaganfall sind oft Tripod-Defizite.",
  },
  {
    id: "zylinder",
    name: "Zylindrischer Griff (Cylindrical Grip)",
    beschreibung:
      "Ganze Hand umschließt einen zylindrischen Gegenstand. Kraftvoll, wenig Feinmotorik.",
    beispiel: "Glas halten, Türklinke, Pfanne, Werkzeuggriffe.",
    muskeln:
      "Tiefe und oberflächliche Fingerbeuger (FDP, FDS), Daumenopposition. Stark extrinsisch.",
    cortex:
      "Geringere Cortex-Anforderung als feinmotorische Griffe — kommt früher in der Reha zurück.",
  },
  {
    id: "kugel",
    name: "Kugelgriff (Spherical Grip)",
    beschreibung:
      "Hand umschließt eine Kugel. Daumen + alle Finger spreizen sich aus, jeder Finger berührt die Oberfläche.",
    beispiel: "Apfel halten, Baseball werfen, Tennisball.",
    muskeln:
      "Wie zylindrisch, aber zusätzliche Abduktion der Finger (Spreizen). Mehr Intrinsik beteiligt.",
    cortex:
      "Mittlere Komplexität. Variabilität der Objektgröße macht das Training wertvoll für Adaptation.",
  },
  {
    id: "haken",
    name: "Hakengriff (Hook Grip)",
    beschreibung:
      "Finger gekrümmt wie ein Haken, Daumen passiv. Reine Kraft, kein Daumen-Einsatz.",
    beispiel: "Koffer tragen, Einkaufstüten, an einer Stange hängen.",
    muskeln:
      "Reine Fingerbeuger (FDP, FDS). Daumen nicht involviert — was es zu einem der ältesten Griffe der Evolution macht (auch Affen können das).",
    cortex:
      "Geringe Cortex-Anforderung. Wenig informativ für Reha-Bewertung — fast jeder kann es trotz Defizit.",
  },
];

export default function Handtherapie() {
  const [aktiv, setAktiv] = useState<string>("pinzette");
  const g = GRIFFE.find((x) => x.id === aktiv)!;

  return (
    <div className="lesson-card">
      <h2>Handtherapie & Greifmuster</h2>
      <p className="lesson-description">
        Die menschliche Hand kann hunderte verschiedene Griffe — die
        Klassifikation reduziert das auf ~6 Grundmuster, die fast alle
        ADL-Bewegungen abdecken. Wer die Muster kennt, kann ein
        Greifdefizit präzise einordnen und gezielt trainieren statt
        diffus „die Hand stärken".
      </p>

      <div className="info-box">
        Klassifikation geht auf <strong>Napier</strong> (1956) und
        <strong> Schlesinger</strong> (1919) zurück. Heute Standard in
        Hand-Reha und Prothetik — eine Prothese kann nur die Griffe, die
        man explizit programmiert.
      </div>

      <h3>Die sechs Standard-Greifmuster</h3>
      <div className="input-group">
        <label>Wähle ein Greifmuster</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {GRIFFE.map((gr) => (
            <button
              key={gr.id}
              type="button"
              onClick={() => setAktiv(gr.id)}
              className="toggle-code"
              style={{
                background: aktiv === gr.id ? "#eef2ff" : "transparent",
                borderColor: aktiv === gr.id ? "#3b82f6" : "#d1d5db",
                color: aktiv === gr.id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === gr.id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {gr.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="result-box">
        <div className="result-label">{g.name}</div>
        <div style={{ marginTop: 8, fontSize: "0.92rem", color: "#374151" }}>
          {g.beschreibung}
        </div>
        <div className="kv-table" style={{ marginTop: 10, fontSize: "0.86rem" }}>
          <dt style={{ fontFamily: "inherit" }}>Beispiel:</dt>
          <dd style={{ fontFamily: "inherit" }}>{g.beispiel}</dd>
          <dt style={{ fontFamily: "inherit" }}>Muskulatur:</dt>
          <dd style={{ fontFamily: "inherit" }}>{g.muskeln}</dd>
          <dt style={{ fontFamily: "inherit" }}>Cortex-Anforderung:</dt>
          <dd style={{ fontFamily: "inherit" }}>{g.cortex}</dd>
        </div>
      </div>

      <h3>Reha-Reihenfolge nach Schlaganfall</h3>
      <ol className="step-list">
        <li>
          <strong>Zuerst grob:</strong> Hakengriff, dann zylindrischer Griff.
          Wenig Cortex-Anforderung, schnellere Erfolgserlebnisse.
        </li>
        <li>
          <strong>Dann Kraft mit Daumen:</strong> Schlüsselgriff, Kugelgriff.
          Daumen-Opposition wird trainiert.
        </li>
        <li>
          <strong>Zuletzt fein:</strong> Drei-Finger-Griff, Pinzettengriff.
          Höchste Cortex-Anforderung, oft monatelange Übung nötig.
        </li>
        <li>
          <strong>Funktional einsetzen:</strong> alle Griffe in ADL-Kontexten
          üben — eine Tasse halten ist nicht dasselbe wie ein Glas. Variation
          ist Pflicht.
        </li>
      </ol>

      <DepthBox variant="why" title="Was macht die menschliche Hand evolutionär einzigartig?">
        Die <strong>opponierbare Daumen-Stellung</strong> — der Daumen
        kann zu allen anderen Fingern hinüber. Andere Primaten haben das
        nur eingeschränkt; viele Affen sind „Vier-Finger-Greifer" mit
        passivem Daumen. Erst die volle Opposition (Daumenspitze trifft
        kleinen Finger) macht den Pinzettengriff möglich — und damit
        Werkzeugherstellung in der Komplexität, die Steinwerkzeuge,
        Nähen, später Schreiben braucht. Ergo-Therapie der Hand ist
        ergo-therapeutisch tatsächlich die Therapie dessen, was den
        Menschen kognitiv möglich gemacht hat.
      </DepthBox>

      <DepthBox variant="mistake" title='"Hand stärken" als pauschales Reha-Ziel'>
        Eine Hand, die zylindrisch perfekt greift, aber keinen
        Pinzettengriff zustande bringt, ist nicht „nicht stark genug" —
        sie hat ein <em>spezifisches</em> Defizit der intrinsischen
        Muskulatur und/oder feinen Cortex-Ansteuerung. Pauschales
        Greifkraft-Training (Handgrip-Trainer) verstärkt das
        <em>zylindrische</em> Muster und ignoriert das eigentliche
        Problem. Greifmuster-spezifische Übungen sind Pflicht.
      </DepthBox>

      <DepthBox variant="deeper" title="Intrinsisch vs. extrinsisch — und warum es wichtig ist">
        <ul>
          <li>
            <strong>Extrinsische Muskeln</strong> — entspringen im Unterarm,
            laufen als Sehnen in die Hand. Erzeugen Kraft und grobe
            Bewegung. Beuger (FDP, FDS) und Strecker.
          </li>
          <li>
            <strong>Intrinsische Muskeln</strong> — sitzen <em>innerhalb</em>
            der Hand (Lumbrikales, Interossei, Thenar/Hypothenar). Erzeugen
            die feinmotorische Differenzierung — jeden Finger einzeln zu
            steuern, Daumen zu opponieren.
          </li>
        </ul>
        Bei isolierter Schädigung des N. medianus (Karpaltunnel) sind
        bestimmte Intrinsika ausgefallen — Pinzettengriff weg, zylindrischer
        Griff erhalten. Genaue Funktionsdiagnostik sagt, wo zu trainieren ist.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Homunkulus (ein Viertel des Motorcortex steuert die Hand!),
        Bilaterale Integration (Werkzeug benutzen = dominante Hand führt,
        andere stabilisiert), MMC (bei feinmotorischen Griffen besonders
        wirksam, weil die intrinsische Muskulatur normalerweise unbewusst
        läuft).
      </DepthBox>
    </div>
  );
}
