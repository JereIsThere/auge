import type { Metadata } from 'next'
import { getActiveRepoEdits } from '@/lib/active-prs'
import { getAdrMeta } from '@/lib/adrs'
import { getServiceHealth } from '@/lib/service-health'
import KarteClient from './KarteClient'

export const metadata: Metadata = {
  title: 'Karte',
  description: 'Interaktive 2D-Karte des auge-Ökosystems — alle Projekte, Status und Abhängigkeiten auf einen Blick.',
}

// ISR: alle 10 Minuten neu rendern → PR-Status + Health bleibt aktuell.
export const revalidate = 600

export default async function KartePage() {
  const [activeRepos, adrMeta, healthByNode] = await Promise.all([
    getActiveRepoEdits(),
    getAdrMeta(),
    getServiceHealth(),
  ])
  return (
    <KarteClient
      activeRepoIds={activeRepos.map((r) => r.repoId)}
      adrMeta={adrMeta}
      healthByNode={healthByNode}
    />
  )
}
