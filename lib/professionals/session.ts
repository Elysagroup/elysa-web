const ADMIN_COOKIE = 'elysa_admin_session'
const PRO_COOKIE = 'elysa_pro_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type SessionRole = 'admin' | 'psychologist'

export type SessionPayload = {
  role: SessionRole
  email: string
  accountId?: string
  name?: string
  exp: number
}

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (secret && secret.length >= 16) return secret
  if (process.env.NODE_ENV !== 'production') return 'elysa-dev-session-secret'
  return null
}

function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ''
  for (const byte of array) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function sign(value: string, secret: string) {
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(value))
  return bytesToBase64Url(signature)
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

export async function createSessionToken(payload: Omit<SessionPayload, 'exp'>) {
  const secret = getSecret()
  if (!secret) throw new Error('SESSION_SECRET_MISSING')
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  }
  const encoded = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(body)))
  const signature = await sign(encoded, secret)
  return `${encoded}.${signature}`
}

export async function readSessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  const secret = getSecret()
  if (!secret) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  const expected = await sign(encoded, secret)
  if (!timingSafeEqual(signature, expected)) return null
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encoded))) as SessionPayload
    if (!payload?.role || !payload.email || !payload.exp) return null
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function sessionCookieName(role: SessionRole) {
  return role === 'admin' ? ADMIN_COOKIE : PRO_COOKIE
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  }
}

export { ADMIN_COOKIE, PRO_COOKIE }
