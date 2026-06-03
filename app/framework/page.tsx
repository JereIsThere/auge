import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './framework.module.css'

export const metadata: Metadata = {
  title: 'Framework — auge',
  description: 'Übersicht über das auge-Framework und alle Subprojekte.',
}

type Status = 'live' | 'in-progress' | 'planned'

type Repo = {
  name: string
  emoji: string
  tagline: string
  status: Status
  group: string
  url?: string
  port?: string
  details: string[]
  deps?: string[]
}

const REPOS: Repo[] = [
  {
    name: 'auge',
    emoji: '👁️',
    tagline: 'Next.js Lernportal — interaktive Lektionen, Tiefen-Boxen, Quellenlinks.',
    status: 'live',
    group: 'Apps',
    url: 'https://github.com/JereIsThere/auge',
    details: [
      'Next.js 15, App Router, statisch-nah deploybar',
      'Themen-System mit Lektionen, Gruppen, Pfaden',
      'Blog-Feed, KommtNoch-Liste',
    ],
  },
  {
    name: 'hand',
    emoji: '✋',
    tagline: 'Main App — tägliches Cockpit mit Sprecher, Zettel, Drop, dann.',
    status: 'in-progress',
    group: 'Apps',
    url: 'https://github.com/JereIsThere/hand',
    port: '3737',
    details: [
      'Sprecher: Chat mit Mode-Selector 📝🖼️🎬 + Modell-Dropdown',
      'Zettel: Schreib-Modus (lineiert) · Mal-Modus (Paint×PPT)',
      'Drop: cross-platform Datei-Transfer (WebRTC, AirDrop-Style)',
      'dann-Page: Roadmap-Cockpit direkt in Hand',
      'Bookmarks/Embeds Dashboard via OrientDB',
    ],
    deps: ['gehirn', 'OrientDB'],
  },
  {
    name: 'gehirn',
    emoji: '🧠',
    tagline: 'Express-API — Gen-Text/Image/Video via Grok. Löst n8n-Workflows ab.',
    status: 'in-progress',
    group: 'Infra',
    url: 'https://github.com/JereIsThere/gehirn',
    port: '4000',
    details: [
      'POST /gen/text · /gen/image · /gen/video',
      'GET /models → filtert nach vorhandenen API-Keys',
      'Modell-Registry: grok-3-mini (cheap) · grok-4-latest (normal)',
      'Zentrale Key-Verwaltung via Docker ENV',
      'Geplant: OpenAI, Anthropic, Gemini Provider',
    ],
    deps: ['xAI API'],
  },
  {
    name: 'funkner',
    emoji: '⚡',
    tagline: 'CLI + KI-Agent-Sammlung. Schreibt in OrientDB statt MD-Dateien.',
    status: 'planned',
    group: 'Infra',
    url: 'https://github.com/JereIsThere/funkner',
    details: [
      'Agent-Pattern: verb + [service-override]? + content',
      '"dj, spiel band deftones" → preferred service aus User-Settings',
      '"dj spiel [spotify] song X" → erzwingt Spotify',
      'funkner roadmap add/done → ersetzt manuelle MD-Edits',
      'Zentraler Vault pro GitHub-User',
    ],
    deps: ['OrientDB', 'dann2'],
  },
  {
    name: 'dann2',
    emoji: '🗺️',
    tagline: 'Roadmap-Store — alle roadmap.*.md, live aggregiert aus allen Repos.',
    status: 'in-progress',
    group: 'Infra',
    url: 'https://github.com/JereIsThere/dann2',
    details: [
      'GitHub Action scannt alle JereIsThere-Repos alle 30min',
      'Findet roadmap.*.md → aggregiert in external/',
      'loadRoadmaps() lädt aus mehreren Quellen mit Source-Label',
      'Live: jeremias-groehl.de/roadmaps',
      'Auto-Bump Submodule-Pointer in auge-framework',
    ],
  },
  {
    name: 'speicher',
    emoji: '💾',
    tagline: 'Self-hosted Storage — secure local cloud, kein S3, kein Google Drive.',
    status: 'planned',
    group: 'Infra',
    details: [
      'MinIO (S3-kompatibel, Docker, Port 9000/9001)',
      'Signed/private URLs mit Ablaufdatum',
      'gehirn gen/image → speicher statt flüchtige xAI-URLs',
      'Hand Drop-Page → speicher-Backend',
      'Galerie-Page in Hand geplant',
    ],
    deps: ['gehirn', 'hand'],
  },
  {
    name: 'bits',
    emoji: '🔮',
    tagline: 'Snippet-VectorDB — verifizierte Snippets. Claude findet statt halluziniert.',
    status: 'planned',
    group: 'Infra',
    details: [
      'search_bits("nginx reverse proxy") → fertiger Block',
      'Typen: nginx, JSX, n8n-Subworkflow, MCP-Tool, shell-oneliner',
      'Haiku füllt Templates, Sonnet/Opus nur für Architektur',
      'Agent schreibt nur Diff-Kommentar, Bit wird eingesetzt',
    ],
    deps: ['OrientDB', 'funkner'],
  },
]

const STATUS_LABEL: Record<Status, string> = {
  'live': 'live',
  'in-progress': 'in progress',
  'planned': 'planned',
}

const GROUPS = ['Apps', 'Infra']

export default function FrameworkPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">auge</Link>
          <span>/</span>
          <span>framework</span>
        </div>
        <h1 className={styles.title}>auge-framework</h1>
        <p className={styles.subtitle}>
          Klammer-Repo für das auge-Ökosystem — alle Subprojekte, Services und ihre Verbindungen.
        </p>
        <div className={styles.repoLink}>
          <a href="https://github.com/JereIsThere/auge-framework" target="_blank" rel="noopener">
            ↗ github.com/JereIsThere/auge-framework
          </a>
        </div>
      </header>

      {GROUPS.map(group => {
        const repos = REPOS.filter(r => r.group === group)
        return (
          <section key={group} className={styles.section}>
            <div className={styles.sectionLabel}>{group}</div>
            <div className={styles.grid}>
              {repos.map(repo => (
                <article key={repo.name} className={styles.card} data-status={repo.status}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardEmoji} aria-hidden>{repo.emoji}</span>
                    <div className={styles.cardMeta}>
                      <div className={styles.cardName}>
                        {repo.url
                          ? <a href={repo.url} target="_blank" rel="noopener">{repo.name}</a>
                          : repo.name
                        }
                        {repo.port && <span className={styles.port}>:{repo.port}</span>}
                      </div>
                      <span className={styles.badge} data-status={repo.status}>
                        <span className={styles.badgeDot} />
                        {STATUS_LABEL[repo.status]}
                      </span>
                    </div>
                  </div>

                  <p className={styles.tagline}>{repo.tagline}</p>

                  <ul className={styles.details}>
                    {repo.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>

                  {repo.deps && repo.deps.length > 0 && (
                    <div className={styles.deps}>
                      {repo.deps.map(d => (
                        <span key={d} className={styles.dep}>↳ {d}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}

      <section className={styles.section}>
        <div className={styles.sectionLabel}>Docker-Stack</div>
        <div className={styles.composeTable}>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Port</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>hand</td><td>3737</td><td>Main App</td></tr>
              <tr><td>gehirn</td><td>4000</td><td>Gen-API</td></tr>
              <tr><td>OrientDB</td><td>2480 / 2424</td><td>Graph-DB (Studio + Binary)</td></tr>
              <tr><td>n8n</td><td>5678</td><td>Orchestrierung + Automations</td></tr>
              <tr className={styles.planned}><td>speicher</td><td>9000 / 9001</td><td>MinIO Storage (geplant)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/roadmaps">→ Roadmaps ansehen</Link>
        <a href="https://github.com/JereIsThere/auge-framework" target="_blank" rel="noopener">
          → auge-framework auf GitHub
        </a>
      </footer>
    </div>
  )
}
