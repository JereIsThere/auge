import type { Thema } from '@/types';

// Sampler-Thema: drei Lern-Kanäle (Hören · Sehen · Sprechen), je eine echte
// Einstiegs-Lektion + „kommt-noch"-Stubs. Bewusst NICHT fertig — gedacht zum
// Durchklicken, damit der Lernende sagen kann, von welchem Kanal er mehr will.
// Fokus: englischen Satzbau intuitiv fühlen (fürs Mündliche), nicht Regeln pauken.

const thema: Thema = {
  slug: 'englisch-satzbau',
  titel: 'Englisch: Satzbau intuitiv',
  kategorie: 'sprache',
  kurzbeschreibung:
    'Englische Sätze nicht nach Regel, sondern nach Gefühl bauen — fürs Mündliche.',
  beschreibung:
    'Im Sprechfluss hat keiner Zeit, eine Grammatikregel abzurufen — man ' +
    'braucht Bauchgefühl: „das klingt richtig". Dieses Thema probiert drei ' +
    'Wege, dieses Gefühl aufzubauen: über das Ohr (Satz-Melodie), über das ' +
    'Auge (Bausteine schieben) und über das Sprechen (Gerüst füllen + ' +
    'KI-Feedback). Jeder Kanal hat hier eine echte Einstiegs-Lektion; der ' +
    'Rest ist noch offen. Klick dich durch und sag, von welchem Kanal du ' +
    'mehr möchtest — daraus wird dann ausgebaut.',
  tags: ['englisch', 'sprache', 'mündliche-prüfung', 'satzbau', 'intuitiv'],
  status: 'in-arbeit',
  pfade: [
    {
      slug: 'sampler',
      titel: 'Der Drei-Kanäle-Sampler',
      beschreibung:
        'Je eine Kostprobe pro Lernweg — hören, sehen, sprechen. Welcher liegt dir?',
      icon: '🎛️',
      lektionenSlugs: ['satz-melodie', 'satz-zug', 'bau-drauf'],
      akzent: 'from-emerald-400 to-teal-600',
    },
  ],
  gruppen: [
    {
      titel: '🎧 Kanal 1 — Hören & Rhythmus',
      untertitel: 'Den Beat eines englischen Satzes fühlen.',
      lektionen: [
        {
          slug: 'satz-melodie',
          titel: 'Die Satz-Melodie',
          icon: '🎵',
          kurzbeschreibung:
            'Inhaltswörter kriegen den Schlag, der Rest huscht durch. Spiel den Rhythmus ab.',
          loader: () => import('@/components/kurse/englisch-satzbau/SatzMelodie'),
        },
        {
          slug: 'schwache-woerter',
          titel: 'Schwache Wörter verschlucken',
          icon: '🌫️',
          kurzbeschreibung:
            'to, of, the, and — wie Muttersprachler die unbetonten Wörter zusammenquetschen.',
          kommtNoch: true,
        },
        {
          slug: 'frage-melodie',
          titel: 'Frage-Melodie: rauf oder runter?',
          icon: '↗️',
          kurzbeschreibung:
            'Yes/No-Fragen gehen hoch, W-Fragen runter — die Stimme verrät die Satzart.',
          kommtNoch: true,
        },
      ],
    },
    {
      titel: '👁️ Kanal 2 — Sehen & Bewegen',
      untertitel: 'Satzteile als Bausteine in fester Reihenfolge.',
      lektionen: [
        {
          slug: 'satz-zug',
          titel: 'Der Satz-Zug',
          icon: '🚃',
          kurzbeschreibung:
            'Wer → tut was → wem/was → wo → wann. Schieb die Waggons, bis es einrastet.',
          loader: () => import('@/components/kurse/englisch-satzbau/SatzZug'),
        },
        {
          slug: 'frage-bauen',
          titel: 'Fragen bauen: Hilfsverb nach vorn',
          icon: '🔧',
          kurzbeschreibung:
            'do/does/did und das Hilfsverb rutschen vor das Subjekt — der Frage-Griff.',
          kommtNoch: true,
        },
        {
          slug: 'nebensaetze-anhaengen',
          titel: 'Nebensätze anhängen statt Verb ans Ende',
          icon: '🔗',
          kurzbeschreibung:
            'Im Deutschen wandert das Verb ans Ende — im Englischen bleibt es vorn. Anhängen statt verschieben.',
          kommtNoch: true,
        },
      ],
    },
    {
      titel: '🗣️ Kanal 3 — Selber Sprechen',
      untertitel: 'Ein Gerüst füllen und länger machen — mit KI als Prüfer.',
      lektionen: [
        {
          slug: 'bau-drauf',
          titel: 'Bau drauf — ein Gerüst, zehn Sätze',
          icon: '🧱',
          kurzbeschreibung:
            'Ein festes Satzgerüst, viele Füllungen — und dann länger machen. Mit KI-Review.',
          loader: () => import('@/components/kurse/englisch-satzbau/BauDrauf'),
        },
        {
          slug: 'sentence-starter',
          titel: 'Sentence-Starter fürs Examen',
          icon: '🚀',
          kurzbeschreibung:
            'Fertige Satzanfänge zum Zeitgewinn: „What I would say is…", „The way I see it…".',
          kommtNoch: true,
        },
        {
          slug: 'bildbeschreibung',
          titel: 'Bildbeschreibung mit KI-Prüfer',
          icon: '🖼️',
          kurzbeschreibung:
            'Ein Bild beschreiben, KI spielt den Prüfer und gibt Feedback auf den Satzbau.',
          kommtNoch: true,
        },
      ],
    },
  ],
};

export default thema;
