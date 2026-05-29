"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Phase = "kognitiv" | "assoziativ" | "autonom";

const PHASEN: { id: Phase; titel: string; dauer: string; merkmale: string[]; therapie: string }[] = [
  {
    id: "kognitiv",
    titel: "Phase 1 — Kognitiv",
    dauer: "Tage bis wenige Wochen",
    merkmale: [
      "Bewusstes Nachdenken bei jedem Schritt",
      "Viele Fehler, Korrekturen via Selbstkommentar",
      "Hohe kortikale Aktivität (präfrontal, prämotorisch)",
      "Erschöpft schnell — Konzentration ist anstrengend",
    ],
    therapie:
      "Klare verbale Anweisung, eine Sache zur Zeit, viel Wiederholung mit Feedback. Anfänger:innen können nicht 3 Hinweise gleichzeitig umsetzen — also nicht versuchen.",
  },
  {
    id: "assoziativ",
    titel: "Phase 2 — Assoziativ",
    dauer: "Wochen bis Monate",
    merkmale: [
      "Grobform der Bewegung sitzt, Feinheiten werden geschliffen",
      "Weniger Fehler, schnellere Korrekturen",
      "Variabilität sinkt — die Bewegung wird konsistenter",
      "Aufmerksamkeit kann teilweise auf andere Sachen gehen",
    ],
    therapie:
      "Variabilität gezielt einführen (verschiedene Tassen-Größen, verschiedene Tisch-Höhen). Selbstkorrektur fördern statt jede Bewegung kommentieren. Schwierigkeit langsam steigern.",
  },
  {
    id: "autonom",
    titel: "Phase 3 — Autonom",
    dauer: "Monate bis Jahre — oft nie 100%",
    merkmale: [
      "Bewegung läuft automatisch, kaum kortikale Beteiligung",
      "Dual-Task möglich (gehen + sprechen, schreiben + nachdenken)",
      "Subkortikal organisiert (Kleinhirn, Basalganglien)",
      "Bei Stress oder Müdigkeit fällt man teilweise auf Phase 2 zurück",
    ],
    therapie:
      "Übertragen in Alltagskontexte. Dual-Task-Training (Aufgabe + Ablenkung). Cave: auf dieser Stufe ist explizite Korrektur kontraproduktiv — automatische Bewegung wird durch bewusste Aufmerksamkeit gestört.",
  },
];

export default function MotorischesLernen() {
  const [aktiv, setAktiv] = useState<Phase>("kognitiv");
  const p = PHASEN.find((x) => x.id === aktiv)!;

  return (
    <div className="lesson-card">
      <h2>Motorisches Lernen — die drei Phasen</h2>
      <p className="lesson-description">
        Jede neue Bewegung — sei es Schuhebinden, Klavierspielen, oder das
        Wiedererlernen einer Hand-Greif-Funktion nach Schlaganfall — läuft
        durch drei Phasen. Wer weiß, in welcher Phase ein:e Klient:in steckt,
        weiß auch, welche Intervention jetzt sinnvoll ist.
      </p>

      <div className="info-box">
        Modell von <strong>Fitts &amp; Posner (1967)</strong>. Bis heute der
        Standard-Rahmen in Motor-Learning-Forschung und Ergo/Physio-Reha.
      </div>

      <div className="input-group">
        <label>Phase wählen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PHASEN.map((ph) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => setAktiv(ph.id)}
              className="toggle-code"
              style={{
                background: aktiv === ph.id ? "#eef2ff" : "transparent",
                borderColor: aktiv === ph.id ? "#3b82f6" : "#d1d5db",
                color: aktiv === ph.id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === ph.id ? 700 : 500,
              }}
            >
              {ph.titel}
            </button>
          ))}
        </div>
      </div>

      {/* Phasen-Visualisierung als Stufendiagramm */}
      <svg
        viewBox="0 0 320 120"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          width: "100%",
          height: 130,
        }}
      >
        {PHASEN.map((ph, i) => {
          const x = 30 + i * 90;
          const istAktiv = ph.id === aktiv;
          return (
            <g
              key={ph.id}
              onClick={() => setAktiv(ph.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={20 + (2 - i) * 18}
                width={80}
                height={70 + i * 18}
                fill={istAktiv ? "#3b82f6" : "#a5b4fc"}
                opacity={istAktiv ? 1 : 0.55}
                rx={6}
              />
              <text x={x + 40} y={35 + (2 - i) * 18} textAnchor="middle" fontSize="9" fill="white" fontFamily="ui-monospace, monospace" fontWeight="bold">
                Phase {i + 1}
              </text>
              <text x={x + 40} y={48 + (2 - i) * 18} textAnchor="middle" fontSize="9" fill="white" fontFamily="ui-monospace, monospace">
                {ph.id}
              </text>
            </g>
          );
        })}
        <text x="160" y="110" textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="ui-monospace, monospace">
          Zeit + Wiederholung →
        </text>
      </svg>

      <div className="result-box" style={{ borderLeft: "3px solid #3b82f6" }}>
        <div className="result-label">
          {p.titel}
          <span style={{ marginLeft: 10, fontWeight: 400, opacity: 0.7 }}>· {p.dauer}</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <strong style={{ fontSize: "0.85rem", color: "#374151" }}>Merkmale:</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: "0.88rem" }}>
            {p.merkmale.map((m, i) => (
              <li key={i} style={{ marginBottom: 3 }}>{m}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            background: "#eff6ff",
            borderRadius: 6,
            fontSize: "0.88rem",
            color: "#1e3a8a",
          }}
        >
          <strong>Therapie-Konsequenz:</strong> {p.therapie}
        </div>
      </div>

      <DepthBox variant="why" title="Warum verändert sich was im Hirn pro Phase?">
        In Phase 1 sind <em>präfrontaler Cortex</em> + <em>prämotorischer
        Cortex</em> stark aktiv (bewusste Steuerung). In Phase 2 wandert
        die Last in den <em>primären Motorcortex</em>. In Phase 3 übernehmen
        <em>Kleinhirn</em> und <em>Basalganglien</em> — die automatisierenden
        Strukturen. fMRT-Studien zeigen das schön: das gesamte Hirn-
        Aktivierungsmuster wandert über Wochen vom Frontalhirn nach hinten
        und unten.
      </DepthBox>

      <DepthBox variant="mistake" title='"Mehr Hinweise = besseres Feedback"'>
        Klassischer Fehler vor allem in Phase 1: Therapeut:in sagt
        gleichzeitig „Schulter runter, Ellbogen näher am Körper, langsam
        ausatmen, Hand entspannen". Der/die Klient:in kann nichts davon
        umsetzen. <strong>Faustregel</strong>: <em>ein</em> Hinweis pro
        Wiederholung. Wenn der sitzt, dann der nächste. Mehr Information ist
        in Phase 1 schädlich.
      </DepthBox>

      <DepthBox variant="deeper" title="Bernstein-Stufen — eine Variante">
        Der russische Bewegungsforscher Nicolai Bernstein beschrieb dasselbe
        anders: in Stufe 1 versucht das System, alle „Freiheitsgrade" (Joints
        und Muskeln) zu <em>fixieren</em>, um die Bewegung zu vereinfachen
        (= steife, hölzerne Bewegung). In Stufe 2 werden Freiheitsgrade
        wieder freigegeben (= flexibler). In Stufe 3 werden sie <em>genutzt</em>
        (= elegant und energie-effizient). Die Beobachtung „Bewegung wird
        weicher" über die Reha-Zeit erklärt genau das.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Neuroplastizität (jede Phase entspricht einer anderen
        Plastizitäts-Form), MMC (in Phase 1 bewusst, in Phase 3 stört es),
        und Dual-Task-Training (echter Test für Phase 3 ist: kann die
        Person die Bewegung machen UND etwas anderes gleichzeitig?).
      </DepthBox>
    </div>
  );
}
