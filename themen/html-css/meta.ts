import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'html-css',
  titel: 'HTML & CSS',
  kategorie: 'cs',
  kurzbeschreibung:
    'Struktur und Aussehen des Webs — von den ersten Tags bis zum Lesen und Reparieren von KI-generiertem HTML.',
  beschreibung:
    'HTML ist das Skelett einer Seite, CSS die Haut darüber. Wer beide ' +
    'versteht, kann jede Web-Oberfläche lesen — und das ist heute wichtiger ' +
    'denn je: KIs schreiben Markup im Sekundentakt, aber wer es nicht lesen ' +
    'kann, kann es auch nicht reparieren. Dieser Kurs baut von den Grundlagen ' +
    '(Tags, Selektoren, Box-Modell) über modernes Layout (Flexbox, Grid, ' +
    'Responsive) bis zu einer eigenen Sektion: KI-HTML schnell erkennen, ' +
    'lesen, verstehen und debuggen.',
  tags: ['web', 'html', 'css', 'frontend', 'layout', 'ki-code'],
  status: 'fertig',
  akzent: 'from-sky-500 to-indigo-600',
  pfade: [
    {
      slug: 'grundlagen',
      titel: 'Grundlagen',
      beschreibung:
        'Was HTML und CSS sind, das Grundgerüst, Selektoren, das Box-Modell und die Kaskade.',
      icon: '🌱',
      lektionenSlugs: [
        'grundlagen',
        'html-struktur',
        'css-regeln',
        'box-model',
        'kaskade-spezifitaet',
      ],
      akzent: 'from-emerald-400 to-teal-500',
    },
    {
      slug: 'layout',
      titel: 'Modernes Layout',
      beschreibung:
        'Flexbox, Grid, Positionierung & Stacking, Responsive Design — wie man heute Layouts baut.',
      icon: '📐',
      lektionenSlugs: ['flexbox', 'grid', 'position-zindex', 'responsive'],
      akzent: 'from-sky-400 to-indigo-500',
    },
    {
      slug: 'ki-html',
      titel: 'KI-HTML meistern',
      beschreibung:
        'KI-generiertes Markup erkennen, schnell lesen, verstehen und systematisch bugfixen — plus Übungen mit KI-Review.',
      icon: '🤖',
      lektionenSlugs: [
        'ki-html-erkennen',
        'ki-html-lesen',
        'ki-html-bugfixen',
        'uebungsaufgaben',
      ],
      akzent: 'from-violet-400 to-fuchsia-500',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Struktur, Stil und die Regeln dahinter.',
      lektionen: [
        {
          slug: 'grundlagen',
          titel: 'Was HTML & CSS sind',
          icon: '🧱',
          kurzbeschreibung:
            'Struktur vs. Aussehen — und warum das eine ohne das andere funktioniert. Mit „CSS an/aus"-Demo.',
          loader: () => import('@/components/kurse/html-css/Grundlagen'),
        },
        {
          slug: 'html-struktur',
          titel: 'Das HTML-Grundgerüst & semantische Tags',
          icon: '📄',
          kurzbeschreibung:
            'doctype, head, body — und warum <section> besser ist als ein weiteres <div>.',
          loader: () => import('@/components/kurse/html-css/HtmlStruktur'),
        },
        {
          slug: 'css-regeln',
          titel: 'CSS einbinden & die Anatomie einer Regel',
          icon: '🎯',
          kurzbeschreibung:
            'Inline, intern, extern — Selektor, Property, Wert. Wo Stil herkommt und wie man ihn trifft.',
          loader: () => import('@/components/kurse/html-css/CssRegeln'),
        },
        {
          slug: 'box-model',
          titel: 'Das Box-Modell',
          icon: '📦',
          kurzbeschreibung:
            'content, padding, border, margin — interaktiv mit Reglern. Plus box-sizing, das #1-Aha.',
          loader: () => import('@/components/kurse/html-css/BoxModel'),
        },
        {
          slug: 'kaskade-spezifitaet',
          titel: 'Kaskade, Vererbung & Spezifität',
          icon: '⚖️',
          kurzbeschreibung:
            'Warum gewinnt welche Regel? Interaktiver Spezifitäts-Rechner mit konkurrierenden Regeln.',
          loader: () => import('@/components/kurse/html-css/KaskadeSpezifitaet'),
        },
      ],
    },
    {
      titel: 'Modernes Layout',
      untertitel: 'Wie man 2025 Layouts baut.',
      lektionen: [
        {
          slug: 'flexbox',
          titel: 'Flexbox',
          icon: '↔️',
          kurzbeschreibung:
            'Die eine Achse. Interaktives Playground: direction, justify, align, wrap — live.',
          loader: () => import('@/components/kurse/html-css/Flexbox'),
        },
        {
          slug: 'grid',
          titel: 'CSS Grid',
          icon: '▦',
          kurzbeschreibung:
            'Zwei Achsen, echte Spalten & Zeilen. Interaktiv: Spaltenzahl, Gap, Span.',
          loader: () => import('@/components/kurse/html-css/Grid'),
        },
        {
          slug: 'position-zindex',
          titel: 'Position & Stacking',
          icon: '🗂️',
          kurzbeschreibung:
            'static, relative, absolute, fixed, sticky — und warum dein z-index nicht greift.',
          loader: () => import('@/components/kurse/html-css/PositionZindex'),
        },
        {
          slug: 'responsive',
          titel: 'Responsive Design',
          icon: '📱',
          kurzbeschreibung:
            'Einheiten (rem/em/%/vw), Media Queries, mobile-first. Mit simuliertem Viewport-Regler.',
          loader: () => import('@/components/kurse/html-css/Responsive'),
        },
      ],
    },
    {
      titel: 'KI-HTML lesen & reparieren',
      untertitel: 'Markup, das eine KI geschrieben hat, souverän handhaben.',
      lektionen: [
        {
          slug: 'ki-html-erkennen',
          titel: 'KI-HTML erkennen',
          icon: '🔍',
          kurzbeschreibung:
            'div-Suppe, Utility-Klassen-Wüsten, generische Namen — die typischen Fingerabdrücke.',
          loader: () => import('@/components/kurse/html-css/KiHtmlErkennen'),
        },
        {
          slug: 'ki-html-lesen',
          titel: 'KI-HTML schnell lesen & verstehen',
          icon: '👓',
          kurzbeschreibung:
            'Struktur-zuerst-Strategie, DevTools als Röntgengerät, Klassennamen ignorieren lernen.',
          loader: () => import('@/components/kurse/html-css/KiHtmlLesen'),
        },
        {
          slug: 'ki-html-bugfixen',
          titel: 'KI-HTML systematisch bugfixen',
          icon: '🛠️',
          kurzbeschreibung:
            'Die häufigsten KI-Bug-Klassen und ein 5-Schritte-Verfahren. Mit interaktiver Bug-Galerie.',
          loader: () => import('@/components/kurse/html-css/KiHtmlBugfixen'),
        },
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben',
          icon: '🏋️',
          kurzbeschreibung:
            'Drei Aufgaben (Card bauen · kaputtes Layout fixen · KI-div-Suppe entwirren) — je mit KI-Review-Prompt.',
          loader: () => import('@/components/kurse/html-css/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
