import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { readSessionToken, sessionCookieName, type SessionPayload, type SessionRole } from '@/lib/professionals/session'

type RefreshedCookie = {
  name: string
  value: string
  options?: Parameters<NextResponse['cookies']['set']>[2]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const loginPath = pathname === '/dashboard/login'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      if (loginPath) return NextResponse.next()
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/dashboard/login'
      return NextResponse.redirect(loginUrl)
    }

    let response = NextResponse.next({ request })
    const refreshedCookies: RefreshedCookie[] = []
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          refreshedCookies.push(...cookiesToSet)
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!loginPath && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/login'
      url.searchParams.set('next', pathname)
      const redirect = NextResponse.redirect(url)
      refreshedCookies.forEach(({ name, value, options }) => redirect.cookies.set(name, value, options))
      return redirect
    }

    return response
  }

  if (pathname === '/admin/login') return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get(sessionCookieName('admin'))?.value
    const adminSession = await readSessionToken(adminToken)
    if (adminSession?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}