import type { Metadata } from 'next'
import { getActiveRepoEdits } from '@/lib/active-prs'
import KarteClient from './KarteClient'

export const metadata: Metadata = {
  title: 'Karte',
  description: 'Interaktive 2D-Karte des auge-Ökosystems — alle Projekte, Status und Abhängigkeiten auf einen Blick.',
}

// ISR: alle 10 Minuten neu rendern → PR-Status bleibt aktuell.
export const revalidate = 600

export default async function KartePage() {
  const activeRepos = await getActiveRepoEdits()
  const activeRepoIds = activeRepos.map((r) => r.repoId)
  return <KarteClient activeRepoIds={activeRepoIds} />
}
