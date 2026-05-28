import type { Thema } from '@/types';

// Platzhalter-Themen: existieren als Kategorien-Anker auf der Landing,
// haben aber noch keine Lektionen. Werden umgezogen nach
// themen/<slug>/meta.ts, sobald sie inhaltlich gefüllt werden.

function platzhalter(
  slug: string,
  titel: string,
  kategorie: Thema['kategorie'],
  kurzbeschreibung: string,
  tags: string[] = []
): Thema {
  return {
    slug,
    titel,
    kategorie,
    kurzbeschreibung,
    tags,
    status: 'kommt-noch',
    gruppen: [],
  };
}

export const PLATZHALTER_THEMEN: Thema[] = [
  platzhalter(
    'regex',
    'Reguläre Ausdrücke',
    'cs',
    'Muster im Text finden – von der einfachen Ziffernsuche bis zu ReDoS.',
    ['programmierung', 'text', 'python', 'muster']
  ),
  platzhalter(
    'datenstrukturen-algorithmen',
    'Datenstrukturen & Algorithmen',
    'cs',
    'Big-O, Bäume, Graphen, dynamische Programmierung.',
    ['programmierung', 'algorithmik', 'big-o', 'python']
  ),
  platzhalter(
    'tensorflow-keras',
    'TensorFlow & Keras',
    'cs',
    'Neuronale Netze in der Praxis – vom MNIST-Modell bis zum Transformer.',
    ['ml', 'neural-networks', 'python', 'deep-learning']
  ),
  platzhalter(
    'git',
    'Git & Versionskontrolle',
    'cs',
    'Branches, Merge vs. Rebase, der Git-DAG erklärt.',
    ['git', 'vcs', 'collaboration', 'devops']
  ),
  platzhalter(
    'docker',
    'Docker & Container',
    'cs',
    'Container, Images, Compose – und was eigentlich der Kernel macht.',
    ['devops', 'container', 'deployment', 'linux']
  ),
  platzhalter(
    'linux-cli',
    'Linux & CLI',
    'cs',
    'Shell, Pipes, Prozesse, systemd – das System unter der GUI.',
    ['linux', 'shell', 'bash', 'terminal']
  ),
  platzhalter(
    'latex',
    'LaTeX',
    'cs',
    'Wissenschaftlicher Textsatz, Formeln, BibTeX – Struktur statt Layout.',
    ['dokumentation', 'wissenschaft', 'typografie', 'tex']
  ),
  platzhalter(
    'figurzeichnen',
    'Figurzeichnen',
    'art',
    'Gesture, Proportion, Anatomie – die Figur als Bewegung verstehen.',
    ['zeichnen', 'anatomie', 'gestik', 'manga']
  ),
  platzhalter(
    'lineare-algebra',
    'Lineare Algebra',
    'math',
    'Vektoren, Matrizen, Eigenwerte – die Sprache, in der ML-Modelle denken.',
    ['mathematik', 'vektoren', 'matrizen', 'ml-grundlage']
  ),
];
