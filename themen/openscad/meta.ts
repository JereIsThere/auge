import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'openscad',
  titel: 'OpenSCAD',
  kategorie: 'cs',
  kurzbeschreibung:
    'Dinge programmieren statt zeichnen — eine druckbare Visitenkarten-Box als Code-Along.',
  beschreibung:
    'OpenSCAD baut 3D-Modelle aus Code: Du beschreibst die Form als Text, ' +
    'OpenSCAD rechnet sie aus. In diesem Code-Along bauen wir Schritt für ' +
    'Schritt eine echte, druckbare Visitenkarten-Box — und lernen unterwegs ' +
    'die Grundkörper, difference und parametrisches Design. Bewusst schlank ' +
    'gehalten; weitere OpenSCAD-Themen kommen später dazu.',
  tags: ['3d-druck', 'cad', 'parametrik', 'code'],
  status: 'in-arbeit',
  pfade: [
    {
      slug: 'die-box',
      titel: 'Die Box',
      beschreibung:
        'Vom ersten Würfel zur druckbaren Visitenkarten-Box — der komplette Code-Along.',
      icon: '📦',
      lektionenSlugs: [
        'einstieg',
        'masse-positionieren',
        'aushoehlen',
        'variablen-toleranz',
        'feinschliff',
        'export-druck',
      ],
      akzent: 'from-teal-400 to-cyan-600',
    },
  ],
  gruppen: [
    {
      titel: 'Die Box bauen',
      untertitel: 'Vom Würfel zur parametrischen Schale.',
      lektionen: [
        {
          slug: 'einstieg',
          titel: 'Dinge programmieren statt zeichnen',
          icon: '🧊',
          kurzbeschreibung:
            'Der OpenSCAD-Mindset und dein erster Körper: cube(30).',
          loader: () => import('@/components/kurse/openscad/Einstieg'),
        },
        {
          slug: 'masse-positionieren',
          titel: 'Maße & Positionieren',
          icon: '📐',
          kurzbeschreibung:
            'cube mit drei Maßen, das Koordinatensystem und translate.',
          loader: () => import('@/components/kurse/openscad/MassePositionieren'),
        },
        {
          slug: 'aushoehlen',
          titel: 'difference: aushöhlen',
          icon: '🕳️',
          kurzbeschreibung:
            'Aus dem Block wird eine Schale — die wichtigste Operation in OpenSCAD.',
          loader: () => import('@/components/kurse/openscad/Aushoehlen'),
        },
        {
          slug: 'variablen-toleranz',
          titel: 'Variablen & Toleranz',
          icon: '🎚️',
          kurzbeschreibung:
            'Kartenmaße als Variablen — plus Spiel, damit die Karten reinpassen.',
          loader: () => import('@/components/kurse/openscad/VariablenToleranz'),
        },
      ],
    },
    {
      titel: 'Fertig & drucken',
      untertitel: 'Feinschliff und der Weg zur STL.',
      lektionen: [
        {
          slug: 'feinschliff',
          titel: 'Feinschliff: runde Ecken & Daumenmulde',
          icon: '🪄',
          kurzbeschreibung:
            'Abgerundete Ecken mit hull/$fn und ein Ausschnitt zum Greifen der Karten.',
          kommtNoch: true,
        },
        {
          slug: 'export-druck',
          titel: 'Vom Modell zum Druck',
          icon: '🖨️',
          kurzbeschreibung:
            'Preview vs. Render (F5/F6), Mannigfaltigkeit und STL-Export.',
          kommtNoch: true,
        },
      ],
    },
    {
      titel: 'Übung & Ausblick',
      untertitel: 'Selbst bauen — und was OpenSCAD noch kann.',
      lektionen: [
        {
          slug: 'uebung',
          titel: 'Übungsaufgabe mit KI-Review',
          icon: '✏️',
          kurzbeschreibung:
            'Eine eigene Variante der Box bauen — mit KI-Review-Prompt zum Kopieren.',
          kommtNoch: true,
        },
        {
          slug: 'noch-nicht-erklaert',
          titel: 'Das ist hier noch nicht erklärt',
          icon: '🧭',
          kurzbeschreibung:
            'Ehrliche Landkarte: was OpenSCAD noch kann und wofür — die Roadmap des Kurses.',
          loader: () => import('@/components/kurse/openscad/NochNichtErklaert'),
        },
      ],
    },
  ],
};

export default thema;
