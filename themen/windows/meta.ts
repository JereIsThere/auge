import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'windows',
  titel: 'Windows besser nutzen',
  kategorie: 'cs',
  kurzbeschreibung:
    'Vom Maus-Klicker zum Power-User — Shortcuts, Fenster, blitzschnelles Öffnen und PowerShell.',
  beschreibung:
    'Die meisten benutzen Windows wie vor zwanzig Jahren: alles mit der Maus, ' +
    'jedes Programm aus dem Startmenü gesucht. Dabei steckt unter der Oberfläche ' +
    'ein schnelles, tastatur-getriebenes System. Dieser Kurs macht dich zum ' +
    'Power-User: die Shortcuts, die wirklich Zeit sparen, Fenster- und ' +
    'Desktop-Management, Programme in unter einer Sekunde öffnen — und ein ' +
    'solides Fundament in Terminal und PowerShell, der eigentlichen ' +
    'Fernbedienung deines Rechners.',
  tags: ['windows', 'produktivität', 'shortcuts', 'powershell', 'terminal', 'cli'],
  status: 'fertig',
  akzent: 'from-sky-500 to-blue-700',
  pfade: [
    {
      slug: 'tastatur',
      titel: 'Tastatur & Fenster',
      beschreibung:
        'Die Shortcuts, die zählen, Fenster- und Desktop-Management und Programme in Sekundenbruchteilen öffnen.',
      icon: '⌨️',
      lektionenSlugs: ['shortcuts', 'fenster-desktops', 'programme-oeffnen'],
      akzent: 'from-cyan-400 to-sky-500',
    },
    {
      slug: 'terminal',
      titel: 'Terminal & PowerShell',
      beschreibung:
        'CMD, PowerShell, Windows Terminal, WSL — und wie du die Shell für Navigation, Dateien und die Pipeline nutzt.',
      icon: '⌨️',
      lektionenSlugs: [
        'terminal-landschaft',
        'powershell-grundlagen',
        'navigieren-dateien',
        'pipeline-praxis',
      ],
      akzent: 'from-blue-500 to-indigo-600',
    },
    {
      slug: 'power-user',
      titel: 'Power-User & Übung',
      beschreibung:
        'Eingebaute Power-Tools und drei Übungsaufgaben mit KI-Review, die alles verbinden.',
      icon: '🚀',
      lektionenSlugs: ['power-tools', 'uebungsaufgaben'],
      akzent: 'from-violet-500 to-fuchsia-600',
    },
  ],
  gruppen: [
    {
      titel: 'Schneller mit der Tastatur',
      untertitel: 'Shortcuts, Fenster und das blitzschnelle Öffnen von Programmen.',
      lektionen: [
        {
          slug: 'shortcuts',
          titel: 'Die Shortcuts, die wirklich zählen',
          icon: '⌨️',
          kurzbeschreibung:
            'Die Windows-Taste als Zentrum. Interaktive, filterbare Shortcut-Übersicht zum Suchen.',
          loader: () => import('@/components/kurse/windows/Shortcuts'),
        },
        {
          slug: 'fenster-desktops',
          titel: 'Fenster & virtuelle Desktops',
          icon: '🪟',
          kurzbeschreibung:
            'Snap-Layouts, Win+Pfeile, Task-Ansicht und mehrere Desktops — mit interaktivem Snap-Demo.',
          loader: () => import('@/components/kurse/windows/FensterDesktops'),
        },
        {
          slug: 'programme-oeffnen',
          titel: 'Programme blitzschnell öffnen',
          icon: '🚀',
          kurzbeschreibung:
            'Start-Suche, Taskleiste (Win+1..9) und der Ausführen-Dialog — mit Such-Simulator & Win+R-Referenz.',
          loader: () => import('@/components/kurse/windows/ProgrammeOeffnen'),
        },
      ],
    },
    {
      titel: 'Terminal & PowerShell',
      untertitel: 'Die Fernbedienung deines Rechners.',
      lektionen: [
        {
          slug: 'terminal-landschaft',
          titel: 'CMD, PowerShell, Terminal & WSL',
          icon: '🧭',
          kurzbeschreibung:
            'Was ist was? Shell vs. Terminal, die vier Optionen — und wann du welche nimmst.',
          loader: () => import('@/components/kurse/windows/TerminalLandschaft'),
        },
        {
          slug: 'powershell-grundlagen',
          titel: 'PowerShell-Grundlagen',
          icon: '💠',
          kurzbeschreibung:
            'Cmdlets (Verb-Noun), Aliase, Get-Help, Tab-Vervollständigung — mit interaktivem Konsolen-Simulator.',
          loader: () => import('@/components/kurse/windows/PowershellGrundlagen'),
        },
        {
          slug: 'navigieren-dateien',
          titel: 'Navigieren & Dateien verwalten',
          icon: '📁',
          kurzbeschreibung:
            'cd, ls, mkdir, copy, move, del, Get-Content — Ordner und Dateien ohne Maus.',
          loader: () => import('@/components/kurse/windows/NavigierenDateien'),
        },
        {
          slug: 'pipeline-praxis',
          titel: 'Die Pipeline & Praxis',
          icon: '🔗',
          kurzbeschreibung:
            'Objekte statt Text: Get-Process | Where | Sort, Select-String, als Admin, Execution Policy.',
          loader: () => import('@/components/kurse/windows/PipelinePraxis'),
        },
      ],
    },
    {
      titel: 'Power-User & Übung',
      untertitel: 'Eingebaute Werkzeuge und dein Wissen am eigenen Rechner.',
      lektionen: [
        {
          slug: 'power-tools',
          titel: 'Eingebaute Power-Tools',
          icon: '🧰',
          kurzbeschreibung:
            'Task-Manager, Zwischenablage-Verlauf (Win+V), Screenshots (Win+Shift+S), Win+X, PowerToys.',
          loader: () => import('@/components/kurse/windows/PowerTools'),
        },
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben',
          icon: '🏋️',
          kurzbeschreibung:
            'Drei Aufgaben (Tastatur-Tag · Datei-Aufräumen per Shell · PowerShell-Einzeiler) — je mit KI-Review.',
          loader: () => import('@/components/kurse/windows/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
