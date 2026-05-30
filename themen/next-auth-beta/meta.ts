import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'next-auth-beta',
  titel: 'Auth.js v5 (next-auth@beta)',
  kategorie: 'cs',
  kurzbeschreibung:
    'Authentifizierung im App Router — ein universelles auth() statt fünf APIs.',
  beschreibung:
    'next-auth@beta ist Auth.js v5: die große Vereinfachung für den App Router. ' +
    'Statt getServerSession, getToken, getSession, withAuth und useSession gibt es ' +
    'genau eine Funktion — auth() — die in Server Components, Route Handlers, Server ' +
    'Actions und Middleware funktioniert. Wir gehen das Setup durch (auth.ts, ' +
    'Route-Handler, AUTH_-Env), lesen Sessions in allen Kontexten, schützen Routen ' +
    'mit dem neuen authorized-Callback und lösen das Edge-Problem mit der Split-Config.',
  tags: ['nextjs', 'auth', 'app-router', 'typescript', 'oauth'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Was v5 anders macht, das Setup in vier Exports, Sessions lesen.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'setup', 'session-lesen'],
      akzent: 'from-sky-500 to-indigo-600',
    },
    {
      slug: 'schutz',
      titel: 'Schutz & Edge',
      beschreibung: 'Routen schützen mit Middleware + authorized, und das Edge-Problem.',
      icon: '🛡️',
      lektionenSlugs: ['routen-schuetzen', 'edge-split'],
      akzent: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'praxis',
      titel: 'Übung',
      beschreibung: 'Drei Aufgaben vom Login bis zur geschützten Route — mit KI-Review.',
      icon: '🧪',
      lektionenSlugs: ['uebungsaufgaben'],
      akzent: 'from-rose-500 to-red-600',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Was v5 ist — und warum es alles einfacher macht.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was Auth.js v5 anders macht',
          icon: '📖',
          kurzbeschreibung:
            'Rebranding, das universelle auth(), und welche fünf APIs es ersetzt.',
          loader: () => import('@/components/kurse/next-auth-beta/Einleitung'),
        },
        {
          slug: 'setup',
          titel: 'Setup: auth.ts, Route-Handler, Env',
          icon: '⚙️',
          kurzbeschreibung:
            'Die vier Exports, der zwei-Zeilen-Route-Handler und die AUTH_-Konvention.',
          loader: () => import('@/components/kurse/next-auth-beta/Setup'),
        },
        {
          slug: 'session-lesen',
          titel: 'Session lesen mit auth()',
          icon: '🔍',
          kurzbeschreibung:
            'Server Component, Route Handler, Client — wo dieselbe Funktion wie funktioniert.',
          loader: () => import('@/components/kurse/next-auth-beta/SessionLesen'),
        },
      ],
    },
    {
      titel: 'Schutz & Edge',
      untertitel: 'Routen absichern — und der Stolperstein mit der Edge-Runtime.',
      lektionen: [
        {
          slug: 'routen-schuetzen',
          titel: 'Routen schützen: Middleware & authorized',
          icon: '🛡️',
          kurzbeschreibung:
            'Der neue authorized-Callback, der Middleware-Export und signIn/signOut als Server Action.',
          loader: () => import('@/components/kurse/next-auth-beta/RoutenSchuetzen'),
        },
        {
          slug: 'edge-split',
          titel: 'Das Edge-Problem & die Split-Config',
          icon: '⚡',
          kurzbeschreibung:
            'Warum ein DB-Adapter die Middleware sprengt — und wie auth.config.ts es löst.',
          loader: () => import('@/components/kurse/next-auth-beta/EdgeSplit'),
        },
      ],
    },
    {
      titel: 'Übung',
      untertitel: 'Vom Login-Button bis zur geschützten Route — mit KI-Review.',
      lektionen: [
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben für Auth.js v5',
          icon: '🧪',
          kurzbeschreibung:
            'Drei Aufgaben (Login-Flow · Session-Anzeige · Route-Schutz) mit KI-Review-Prompt.',
          loader: () => import('@/components/kurse/next-auth-beta/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
