import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_CHUNKING = `Du bist ein erfahrener RAG-Engineer und gibst präzises,
strukturiertes Feedback zu Chunking-Strategien.

ICH ÜBBE: RAG-Vorverarbeitung — Chunking, Metadaten und Embedding-Auswahl
für ein konkretes Dokument-Corpus.

MEINE AUFGABE WAR: Ich habe ein Dokument-Corpus (beschrieben unten) analysiert
und eine Chunking-Strategie entworfen. Ich beschreibe jetzt meinen Ansatz.

Bitte beurteile meinen Entwurf auf:

1. Chunk-Größe — passt die gewählte Größe zum Dokument-Typ?
   Kurze Chunks (128–256 Tokens) sind gut für FAQ-artige Inhalte.
   Große Chunks (512–1024) für zusammenhängende Absätze/Code-Blöcke.
   Habe ich eine Begründung gegeben?

2. Overlap — ist der Overlap sinnvoll gewählt?
   Kein Overlap → Satz-Halbierungen an Chunk-Grenzen.
   Zu viel Overlap → aufgeblähter Index, redundante Treffer.
   10–20 % des Chunk-Size ist ein guter Startpunkt.

3. Metadaten — welche Felder habe ich vorgesehen, und decken sie
   sinnvolle Filterdimensionen ab? Fehlen wichtige Felder (Datum,
   Quelle, Abschnittstyp)?

4. Embedding-Modell — passt die Wahl zur Sprache (DE/EN) und zum
   Domain-Typ? Habe ich Sentence-Transformers, OpenAI-Embeddings oder
   ein anderes Modell erwähnt, und warum?

5. Splitting-Methode — habe ich Fixed-Size, Sentence-Splitting oder
   Recursive-Splitting erwähnt? Passt die Methode zum Dokument-Typ?

Nenne am Ende die ZWEI größten Schwachstellen meines Entwurfs —
konkret, wo ein schlechtes Chunking in der Praxis zu schlechtem
Retrieval führen würde.`;

const PROMPT_PIPELINE = `Du bist RAG-System-Architekt und gibst strukturiertes
Feedback zu Pipeline-Entwürfen.

ICH ÜBE: Das Designen einer vollständigen RAG-Pipeline für einen
konkreten Use Case — von der Datei bis zur generierten Antwort.

MEINE AUFGABE WAR: Ich habe für einen gegebenen Use Case eine
RAG-Pipeline entworfen und die folgenden Entscheidungen beschrieben:
Corpus-Quelle, Chunking-Strategie, Embedding-Modell, Vector-DB,
Retrieval-Methode (dense / hybrid / re-ranking), Prompt-Design
und Halluzinations-Schutz.

Bitte beurteile meinen Pipeline-Entwurf auf:

1. Vollständigkeit — fehlt ein relevanter Schritt?
   (Indexierung, Query-Preprocessing, Retrieval, Re-Ranking, Generation)
   Habe ich jeden Schritt mindestens kurz adressiert?

2. Retrieval-Strategie — habe ich begründet, ob Dense, Sparse oder
   Hybrid besser passt? Für produktive Systeme ist Hybrid-Retrieval
   (BM25 + Vektor) meist überlegen — habe ich das bedacht?

3. Re-Ranking — bei mehr als 5-10 abgerufenen Chunks bringt ein
   Cross-Encoder deutliche Qualitätsverbesserung. Habe ich
   Re-Ranking vorgesehen oder begründet warum nicht?

4. Halluzinations-Schutz — habe ich mindestens eine Maßnahme
   genannt? (System-Prompt-Anweisung, Faithfulness-Check,
   Quellenverifizierung, Confidence-Threshold)

5. Failure Mode — habe ich identifiziert, welches Halluzinations-
   Muster für meinen Use Case am wahrscheinlichsten ist?
   (Kontext lügt / kein Kontext passt / Mehrfach-Hop / Quellen-
   Halluzination)

6. Metadaten-Nutzung — nutze ich Metadaten als Filter im Retrieval,
   oder suche ich nur per Embedding? Filter sind entscheidend wenn
   der Corpus verschiedene Versionen, Sprachen oder Abteilungen enthält.

Identifiziere am Ende den ONE schwächsten Punkt meines Designs —
der, bei dem ein echter User am wahrscheinlichsten eine schlechte
Antwort bekommen würde — und erkläre kurz, wie ich ihn beheben könnte.`;

const PROMPT_MINI_RAG = `Du bist erfahrener RAG-Engineer und gibst ehrliches,
technisches Feedback zu Mini-RAG-Implementierungen.

ICH ÜBE: Einen vollständigen RAG-Prototyp bauen und mit Retrieval-
Metriken evaluieren.

MEINE AUFGABE WAR: Ich habe einen Mini-RAG mit mindestens 5 Dokumenten
und 5 Test-Queries gebaut, Precision@5 und MRR ausgerechnet und
das Ergebnis mit einem Baseline-Vergleich dokumentiert.

Ich beschreibe jetzt: meinen Tech-Stack, mein Corpus, meine Queries,
meine Ergebnisse (Precision@5, MRR) und was mich überrascht hat.

Bitte beurteile meine Implementierung auf:

1. Corpus-Qualität — passen die 5+ Dokumente gut zum Query-Set?
   Sind die Queries distinkt genug, dass Retrieval-Fehler sichtbar werden?

2. Chunking — war meine Chunk-Größe angemessen für den Corpus?
   Hätte ein anderer Overlap oder eine andere Split-Methode geholfen?

3. Embedding-Wahl — habe ich das Embedding-Modell zur Sprache
   und Domain passend gewählt?

4. Retrieval-Metriken — sind meine Precision@5 und MRR plausibel
   für die Corpus-/Query-Kombination? Wo lagen die schlechtesten Queries?

5. Baseline-Vergleich — habe ich einen Vergleich gezogen?
   (z.B. BM25-Only vs. Dense, oder k=3 vs. k=10)
   Ohne Baseline ist eine einzelne Metrik wenig aussagekräftig.

6. Nächste Iteration — welche eine Änderung würde meinen Score
   am stärksten verbessern?

Nenne die ZWEI konkreten Verbesserungs-Hebel, die den größten
Sprung in Precision@5 bringen würden. Sei direkt und technisch präzise.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Schwierigkeit. Die erste kannst du ohne
        Code lösen, die zweite schon mit einem Notizbuch, die dritte braucht
        eine echte Implementierung. Für jede gibt es einen{" "}
        <strong>KI-Review-Prompt</strong> — du beschreibst deinen Entwurf oder
        Code, kopierst den Prompt nach Claude, ChatGPT oder Gemini und
        bekommst strukturiertes Feedback.
      </p>

      <div className="info-box">
        <strong>So bekommst du am meisten raus:</strong> Mach jede Aufgabe{" "}
        <em>vor</em> dem Review zu Ende. Beim KI-Review gilt: je genauer du
        beschreibst, was du getan hast und warum, desto konkreter das
        Feedback. Vage Beschreibungen bekommen vage Kritik.
      </div>

      <Aufgabe
        titel="Aufgabe 1 — Chunking-Strategie entwerfen"
        schwierigkeit="leicht"
        zeit="30–45 min"
      >
        <p>
          Wähle einen Dokument-Typ aus der Liste — am besten einen, der dir
          vertraut ist:
        </p>
        <ul style={{ marginLeft: "1.2rem", marginBottom: "0.75rem" }}>
          <li>Technische Dokumentation (z.B. eine API-Referenz mit Parametern)</li>
          <li>Rechtliche Texte (z.B. AGB, Mietvertrag)</li>
          <li>Wissenschaftliche Paper (Einleitung, Methodik, Ergebnisse)</li>
          <li>Support-FAQ (kurze Fragen + kurze Antworten)</li>
          <li>Quellcode (Dateien, Funktionen, Kommentare)</li>
        </ul>
        <p>
          Schreib einen kurzen Entwurf (reicht als Text-Dokument oder
          Markdown-Datei) mit deinen Entscheidungen — ohne Code, nur Begründungen.
        </p>
        <AufgabeCheckliste
          items={[
            "Dokument-Typ + Begründung, warum er für RAG interessant ist",
            "Chunk-Größe (in Tokens oder Zeichen) + warum genau diese Größe",
            "Overlap: wie viel und warum (oder: warum keinen)",
            "Splitting-Methode: Fixed-Size, Satz-Splitting oder Recursive — begründet",
            "Mindestens 3 Metadaten-Felder (z.B. Datum, Abschnittstyp, Quelle)",
            "Embedding-Modell-Wahl mit Begründung (Sprache, Domain, Kosten)",
          ]}
        />
        <KiReview prompt={PROMPT_CHUNKING} />
      </Aufgabe>

      <Aufgabe
        titel="Aufgabe 2 — RAG-Pipeline für einen Use Case designen"
        schwierigkeit="mittel"
        zeit="1–1,5 h"
      >
        <p>
          Wähle einen Use Case und entwirf die vollständige RAG-Pipeline —
          von der Datei-Quelle bis zur generierten Antwort. Du musst noch
          keinen Code schreiben; ein klarer, begründeter Entwurf reicht.
        </p>
        <ul style={{ marginLeft: "1.2rem", marginBottom: "0.75rem" }}>
          <li>Interner Support-Bot für ein Software-Produkt (Dokumentation + Changelogs)</li>
          <li>Medizinischer Wissens-Assistent (Leitlinien + Studien)</li>
          <li>Code-Assistent, der eine interne Codebase kennt</li>
          <li>Rechtlicher Assistent für Vertragsanalyse</li>
        </ul>
        <p>
          Gehe alle sechs Stufen durch — in deinem Entwurf darf jede Stufe
          ein kurzer Absatz sein, aber jede muss da sein.
        </p>
        <AufgabeCheckliste
          items={[
            "Corpus-Quelle: Woher kommen die Dokumente, in welchem Format?",
            "Chunking: Strategie begründet (Typ, Größe, Overlap, Metadaten)",
            "Retrieval: Dense / Sparse / Hybrid — begründet, mit konkreter DB-Wahl",
            "Re-Ranking: Cross-Encoder ja oder nein — mit Begründung",
            "Prompt-Design: System-Prompt-Skizze mit Kontext-Slot und Antwort-Anweisung",
            "Halluzinations-Schutz: mindestens eine konkrete Maßnahme",
            "Failure-Mode: welches der vier Halluzinations-Muster ist am wahrscheinlichsten?",
          ]}
        />
        <KiReview prompt={PROMPT_PIPELINE} />
      </Aufgabe>

      <Aufgabe
        titel="Aufgabe 3 — Mini-RAG bauen und evaluieren"
        schwierigkeit="schwer"
        zeit="3–5 h"
      >
        <p>
          Baue einen vollständigen RAG-Prototyp in Python. Kein Framework
          erforderlich — du kannst FAISS oder ChromaDB für den Vektor-Index
          und die OpenAI- oder Sentence-Transformers-API für Embeddings nehmen.
          Das Ziel ist nicht Perfektion, sondern eine{" "}
          <em>messbare Baseline</em>.
        </p>
        <p>
          Corpus-Vorschlag falls du keinen eigenen hast: 10 Wikipedia-Absätze
          zu einem Thema deiner Wahl (z.B. Quantencomputing, Klimawandel,
          Geschichte Roms). Query-Set: 5 Fragen, von denen du weißt, welche
          Absätze die richtige Antwort enthalten — das sind deine Ground-Truth-Labels.
        </p>
        <AufgabeCheckliste
          items={[
            "Mindestens 5 Dokumente / 10 Chunks im Index",
            "Mindestens 5 Test-Queries mit Ground-Truth (welche Chunks sind relevant?)",
            "Precision@5 für jede Query berechnet (wie viele der Top-5 sind relevant?)",
            "MRR berechnet (bei welcher Position taucht das erste relevante Dokument auf?)",
            "Mindestens ein Baseline-Vergleich (z.B. k=3 vs k=10, oder BM25 vs Dense)",
            "Dokumentiert: was hat dich überrascht — wo lagen die schlechtesten Queries?",
          ]}
        />
        <KiReview prompt={PROMPT_MINI_RAG} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> Nimm deinen
        Mini-RAG aus Aufgabe 3 und bau ihn mit Hybrid-Retrieval (BM25 +
        Dense) und einem Cross-Encoder-Re-Ranker aus. Miss Precision@5 und
        MRR erneut. Der Delta zwischen Baseline und verbessertem System ist
        dein persönlichster RAG-Lernmoment.
      </div>
    </div>
  );
}
