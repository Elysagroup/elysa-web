import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { requireRole } from '@/lib/professionals/http'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: 'Area professionisti',
    template: '%s | Area professionisti Elysa',
  },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('psychologist')
  const loggedIn = Boolean(session)

  return (
    <div className="min-h-dvh bg-ivory">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
          <Link href={loggedIn ? '/dashboard' : '/dashboard/login'} className="rounded-md">
            <Logo />
          </Link>
          {loggedIn ? (
            <nav aria-label="Navigazione area professionisti" className="order-3 flex w-full flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-3 text-sm sm:order-none sm:w-auto sm:border-0 sm:pt-0">
              <Link href="/dashboard" className="min-h-11 inline-flex items-center font-medium text-ocean hover:underline">
                Panoramica
              </Link>
              <Link href="/dashboard/proponi-classe" className="min-h-11 inline-flex items-center font-medium text-ocean hover:underline">
                Proponi una classe
              </Link>
              <Link href="/dashboard/password" className="min-h-11 inline-flex items-center font-medium text-ocean hover:underline">
                Password
              </Link>
              <span className="hidden max-w-40 truncate text-muted-foreground lg:inline" title={session?.name}>
                {session?.name}
              </span>
              <form action="/api/dashboard/logout" method="post">
                <button type="submit" className="min-h-11 font-medium text-ocean underline underline-offset-4">
                  Esci
                </button>
              </form>
            </nav>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link href="/per-professionisti" className="font-medium text-ocean underline underline-offset-4">
                Per professionisti
              </Link>
              <span className="hidden text-muted-foreground sm:inline">Area riservata</span>
            </div>
          )}
        </div>
      </header>
      {children}
    </div>
  )
}
