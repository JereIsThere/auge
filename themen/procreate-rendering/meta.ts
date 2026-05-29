import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'procreate-rendering',
  titel: 'Rendering in Procreate',
  kategorie: 'art',
  kurzbeschreibung:
    'Von der Skizze zum plastischen Bild – Licht, Material, Atmosphäre.',
  beschreibung:
    'Rendering ist die Phase, in der ein Bild Volumen und Material bekommt. ' +
    'Procreate ist nur das Werkzeug — die Rendering-Konzepte (Lichtbereiche, ' +
    'Material, Layer-Modi) sind dieselben wie in Photoshop oder klassischer ' +
    'Malerei. Diese Lektionen fokussieren das Procreate-Vokabular dort, wo es ' +
    'spezifisch wird.',
  tags: ['kunst', 'illustration', 'digital', 'procreate', 'rendering'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Was Rendering bedeutet, klassische Lichtbereiche, Layer-Modi — endet mit erster Übung.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'lichtkugel', 'layer-modi', 'uebungsaufgaben'],
      akzent: 'from-rose-400 to-fuchsia-500',
    },
    {
      slug: 'material',
      titel: 'Material',
      beschreibung: 'Was jede Oberfläche anders macht — Haut, Stoff, Metall, Haare. Endet mit Material-Mix-Übung.',
      icon: '🎨',
      lektionenSlugs: ['haut', 'stoff', 'metall', 'haare', 'uebungsaufgaben'],
      akzent: 'from-amber-400 to-orange-500',
    },
    {
      slug: 'atmosphaere',
      titel: 'Atmosphäre',
      beschreibung: 'Der letzte Schliff: Konturlicht und finaler Color-Look. Endet mit Portrait-Übung.',
      icon: '✨',
      lektionenSlugs: ['rim-light', 'color-grading', 'uebungsaufgaben'],
      akzent: 'from-violet-400 to-fuchsia-500',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Die Konzepte, die jenseits von Procreate gelten.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was Rendering wirklich bedeutet',
          icon: '📖',
          kurzbeschreibung: 'Vier Phasen, drei Lichtbestandteile, Werte vor Farbe.',
          loader: () => import('@/components/kurse/procreate-rendering/Einleitung'),
        },
        {
          slug: 'lichtkugel',
          titel: 'Die Lichtkugel',
          icon: '☀️',
          kurzbeschreibung: 'Highlight, Core Shadow, Reflected Light – an einer Kugel mit verstellbarer Lichtquelle.',
          loader: () => import('@/components/kurse/procreate-rendering/Lichtkugel'),
        },
      ],
    },
    {
      titel: 'Procreate-Techniken',
      untertitel: 'Wo die App konkret zum Werkzeug wird.',
      lektionen: [
        {
          slug: 'layer-modi',
          titel: 'Layer-Modi für Rendering',
          icon: '🪟',
          kurzbeschreibung: 'Multiply, Add, Overlay & Co. – interaktive Vorschau auf einer Mini-Szene.',
          loader: () => import('@/components/kurse/procreate-rendering/LayerModi'),
        },
        {
          slug: 'clipping-masks',
          titel: 'Clipping Masks & Alpha Lock',
          icon: '🎭',
          kurzbeschreibung: 'Schatten scopen ohne destruktiv zu werden – Modus-Vergleich live.',
          loader: () => import('@/components/kurse/procreate-rendering/ClippingMasks'),
        },
        {
          slug: 'brushes',
          titel: 'Brushes für Rendering',
          icon: '🖌️',
          kurzbeschreibung: 'Fünf Brush-Familien, jeder Strich live im Vergleich.',
          loader: () => import('@/components/kurse/procreate-rendering/Brushes'),
        },
        {
          slug: 'reference-companion',
          titel: 'Reference Companion',
          icon: '🪞',
          kurzbeschreibung: 'Live-Referenzbild und Color-Picking ohne App-Switch.',
          loader: () => import('@/components/kurse/procreate-rendering/ReferenceCompanion'),
        },
      ],
    },
    {
      titel: 'Materialien',
      untertitel: 'Wie verschiedene Oberflächen Licht reflektieren.',
      lektionen: [
        {
          slug: 'haut',
          titel: 'Haut & Subsurface Scattering',
          icon: '🫥',
          kurzbeschreibung: 'Warum Haut atmet — interaktive SSS-Stärke.',
          loader: () => import('@/components/kurse/procreate-rendering/Haut'),
        },
        {
          slug: 'stoff',
          titel: 'Stoff & Falten',
          icon: '👕',
          kurzbeschreibung: 'Baumwolle, Seide, Leder, Wolle im SVG-Vergleich.',
          loader: () => import('@/components/kurse/procreate-rendering/Stoff'),
        },
        {
          slug: 'metall',
          titel: 'Metall',
          icon: '⚙️',
          kurzbeschreibung: 'Politur-Slider + Umgebungsreflexion – von matt zu Chrom.',
          loader: () => import('@/components/kurse/procreate-rendering/Metall'),
        },
        {
          slug: 'haare',
          titel: 'Haare',
          icon: '💇',
          kurzbeschreibung: 'Strähnen statt Strähne — anisotropes Highlight, Flyaways zum Schluss.',
          loader: () => import('@/components/kurse/procreate-rendering/Haare'),
        },
      ],
    },
    {
      titel: 'Atmosphäre',
      untertitel: 'Was das Bild zusammenhält.',
      lektionen: [
        {
          slug: 'rim-light',
          titel: 'Rim Light & Backlight',
          icon: '✨',
          kurzbeschreibung: 'Vier Beleuchtungs-Setups live an einer Silhouette.',
          loader: () => import('@/components/kurse/procreate-rendering/RimLight'),
        },
        {
          slug: 'color-grading',
          titel: 'Color Grading am Ende',
          icon: '🎞️',
          kurzbeschreibung: 'Vorher/Nachher pro Preset – teal-orange, vintage, kalte Nacht…',
          loader: () => import('@/components/kurse/procreate-rendering/ColorGrading'),
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
            'Drei Aufgaben (Café · Portrait mit Rim Light · Stillleben Material-Mix) – jede mit KI-Review-Prompt zum Kopieren.',
          loader: () => import('@/components/kurse/procreate-rendering/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
