import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { readSessionToken, sessionCookieName, type SessionPayload, type SessionRole } from '@/lib/professionals/session'

export function getClientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status })
}

export async function requireRole(role: SessionRole): Promise<SessionPayload | null> {
  const jar = await cookies()
  return readSessionToken(jar.get(sessionCookieName(role))?.value)
}

export function isPdfFile(file: File, maxBytes: number) {
  const name = file.name.toLowerCase()
  const typeOk = file.type === 'application/pdf' || file.type === '' || file.type === 'application/octet-stream'
  return typeOk && name.endsWith('.pdf') && file.size > 0 && file.size <= maxBytes
}
