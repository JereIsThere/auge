import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'rsb',
  titel: 'Rechnerorganisation & Betriebssysteme',
  kategorie: 'cs',
  kurzbeschreibung:
    'Wie ein Rechner intern wirklich arbeitet — Start bei den Registern, dem schnellsten Speicher der CPU.',
  beschreibung:
    'RSB (Rechnerorganisation & Betriebssysteme) erklärt die Schichten unter ' +
    'dem Code: vom Transistor über die CPU bis zum Scheduler. Dieser Kurs ' +
    'startet bewusst klein mit einer einzigen, voll ausgebauten Lektion über ' +
    'Register — den schnellsten Speicher direkt im Prozessor. Weitere Lektionen ' +
    '(Befehlszyklus, Speicherhierarchie, Prozesse) kommen Schritt für Schritt dazu.',
  tags: ['cpu', 'register', 'betriebssysteme', 'hardware', 'grundlagen'],
  status: 'in-arbeit',
  gruppen: [
    {
      titel: 'Die CPU von innen',
      untertitel: 'Wo Daten verarbeitet werden, bevor irgendetwas in den RAM geht.',
      lektionen: [
        {
          slug: 'register',
          titel: 'Register: der schnellste Speicher der CPU',
          icon: '🗄️',
          kurzbeschreibung:
            'Was Register sind, warum es sie gibt und welche Sorten eine CPU braucht — mit interaktivem 8-Bit-Register.',
          loader: () => import('@/components/kurse/rsb/Register'),
        },
        {
          slug: 'befehlszyklus',
          titel: 'Der Befehlszyklus (Fetch–Decode–Execute)',
          icon: '🔁',
          kurzbeschreibung:
            'Wie PC, IR und das Steuerwerk zusammen einen Befehl nach dem anderen abarbeiten.',
          kommtNoch: true,
        },
        {
          slug: 'speicherhierarchie',
          titel: 'Speicherhierarchie: Register, Cache, RAM, Platte',
          icon: '🪜',
          kurzbeschreibung:
            'Warum schneller Speicher klein und teuer ist — und langsamer Speicher groß und billig.',
          kommtNoch: true,
        },
      ],
    },
  ],
};

export default thema;
