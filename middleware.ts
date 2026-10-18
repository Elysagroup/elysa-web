import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, PRO_COOKIE, readSessionToken } from '@/lib/professionals/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await readSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)
    if (!session || session.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = `?next=${encodeURIComponent(pathname)}`
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const session = await readSessionToken(request.cookies.get(PRO_COOKIE)?.value)
    if (!session || session.role !== 'psychologist') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/login'
      url.search = `?next=${encodeURIComponent(pathname)}`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/dashboard', '/dashboard/:path*'],
}
