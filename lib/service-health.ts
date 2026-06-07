export type HealthStatus = 'up' | 'down' | 'unknown'

const SERVICES: Array<{ id: string; envKey: string }> = [
  { id: 'hand',    envKey: 'HAND_URL'    },
  { id: 'gehirn',  envKey: 'GEHIRN_URL'  },
  { id: 'funkner', envKey: 'FUNKNER_URL' },
]

async function checkHealth(url: string): Promise<HealthStatus> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(`${url}/health`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    })
    clearTimeout(timeout)
    if (!res.ok) return 'down'
    const data = await res.json()
    return data?.ok === true ? 'up' : 'down'
  } catch {
    return 'down'
  }
}

export async function getServiceHealth(): Promise<Record<string, HealthStatus>> {
  const results = await Promise.all(
    SERVICES.map(async ({ id, envKey }) => {
      const url = process.env[envKey]
      if (!url) return [id, 'unknown'] as const
      const status = await checkHealth(url)
      return [id, status] as const
    })
  )
  return Object.fromEntries(results)
}
