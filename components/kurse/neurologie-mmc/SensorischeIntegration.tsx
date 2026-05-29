"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Sinn = {
  id: string;
  name: string;
  icon: string;
  beschreibung: string;
  klinik: string;
};

const SINNE: Sinn[] = [
  {
    id: "visuell",
    name: "Visuell",
    icon: "👁",
    beschreibung: "Bilder, Bewegung, Farbe, Tiefe. Etwa 50% aller sensorischen Daten im Cortex.",
    klinik: "Dominiert oft die anderen. Bei sensorischer Überforderung Augen schließen lassen — entlastet sofort.",
  },
  {
    id: "auditiv",
    name: "Auditiv",
    icon: "👂",
    beschreibung: "Tonhöhe, Lautstärke, Richtung, Sprache. Reicht weit in den Hintergrund.",
    klinik: "Hintergrundgeräusche stören bei sensorischer Verarbeitungsstörung enorm. Quiet space als therapeutisches Setting.",
  },
  {
    id: "taktil",
    name: "Taktil (Tast)",
    icon: "✋",
    beschreibung: "Druck, Vibration, Schmerz, Temperatur, Textur. Über die ganze Hautoberfläche verteilt.",
    klinik: "Sehr individuell — manche brauchen viel taktilen Input (sensory seeking), andere meiden ihn (sensory avoiding). Pflicht-Screening in der Pädiatrie.",
  },
  {
    id: "olfaktorisch",
    name: "Olfaktorisch",
    icon: "👃",
    beschreibung: "Geruch. Direkter Weg ins limbische System — daher starke emotionale Komponente.",
    klinik: "Selten im Therapiefokus, aber bei Demenz-Reha unerwartet wirksam (Duft-Erinnerungen).",
  },
  {
    id: "gustatorisch",
    name: "Gustatorisch",
    icon: "👅",
    beschreibung: "Geschmack — süß, salzig, sauer, bitter, umami. Eng mit Geruch gekoppelt.",
    klinik: "Relevanter Bereich bei Dysphagie und Aphasie-Reha.",
  },
  {
    id: "propriozeptiv",
    name: "Propriozeptiv",
    icon: "🤲",
    beschreibung: "Wo ist mein Körper im Raum? Wie stehen meine Gelenke? Eigene Lektion gewidmet.",
    klinik: "Wenn gestört: Person muss visuell ersetzen. Tappendes Gehen, ungeschickter Schriftzug.",
  },
  {
    id: "vestibulaer",
    name: "Vestibulär",
    icon: "⚖️",
    beschreibung: "Gleichgewicht und Lage im Raum. Bogengänge + Otolithen im Innenohr.",
    klinik: "Vestibuläre Reha bei Schwindel/Sturzangst. Auch bei sensory processing oft mit-betroffen.",
  },
];

const PROBLEME = [
  {
    titel: "Sensory Modulation Disorder",
    untertitel: "über- oder untererregbar",
    beschreibung:
      "Reize werden als zu intensiv (over-responsive) oder zu schwach (under-responsive) verarbeitet. Klassisch: Kind kann Etiketten in T-Shirts nicht aushalten, oder sucht ständig harte Stimulation (Drücken, Klopfen).",
  },
  {
    titel: "Sensory Discrimination Disorder",
    untertitel: "Reize nicht differenziert wahrnehmen",
    beschreibung:
      "Kann zwei ähnliche Reize nicht unterscheiden (Münze von Knopf in der Hosentasche; Schnipsen von links/rechts). Macht Feinmotorik unzuverlässig.",
  },
  {
    titel: "Sensory-Based Motor Disorder",
    untertitel: "Bewegung leidet unter Sensorik-Problemen",
    beschreibung:
      "Dyspraxie (kann neue Bewegungssequenzen schlecht lernen) oder posturale Störung (kann nicht ruhig sitzen oder stehen). Beides sekundär — die Sensorik liefert keine verwertbare Basis.",
  },
];

export default function SensorischeIntegration() {
  const [aktiv, setAktiv] = useState<string>("propriozeptiv");
  const s = SINNE.find((x) => x.id === aktiv)!;

  return (
    <div className="lesson-card">
      <h2>Sensorische Integration</h2>
      <p className="lesson-description">
        Das ZNS bekommt sieben Sensorik-Strömungen gleichzeitig — und muss
        sie zu einem einheitlichen Bild fusionieren. Wenn diese{" "}
        <strong>Integration</strong> klappt, fühlt sich Alltag normal an.
        Wenn sie hakt, ist <em>jede</em> einzelne Aktion anstrengend, weil
        das Gehirn die Daten erst mühsam sortieren muss.
      </p>

      <div className="info-box">
        Konzept geht auf <strong>A. Jean Ayres</strong> zurück (Ergotherapeutin,
        1970er). Sensorische Integration ist heute Standard-Rahmen in der
        pädiatrischen Ergo, zunehmend auch in der Erwachsenen-Reha.
      </div>

      <h3>Die sieben Sinne</h3>
      <div className="input-group">
        <label>Wähl einen Sinn</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SINNE.map((sn) => (
            <button
              key={sn.id}
              type="button"
              onClick={() => setAktiv(sn.id)}
              className="toggle-code"
              style={{
                background: aktiv === sn.id ? "#eef2ff" : "transparent",
                borderColor: aktiv === sn.id ? "#3b82f6" : "#d1d5db",
                color: aktiv === sn.id ? "#1d4ed8" : "#374151",
                fontWeight: aktiv === sn.id ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {sn.icon} {sn.name}
            </button>
          ))}
        </div>
      </div>

      <div className="result-box">
        <div className="result-label">
          {s.icon} {s.name}
        </div>
        <div style={{ marginTop: 8, fontSize: "0.92rem", color: "#374151" }}>
          {s.beschreibung}
        </div>
        <div style={{ marginTop: 8, padding: "8px 12px", background: "#eef2ff", borderRadius: 6, fontSize: "0.88rem", color: "#1e3a8a" }}>
          <strong>Klinisch:</strong> {s.klinik}
        </div>
      </div>

      <h3>Drei Hauptstörungsmuster</h3>
      <ol className="step-list">
        {PROBLEME.map((p) => (
          <li key={p.titel}>
            <strong>{p.titel}</strong>{" "}
            <span style={{ color: "#6b7280", fontStyle: "italic" }}>
              — {p.untertitel}
            </span>
            <div style={{ marginTop: 4, fontSize: "0.88rem" }}>
              {p.beschreibung}
            </div>
          </li>
        ))}
      </ol>

      <DepthBox variant="why" title="Warum klappt manchen Kindern Lernen einfach nicht?">
        Wenn das Hirn sensorische Reize nicht effizient integriert, geht
        ein Großteil der Aufmerksamkeit in die Verarbeitung — kein Raum
        mehr für höhere Aufgaben wie Lernen, Sprechen, Sozial-Interaktion.
        Ein Kind, das in der Schule still und ruhig sitzen <em>muss</em>,
        obwohl es vestibuläre/propriozeptive Stimulation braucht, ist 90 %
        damit beschäftigt, nicht zu zappeln. Die 10 % Restkapazität reichen
        nicht für Mathematik.
      </DepthBox>

      <DepthBox variant="mistake" title='"Mehr Reize = mehr Stimulation = besser"'>
        Falsch. Die richtige Dosis hängt vom Profil ab. Ein over-responsives
        Kind in einer Reizüberflutung wird Meltdowns produzieren, nicht
        besser lernen. Klassisches Therapie-Setting: <em>gerade so viel
        Stimulation, dass die Verarbeitungsgrenze erweitert wird, ohne
        sie zu überschreiten</em>. Just-right Challenge.
      </DepthBox>

      <DepthBox variant="deeper" title="Sensorische Diät">
        Standard-Werkzeug der Ergotherapie für Klienten mit
        Verarbeitungsstörungen: ein über den Tag verteilter Plan
        bestimmter sensorischer Inputs (z.B. Trampolin-Springen vor
        Schulanfang, Gewichtsweste während Hausaufgaben, ruhiger Raum
        nach Mittagessen). Genau wie eine Ernährungs-Diät — aber für die
        Sinne. Kein One-size-fits-all, individuell zugeschnitten.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Propriozeption (einer der sieben Sinne), Bilaterale Integration
        (verbindet sensorische Daten beider Körperhälften), und
        ADHS/Autismus-Spektrum (sensorische Verarbeitungsprofile sind
        oft mit-betroffen — Ergo ist hier wichtiger Therapiebaustein).
      </DepthBox>
    </div>
  );
}
