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
      'Zettel: Schreib-Modus (lineiert) · Mal-Modus (Paint×PPT)',
      'Drop: cross-platform Datei-Transfer (WebRTC, AirDrop-Style)',
      'dann-Page: Roadmap-Cockpit direkt in Hand',
      'Bookmarks/Embeds Dashboard via OrientDB',
    ],
    deps: ['gehirn'],
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
    mx: 738, my: 268,
  },
  {
    id:      'dann2',
    name:    'dann2',
    emoji:   '🗺️',
    tagline: 'Roadmap-Store — alle roadmap.*.md, live aggregiert aus allen Repos.',
    status:  'in-progress',
    group:   'Infra',
    url:     'https://github.com/JereIsThere/dann2',
    details: [
      'GitHub Action scannt alle JereIsThere-Repos alle 30 min',
      'Findet roadmap.*.md → aggregiert in external/',
      'loadRoadmaps() lädt aus mehreren Quellen mit Source-Label',
      'Live: jeremias-groehl.de/roadmaps',
      'Auto-Bump Submodule-Pointer in auge-framework',
    ],
    deps: [],
    mx: 132, my: 492,
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
    deps: ['dann2'],
    mx: 312, my: 504,
  },
  {
    id:      'speicher',
    name:    'speicher',
    emoji:   '💾',
    tagline: 'Self-hosted Personal Cloud — Nextcloud-Style, backed by MinIO (Port 9000).',
    status:  'planned',
    group:   'Infra',
    details: [
      'MinIO als Backend (S3-kompatibel, Docker, Port 9000/9001)',
      'Nextcloud-artiger Zugriff: Web-UI, WebDAV, Mobile-App',
      'gehirn gen/image → speicher statt flüchtige xAI-URLs',
      'Hand Drop-Page → speicher als persistentes Backend',
      'Galerie-Page in Hand: zeigt gespeicherte Bilder/Dateien',
      'Kein Google Drive, kein iCloud — vollständig selbst gehostet',
    ],
    deps: ['gehirn', 'hand'],
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
