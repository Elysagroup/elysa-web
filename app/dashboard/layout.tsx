import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Logo } from '@/components/logo'
import { PRO_COOKIE, readSessionToken } from '@/lib/professionals/session'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: 'Area professionisti',
    template: '%s | Area professionisti Elysa',
  },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies()
  const session = await readSessionToken(jar.get(PRO_COOKIE)?.value)
  const loggedIn = session?.role === 'psychologist'

  return (
    <div className="min-h-dvh bg-ivory">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={loggedIn ? '/dashboard' : '/dashboard/login'} className="rounded-md">
            <Logo />
          </Link>
          {loggedIn ? (
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="font-medium text-ocean hover:underline">
                Panoramica
              </Link>
              <Link href="/dashboard/proponi-classe" className="font-medium text-ocean hover:underline">
                Proponi una classe
              </Link>
              <span className="hidden text-muted-foreground sm:inline">{session.name}</span>
              <form action="/api/dashboard/logout" method="post">
                <button type="submit" className="font-medium text-ocean underline underline-offset-4">
                  Esci
                </button>
              </form>
            </nav>
          ) : (
            <span className="text-sm font-medium text-ocean">Area riservata</span>
          )}
        </div>
      </header>
      {children}
    </div>
  )
}
