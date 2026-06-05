import type { Metadata } from 'next'
import Link from 'next/link'
import { NODES, STATUS_LABEL, type EcoNode } from '@/lib/ecosystem'
import styles from './framework.module.css'

export const metadata: Metadata = {
  title: 'Framework',
  description: 'Übersicht über das auge-Framework und alle Subprojekte.',
}

const GROUPS = ['Apps', 'Infra'] as const

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
        const repos = NODES.filter(n => n.group === group)
        return (
          <section key={group} className={styles.section}>
            <div className={styles.sectionLabel}>{group}</div>
            <div className={styles.grid}>
              {repos.map((repo: EcoNode) => (
                <article key={repo.id} className={styles.card} data-status={repo.status}>
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

                  {repo.deps.length > 0 && (
                    <div className={styles.deps}>
                      {repo.deps.map(depId => (
                        <span key={depId} className={styles.dep}>↳ {depId}</span>
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
        <Link href="/karte">→ Ökosystem-Karte</Link>
        <a href="/roadmaps">→ Roadmaps ansehen</a>
        <a href="https://github.com/JereIsThere/auge-framework" target="_blank" rel="noopener">
          → auge-framework auf GitHub
        </a>
      </footer>
    </div>
  )
}
