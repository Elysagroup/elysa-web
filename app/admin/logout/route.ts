import { NextResponse } from 'next/server'
import { sessionCookieName } from '@/lib/professionals/session'

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'https://elysagroup.com'))
  
  // Rimuove i cookie di sessione
  response.cookies.delete('elysa_admin_session')
  response.cookies.delete(sessionCookieName('admin'))

  return response
}