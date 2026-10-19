import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, PRO_COOKIE } from '@/lib/professionals/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Consentiamo sempre l'accesso alla pagina di login e alle API
  if (pathname === '/admin/login' || pathname === '/dashboard/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 2. Controllo per la rotta Admin
  if (pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value

    if (!adminCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 3. Controllo per la rotta Dashboard Professionisti
  if (pathname.startsWith('/dashboard')) {
    const proCookie = request.cookies.get(PRO_COOKIE)?.value

    if (!proCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}