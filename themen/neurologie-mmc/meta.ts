import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'neurologie-mmc',
  titel: 'Neurologie & Mind-Muscle-Connection',
  kategorie: 'sonstiges',
  kurzbeschreibung:
    'Vom Hirn zum Muskel und zurück – mit Ergotherapie-Blick.',
  beschreibung:
    'Wie eine Bewegung entsteht, was Mind-Muscle-Connection neurologisch ' +
    'bedeutet, warum die Hand so viel Hirnfläche bekommt. Die Lektionen ' +
    'sind didaktisch — aber mit einem Auge auf die Reha-Praxis: jede ' +
    'Theorie endet bei einer konkreten Therapie-Konsequenz.',
  tags: ['neurologie', 'ergotherapie', 'reha', 'motorik', 'mmc'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Vom Hirn zum Muskel, MMC, der Homunkulus.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'homunkulus', 'mind-muscle-connection', 'neuroplastizitaet'],
      akzent: 'from-pink-400 to-rose-500',
    },
    {
      slug: 'lernen',
      titel: 'Lernen & Üben',
      beschreibung: 'Wie das Hirn Bewegung speichert — und wie Übung das beschleunigt.',
      icon: '📈',
      lektionenSlugs: ['motorisches-lernen', 'motor-imagery', 'propriozeption', 'sensorische-integration'],
      akzent: 'from-violet-400 to-indigo-500',
    },
    {
      slug: 'reha',
      titel: 'Reha-Praxis',
      beschreibung: 'Bewährte Methoden + Übungsaufgaben für die eigene Praxis.',
      icon: '🤲',
      lektionenSlugs: ['spiegeltherapie', 'cimt', 'bilaterale-integration', 'handtherapie', 'uebungsaufgaben'],
      akzent: 'from-amber-400 to-orange-500',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Wie eine Bewegung neurologisch entsteht.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Vom Hirn zum Muskel',
          icon: '🧠',
          kurzbeschreibung: 'Die fünf Stationen einer Bewegung — Motorcortex bis Muskelfaser.',
          loader: () => import('@/components/kurse/neurologie-mmc/Einleitung'),
        },
        {
          slug: 'homunkulus',
          titel: 'Der motorische Homunkulus',
          icon: '🗺️',
          kurzbeschreibung: 'Warum die Hand ein Viertel des Cortex bekommt — interaktive Cortex-Karte.',
          loader: () => import('@/components/kurse/neurologie-mmc/Homunkulus'),
        },
        {
          slug: 'neuroplastizitaet',
          titel: 'Neuroplastizität',
          icon: '🌱',
          kurzbeschreibung: 'Synapsen-Stärke live: Wiederholungen, Tage, Spaced Practice.',
          loader: () => import('@/components/kurse/neurologie-mmc/Neuroplastizitaet'),
        },
      ],
    },
    {
      titel: 'Ansteuerung',
      untertitel: 'Wie willkürliche Bewegung wirklich funktioniert.',
      lektionen: [
        {
          slug: 'mind-muscle-connection',
          titel: 'Mind-Muscle-Connection',
          icon: '⚡',
          kurzbeschreibung: 'Aufmerksamkeits-Fokus + Last live als EMG-Modell.',
          loader: () => import('@/components/kurse/neurologie-mmc/MindMuscleConnection'),
        },
        {
          slug: 'motorisches-lernen',
          titel: 'Motorisches Lernen',
          icon: '📈',
          kurzbeschreibung: 'Die drei Phasen nach Fitts & Posner — kognitiv, assoziativ, autonom.',
          loader: () => import('@/components/kurse/neurologie-mmc/MotorischesLernen'),
        },
        {
          slug: 'motor-imagery',
          titel: 'Motor Imagery',
          icon: '💭',
          kurzbeschreibung: 'Mentales Üben ohne Bewegung — und warum es trotzdem wirkt.',
          loader: () => import('@/components/kurse/neurologie-mmc/MotorImagery'),
        },
      ],
    },
    {
      titel: 'Sensorik',
      untertitel: 'Die Rückmeldung, ohne die nichts klappt.',
      lektionen: [
        {
          slug: 'propriozeption',
          titel: 'Propriozeption',
          icon: '📡',
          kurzbeschreibung: 'Der sechste Sinn — wo dein Körper im Raum ist, ohne hinzuschauen.',
          loader: () => import('@/components/kurse/neurologie-mmc/Propriozeption'),
        },
        {
          slug: 'sensorische-integration',
          titel: 'Sensorische Integration',
          icon: '🔀',
          kurzbeschreibung: 'Die sieben Sinne, Ayres-Modell, drei Störungsmuster.',
          loader: () => import('@/components/kurse/neurologie-mmc/SensorischeIntegration'),
        },
      ],
    },
    {
      titel: 'Reha-Praxis',
      untertitel: 'Wo die Theorie in der Therapie ankommt.',
      lektionen: [
        {
          slug: 'spiegeltherapie',
          titel: 'Spiegeltherapie',
          icon: '🪞',
          kurzbeschreibung: 'Ramachandran-Idee: visuelle Täuschung aktiviert kortikale Areale.',
          loader: () => import('@/components/kurse/neurologie-mmc/Spiegeltherapie'),
        },
        {
          slug: 'cimt',
          titel: 'CIMT (Constraint-Induced Movement Therapy)',
          icon: '🤚',
          kurzbeschreibung: 'Gesunde Hand fixieren, betroffene neu lernen — radikal und wirksam.',
          loader: () => import('@/components/kurse/neurologie-mmc/Cimt'),
        },
        {
          slug: 'bilaterale-integration',
          titel: 'Bilaterale Integration',
          icon: '⚖️',
          kurzbeschreibung: 'Symmetrisch, reziprok, asymmetrisch — drei Stufen der Hand-Koordination.',
          loader: () => import('@/components/kurse/neurologie-mmc/BilateraleIntegration'),
        },
        {
          slug: 'handtherapie',
          titel: 'Handtherapie & Greifmuster',
          icon: '🖐️',
          kurzbeschreibung: 'Sechs Standard-Griffe interaktiv — von Pinzette bis Haken.',
          loader: () => import('@/components/kurse/neurologie-mmc/Handtherapie'),
        },
      ],
    },
    {
      titel: 'Übung',
      untertitel: 'Konzepte am eigenen Material prüfen — mit KI-Review.',
      lektionen: [
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben für Ergo-Praxis',
          icon: '🤲',
          kurzbeschreibung:
            'Drei Reflexions-Aufgaben (Greifmuster-Tagebuch · Bewegung verlangsamen · Modell-Fall) mit KI-Review-Prompt.',
          loader: () => import('@/components/kurse/neurologie-mmc/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
