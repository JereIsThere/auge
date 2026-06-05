import type { Metadata } from 'next'
import KarteClient from './KarteClient'

export const metadata: Metadata = {
  title: 'Karte',
  description: 'Interaktive 2D-Karte des auge-Ökosystems — alle Projekte, Status und Abhängigkeiten auf einen Blick.',
}

export default function KartePage() {
  return <KarteClient />
}
