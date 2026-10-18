import { NextResponse, type NextRequest } from 'next/server'
import { sessionCookieName } from '@/lib/professionals/session'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/dashboard/login', request.url), 303)
  response.cookies.set(sessionCookieName('psychologist'), '', { path: '/', maxAge: 0 })
  return response
}
