import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/professionals/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('BODY RICEVUTO:', body)

    // Password fissa
    const EXPECTED_PASSWORD = 'Elysa2026'

    if (!body || body.password !== EXPECTED_PASSWORD) {
      return jsonError(401, 'invalid_credentials')
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
    console.error('ERRORE LOGIN ADMIN:', error)
    return jsonError(500, 'internal_error')
  }
}