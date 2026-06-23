import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'affinity',
  titel: 'Affinity Suite',
  kategorie: 'art',
  kurzbeschreibung:
    'Photo, Designer, Publisher — professionelle Bildbearbeitung ohne Abo.',
  beschreibung:
    'Affinity ist die Alternative zu Adobes Creative Suite: einmaliger Kauf, ' +
    'kein Abo, kein Cloud-Zwang. Photo ersetzt Photoshop, Designer ersetzt Illustrator, ' +
    'Publisher ersetzt InDesign. Wer von Paint.NET oder Inkscape umsteigt, merkt schnell: ' +
    'die Apps denken in Schichten, Masken und non-destructiven Anpassungen — ein anderer Kopf als ' +
    'einfache Pixel-Editoren.',
  tags: ['design', 'bildbearbeitung', 'vektor', 'raster', 'affinity', 'foto'],
  status: 'in-arbeit',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Die drei Apps verstehen, Umstieg von Paint.NET und Inkscape.',
      icon: '🌱',
      lektionenSlugs: ['was-ist-affinity', 'photo-vs-pdn', 'designer-vs-inkscape'],
      akzent: 'from-violet-400 to-purple-500',
    },
    {
      slug: 'photo',
      titel: 'Affinity Photo',
      beschreibung: 'Non-destructives Editing, Ebenen, Masken, Farbkorrektur.',
      icon: '📷',
      lektionenSlugs: ['photo-vs-pdn', 'ebenen-masken', 'farbkorrektur'],
      akzent: 'from-blue-400 to-indigo-500',
    },
    {
      slug: 'designer',
      titel: 'Affinity Designer',
      beschreibung: 'Vektor-Editing, Nodes, das Pixel-Persona.',
      icon: '✏️',
      lektionenSlugs: ['designer-vs-inkscape', 'vektor-basics', 'pixel-persona'],
      akzent: 'from-emerald-400 to-teal-500',
    },
    {
      slug: 'workflow',
      titel: 'Workflow',
      beschreibung: 'Erster Projekt-Workflow, Studio Link, Export-Persona.',
      icon: '⚙️',
      lektionenSlugs: ['erster-workflow', 'studio-link', 'export-persona'],
      akzent: 'from-rose-400 to-pink-500',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Was die drei Apps sind — und wie sie zusammenarbeiten.',
      lektionen: [
        {
          slug: 'was-ist-affinity',
          titel: 'Die Affinity Suite',
          icon: '🗺️',
          kurzbeschreibung:
            'Photo, Designer, Publisher — welche App wofür, und warum kein Abo.',
          loader: () => import('@/components/kurse/affinity/WasIstAffinity'),
        },
        {
          slug: 'photo-vs-pdn',
          titel: 'Affinity Photo vs. Paint.NET',
          icon: '📷',
          kurzbeschreibung:
            'Warum Photo eher Photoshop als PDN ist — non-destructive Editing, Anpassungsebenen, RAW.',
          loader: () => import('@/components/kurse/affinity/PhotoVsPdn'),
        },
        {
          slug: 'designer-vs-inkscape',
          titel: 'Affinity Designer vs. Inkscape',
          icon: '✏️',
          kurzbeschreibung:
            'Node-Editing, Bezier-Kurven, SVG-Export — was anders ist und was besser wird.',
          loader: () => import('@/components/kurse/affinity/DesignerVsInkscape'),
        },
      ],
    },
    {
      titel: 'Erster Workflow',
      untertitel: 'Ein Projekt von Anfang bis Export durchziehen.',
      lektionen: [
        {
          slug: 'erster-workflow',
          titel: 'Erster Workflow in Affinity',
          icon: '🚀',
          kurzbeschreibung:
            'Dokument anlegen, importieren, exportieren — die wichtigsten Schritte vom ersten Start.',
          loader: () => import('@/components/kurse/affinity/ErsterWorkflow'),
        },
      ],
    },
    {
      titel: 'Affinity Photo (Pixel)',
      untertitel: 'Non-destructives Editing, Masken, Farbkorrektur.',
      lektionen: [
        {
          slug: 'ebenen-masken',
          titel: 'Ebenen & Masken',
          icon: '🧅',
          kurzbeschreibung:
            'Live-Filter, Anpassungsebenen, Pixel-Masken — wie PDN-Ebenen, aber viel mächtiger.',
          kommtNoch: true,
        },
        {
          slug: 'farbkorrektur',
          titel: 'Farbkorrektur & Gradationskurven',
          icon: '🌈',
          kurzbeschreibung:
            'Kurven, Levels, HSL — und wann man lieber im LAB-Farbraum arbeitet.',
          kommtNoch: true,
        },
      ],
    },
    {
      titel: 'Affinity Designer (Vektor)',
      untertitel: 'Pfade, Nodes, Raster und Vektor in einem Dokument.',
      lektionen: [
        {
          slug: 'vektor-basics',
          titel: 'Stift-Werkzeug & Nodes',
          icon: '🔷',
          kurzbeschreibung:
            'Bezier-Pfade erstellen, Nodes editieren, Konturen schliessen — schneller als in Inkscape.',
          kommtNoch: true,
        },
        {
          slug: 'pixel-persona',
          titel: 'Das Pixel-Persona',
          icon: '🎭',
          kurzbeschreibung:
            'Raster-Editing direkt in Designer — wann das sinnvoll ist und wie es sich anfuhlt.',
          kommtNoch: true,
        },
      ],
    },
    {
      titel: 'Gemeinsamer Workflow',
      untertitel: 'Studio Link und Export-Persona.',
      lektionen: [
        {
          slug: 'studio-link',
          titel: 'Studio Link',
          icon: '🔗',
          kurzbeschreibung:
            'Zwischen Photo, Designer und Publisher wechseln — ohne Datei-Export.',
          kommtNoch: true,
        },
        {
          slug: 'export-persona',
          titel: 'Export-Persona',
          icon: '📦',
          kurzbeschreibung:
            'PNG, SVG, PDF, JPEG2000 — Slices, Artboards, One-Click-Export.',
          kommtNoch: true,
        },
      ],
    },
  ],
};

export default thema;
