import { NextResponse, type NextRequest } from 'next/server'
import { getClientIdentifier, jsonError } from '@/lib/professionals/http'
import { adminLoginSchema } from '@/lib/professionals/schema'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/professionals/session'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function adminPassword() {
  return 'elysa2026'
  //const password = process.env.ADMIN_PASSWORD;
  //if (password && password.trim() !== '') {
  //  return password.trim();
  
  // Fallback di sicurezza solo se la variabile non è definita affatto (utile in locale)
  if (process.env.NODE_ENV !== 'production') {
    return 'elysa-admin-dev';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(getClientIdentifier(request), 'admin-login')
  if (!allowed) return jsonError(429, 'rate_limited')

  const expected = adminPassword()
  if (!expected) return jsonError(503, 'not_configured')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'invalid_request')
  }

  const parsed = adminLoginSchema.safeParse(body)
  if (!parsed.success) return jsonError(422, 'validation_error')
  if (parsed.data.password !== expected) return jsonError(401, 'invalid_credentials')

  try {
    const token = await createSessionToken({
      role: 'admin',
      email: 'info@elysagroup.com',
      name: 'Team Elysa',
    })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(sessionCookieName('admin'), token, sessionCookieOptions())
    return response
  } catch {
    return jsonError(503, 'not_configured')
  }
}
