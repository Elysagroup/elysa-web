import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/professionals/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'elysa2026'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const passwordInviata = typeof body?.password === 'string' ? body.password.trim() : ''
    const expected = adminPassword()

    if (!passwordInviata || passwordInviata !== expected) {
      return jsonError(401, 'invalid_credentials')
    }

    // Assicuriamo un segreto di sessione se non è presente in env
    if (!process.env.SESSION_SECRET) {
      process.env.SESSION_SECRET = 'elysa-session-secret-fallback-2026'
    }

    const token = await createSessionToken({
      role: 'admin',
      email: 'info@elysagroup.com',
      name: 'Team Elysa',
    })

    const response = NextResponse.json({ ok: true })
    response.cookies.set(sessionCookieName('admin'), token, sessionCookieOptions())
    
    return response
  } catch (error) {
    console.error('Errore durante la creazione della sessione admin:', error)
    return jsonError(500, 'internal_error')
  }
}