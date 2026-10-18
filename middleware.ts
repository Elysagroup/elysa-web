import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, PRO_COOKIE, readSessionToken } from '@/lib/professionals/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Lasciamo passare sempre le chiamate API e la pagina di login
  if (pathname === '/admin/login' || pathname === '/dashboard/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 2. Controllo protezione per le rotte Admin
  if (pathname.startsWith('/admin')) {
    let session = null
    try {
      const cookieValue = request.cookies.get(ADMIN_COOKIE)?.value
      if (cookieValue) {
        session = await readSessionToken(cookieValue)
      }
    } catch (error) {
      console.error('Middleware Admin Session Error:', error)
    }

    if (!session || session.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 3. Controllo protezione per le rotte Dashboard Professionisti
  if (pathname.startsWith('/dashboard')) {
    let session = null
    try {
      const cookieValue = request.cookies.get(PRO_COOKIE)?.value
      if (cookieValue) {
        session = await readSessionToken(cookieValue)
      }
    } catch (error) {
      console.error('Middleware Dashboard Session Error:', error)
    }

    if (!session || session.role !== 'psychologist') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/dashboard', '/dashboard/:path*'],
}
