/**
 * ecosystem.ts — zentrale Datenquelle für das auge-Ökosystem.
 *
 * Wird von /framework (Übersichts-Grid) und /karte (2D-Map) verwendet.
 * Neue Projekte hier eintragen, Rest wird automatisch übernommen.
 *
 * mx / my: Position im SVG-Viewport (viewBox "0 0 1000 640").
 */

export type NodeStatus = 'live' | 'in-progress' | 'planned'
export type NodeGroup  = 'Apps' | 'Infra'

export interface EcoNode {
  id:       string
  name:     string
  emoji:    string
  /** Einzeiler für Karten und Popups */
  tagline:  string
  status:   NodeStatus
  group:    NodeGroup
  port?:    string
  url?:     string
  /** Stichpunkte für das Detail-Popup */
  details:  string[]
  /** IDs anderer EcoNodes, von denen dieses Projekt abhängt */
  deps:     string[]
  /** ADR-Nummern die zu diesem Node gehören (z.B. ['0002', '0007']) */
  adrs:     string[]
  /** Key in healthByNode → 'hand' | 'gehirn' | 'funkner' */
  healthId?: string
  /** Vollständiger Tech/Arch-Kontext — was Agents in CLAUDE.md sehen (für /karte Popup) */
  context:  string[]
  /** Tabs / Routen — für Apps mit mehreren Bereichen */
  areas?:   string[]
  /** Position auf der 2D-Karte (SVG-Einheiten, 0-1000 × 0-640) */
  mx: number
  my: number
}

export const NODES: EcoNode[] = [
  {
    id:      'auge',
    name:    'auge',
    emoji:   '👁️',
    tagline: 'Next.js Lernportal — interaktive Lektionen, Tiefen-Boxen, Quellenlinks.',
    status:  'live',
    group:   'Apps',
    url:     'https://github.com/JereIsThere/auge',
    details: [
      'Next.js 15, App Router, statisch-nah deploybar',
      'Themen-System mit Lektionen, Gruppen, Pfaden',
      'Blog-Feed, KommtNoch-Liste',
      'Live: auge2.jeremias-groehl.de',
    ],
    deps: [],
    adrs: ['0001'],
    context: [
      'Next.js 15 App Router · TypeScript · Tailwind',
      'DB-frei: Themen = TypeScript-Dateien unter themen/<slug>/meta.ts',
      'Deploy: auge-framework self-hosted runner → Docker (Port 3010 intern)',
      'Submission-Pipeline: buildSubmission() in hand → PR auf JereIsThere/auge',
      'ISR-Pattern: active-prs.ts revalidiert alle 10 min (live PR-Badges)',
      '/karte: 2D-Ökosystem-Map mit ADR-Chips + live Health-Dots',
      'Agents: neue themen/<slug>/meta.ts + Components anlegen, dann PR öffnen',
    ],
    mx: 500, my: 115,
  },
  {
    id:      'hand',
    name:    'hand',
    emoji:   '✋',
    tagline: 'Main App — tägliches Cockpit mit Sprecher, Zettel, Drop, dann.',
    status:  'in-progress',
    group:   'Apps',
    port:    '3737',
    url:     'https://github.com/JereIsThere/hand',
    details: [
      'Sprecher: Chat mit Mode-Selector 📝🖼️🎬 + Modell-Dropdown',
      'Zettel: Schreib-Modus (lineiert) · Tafel: SVG-Paint + PPTX-Style',
      'Drop: cross-platform Datei-Transfer (WebRTC, AirDrop-Style)',
      'roadmaps: Milestone-Spalten + Drag & Drop für private Projekte',
      'screens: Smart-Home-Display-Verwaltung + Quick-Capture',
    ],
    deps: ['gehirn'],
    adrs: ['0001', '0006', '0012', '0013'],
    healthId: 'hand',
    context: [
      'Express.js · Vanilla JS/HTML · Node.js · Port 3737',
      'OrientDB: Submissions, Snippets, Roadmap-Milestones, Screen-Configs, Captures',
      'Submissions-Admin bleibt bis gehirn-admin existiert',
      'buildSubmission(): GitHub API → Branch → meta.ts → PR auf JereIsThere/auge',
      'Atlas Cloud Image-Modelle wählbar im Sprecher (via gehirn /gen/image)',
    ],
    areas: [
      'Sprecher — Chat + Mode-Selector (Text/Bild/Video) + Modell-Dropdown via gehirn',
      'Zettel — lineierter Schreibmodus (reines Schreiben)',
      'Tafel — SVG-Paint + PPTX-Style (visuelles Arbeiten)',
      'Drop — WebRTC Dateitransfer, AirDrop-Style, cross-platform',
      'roadmaps — Milestone-Spalten + Drag & Drop für private Projekte (ADR 0012)',
      'screens — Smart-Home-Display-Verwaltung + Quick-Capture (ADR 0013)',
      'Submissions-Admin — offene Submissions genehmigen/ablehnen/bauen',
    ],
    mx: 248, my: 318,
  },
  {
    id:      'gehirn',
    name:    'gehirn',
    emoji:   '🧠',
    tagline: 'Express-API — Gen-Text/Image/Video via Grok + Snippet-VectorDB via OrientDB.',
    status:  'in-progress',
    group:   'Infra',
    port:    '4000',
    url:     'https://github.com/JereIsThere/gehirn',
    details: [
      'POST /gen/text · /gen/image · /gen/video',
      'GET /models → filtert nach vorhandenen API-Keys',
      'Modell-Registry: grok-3-mini (cheap) · grok-4-latest (normal)',
      'Zentrale Key-Verwaltung via Docker ENV',
      'OrientDB Vector-Index (bits): verifizierte Snippets (nginx, JSX, shell, MCP)',
      'search_bits("nginx reverse proxy") → fertiger Block statt Halluzination',
    ],
    deps: [],
    adrs: ['0004', '0006', '0007', '0008'],
    healthId: 'gehirn',
    context: [
      'Express.js · Node.js · Port 4000 (API) + 3738 (Admin-Panel, geplant)',
      'POST /gen/text · /gen/image · /gen/video — unified KI-Gateway',
      'GET /models → filtert nach vorhandenen API-Keys (nur verfügbare Modelle)',
      'Provider: xAI (Grok-3-mini, Grok-4), OpenAI, Anthropic, Atlas Cloud',
      'Atlas Cloud Image-Modelle: flux-2-pro, imagen-4-ultra, ideogram-v3, z-image-turbo, seedream-5',
      'bits: OrientDB Lucene-Vector-Index für verifizierte Snippets (nginx, JSX, MCP, shell)',
      '/deploy/* Routen: Docker-Socket-Mount → Service-Status + Rolling-Update-Triggering',
      'gehirn-admin (Port 3738, geplant): OrientDB-CRUD, SSH-Tunnel, Submissions, bits-Verwaltung',
    ],
    areas: [
      'API (Port 4000) — /gen/text · /gen/image · /gen/video · /models',
      'bits — Snippet-VectorDB via OrientDB Lucene',
      'deploy — /deploy/status · /deploy/update/:service · /deploy/log/:service',
      'Admin-Panel (Port 3738, geplant) — OrientDB-CRUD, SSH-Tunnel, Submissions',
    ],
    mx: 738, my: 268,
  },
  {
    id:      'funkner',
    name:    'funkner',
    emoji:   '⚡',
    tagline: 'CLI + KI-Agent-Sammlung. Schreibt in OrientDB statt MD-Dateien.',
    status:  'planned',
    group:   'Infra',
    port:    '3100',
    url:     'https://github.com/JereIsThere/funkner',
    details: [
      'Agent-Pattern: verb + [service-override]? + content',
      '"dj, spiel band deftones" → preferred service aus User-Settings',
      '"dj spiel [spotify] song X" → erzwingt Spotify',
      'funkner roadmap add/done → ersetzt manuelle MD-Edits',
      'Zentraler Vault pro GitHub-User',
    ],
    deps: [],
    adrs: ['0002', '0007'],
    healthId: 'funkner',
    context: [
      'Node.js · HTTP-Service Port 3100',
      'Pattern: verb + [service-override]? + content (analog DJ-Syntax)',
      'v0.1: denk (→ gehirn /gen/text, SSE-Streaming), merke, lies (OrientDB Snippets)',
      'v0.2: roadmap add/done/blocks/prio → OrientDB Task-Vertex + Blocks-Edge',
      'GET /roadmap → priorisierte Task-Liste für auge /dann und hand Projekte-Tab',
      'Vault: zentraler Snippet-Store pro GitHub-User (OrientDB)',
      'Settings (preferred services, Key-Priorität) liegen in OrientDB',
    ],
    mx: 312, my: 504,
  },
  {
    id:      'auge-app',
    name:    'auge-app',
    emoji:   '🖥️',
    tagline: 'Desktop Launcher — startet alle Module, zeigt Status, switcht zwischen Apps.',
    status:  'planned',
    group:   'Apps',
    details: [
      'Electron-Shell (extrahiert aus hand/electron/) — kein Neubau',
      'Launcher-Modus: Übersicht aller Module + Start/Stop via gehirn /deploy/*',
      'App-Modi: hand · gehirn-admin · auge (BrowserWindow-URL wechseln)',
      'Onboarding-Flow: Master-Passwort → OS-Keychain → Bearer-Token für gehirn',
      'speicher-Tab: Galerie + Upload (macht erst mit Launcher-Shell Sinn)',
    ],
    deps: ['gehirn'],
    adrs: ['0005', '0011'],
    context: [
      'Electron · Node.js · kein eigenes Repo (liegt in auge-framework/auge-app/)',
      'Launcher-Modus (Default): Status-Dots via GET /deploy/status, Start/Stop via POST /deploy/update/:service',
      'Modi: launcher | hand (3737) | gehirn-admin (3738) | auge (3010) — per --mode Argument',
      'Auth-Onboarding: GEHIRN_ADMIN_SECRET als Bearer-Token → Electron safeStorage (OS-Keychain)',
      'speicher-Tab: erst sinnvoll wenn Desktop-Launcher existiert (ADR 0003 ∧ 0011)',
      'Android (geplant): Capacitor wraps statisches Bundle — setzt ADR 0006 voraus',
      'Voraussetzung: gehirn /deploy/* implementiert (ADR 0008) + Bearer-Auth (ADR 0011)',
    ],
    areas: [
      'Launcher — Modul-Übersicht, Start/Stop, Logs',
      'hand-Modus — wraps hand Cockpit (Port 3737)',
      'gehirn-Modus — wraps gehirn-admin (Port 3738)',
      'auge-Modus — wraps auge Lernportal (Port 3010)',
      'speicher-Tab — Galerie, Upload, freier Speicher (geplant)',
    ],
    mx: 500, my: 420,
  },
  {
    id:      'speicher',
    name:    'speicher',
    emoji:   '💾',
    tagline: 'Self-hosted Datei-Storage — MinIO intern, gehirn ist der einzige Gateway.',
    status:  'planned',
    group:   'Infra',
    details: [
      'MinIO als S3-Backend (Docker, intern — kein öffentlicher Port)',
      'gehirn ist der einzige Gateway: /speicher/* Routen auf Port 4000',
      'gehirn gen/image → speicher statt flüchtige xAI-URLs',
      'hand Drop-Page → Dateien via POST /speicher/upload',
      'Galerie in hand / gehirn-admin: Bilder + Dokumente browsen',
      'Kein Google Drive, kein iCloud — vollständig selbst gehostet',
    ],
    deps: ['gehirn'],
    adrs: ['0003'],
    context: [
      'MinIO S3 · interner Docker-Container · kein öffentlicher Port (ADR 0003)',
      'gehirn ist Gateway: /speicher/upload · /speicher/:bucket/:key · /speicher/list',
      'Auth + Rate-Limiting zentral in gehirn — kein direkter MinIO-Zugriff',
      'Buckets: generated-images, drop, documents',
      'gehirn gen/image → persistente gehirn-URL statt flüchtige xAI-URLs',
      'hand Drop-Page → POST /speicher/upload statt WebRTC-only',
    ],
    mx: 806, my: 458,
  },
]

// ── Lookup helpers ─────────────────────────────────────────────────────────

export function getNode(id: string): EcoNode | undefined {
  return NODES.find(n => n.id === id)
}

/** Alle direkten Dependency-Paare (from depends on to). */
export function getEdges(): Array<{ from: EcoNode; to: EcoNode }> {
  const edges: Array<{ from: EcoNode; to: EcoNode }> = []
  for (const node of NODES) {
    for (const depId of node.deps) {
      const target = getNode(depId)
      if (target) edges.push({ from: node, to: target })
    }
  }
  return edges
}

// ── Visual constants ────────────────────────────────────────────────────────

export const STATUS_COLOR: Record<NodeStatus, string> = {
  'live':        '#00d4c8',
  'in-progress': '#d4a200',
  'planned':     '#6b00cc',
}

export const STATUS_LABEL: Record<NodeStatus, string> = {
  'live':        'live',
  'in-progress': 'in progress',
  'planned':     'planned',
}

/** Radius der Haupt-Circle je Status. */
export const NODE_RADIUS: Record<NodeStatus, number> = {
  'live':        27,
  'in-progress': 22,
  'planned':     17,
}

/** Radius der äußeren Glow-Circle. */
export const GLOW_RADIUS: Record<NodeStatus, number> = {
  'live':        52,
  'in-progress': 42,
  'planned':     32,
}
