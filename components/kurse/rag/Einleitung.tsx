import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was ist RAG?</h2>
      <p className="lesson-description">
        RAG steht für <strong>Retrieval-Augmented Generation</strong> — eine
        Technik, mit der LLMs auf Wissen zugreifen können, das nicht in ihrem
        Training steckt. Statt die Frage einfach an das Modell zu schicken,
        sucht man <em>zuerst</em> passende Textstücke in einer eigenen
        Wissensbasis und legt sie als Kontext bei.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> &bdquo;Antworte mir, <em>aber benutze
        dafür diese Dokumente hier</em>.&ldquo;
      </div>

      <RagQuelle
        id="lewis2020-rag"
        kernaussagen={[
          "Prägt den Begriff „Retrieval-Augmented Generation“ (RAG).",
          "Kombiniert Dense Passage Retriever (DPR) + seq2seq-Generator (BART) end-to-end trainiert.",
          "Schlägt parametric-only Seq2Seq-Modelle auf wissensintensiven QA-Tasks (Natural Questions, TriviaQA).",
        ]}
      />

      <h3>Warum nicht einfach finetunen?</h3>
      <ol className="step-list">
        <li>
          <strong>Aktualität</strong> — neue Dokumente landen in der Datenbank,
          nicht im teuren Trainingslauf.
        </li>
        <li>
          <strong>Quellen-Nachweis</strong> — das Modell kann sagen, woher es
          eine Information hat.
        </li>
        <li>
          <strong>Halluzinationen senken</strong> — wenn das relevante Dokument
          dabeiliegt, ist Erfinden weniger attraktiv.
        </li>
        <li>
          <strong>Rechte &amp; Privatsphäre</strong> — Firmendokumente bleiben
          im eigenen System, nicht im Modellgewicht.
        </li>
      </ol>

      <h3>Die Pipeline grob</h3>
      <div className="flow-step">
        <div className="flow-step-num">1</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Frage entgegennehmen</div>
          <div className="flow-step-desc">Nutzer-Input wird zum Suchstart.</div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">2</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Retrieve</div>
          <div className="flow-step-desc">
            Wissensbasis nach den k ähnlichsten Textstücken durchsuchen
            (meist via Embeddings).
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">3</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Augment</div>
          <div className="flow-step-desc">
            Gefundene Stücke werden in den Prompt eingebaut als Kontext.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">4</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Generate</div>
          <div className="flow-step-desc">
            LLM antwortet — idealerweise basierend auf dem Kontext.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum gerade Embeddings?">
        Embeddings übersetzen Text in Zahlenvektoren, bei denen die <em>Bedeutung</em>{" "}
        in der Geometrie steckt: ähnliche Texte liegen nah beieinander, auch
        wenn sie völlig unterschiedliche Wörter benutzen.{" "}
        <em>&bdquo;Auto&ldquo;</em> und <em>&bdquo;Fahrzeug&ldquo;</em> sind in
        klassischer Volltextsuche zwei verschiedene Tokens — im Embedding-Raum
        liegen sie fast aufeinander.
      </DepthBox>

      <DepthBox variant="mistake" title="Häufiger Denkfehler">
        RAG ist <strong>kein</strong> Garant gegen Halluzinationen. Wenn die
        Wissensbasis schlecht ist (veraltet, widersprüchlich, unvollständig)
        oder das Retrieval die falschen Stücke holt, halluziniert das Modell
        trotzdem — nur jetzt mit <em>scheinbarer</em> Quellenangabe. Garbage
        in, confident garbage out.
      </DepthBox>

      <DepthBox variant="deeper" title="Wo RAG schwierig wird">
        <ul>
          <li>
            <strong>Mehrhopfen-Fragen</strong> — &bdquo;Welche Mitarbeiter haben
            sowohl Projekt X als auch Y bearbeitet?&ldquo; lässt sich nicht aus
            einer Ähnlichkeitssuche extrahieren.
          </li>
          <li>
            <strong>Tabellen &amp; strukturierte Daten</strong> — Embeddings
            sind für Fließtext optimiert, nicht für SQL-artige Joins.
          </li>
          <li>
            <strong>Zeitliche Reasoning</strong> — &bdquo;Was war der letzte
            Stand vor dem 1. März?&ldquo; braucht Metadaten-Filter, nicht
            Vektor-Ähnlichkeit.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Embeddings (kommt im nächsten Schritt), Vektor-Datenbanken (Pinecone,
        Weaviate, pgvector), Re-Ranking (Cross-Encoder), und Prompt-Engineering
        (wie baut man den Kontext in den Prompt ein, ohne dass das Modell ihn
        ignoriert).
      </DepthBox>
    </div>
  );
}
