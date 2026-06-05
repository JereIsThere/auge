/**
 * active-prs.ts — Live-Status des Ökosystems via GitHub PR-API.
 *
 * Kein Agent-seitiger Aufwand nötig: sobald ein PR Dateien unter
 * themen/<slug>/ oder components/kurse/<slug>/ berührt, erscheint
 * automatisch ein "live edit"-Badge auf der Landing und der /karte.
 *
 * Revalidiert alle 10 Minuten (Next.js ISR). Funktioniert ohne
 * GITHUB_TOKEN (60 req/h anonym), mit Token bis 5000 req/h.
 */

const GH = 'https://api.github.com'
const REVALIDATE = 600 // 10 min

function ghHeaders(): HeadersInit {
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }
}

async function ghFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${GH}${path}`, {
      headers: ghHeaders(),
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// ── Typen ────────────────────────────────────────────────────────────────────

/** Ein Lern-Thema das gerade in einem offenen PR bearbeitet wird. */
export interface ActiveThemaEdit {
  /** Thema-Slug, z.B. "kryptografie" */
  slug: string
  prNumber: number
  prTitle: string
  prUrl: string
  branch: string
}

/**
 * Ein Repo (EcoNode.id) das mindestens einen offenen PR hat.
 * Wird von /karte genutzt um aktive Nodes hervorzuheben.
 */
export interface ActiveRepoEdit {
  /** Entspricht EcoNode.id aus lib/ecosystem.ts */
  repoId: string
  prCount: number
  latestPrTitle: string
  latestPrUrl: string
}

// ── API-Calls ─────────────────────────────────────────────────────────────────

/**
 * Gibt alle Themen zurück die gerade in offenen PRs auf JereIsThere/auge
 * bearbeitet werden. Erkennt Slugs automatisch aus den geänderten Dateipfaden —
 * kein manueller Schritt nötig.
 */
export async function getActiveThemaEdits(): Promise<ActiveThemaEdit[]> {
  const prs = await ghFetch<any>('/repos/JereIsThere/auge/pulls?state=open&per_page=20')

  const edits: ActiveThemaEdit[] = []

  await Promise.all(
    prs.map(async (pr: any) => {
      const files = await ghFetch<any>(
        `/repos/JereIsThere/auge/pulls/${pr.number}/files?per_page=100`
      )

      const slugs = new Set<string>()
      for (const f of files) {
        // Matched: themen/<slug>/ oder components/kurse/<slug>/
        const m = (f.filename as string).match(
          /^(?:themen|components\/kurse)\/([^/]+)\//
        )
        if (m && m[1] !== '_platzhalter') slugs.add(m[1])
      }

      for (const slug of slugs) {
        edits.push({
          slug,
          prNumber: pr.number,
          prTitle:  pr.title,
          prUrl:    pr.html_url,
          branch:   pr.head.ref,
        })
      }
    })
  )

  return edits
}

/**
 * Gibt alle Repos zurück die mindestens einen offenen PR haben.
 * Mapping: GitHub-Repo → EcoNode.id (aus lib/ecosystem.ts).
 */
export async function getActiveRepoEdits(): Promise<ActiveRepoEdit[]> {
  const REPOS: Array<{ repo: string; id: string }> = [
    { repo: 'JereIsThere/auge',           id: 'auge' },
    { repo: 'JereIsThere/hand',           id: 'hand' },
    { repo: 'JereIsThere/gehirn',         id: 'gehirn' },
    { repo: 'JereIsThere/dann2',          id: 'dann2' },
    { repo: 'JereIsThere/funkner',        id: 'funkner' },
    { repo: 'JereIsThere/auge-framework', id: 'auge' },
  ]

  const results = await Promise.all(
    REPOS.map(async ({ repo, id }) => {
      const prs = await ghFetch<any>(`/repos/${repo}/pulls?state=open&per_page=5`)
      if (prs.length === 0) return null
      return {
        repoId:         id,
        prCount:        prs.length,
        latestPrTitle:  prs[0].title,
        latestPrUrl:    prs[0].html_url,
      } satisfies ActiveRepoEdit
    })
  )

  return results.filter((r): r is ActiveRepoEdit => r !== null)
}
