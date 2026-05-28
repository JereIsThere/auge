import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'mcp',
  titel: 'MCP',
  kategorie: 'cs',
  kurzbeschreibung:
    'Model Context Protocol – ein einheitlicher Adapter zwischen LLM-Agenten und Tools.',
  beschreibung:
    'MCP ist das, was LSP für IDEs war: ein offenes Protokoll, das den Agenten von der ' +
    'Integration befreit. Wir gehen die drei Primitives durch (Tools, Resources, Prompts), ' +
    'schauen tief in JSON-RPC und Transports, bauen einen eigenen Server, und decken die ' +
    'beiden wichtigsten Sicherheits-Pattern ab — Prompt Injection und Confused Deputy.',
  tags: ['llm', 'protocol', 'agents', 'tools'],
  status: 'fertig',
  pfade: [
    {
      slug: 'einstieg',
      titel: 'Einstieg',
      beschreibung: 'Was MCP ist, wie ein Tool-Call abläuft, wo es vs. REST anders ist.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'tool-call', 'vs-api'],
      akzent: 'from-sky-500 to-indigo-600',
    },
    {
      slug: 'primitives',
      titel: 'Die Primitives',
      beschreibung: 'Tools kennst du. Hier kommen Resources, Prompts, Sampling.',
      icon: '🧩',
      lektionenSlugs: ['resources', 'prompts', 'sampling'],
      akzent: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'unter-der-haube',
      titel: 'Unter der Haube',
      beschreibung: 'JSON-RPC, Transports und ein Server, den du selbst baust.',
      icon: '🔧',
      lektionenSlugs: ['json-rpc', 'transport', 'server-bauen'],
      akzent: 'from-amber-500 to-orange-600',
    },
    {
      slug: 'sicherheit-und-praxis',
      titel: 'Sicherheit & Übung',
      beschreibung: 'Die beiden großen Angriffs-Klassen — und drei Übungsaufgaben mit KI-Review.',
      icon: '🔒',
      lektionenSlugs: ['prompt-injection', 'confused-deputy', 'uebungsaufgaben'],
      akzent: 'from-rose-500 to-red-600',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Was MCP ist – und was es nicht ist.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was ist MCP?',
          icon: '📖',
          kurzbeschreibung: 'Tools · Resources · Prompts – die drei Primitives.',
          loader: () => import('@/components/kurse/mcp/Einleitung'),
        },
        {
          slug: 'tool-call',
          titel: 'Tool-Call von A bis Z',
          icon: '🛠️',
          kurzbeschreibung: 'Wer redet wann mit wem – interaktiver 8-Schritte-Flow.',
          loader: () => import('@/components/kurse/mcp/ToolCallFlow'),
        },
        {
          slug: 'vs-api',
          titel: 'MCP vs. klassische API',
          icon: '⚖️',
          kurzbeschreibung: 'Was MCP neu macht – und wann es Overkill ist.',
          loader: () => import('@/components/kurse/mcp/VsApi'),
        },
      ],
    },
    {
      titel: 'Die Primitives',
      untertitel: 'Tools kennst du schon — hier die anderen drei.',
      lektionen: [
        {
          slug: 'resources',
          titel: 'Resources',
          icon: '📁',
          kurzbeschreibung: 'Lesbare Datenquellen mit URI — interaktiver Resource-Browser.',
          loader: () => import('@/components/kurse/mcp/Resources'),
        },
        {
          slug: 'prompts',
          titel: 'Prompts',
          icon: '📜',
          kurzbeschreibung: 'Server-bereitgestellte Prompt-Templates — live mit Argument-Filler.',
          loader: () => import('@/components/kurse/mcp/Prompts'),
        },
        {
          slug: 'sampling',
          titel: 'Sampling',
          icon: '↩️',
          kurzbeschreibung: 'Die Rück-Richtung: Server bittet Client um eine LLM-Inferenz.',
          loader: () => import('@/components/kurse/mcp/Sampling'),
        },
      ],
    },
    {
      titel: 'Unter der Haube',
      untertitel: 'Wire-Format, Transport-Schichten, eigener Server.',
      lektionen: [
        {
          slug: 'json-rpc',
          titel: 'JSON-RPC im Detail',
          icon: '📡',
          kurzbeschreibung: 'Request, Response, Error, Notification — alle vier Message-Typen mit Live-Beispielen.',
          loader: () => import('@/components/kurse/mcp/JsonRpc'),
        },
        {
          slug: 'transport',
          titel: 'Transport: stdio · SSE · HTTP',
          icon: '🚌',
          kurzbeschreibung: 'Drei Transports im Direktvergleich — wann welcher passt.',
          loader: () => import('@/components/kurse/mcp/Transport'),
        },
        {
          slug: 'server-bauen',
          titel: 'Einen eigenen Server bauen',
          icon: '🔧',
          kurzbeschreibung: 'Sieben Schritte zum eigenen Server — Python und TypeScript Seite an Seite.',
          loader: () => import('@/components/kurse/mcp/ServerBauen'),
        },
      ],
    },
    {
      titel: 'Sicherheit',
      untertitel: 'Was kann schiefgehen, wenn ein LLM Tools aufrufen darf?',
      lektionen: [
        {
          slug: 'prompt-injection',
          titel: 'Prompt Injection via Tool-Result',
          icon: '🪤',
          kurzbeschreibung: 'Drei reale Patterns + Schutz-Schichten.',
          loader: () => import('@/components/kurse/mcp/PromptInjection'),
        },
        {
          slug: 'confused-deputy',
          titel: 'Confused Deputy',
          icon: '🎭',
          kurzbeschreibung: 'Über-privilegierter Server, naïver Tool-Call — und wie OAuth das löst.',
          loader: () => import('@/components/kurse/mcp/ConfusedDeputy'),
        },
      ],
    },
    {
      titel: 'Übung',
      untertitel: 'Konzepte am eigenen Server prüfen — mit KI-Review.',
      lektionen: [
        {
          slug: 'uebungsaufgaben',
          titel: 'Übungsaufgaben für MCP-Praxis',
          icon: '🧪',
          kurzbeschreibung:
            'Drei Aufgaben (Tool-Schema · Mini-Server · Sicherheits-Audit) mit KI-Review-Prompt.',
          loader: () => import('@/components/kurse/mcp/Uebungsaufgaben'),
        },
      ],
    },
  ],
};

export default thema;
