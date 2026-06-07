const FRAMEWORK_API  = 'https://api.github.com/repos/JereIsThere/auge-framework/contents/docs/adr'
const GITHUB_VIEW    = 'https://github.com/JereIsThere/auge-framework/blob/main/docs/adr'

export interface AdrMeta {
  num:   string   // '0008'
  title: string   // 'Zentrales Deployment aus auge-framework'
  url:   string   // GitHub blob URL
}

export async function getAdrMeta(): Promise<Record<string, AdrMeta>> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    }

    const listRes = await fetch(FRAMEWORK_API, { headers, next: { revalidate: 600 } })
    if (!listRes.ok) return {}

    const files: Array<{ name: string; download_url: string }> = await listRes.json()
    const adrFiles = files.filter(f => /^\d{4}-.*\.md$/.test(f.name))

    const entries = await Promise.all(
      adrFiles.map(async (f) => {
        const num = f.name.slice(0, 4)
        try {
          const raw = await fetch(f.download_url, { next: { revalidate: 600 } })
          const text = await raw.text()
          // Erste Zeile: "# ADR 0008 — Titel" oder "# Titel"
          const firstLine = text.split('\n')[0].replace(/^#+\s*/, '')
          const title = firstLine
            .replace(/^ADR\s*\d+\s*[—–-]+\s*/i, '')
            .trim()
          return [num, { num, title, url: `${GITHUB_VIEW}/${f.name}` }] as const
        } catch {
          return null
        }
      })
    )

    return Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, AdrMeta]>)
  } catch {
    return {}
  }
}
