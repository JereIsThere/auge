"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Pattern = "symmetrisch" | "reziprok" | "asymmetrisch";

const PATTERNS: Record<Pattern, { titel: string; beispiele: string[]; therapie: string }> = {
  symmetrisch: {
    titel: "Symmetrisch",
    beispiele: [
      "Klatschen",
      "Beide Hände auf dem Lenkrad",
      "Beidhändig eine Schüssel halten",
      "Beidhändig Wäsche aufhängen",
    ],
    therapie:
      "Einstiegspattern für Reha. Beide Hemisphären feuern synchron — die intakte hilft der betroffenen mit. Klassisch: bilateral arm training nach Schlaganfall.",
  },
  reziprok: {
    titel: "Reziprok (alternierend)",
    beispiele: [
      "Gehen (Arme schwingen gegenläufig)",
      "Schwimmen (Brustschwimmen-Armzug)",
      "Schlagzeug-Beats",
      "Krabbeln im Säuglingsalter",
    ],
    therapie:
      "Nächste Stufe nach symmetrischen Mustern. Erfordert dass beide Hemisphären sich abwechseln — gutes Diagnostik-Werkzeug für interhemisphärische Koordination.",
  },
  asymmetrisch: {
    titel: "Asymmetrisch (unterschiedlich)",
    beispiele: [
      "Schreiben (eine Hand schreibt, andere hält Papier)",
      "Klavierspielen (zwei verschiedene Melodien)",
      "Werkzeug benutzen (eine führt, andere stabilisiert)",
      "Schnürsenkel binden",
    ],
    therapie:
      "Höchste Stufe. Erfordert klare Rollenverteilung (dominante vs. unterstützende Hand). Endpunkt der bilateralen Reha — Voraussetzung für die meisten ADLs.",
  },
};

export default function BilateraleIntegration() {
  const [aktiv, setAktiv] = useState<Pattern>("symmetrisch");
  const p = PATTERNS[aktiv];

  return (
    <div className="lesson-card">
      <h2>Bilaterale Integration</h2>
      <p className="lesson-description">
        Zwei Hände — zwei Hirnhälften. Damit die zusammenspielen, müssen
        sie ständig über die <strong>Balken-Verbindung (Corpus Callosum)</strong>{" "}
        kommunizieren. Wenn diese Koordination klappt, kann man schreiben,
        Klavier spielen, oder einfach mit einer Hand etwas halten und mit
        der anderen schneiden. Wenn nicht, fühlt sich der Alltag wie ein
        endloses Stolpern an.
      </p>

      <div className="info-box">
        Bilaterale Integration entwickelt sich in der frühen Kindheit
        (0-6 Jahre) und festigt sich bis ~9 Jahre. Bei Kindern mit
        Entwicklungsverzögerung oder Aufmerksamkeitsstörungen ist sie
        oft auffällig — was sich in „ungeschickter Motorik" zeigt.
      </div>

      <h3>Drei Stufen der Komplexität</h3>
      <div className="input-group">
        <label>Bewegungsmuster wählen</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(PATTERNS) as Pattern[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setAktiv(id)}
              className="toggle-code"
              style={{
                background: aktiv === id ? "#eef2ff" : "transparent",
                borderColor: aktiv === id ? "#3b82f6" : "#d1d5db",
                color: aktiv === id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === id ? 700 : 500,
              }}
            >
              {PATTERNS[id].titel}
            </button>
          ))}
        </div>
      </div>

      {/* Visualisierung: zwei Hände mit Bewegungsrichtungen */}
      <svg
        viewBox="0 0 300 150"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          width: "100%",
          maxWidth: 320,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Linke Hand */}
        <circle cx="80" cy="75" r="22" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
        <text x="80" y="80" textAnchor="middle" fontSize="13" fontFamily="ui-monospace, monospace" fontWeight="bold" fill="white">L</text>

        {/* Rechte Hand */}
        <circle cx="220" cy="75" r="22" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
        <text x="220" y="80" textAnchor="middle" fontSize="13" fontFamily="ui-monospace, monospace" fontWeight="bold" fill="white">R</text>

        {/* Bewegungspfeile, abhängig vom Pattern */}
        {aktiv === "symmetrisch" && (
          <>
            <path d="M 80 50 L 80 30" stroke="#7c3aed" strokeWidth="3" markerEnd="url(#arrow-purple)" />
            <path d="M 220 50 L 220 30" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow-amber)" />
          </>
        )}
        {aktiv === "reziprok" && (
          <>
            <path d="M 80 50 L 80 30" stroke="#7c3aed" strokeWidth="3" markerEnd="url(#arrow-purple)" />
            <path d="M 220 100 L 220 125" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow-amber)" />
          </>
        )}
        {aktiv === "asymmetrisch" && (
          <>
            <path d="M 80 50 Q 60 30, 80 25" stroke="#7c3aed" strokeWidth="3" fill="none" markerEnd="url(#arrow-purple)" />
            <path d="M 198 75 L 175 75" stroke="#d97706" strokeWidth="3" markerEnd="url(#arrow-amber)" />
          </>
        )}

        {/* Corpus Callosum-Andeutung */}
        <path
          d="M 105 75 Q 150 60, 195 75"
          stroke="#6b7280"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3 3"
        />
        <text x="150" y="55" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="ui-monospace, monospace">
          Corpus Callosum
        </text>

        <defs>
          <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L4,3 z" fill="#7c3aed" />
          </marker>
          <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L4,3 z" fill="#d97706" />
          </marker>
        </defs>
      </svg>

      <div className="result-box">
        <div className="result-label">{p.titel}</div>
        <div style={{ marginTop: 8, fontSize: "0.88rem" }}>
          <strong>Beispiele:</strong>
          <ul style={{ marginTop: 4, paddingLeft: 18 }}>
            {p.beispiele.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            background: "#eef2ff",
            borderRadius: 6,
            fontSize: "0.88rem",
            color: "#1e3a8a",
          }}
        >
          <strong>Therapie-Konsequenz:</strong> {p.therapie}
        </div>
      </div>

      <DepthBox variant="why" title="Warum entwickelt sich das in dieser Reihenfolge?">
        Im Säuglingsalter ist das Corpus Callosum noch unreif —
        Myelinisierung dauert bis ~7-10 Jahre. Symmetrische Muster
        funktionieren früher (klatschen ab ~10 Mon.), weil sie weniger
        interhemisphärische Koordination brauchen. Reziprok kommt mit
        dem Krabbeln (~9-12 Mon.) und Gehen. Asymmetrisch (z.B.
        Schreiben mit Stützhand) braucht ~5-7 Jahre, weil die Hand-
        Dominanz erst stabil sein muss + das Corpus Callosum reif genug
        für entkoppelte Steuerung.
      </DepthBox>

      <DepthBox variant="mistake" title="Linkshändigkeit als Problem behandeln">
        Heute klar überholt — aber in älteren Kohorten noch relevant. Die
        erzwungene Umerziehung von Linkshändern auf rechts (bis in die
        1970er weit verbreitet) störte die bilaterale Integration
        nachhaltig. Symptom-Spektrum: Stottern, Lese-/Schreib-
        Schwierigkeiten, motorische Ungeschicklichkeit. Bei älteren
        Klient:innen mit „unklarem motorischem Profil" Schullaufbahn
        erfragen.
      </DepthBox>

      <DepthBox variant="deeper" title="Crossing the Midline">
        Eine spezifische Form der bilateralen Integration: kann eine
        Hand über die Körpermitte zur Gegenseite greifen? Klingt
        banal, ist aber ein kritischer Meilenstein in der
        Kinderentwicklung (~3-4 Jahre). Wenn ein Kind beim Schreiben
        oder Anziehen die Körpermitte vermeidet (Hand wechseln statt
        rübergreifen), ist das ein Hinweis auf gestörte bilaterale
        Integration. Therapie: gezielte Cross-Midline-Übungen
        (Diagonal-Bewegungen, beidseitiges Zeichnen).
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Sensorische Integration (gemeinsamer Boden in Ayres' Modell),
        Handdominanz (entwickelt sich parallel — bei stabiler
        Dominanz funktioniert bilaterale Integration besser),
        Schlaganfall-Reha (Bilateral Training nutzt die gesunde
        Hemisphäre als „Helferin").
      </DepthBox>
    </div>
  );
}
