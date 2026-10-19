import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { readSessionToken, sessionCookieName, type SessionPayload, type SessionRole } from '@/lib/professionals/session'
import { findAccountByAuthUserId } from '@/lib/professionals/store'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export function getClientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status })
}

export async function requireRole(role: SessionRole): Promise<SessionPayload | null> {
  if (role === 'admin') {
    const jar = await cookies()
    return readSessionToken(jar.get(sessionCookieName('admin'))?.value)
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const account = await findAccountByAuthUserId(user.id)
  if (!account || account.authUserId !== user.id) return null

  return {
    role: 'psychologist',
    email: user.email,
    accountId: account.id,
    name: `${account.firstName} ${account.lastName}`,
    exp: Math.floor(Date.now() / 1000) + 60,
  }
}

export function isPdfFile(file: File, maxBytes: number) {
  const name = file.name.toLowerCase()
  const typeOk = file.type === 'application/pdf' || file.type === '' || file.type === 'application/octet-stream'
  return typeOk && name.endsWith('.pdf') && file.size > 0 && file.size <= maxBytes
}
