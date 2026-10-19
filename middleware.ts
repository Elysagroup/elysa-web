import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Consentiamo sempre l'accesso alla pagina di login e alle API
  if (pathname === '/admin/login' || pathname === '/dashboard/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 2. Controllo per la rotta Admin
  if (pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get('elysa_admin_session')?.value

    if (!adminCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 3. Controllo per la rotta Dashboard Professionisti
  if (pathname.startsWith('/dashboard')) {
    const proCookie = request.cookies.get('elysa_pro_session')?.value

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