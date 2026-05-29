"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Fokus = "external" | "leicht-internal" | "stark-internal";

const FOKUS_LABEL: Record<Fokus, { titel: string; beispiel: string }> = {
  "external": {
    titel: "External Focus",
    beispiel: "Drücke die Hantel nach oben. (Aufmerksamkeit liegt auf dem Objekt bzw. Effekt)",
  },
  "leicht-internal": {
    titel: "Leicht internal",
    beispiel: "Hebe deinen Arm gerade nach oben. (Bewegung beschrieben, kein Muskel benannt)",
  },
  "stark-internal": {
    titel: "Stark internal (MMC)",
    beispiel: "Spüre, wie der Bizeps sich zusammenzieht, während der Arm sich beugt.",
  },
};

// Vereinfachtes EMG-Modell: stark-internal Fokus erhöht die
// Aktivierung des Zielmuskels (Bizeps) UND reduziert die
// Aktivierung des Antagonisten / Synergisten (Trizeps, Schulter).
// Basis: Calatayud, Schoenfeld u.a.
function emgAktivitaet(fokus: Fokus, last: number): {
  ziel: number;
  antagonist: number;
  synergist: number;
} {
  // Last: 0..100 (% der Maximallast). Niedrige Last → MMC-Effekt größer.
  const lastFactor = Math.max(0.4, 1 - last / 150);

  switch (fokus) {
    case "external":
      return {
        ziel: 55 + last * 0.3,
        antagonist: 20 + last * 0.08,
        synergist: 35 + last * 0.2,
      };
    case "leicht-internal":
      return {
        ziel: 62 + last * 0.27,
        antagonist: 18 + last * 0.08,
        synergist: 32 + last * 0.2,
      };
    case "stark-internal":
      return {
        ziel: 65 + last * 0.25 + 15 * lastFactor,
        antagonist: 13 + last * 0.06,
        synergist: 24 + last * 0.18,
      };
  }
}

function balken(label: string, prozent: number, farbe: string) {
  const v = Math.min(100, Math.max(0, prozent));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace, monospace", fontSize: "0.78rem" }}>
      <span style={{ width: 90 }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: 14,
          background: "#e5e7eb",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${v}%`,
            height: "100%",
            background: farbe,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span style={{ width: 42, textAlign: "right" }}>{v.toFixed(0)} %</span>
    </div>
  );
}

export default function MindMuscleConnection() {
  const [fokus, setFokus] = useState<Fokus>("stark-internal");
  const [last, setLast] = useState(40);

  const emg = useMemo(() => emgAktivitaet(fokus, last), [fokus, last]);
  const info = FOKUS_LABEL[fokus];

  // Effizienz = Ziel-Aktivierung relativ zur Gesamtaktivierung
  const gesamt = emg.ziel + emg.antagonist + emg.synergist;
  const effizienz = gesamt === 0 ? 0 : (emg.ziel / gesamt) * 100;

  return (
    <div className="lesson-card">
      <h2>Mind-Muscle-Connection</h2>
      <p className="lesson-description">
        Wenn man <em>denkt</em>, welcher Muskel sich gerade zusammenzieht,
        feuert dieser tatsächlich messbar stärker. Das ist keine
        Bro-Science — EMG-Studien zeigen es seit den 2000ern. In der
        Ergotherapie ist das das neuronale Argument hinter sehr vielen
        Übungs-Settings.
      </p>

      <div className="info-box">
        <strong>Verbal cuing</strong> in der Therapie heißt nichts anderes,
        als die Aufmerksamkeit gezielt zu lenken: external (auf das Objekt),
        internal (auf den Körper) oder stark internal (auf einen spezifischen
        Muskel). Die Wahl verändert messbar, was aktiv wird.
      </div>

      <div className="input-group">
        <label>Aufmerksamkeits-Fokus</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(FOKUS_LABEL) as Fokus[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFokus(id)}
              className="toggle-code"
              style={{
                background: fokus === id ? "#eef2ff" : "transparent",
                borderColor: fokus === id ? "#3b82f6" : "#d1d5db",
                color: fokus === id ? "#1d4ed8" : "#374151",
                fontWeight: fokus === id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {FOKUS_LABEL[id].titel}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Last (% des Maximums): {last} %</label>
        <input
          type="range"
          min={10}
          max={95}
          step={5}
          value={last}
          onChange={(e) => setLast(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="info-box" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
        Beispiel-Anweisung: {info.beispiel}
      </div>

      <div className="result-box">
        <div className="result-label">Geschätzte EMG-Aktivierung (Armcurl-Beispiel)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {balken("Bizeps (Ziel)", emg.ziel, "#10b981")}
          {balken("Trizeps (Antagonist)", emg.antagonist, "#dc2626")}
          {balken("Schulter (Synergist)", emg.synergist, "#a78bfa")}
        </div>
        <div style={{ marginTop: 12, fontSize: "0.82rem", color: "#374151" }}>
          <strong>Ziel-Effizienz</strong>: {effizienz.toFixed(0)} % der
          Aktivierung geht in den eigentlich gemeinten Muskel.
        </div>
      </div>

      <DepthBox variant="why" title="Warum funktioniert Aufmerksamkeit so?">
        Es gibt zwei Erklärungen, die nebeneinander stehen können:
        <ol>
          <li>
            <strong>Erhöhter kortikaler Drive</strong>: bewusste
            Aufmerksamkeit aktiviert zusätzliche Bereiche im präfrontalen
            Cortex, die die Motoneuron-Aktivierung im Rückenmark verstärken.
          </li>
          <li>
            <strong>Hemmung der Synergisten</strong>: durch den Fokus auf
            <em>einen</em> Muskel werden umgebende „Helfer" weniger
            mit-rekrutiert — die Bewegung wird selektiver.
          </li>
        </ol>
        Beides zusammen erklärt, warum MMC bei niedriger Last besser
        funktioniert als bei Maximallast.
      </DepthBox>

      <DepthBox variant="mistake" title="MMC bei jeder Übung erzwingen">
        Bei <strong>hoher Last</strong> (über ~80 % 1RM) lässt sich
        Aufmerksamkeit nicht mehr fein lenken — das ZNS schaltet auf
        external focus um (Survival-Modus, „bewege das Gewicht!"). Hier
        bringt MMC kaum noch was. Faustregel: MMC bei moderater Last
        (40–70 %), bei Hypertrophie-Training. Bei Max-Kraft- oder
        Schnellkraft-Übungen: external focus, klare Zielbewegung.
      </DepthBox>

      <DepthBox variant="deeper" title="Was die EMG-Studien zeigen">
        Schoenfeld et al. (2018) und mehrere Folgestudien fanden bei
        Untrainierten ~10–15 % höhere Ziel-Muskel-Aktivierung bei
        internal focus, bei Erfahrenen sogar ~20 %+. Calatayud et al.
        zeigten, dass nur ein verbaler Cue („spüre den Brustmuskel")
        die Pectoralis-Aktivität beim Bankdrücken signifikant steigert —
        ohne dass die Person bewusst etwas an der Ausführung ändert.
        Effektgröße ist real, aber bei externen Bewegungszielen
        (Treffsicherheit, Schnelligkeit) tatsächlich umgekehrt: external
        focus gewinnt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Motor Imagery (mentales Üben ohne Bewegung — selber Mechanismus,
        nur ohne motorische Output-Stufe), CIMT (Constraint-Induced
        Movement Therapy — zwingt Aufmerksamkeit auf die schwache Seite),
        und Biofeedback (technisch unterstützte MMC — EMG-Visualisierung
        in Echtzeit).
      </DepthBox>
    </div>
  );
}
