import { DepthBox } from "@/components/lessons/DepthBox";
import { RagQuelle } from "./RagQuelle";
import "@/components/lessons/lesson.css";

type DB = {
  name: string;
  hosting: string;
  hybrid: string;
  filter: string;
  sweet: string;
  watch: string;
};

const DATENBANKEN: DB[] = [
  {
    name: "pgvector",
    hosting: "Self / Postgres-Extension",
    hybrid: "Ja (mit tsvector kombinierbar)",
    filter: "Volles SQL WHERE",
    sweet: "Du hast schon Postgres. Mittelgroße Korpora.",
    watch: "HNSW-Index seit pgvector 0.5 — vorher war's langsam.",
  },
  {
    name: "Pinecone",
    hosting: "Managed (SaaS)",
    hybrid: "Ja (Sparse + Dense Vektor parallel)",
    filter: "Metadata-Filter eingebaut",
    sweet: "Du willst Skalierung ohne Ops. Multi-Tenancy via Namespaces.",
    watch: "Nicht günstig. Kein lokales Dev — alles über die Cloud.",
  },
  {
    name: "Weaviate",
    hosting: "Self / Managed",
    hybrid: "Built-in BM25 + Vector (RRF)",
    filter: "GraphQL-Filter",
    sweet: "Hybrid out-of-the-box ohne Eigenbau. Module-System für Custom-Embeddings.",
    watch: "Eigenes Datenmodell mit „Klassen“ – Einarbeitung nötig.",
  },
  {
    name: "Qdrant",
    hosting: "Self / Managed",
    hybrid: "Ja (Sparse via SPLADE)",
    filter: "JSON-Payload-Filter (umfangreich)",
    sweet: "Performance-fokussiert. Filter-First-Workloads (z.B. Multi-Tenant).",
    watch: "Geringer als Pinecone, aber wachsendes Ecosystem.",
  },
  {
    name: "Chroma",
    hosting: "Self / Embedded",
    hybrid: "Nur Dense",
    filter: "Einfache Metadata-Filter",
    sweet: "Lokales Dev, Prototypen, kleine Apps (<1M Vektoren).",
    watch: "Nicht für Production-Scale ausgelegt — eher Notebook-Friend.",
  },
  {
    name: "Elasticsearch / OpenSearch",
    hosting: "Self / Managed",
    hybrid: "Ja (das ist ihr Heimspiel)",
    filter: "Volles Query-DSL",
    sweet: "Du hast schon Elastic für Volltext. Operationen sind eingespielt.",
    watch: "Vektor-Performance kommt nicht ganz an spezialisierte DBs ran.",
  },
];

export default function VectorDb() {
  return (
    <div className="lesson-card">
      <h2>Vektor-Datenbanken</h2>
      <p className="lesson-description">
        Eine Vektor-DB speichert hunderttausende bis Milliarden von
        Embedding-Vektoren und findet zu einer Query-Anfrage in Millisekunden
        die ähnlichsten — typisch mit einem <strong>HNSW-Index</strong>{" "}
        (Hierarchical Navigable Small World). Welche du wählst, hängt
        weniger von der reinen Vector-Performance ab als vom Drumherum.
      </p>

      <div className="info-box">
        <strong>Faustregel:</strong> Wenn du bereits Postgres betreibst, fang
        mit pgvector an. Sonst hängt's davon ab, wie viel Ops du selbst
        machen willst.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DATENBANKEN.map((db) => (
          <div key={db.name} className="result-box">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
                {db.name}
              </span>
              <span className="pill">{db.hosting}</span>
            </div>
            <div className="kv-table" style={{ fontSize: "0.86rem" }}>
              <dt>Hybrid:</dt>
              <dd>{db.hybrid}</dd>
              <dt>Filter:</dt>
              <dd>{db.filter}</dd>
              <dt>Sweet Spot:</dt>
              <dd style={{ fontFamily: "inherit" }}>{db.sweet}</dd>
              <dt>Watch out:</dt>
              <dd style={{ fontFamily: "inherit" }}>{db.watch}</dd>
            </div>
          </div>
        ))}
      </div>

      <DepthBox variant="why" title="Warum brauchen wir spezialisierte DBs?">
        Klassische DBs sind für O(log n) Suche auf <em>einer Dimension</em>{" "}
        optimiert (B-Tree-Indizes). Vektor-Suche braucht <em>nächste Nachbarn
        in n-dimensionalem Raum</em> — naive lineare Suche ist O(n·d) und wird
        bei Millionen Vektoren langsam. ANN-Indizes wie HNSW liefern eine
        Approximation in O(log n) bei {">"}95 % Recall.
      </DepthBox>

      <DepthBox variant="mistake" title="Vektor-DB-Wahl ist nicht die Engpassstelle">
        Die meisten RAG-Projekte scheitern nicht an der Vektor-DB-Performance,
        sondern an: schlechtem Chunking, fehlenden Metadaten-Filtern, keinem
        Re-Ranking, oder uneindeutigen Quellen. Erst die Pipeline-Qualität
        polieren, dann die DB-Wahl optimieren.
      </DepthBox>

      <DepthBox variant="deeper" title="HNSW unter der Haube">
        HNSW baut einen Graphen über die Vektoren mit mehreren Layern (wie
        Skip-Lists). Suche fängt im obersten, dünnsten Layer an und navigiert
        Greedy zum Ziel runter. Trade-off-Parameter: <code>M</code> (Anzahl
        Verbindungen pro Knoten, typisch 16) und <code>efSearch</code>{" "}
        (Such-Breite, typisch 100–400). Höher = besser, langsamer, mehr RAM.
      </DepthBox>

      <RagQuelle
        id="malkov2018-hnsw"
        kernaussagen={[
          "Stellt HNSW vor: mehrlagiger Navigable-Small-World-Graph, in dem die Suche O(log n) erreicht.",
          "Schlägt klassische ANN-Verfahren (FLANN, Annoy) sowohl in Recall als auch Latenz auf vielen Benchmarks.",
          "Heute der Default-Index in fast allen Vektor-DBs (pgvector, Qdrant, Faiss, Pinecone, Weaviate).",
        ]}
      />

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Embeddings (die DB ist nur die Suche, nicht die Übersetzung),
        Quantization (PQ + Scalar Quantization in Faiss/Qdrant für 4–16×
        Speicherersparnis), und Sharding (über mehrere Knoten — Pinecone und
        Qdrant lösen das anders als pgvector).
      </DepthBox>
    </div>
  );
}
