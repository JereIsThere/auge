import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'rag',
  titel: 'RAG',
  kategorie: 'cs',
  kurzbeschreibung:
    'Retrieval-Augmented Generation – LLMs mit eigenem Wissen erweitern.',
  beschreibung:
    'RAG kombiniert Information Retrieval mit Sprachmodellen: Statt das LLM raten zu ' +
    'lassen, suchst du erst die relevanten Dokumente und gibst sie als Kontext mit. ' +
    'Wirkt simpel — die Tücken stecken in Chunking, Embedding-Wahl, Retrieval-Qualität ' +
    'und Re-Ranking.',
  tags: ['llm', 'embeddings', 'retrieval', 'vector-db'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Was RAG ist, wie die Pipeline läuft, wo es klemmt.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'pipeline', 'chunking', 'embeddings'],
      akzent: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'engineer',
      titel: 'Engineer',
      beschreibung: 'Was du baust, wenn das Skelett steht.',
      icon: '💻',
      lektionenSlugs: ['vector-db', 'hybrid', 'cross-encoder', 'metadaten'],
      akzent: 'from-blue-500 to-indigo-600',
    },
    {
      slug: 'production',
      titel: 'Production',
      beschreibung: 'Was du misst und wo es brennt, wenn echte User ankommen.',
      icon: '🔥',
      lektionenSlugs: ['halluzination', 'eval', 'lost-in-middle'],
      akzent: 'from-fuchsia-500 to-rose-600',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Was RAG löst und wann es nicht passt.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was ist RAG?',
          icon: '📖',
          kurzbeschreibung: 'Retrieval + Augmentation + Generation – die Idee in 4 Schritten.',
          loader: () => import('@/components/kurse/rag/Einleitung'),
        },
        {
          slug: 'pipeline',
          titel: 'Die Pipeline',
          icon: '🔀',
          kurzbeschreibung: 'Sechs Schritte vom Klick zur Antwort, klickbar durchgehen.',
          loader: () => import('@/components/kurse/rag/Pipeline'),
        },
      ],
    },
    {
      titel: 'Vorverarbeitung',
      untertitel: 'Wie aus Dokumenten durchsuchbare Stücke werden.',
      lektionen: [
        {
          slug: 'chunking',
          titel: 'Chunking',
          icon: '✂️',
          kurzbeschreibung: 'Interaktiver Chunker mit Größe + Overlap-Slidern.',
          loader: () => import('@/components/kurse/rag/Chunking'),
        },
        {
          slug: 'embeddings',
          titel: 'Embeddings',
          icon: '📐',
          kurzbeschreibung: '2D-Visualizer: Text als Vektor, Ähnlichkeit als Geometrie.',
          loader: () => import('@/components/kurse/rag/Embeddings'),
        },
        {
          slug: 'metadaten',
          titel: 'Metadaten & Filter',
          icon: '🏷️',
          kurzbeschreibung: 'Wann reicht Embedding-Suche nicht und du brauchst Filter.',
          loader: () => import('@/components/kurse/rag/Metadaten'),
        },
      ],
    },
    {
      titel: 'Retrieval',
      untertitel: 'Die ähnlichsten Stücke aus der Wissensbasis holen.',
      lektionen: [
        {
          slug: 'vector-db',
          titel: 'Vector Databases',
          icon: '🗄️',
          kurzbeschreibung: 'pgvector, Pinecone, Weaviate, Qdrant – wann welche?',
          loader: () => import('@/components/kurse/rag/VectorDb'),
        },
        {
          slug: 'hybrid',
          titel: 'Hybrid: BM25 + Vektor',
          icon: '🧬',
          kurzbeschreibung: 'Side-by-Side Vergleich mit RRF-Fusion.',
          loader: () => import('@/components/kurse/rag/Hybrid'),
        },
      ],
    },
    {
      titel: 'Re-Ranking',
      untertitel: 'Aus 50 Kandidaten die wirklich besten 5 machen.',
      lektionen: [
        {
          slug: 'cross-encoder',
          titel: 'Cross-Encoder',
          icon: '⚖️',
          kurzbeschreibung: 'Warum Re-Ranking trotz Embeddings nochmal sortiert.',
          loader: () => import('@/components/kurse/rag/CrossEncoder'),
        },
      ],
    },
    {
      titel: 'Anwendung',
      untertitel: 'Wo es in echten Systemen wehtut.',
      lektionen: [
        {
          slug: 'halluzination',
          titel: 'Halluzinationen trotz Kontext',
          icon: '👻',
          kurzbeschreibung: 'Vier Fall-Muster und was dagegen wirkt.',
          loader: () => import('@/components/kurse/rag/Halluzination'),
        },
        {
          slug: 'eval',
          titel: 'Evaluation',
          icon: '📊',
          kurzbeschreibung: 'Precision@k, Recall@k, MRR, nDCG – interaktiv.',
          loader: () => import('@/components/kurse/rag/Eval'),
        },
        {
          slug: 'lost-in-middle',
          titel: 'Lost in the Middle',
          icon: '🕳️',
          kurzbeschreibung: 'Was passiert, wenn du zu viele Chunks in den Kontext stopfst.',
          loader: () => import('@/components/kurse/rag/LostInMiddle'),
        },
      ],
    },
  ],
};

export default thema;
