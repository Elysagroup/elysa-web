import { NextResponse, type NextRequest } from 'next/server'
import { getClientIdentifier, jsonError } from '@/lib/professionals/http'
import { verifyPassword } from '@/lib/professionals/password'
import { loginSchema } from '@/lib/professionals/schema'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/professionals/session'
import { findAccountByEmail, getStore } from '@/lib/professionals/store'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(getClientIdentifier(request), 'pro-login')
  if (!allowed) return jsonError(429, 'rate_limited')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'invalid_request')
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return jsonError(422, 'validation_error')

  const account = await findAccountByEmail(parsed.data.email)
  if (!account || !verifyPassword(parsed.data.password, account.passwordHash)) {
    return jsonError(401, 'invalid_credentials')
  }

  const store = await getStore()
  const approved = store.applications.some(
    (application) => application.accountId === account.id && application.status === 'approved',
  )
  if (!approved) return jsonError(403, 'not_approved')

  try {
    const token = await createSessionToken({
      role: 'psychologist',
      email: account.email,
      accountId: account.id,
      name: `${account.firstName} ${account.lastName}`,
    })
    const response = NextResponse.json({
      ok: true,
      name: `${account.firstName} ${account.lastName}`,
    })
    response.cookies.set(sessionCookieName('psychologist'), token, sessionCookieOptions())
    return response
  } catch {
    return jsonError(503, 'not_configured')
  }
}
