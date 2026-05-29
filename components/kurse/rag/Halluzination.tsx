"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Fall = {
  titel: string;
  symptom: string;
  beispiel: { frage: string; kontext: string; antwort: string };
  ursache: string;
  fix: string;
};

const FAELLE: Fall[] = [
  {
    titel: "Kontext lügt — Modell glaubt es",
    symptom: "Antwort übernimmt Falsches aus einem veralteten oder fehlerhaften Dokument 1:1.",
    beispiel: {
      frage: "Welche Version von PostgreSQL unterstützt JSON Path?",
      kontext: "[veralteter Wiki-Artikel von 2018] PostgreSQL unterstützt JSON Path ab Version 11.",
      antwort: '"PostgreSQL unterstützt JSON Path seit Version 11."',
    },
    ursache:
      "Das LLM kann nicht beurteilen, ob der Kontext aktuell oder korrekt ist — es vertraut ihm blind.",
    fix: "Datums-Metadaten + Filter; Quellen-Qualität im Pre-Processing prüfen; bei wichtigen Themen mehrere Quellen abgleichen.",
  },
  {
    titel: "Kein Kontext passt — Modell halluziniert trotzdem",
    symptom:
      "Retrieval liefert nichts wirklich Relevantes, aber das Modell improvisiert eine selbstsichere Antwort.",
    beispiel: {
      frage: "Wer hat den Auge-Quellcode 2023 reviewed?",
      kontext: "[keine relevanten Treffer; Top-Chunks sind über Auge allgemein]",
      antwort: '"Der Code wurde von der Senior-Entwicklerin Maria Müller reviewed." (frei erfunden)',
    },
    ursache:
      "Das Modell ist auf Hilfsbereitschaft trainiert. Wenn der Kontext nicht reicht, füllt es Lücken mit Plausibilität.",
    fix:
      'Explizite Anweisung im System-Prompt: „Sage \'Ich weiß es nicht\', wenn der Kontext nicht antwortet." + niedrige Temperatur.',
  },
  {
    titel: "Mehrhopfen-Frage scheitert lautlos",
    symptom:
      "Frage braucht Kombination aus mehreren Dokumenten; Retrieval bringt nur eines, Antwort wirkt aber komplett.",
    beispiel: {
      frage: "Wer in unserem Team arbeitete sowohl an Projekt X als auch Y?",
      kontext: "[holt nur das Projekt-X-Doc] X-Team: Anna, Ben, Clara…",
      antwort: '"Anna hat an beiden gearbeitet." (Y-Doc nie gesehen)',
    },
    ursache:
      "Embedding-Suche findet keine Schnittmengen über Dokumente. Sie sucht eine einzelne ähnliche Passage.",
    fix:
      "Query in Sub-Queries zerlegen (Query Decomposition); strukturierte Daten in einer DB-Spalte, nicht im Embedding.",
  },
  {
    titel: "Quellen-Halluzination",
    symptom: "Antwort gibt Quellen [1] [2] [3] an — aber die Aussagen stehen so nicht in den Dokumenten.",
    beispiel: {
      frage: "Was kostet das Premium-Plan?",
      kontext: "[1] Wir bieten verschiedene Pläne… [2] Premium hat erweiterte Features… [3] Pricing wird quartalsweise aktualisiert.",
      antwort: '"Premium kostet 29 €/Monat [2]." (nirgends erwähnt)',
    },
    ursache:
      "Modell setzt Citation-Marker nach Gefühl, nicht nach Fakt. Citation ist ein Token wie jedes andere.",
    fix:
      "Post-hoc-Validation: jede Aussage in der Antwort gegen die zitierte Quelle prüfen (z.B. mit einem zweiten LLM-Aufruf oder NLI-Modell).",
  },
];

export default function Halluzination() {
  const [aktiv, setAktiv] = useState(0);
  const f = FAELLE[aktiv];

  return (
    <div className="lesson-card">
      <h2>Halluzinationen trotz Kontext</h2>
      <p className="lesson-description">
        RAG ist <em>kein</em> Garant gegen Halluzinationen. Vier klassische
        Muster, wie ein Modell trotz Kontext daneben liegt — und was dagegen
        wirkt.
      </p>

      <div className="warn-box">
        Wenn die Wissensbasis schlecht ist (veraltet, widersprüchlich,
        unvollständig) oder das Retrieval die falschen Stücke holt,
        halluziniert das Modell trotzdem — nur jetzt mit{" "}
        <em>scheinbarer</em> Quellenangabe. <strong>Garbage in, confident
        garbage out.</strong>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FAELLE.map((ff, i) => (
          <button
            key={ff.titel}
            type="button"
            onClick={() => setAktiv(i)}
            className="toggle-code"
            style={{
              background: aktiv === i ? "#fef2f2" : "transparent",
              borderColor: aktiv === i ? "#dc2626" : "#d1d5db",
              color: aktiv === i ? "#b91c1c" : "#374151",
              fontSize: "0.78rem",
            }}
          >
            {i + 1}. {ff.titel}
          </button>
        ))}
      </div>

      <div className="result-box" style={{ borderLeft: "3px solid #dc2626" }}>
        <div className="result-label">Symptom</div>
        <div style={{ marginTop: 4 }}>{f.symptom}</div>
      </div>

      <div className="result-box">
        <div className="result-label">Beispiel</div>
        <div className="kv-table" style={{ marginTop: 6, fontSize: "0.9rem" }}>
          <dt>Frage:</dt>
          <dd style={{ fontFamily: "inherit" }}>&bdquo;{f.beispiel.frage}&ldquo;</dd>
          <dt>Kontext:</dt>
          <dd style={{ fontFamily: "inherit", color: "#52525b" }}>{f.beispiel.kontext}</dd>
          <dt>Antwort:</dt>
          <dd style={{ fontFamily: "inherit", color: "#b91c1c" }}>{f.beispiel.antwort}</dd>
        </div>
      </div>

      <div className="result-box" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
        <div className="result-label" style={{ color: "#78350f" }}>Wieso</div>
        <div style={{ marginTop: 4, color: "#78350f" }}>{f.ursache}</div>
      </div>

      <div className="success-box">
        <strong>Was hilft:</strong> {f.fix}
      </div>

      <DepthBox variant="why" title="Warum halluziniert ein LLM mit Kontext überhaupt?">
        Selbst bei einem System-Prompt mit Kontext steht das LLM unter zwei
        Zielen: <em>hilfreich antworten</em> und <em>plausibel klingen</em>.
        Wenn Kontext und Frage nicht perfekt zusammenpassen, gewichtet das
        Modell den eigenen Pretraining-Bias höher als die Anweisung
        &bdquo;nur aus Kontext&ldquo;. Niedrige Temperatur + explizite
        Anweisung dämpfen das, eliminieren es aber nicht.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich weiß es nicht" ist ein gutes Ergebnis'>
        Viele RAG-Eval-Setups bestrafen leere Antworten. Falsch. Eine ehrliche
        &bdquo;Das geht aus den verfügbaren Dokumenten nicht hervor&ldquo;-Antwort
        ist <em>besser</em> als eine selbstbewusste Falschaussage. Misst
        man unbedingt — dann mit Faithfulness statt nur Answer Relevancy.
      </DepthBox>

      <DepthBox variant="deeper" title="Faithfulness messen">
        RAGAS (Open-Source) bietet eine <code>faithfulness</code>-Metrik:
        jede Aussage in der Antwort wird in einzelne Behauptungen zerlegt,
        und ein Judge-LLM prüft pro Behauptung, ob sie im Kontext steht.
        Score = Anteil belegter Behauptungen. Ein Score von 0.8 heißt:
        20 % der Antwort sind streng genommen halluziniert.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Confidence-Calibration (höhere Confidence = nicht zwangsläufig höhere
        Korrektheit), Constrained Decoding (Modell darf nur Tokens generieren,
        die in den Quellen vorkommen — sehr restriktiv, aber halluzinationsfrei),
        und Citation Verification (post-hoc check ob das zitierte Span den
        Claim wirklich enthält).
      </DepthBox>
    </div>
  );
}
