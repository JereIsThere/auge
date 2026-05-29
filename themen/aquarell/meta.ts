import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'aquarell',
  titel: 'Aquarellmalerei',
  kategorie: 'art',
  kurzbeschreibung:
    'Wasser, Pigment, Papier — mit dem Wasser malen statt gegen es.',
  beschreibung:
    'Aquarell ist die Kunst, dem Wasser zuzuhören. Die Farbe leuchtet von ' +
    'innen, weil sie transparent ist. Du steuerst grob, das Wasser füllt die ' +
    'Lücken. Wer Aquarell beherrscht, beherrscht das Loslassen — und genau ' +
    'darin liegt die Schönheit.',
  tags: ['malerei', 'farbe', 'wasser', 'technik'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Was Aquarell anders macht, die Farb-Grundlagen, die drei Grundtechniken.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'farbkreis', 'wet-techniken'],
      akzent: 'from-amber-400 to-orange-500',
    },
    {
      slug: 'pigmente',
      titel: 'Pigmente',
      beschreibung: 'Was hinter den Tubennamen steckt — Eigenschaften und Lichtechtheit.',
      icon: '🔬',
      lektionenSlugs: ['pigment-eigenschaften', 'lichtechtheit'],
      akzent: 'from-emerald-400 to-teal-500',
    },
    {
      slug: 'techniken',
      titel: 'Techniken',
      beschreibung: 'Glazing, Lifting, Negative Painting — was Aquarell wirklich auszeichnet.',
      icon: '🖌️',
      lektionenSlugs: ['glazing', 'lifting', 'negativ-malen'],
      akzent: 'from-sky-400 to-indigo-500',
    },
    {
      slug: 'komposition',
      titel: 'Komposition & Übung',
      beschreibung: 'Werte vor Farbe, Bildaufbau — und drei Übungsaufgaben mit KI-Review.',
      icon: '🖼️',
      lektionenSlugs: ['notan', 'komposition', 'uebungsaufgaben'],
      akzent: 'from-violet-400 to-fuchsia-500',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Material, Farben, die drei Grundtechniken.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was Aquarell anders macht',
          icon: '💧',
          kurzbeschreibung: 'Pigment, Papier, Wasser — und warum Korrekturen nicht funktionieren.',
          loader: () => import('@/components/kurse/aquarell/Einleitung'),
        },
        {
          slug: 'farbkreis',
          titel: 'Farbkreis & Komplementärfarben',
          icon: '🎨',
          kurzbeschreibung: '12-teiliger Farbkreis interaktiv — Klick zeigt Komplementär + Pigment-Vorschlag.',
          loader: () => import('@/components/kurse/aquarell/Farbkreis'),
        },
        {
          slug: 'wet-techniken',
          titel: 'Wet-on-Wet, Wet-on-Dry, Dry-Brush',
          icon: '🖌️',
          kurzbeschreibung: 'Die drei Grundtechniken — wie viel Wasser auf Papier und Pinsel?',
          loader: () => import('@/components/kurse/aquarell/WetTechniken'),
        },
      ],
    },
    {
      titel: 'Pigmente verstehen',
      untertitel: 'Was hinter den Tubennamen wirklich steckt.',
      lektionen: [
        {
          slug: 'pigment-eigenschaften',
          titel: 'Transparenz, Granulierung, Färbekraft',
          icon: '🔬',
          kurzbeschreibung: 'Die drei Eigenschaften, die alles entscheiden — interaktiver Pigment-Vergleich.',
          loader: () => import('@/components/kurse/aquarell/PigmentEigenschaften'),
        },
        {
          slug: 'lichtechtheit',
          titel: 'Lichtechtheit (Blue Wool Scale)',
          icon: '☀️',
          kurzbeschreibung: 'Welche Pigmente bleichen aus — interaktive Zeitachse über Jahre.',
          loader: () => import('@/components/kurse/aquarell/Lichtechtheit'),
        },
      ],
    },
    {
      titel: 'Techniken',
      untertitel: 'Vom Glazing bis zum Lifting.',
      lektionen: [
        {
          slug: 'glazing',
          titel: 'Glazing',
          icon: '🪟',
          kurzbeschreibung: 'Transparente Schichten übereinander — optisches vs physisches Mischen, live.',
          loader: () => import('@/components/kurse/aquarell/Glazing'),
        },
        {
          slug: 'lifting',
          titel: 'Lifting & Aussparung',
          icon: '✨',
          kurzbeschreibung: 'Helle Stellen rausnehmen — und wann das nicht mehr geht.',
          loader: () => import('@/components/kurse/aquarell/Lifting'),
        },
        {
          slug: 'negativ-malen',
          titel: 'Negative Painting',
          icon: '◐',
          kurzbeschreibung: 'Form durch das, was drumrum ist — Schicht-für-Schicht-Demo.',
          loader: () => import('@/components/kurse/aquarell/NegativMalen'),
        },
      ],
    },
    {
      titel: 'Komposition',
      untertitel: 'Was das Bild zusammenhält.',
      lektionen: [
        {
          slug: 'notan',
          titel: 'Notan & Wertstruktur',
          icon: '◑',
          kurzbeschreibung: 'Hell/Mittel/Dunkel zuerst — interaktive Werttreppe.',
          loader: () => import('@/components/kurse/aquarell/Notan'),
        },
        {
          slug: 'komposition',
          titel: 'Bildaufteilung',
          icon: '🖼️',
          kurzbeschreibung: 'Drittelregel, Diagonalen, Blickführung — schaltbare Hilfslinien.',
          loader: () => import('@/components/kurse/aquarell/Komposition'),
        },
      ],
    },
    {
      titel: 'Übung',
      untertitel: 'Dein Wissen am eigenen Bild prüfen — mit KI-Review.',
      lektionen: [
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben',
          icon: '🖌️',
          kurzbeschreibung:
            'Drei Aufgaben (Werttreppe · Glazing-Vergleich · Stillleben) — jede mit KI-Review-Prompt zum Kopieren.',
          loader: () => import('@/components/kurse/aquarell/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
