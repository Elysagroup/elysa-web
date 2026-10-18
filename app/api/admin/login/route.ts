import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { createSessionToken, sessionCookieName, sessionCookieOptions } from '@/lib/professionals/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Definisci qui la password dell'amministratore
const ADMIN_PASSWORD_HARDCODED = 'MiaPasswordElysa2026'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const passwordInviata = typeof body?.password === 'string' ? body.password.trim() : ''

    // Confronto della password
    if (!passwordInviata || passwordInviata !== ADMIN_PASSWORD_HARDCODED) {
      return jsonError(401, 'invalid_credentials')
    }

    // Creazione del token di sessione per l'admin
    const token = await createSessionToken({
      role: 'admin',
      email: 'info@elysagroup.com',
      name: 'Team Elysa',
    })

    const response = NextResponse.json({ ok: true })
    
    // Impostazione del cookie di sessione
    response.cookies.set(sessionCookieName('admin'), token, sessionCookieOptions())
    
    return response
  } catch (error) {
    console.error('Errore durante il login admin:', error)
    return jsonError(500, 'internal_error')
  }
}