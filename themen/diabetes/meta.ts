import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'diabetes',
  titel: 'Diabetes & CGM',
  kategorie: 'sonstiges',
  kurzbeschreibung:
    'Insulin, Resorption, CGM-Setup — verstehen wie Typ-1-Management funktioniert.',
  beschreibung:
    'Insulinanaloga im Vergleich, Pen vs. Pumpe, CGM-Apps einrichten: ' +
    'Diese Lektionen erklären die Mechanismen hinter dem Diabetes-Management ' +
    'verständlich — ohne medizinische Vorkenntnisse.',
  tags: ['diabetes', 'insulin', 'cgm', 'dexcom', 'xdrip', 'juggluco', 'gesundheit'],
  status: 'in-arbeit',
  akzent: 'from-blue-400 to-cyan-500',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Insulin verstehen, Pen vs. Pumpe, CGM einrichten.',
      icon: '🩺',
      lektionenSlugs: ['insulin-vergleich', 'pen-vs-pumpe', 'juggluco-xdrip-setup'],
      akzent: 'from-blue-400 to-cyan-500',
    },
  ],
  gruppen: [
    {
      titel: 'Insulin & Resorption',
      untertitel: 'Wie Insulinanaloga wirken und was die Verabreichungsform ändert.',
      lektionen: [
        {
          slug: 'insulin-vergleich',
          titel: 'Fiasp, NovoRapid, Humalog im Vergleich',
          icon: '💉',
          kurzbeschreibung:
            'Wirkbeginn, Peak, Dauer — und warum manche Analoga schneller sind.',
          loader: () => import('@/components/kurse/diabetes/InsulinVergleich'),
        },
        {
          slug: 'pen-vs-pumpe',
          titel: 'Resorption: Pen vs. Pumpe',
          icon: '🔄',
          kurzbeschreibung:
            'Depot-Größe, Injektionsstelle, Lipohypertrophie — was den Unterschied macht.',
          loader: () => import('@/components/kurse/diabetes/PenVsPumpe'),
        },
      ],
    },
    {
      titel: 'CGM-Setup',
      untertitel: 'Kontinuierliche Glukosemessung mit Open-Source-Apps.',
      lektionen: [
        {
          slug: 'juggluco-xdrip-setup',
          titel: 'Juggluco + xDrip+ für Dexcom G6/G7',
          icon: '📱',
          kurzbeschreibung:
            'Schritt-für-Schritt: CGM-Daten ohne offizielle App auslesen und verteilen.',
          loader: () => import('@/components/kurse/diabetes/JuglucoXdripSetup'),
        },
      ],
    },
  ],
};

export default thema;
