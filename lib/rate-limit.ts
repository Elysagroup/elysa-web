import 'server-only'

type RateLimitResult = { allowed: boolean; retryAfterSeconds: number }

const WINDOW_SECONDS = 10 * 60
const MAX_REQUESTS = 5

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

async function hashKey(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

function limitInMemory(key: string): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (memoryStore.size > 5000) {
    for (const [storedKey, storedEntry] of memoryStore) {
      if (storedEntry.resetAt <= now) memoryStore.delete(storedKey)
    }
  }

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  entry.count += 1
  return {
    allowed: entry.count <= MAX_REQUESTS,
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  }
}

async function limitWithRedis(
  key: string,
  config: { url: string; token: string },
): Promise<RateLimitResult> {
  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, String(WINDOW_SECONDS), 'NX'],
      ['TTL', key],
    ]),
    signal: AbortSignal.timeout(3000),
    cache: 'no-store',
  })

  if (!response.ok) throw new Error(`Rate limit store responded with ${response.status}`)

  const [incr, , ttl] = (await response.json()) as Array<{ result: number }>
  return {
    allowed: incr.result <= MAX_REQUESTS,
    retryAfterSeconds: Math.max(ttl.result, 1),
  }
}

/**
 * Fixed-window limiter. Uses Upstash Redis (shared across serverless instances)
 * when its env vars are present, otherwise falls back to per-instance memory.
 */
export async function rateLimit(
  identifier: string,
  namespace = 'contact',
): Promise<RateLimitResult> {
  const key = `elysa:${namespace}:${await hashKey(identifier)}`
  const redis = getRedisConfig()

  if (redis) {
    try {
      return await limitWithRedis(key, redis)
    } catch (error) {
      console.error('[contact] Rate limit store unavailable, using memory fallback:', (error as Error).name)
    }
  }

  return limitInMemory(key)
}

const recentSubmissions = new Map<string, number>()
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000

export function isDuplicateSubmission(submissionId: string) {
  const now = Date.now()
  for (const [id, timestamp] of recentSubmissions) {
    if (now - timestamp > DEDUPE_WINDOW_MS) recentSubmissions.delete(id)
  }
  return recentSubmissions.has(submissionId)
}

export function markSubmissionSent(submissionId: string) {
  recentSubmissions.set(submissionId, Date.now())
}
