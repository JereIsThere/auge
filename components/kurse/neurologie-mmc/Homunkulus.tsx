"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Region = {
  id: string;
  name: string;
  /** Anteil der Cortex-Fläche (Penfield-Annäherung). */
  cortexAnteil: number;
  /** Anteil am Körper (in cm² Oberfläche, sehr grob). */
  koerperAnteil: number;
  /** Position auf dem motorischen Cortex (0..1, Apex zur Mitte). */
  cortexX: number;
  cortexY: number;
  beschreibung: string;
  klinisch: string;
};

const REGIONEN: Region[] = [
  {
    id: "hand",
    name: "Hand & Finger",
    cortexAnteil: 25,
    koerperAnteil: 2,
    cortexX: 0.42,
    cortexY: 0.45,
    beschreibung:
      "Massive Cortex-Repräsentation für die feinmotorische Steuerung von 27 Knochen, 34 Muskeln und Tausenden taktilen Rezeptoren.",
    klinisch:
      "Handtherapie ist neurologisch ein extrem hoher Hebel — jede Handübung beansprucht ein Viertel des Motorcortex. Genau deshalb funktioniert Spiegeltherapie nach Schlaganfall.",
  },
  {
    id: "gesicht",
    name: "Gesicht & Lippen",
    cortexAnteil: 20,
    koerperAnteil: 0.5,
    cortexX: 0.34,
    cortexY: 0.55,
    beschreibung:
      "Mimik, Sprechen, Kauen, Schlucken. Vergleichbar groß wie die Hand-Region — Sprechen ist neurologisch eine extreme Feinmotorik-Leistung.",
    klinisch:
      "Logopädie und orofaciale Therapie nutzen genau diese kortikale Reserve. Auch Dysphagie-Therapie ist motorisches Üben über den Cortex.",
  },
  {
    id: "zunge",
    name: "Zunge",
    cortexAnteil: 10,
    koerperAnteil: 0.2,
    cortexX: 0.3,
    cortexY: 0.62,
    beschreibung:
      "Eigene große Region. Zunge ist motorisch komplex (Sprache, Schlucken, Tasten).",
    klinisch:
      "Bei Aphasie- und Dysphagie-Reha relevant. Zungenmobilitätsübungen aktivieren überraschend großen Cortex-Anteil.",
  },
  {
    id: "rumpf",
    name: "Rumpf",
    cortexAnteil: 8,
    koerperAnteil: 35,
    cortexX: 0.62,
    cortexY: 0.3,
    beschreibung:
      "Riesig am Körper, klein im Cortex. Posturale Kontrolle ist eher subkortikal organisiert (Kleinhirn, Hirnstamm).",
    klinisch:
      "Stabilitätstraining wirkt weniger über willkürliche Steuerung, mehr über automatische Reflexbahnen. Schwerpunkt-Verlagerungs-Übungen.",
  },
  {
    id: "arm",
    name: "Arm & Schulter",
    cortexAnteil: 12,
    koerperAnteil: 8,
    cortexX: 0.5,
    cortexY: 0.4,
    beschreibung:
      "Mittlere Größe. Schulter ist beweglichstes Gelenk des Körpers, braucht entsprechend differenzierte Steuerung.",
    klinisch:
      "Reaching-Übungen koppeln Arm- und Hand-Region — gutes Reha-Pattern, weil zwei große Cortex-Areale gleichzeitig.",
  },
  {
    id: "bein",
    name: "Bein & Fuß",
    cortexAnteil: 15,
    koerperAnteil: 32,
    cortexX: 0.78,
    cortexY: 0.18,
    beschreibung:
      "Liegt ganz oben am Cortex, fast an der Großhirnfalte (Falx). Im Verhältnis zur Körpergröße eher schmal repräsentiert.",
    klinisch:
      "Gangtraining wird eher über Wiederholung und automatisierte Muster geübt als über bewusste Einzelmuskel-Kontrolle.",
  },
];

const W = 480;
const H = 320;

export default function Homunkulus() {
  const [aktiv, setAktiv] = useState<Region>(REGIONEN[0]);

  return (
    <div className="lesson-card">
      <h2>Der motorische Homunkulus</h2>
      <p className="lesson-description">
        Wenn man den Motorcortex auf die Körperteile abbildet, die er
        steuert — proportional zur kortikalen Fläche — kommt eine groteske
        Figur heraus: <strong>riesige Hand, riesiges Gesicht, winziger
        Rumpf</strong>. Genau diese Verzerrung ist der Schlüssel zu vielem,
        was in der Reha funktioniert.
      </p>

      <div className="info-box">
        Klick eine Körperregion an — du siehst, wie viel Hirnfläche sie
        bekommt und was das für die Therapie bedeutet.
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: "100%",
          maxWidth: W,
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          display: "block",
          margin: "0 auto",
        }}
      >
        {/* Schädel-Kontur (vereinfacht) */}
        <path
          d="M 60 200 Q 60 60, 240 50 Q 420 60, 420 200 Q 420 240, 410 260 L 370 270 L 350 260 Q 240 280, 130 260 L 110 270 L 70 260 Q 60 240, 60 200 Z"
          fill="#e0e8f0"
          stroke="#6b7280"
          strokeWidth="1.5"
        />
        {/* Sulcus centralis (motorischer Cortex liegt davor) */}
        <line
          x1="240"
          y1="40"
          x2="240"
          y2="270"
          stroke="#6b7280"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <text x="246" y="50" fontSize="9" fill="#6b7280" fontFamily="ui-monospace, monospace">
          Sulcus centralis
        </text>
        <text x="100" y="35" fontSize="10" fill="#1d4ed8" fontFamily="ui-monospace, monospace" fontWeight="bold">
          Motorcortex →
        </text>
        <text x="265" y="35" fontSize="10" fill="#7c3aed" fontFamily="ui-monospace, monospace" fontWeight="bold">
          ← Sensorischer Cortex
        </text>

        {/* Regionen-Marker am Cortex (links = motorisch) */}
        {REGIONEN.map((r) => {
          const cx = 60 + r.cortexX * 180; // linker Bereich (Motor)
          const cy = 80 + r.cortexY * 180;
          const rad = 6 + r.cortexAnteil * 0.6;
          const istAktiv = r.id === aktiv.id;
          return (
            <g
              key={r.id}
              onClick={() => setAktiv(r)}
              style={{ cursor: "pointer" }}
            >
              {istAktiv && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={rad + 4}
                  fill="#3b82f6"
                  opacity={0.25}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={rad}
                fill={istAktiv ? "#3b82f6" : "#6366f1"}
                stroke="white"
                strokeWidth={1.5}
                opacity={istAktiv ? 1 : 0.75}
              />
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fill="white"
                fontWeight="bold"
                style={{ pointerEvents: "none" }}
              >
                {r.name.split(" ")[0].slice(0, 3)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Vergleichs-Balken: Cortex vs. Körper */}
      <div className="result-box" style={{ marginTop: 12 }}>
        <div className="result-label">
          {aktiv.name} — Cortex vs. Körper-Größe
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace, monospace", fontSize: "0.82rem" }}>
            <span style={{ width: 110 }}>Cortex-Anteil</span>
            <div style={{ flex: 1, height: 14, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${aktiv.cortexAnteil * 2.5}%`, height: "100%", background: "#3b82f6" }} />
            </div>
            <span style={{ width: 50, textAlign: "right" }}>~{aktiv.cortexAnteil} %</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace, monospace", fontSize: "0.82rem" }}>
            <span style={{ width: 110 }}>Körper-Anteil</span>
            <div style={{ flex: 1, height: 14, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${aktiv.koerperAnteil * 2.5}%`, height: "100%", background: "#10b981" }} />
            </div>
            <span style={{ width: 50, textAlign: "right" }}>~{aktiv.koerperAnteil} %</span>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: "0.88rem", color: "#374151", lineHeight: 1.55 }}>
          <strong>Beschreibung:</strong> {aktiv.beschreibung}
        </div>
        <div style={{ marginTop: 8, fontSize: "0.88rem", color: "#1e40af", lineHeight: 1.55 }}>
          <strong>Therapie-Relevanz:</strong> {aktiv.klinisch}
        </div>
      </div>

      <DepthBox variant="why" title="Wie wurde der Homunkulus überhaupt vermessen?">
        Wilder Penfield reizte in den 1940ern bei wachen Hirnoperationen
        (Epilepsie-Patient:innen) verschiedene Cortex-Stellen elektrisch
        und fragte: „Was spürst du gerade?" oder beobachtete welche Muskeln
        zucken. Daraus entstand die berühmte Karte. Heute geht das
        nicht-invasiv mit fMRT oder TMS — die Kartierung ist seitdem
        präzisiert, das Grundbild stimmt aber.
      </DepthBox>

      <DepthBox variant="mistake" title="Der Homunkulus ist nicht statisch">
        Lange galt: jede Körperregion hat einen festen Cortex-Bereich.
        Falsch. Die Karte ist <strong>plastisch</strong>: bei Profi-
        Geigerspieler:innen ist die Cortex-Region für die linke Hand
        (Griffhand) deutlich vergrößert. Bei Amputation übernimmt
        benachbartes Gewebe den verwaisten Bereich (häufig: Hand-Bereich
        wird von Gesicht überlagert — daher die berühmten Phantom-
        Empfindungen bei Berührung der Wange). In der Reha nutzt man
        diese Plastizität gezielt: <em>was du übst, wächst</em>.
      </DepthBox>

      <DepthBox variant="deeper" title="Warum genau Hand und Gesicht so groß?">
        Evolutionäres Argument: Werkzeugnutzung (Hand) und Kommunikation
        (Gesicht, Zunge) waren die zwei großen menschlichen Anpassungs-
        vorteile. Selektion bevorzugte über Jahrmillionen Gehirne mit
        feinerer Steuerung in genau diesen Bereichen. Konsequenz: Hand
        und Mund werden mit deutlich mehr Motoneuronen pro Quadratzentimeter
        Körperoberfläche versorgt als Rumpf oder Bein — was die
        Cortex-Repräsentation eins zu eins widerspiegelt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Neuroplastizität (warum gezielte Übung den Cortex umgestaltet),
        CIMT (Constraint-Induced Movement Therapy — die gesunde Hand
        wird mit einer Schiene blockiert, damit die betroffene Hand mehr
        Cortex-Reorganisation auslöst), Spiegeltherapie (visuelle
        Täuschung aktiviert Cortex-Bereiche der unbeweglichen Hand).
      </DepthBox>
    </div>
  );
}
