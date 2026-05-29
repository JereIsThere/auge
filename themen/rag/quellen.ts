import type { Quelle } from '@/types';

// Wissenschaftliche Quellen für das RAG-Thema.
// In Lektionen referenziert via <QuelleBox id="..." kernaussagen={[...]} />.

export const RAG_QUELLEN: Quelle[] = [
  {
    id: 'lewis2020-rag',
    typ: 'paper',
    autoren: [
      'Patrick Lewis', 'Ethan Perez', 'Aleksandra Piktus', 'Fabio Petroni',
      'Vladimir Karpukhin', 'Naman Goyal', 'Heinrich Küttler', 'Mike Lewis',
      'Wen-tau Yih', 'Tim Rocktäschel', 'Sebastian Riedel', 'Douwe Kiela',
    ],
    titel: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    jahr: 2020,
    venue: 'NeurIPS 2020',
    arxiv: '2005.11401',
  },
  {
    id: 'gao2022-hyde',
    typ: 'paper',
    autoren: ['Luyu Gao', 'Xueguang Ma', 'Jimmy Lin', 'Jamie Callan'],
    titel:
      'Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)',
    jahr: 2022,
    venue: 'ACL 2023',
    arxiv: '2212.10496',
  },
  {
    id: 'reimers2019-sbert',
    typ: 'paper',
    autoren: ['Nils Reimers', 'Iryna Gurevych'],
    titel:
      'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks',
    jahr: 2019,
    venue: 'EMNLP 2019',
    arxiv: '1908.10084',
  },
  {
    id: 'karpukhin2020-dpr',
    typ: 'paper',
    autoren: [
      'Vladimir Karpukhin', 'Barlas Oğuz', 'Sewon Min', 'Patrick Lewis',
      'Ledell Wu', 'Sergey Edunov', 'Danqi Chen', 'Wen-tau Yih',
    ],
    titel: 'Dense Passage Retrieval for Open-Domain Question Answering',
    jahr: 2020,
    venue: 'EMNLP 2020',
    arxiv: '2004.04906',
  },
  {
    id: 'malkov2018-hnsw',
    typ: 'paper',
    autoren: ['Yu A. Malkov', 'D. A. Yashunin'],
    titel:
      'Efficient and robust approximate nearest neighbor search using ' +
      'Hierarchical Navigable Small World graphs',
    jahr: 2018,
    venue: 'IEEE TPAMI',
    arxiv: '1603.09320',
  },
  {
    id: 'robertson2009-bm25',
    typ: 'paper',
    autoren: ['Stephen Robertson', 'Hugo Zaragoza'],
    titel: 'The Probabilistic Relevance Framework: BM25 and Beyond',
    jahr: 2009,
    venue: 'Foundations and Trends in IR',
    doi: '10.1561/1500000019',
  },
  {
    id: 'formal2021-splade',
    typ: 'paper',
    autoren: [
      'Thibault Formal', 'Benjamin Piwowarski', 'Stéphane Clinchant',
    ],
    titel:
      'SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking',
    jahr: 2021,
    venue: 'SIGIR 2021',
    arxiv: '2107.05720',
  },
  {
    id: 'khattab2020-colbert',
    typ: 'paper',
    autoren: ['Omar Khattab', 'Matei Zaharia'],
    titel:
      'ColBERT: Efficient and Effective Passage Search via Contextualized ' +
      'Late Interaction over BERT',
    jahr: 2020,
    venue: 'SIGIR 2020',
    arxiv: '2004.12832',
  },
  {
    id: 'es2023-ragas',
    typ: 'paper',
    autoren: [
      'Shahul Es', 'Jithin James', 'Luis Espinosa-Anke', 'Steven Schockaert',
    ],
    titel:
      'RAGAS: Automated Evaluation of Retrieval Augmented Generation',
    jahr: 2023,
    arxiv: '2309.15217',
  },
  {
    id: 'liu2024-lostmiddle',
    typ: 'paper',
    autoren: [
      'Nelson F. Liu', 'Kevin Lin', 'John Hewitt', 'Ashwin Paranjape',
      'Michele Bevilacqua', 'Fabio Petroni', 'Percy Liang',
    ],
    titel: 'Lost in the Middle: How Language Models Use Long Contexts',
    jahr: 2024,
    venue: 'TACL',
    arxiv: '2307.03172',
  },
  {
    id: 'openai2024-embedding3',
    typ: 'blog',
    autor: 'OpenAI',
    site: 'OpenAI Blog',
    titel: 'New embedding models and API updates',
    jahr: 2024,
    url: 'https://openai.com/index/new-embedding-models-and-api-updates/',
  },
];

export function ragQuelleFinden(id: string): Quelle | undefined {
  return RAG_QUELLEN.find((q) => q.id === id);
}
