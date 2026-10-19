import type { Metadata } from 'next'
import Link from 'next/link'
import { KeyRound, LayoutDashboard, Plus } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ProfessionalLogoutButton } from '@/components/professionals/logout-button'
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
    <div className="flex min-h-dvh flex-col bg-ivory">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
          <Link href={loggedIn ? '/dashboard' : '/dashboard/login'} className="rounded-md">
            <Logo />
          </Link>
          {loggedIn ? (
            <div className="flex items-center gap-3 sm:gap-5">
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline" title={session?.name}>
                {session?.name}
              </span>
              <ProfessionalLogoutButton />
            </div>
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

      {loggedIn ? (
        <>
          <nav aria-label="Navigazione area professionisti" className="mx-auto flex w-full max-w-7xl flex-wrap gap-x-5 gap-y-1 border-b border-border bg-white px-5 py-2 text-sm lg:hidden sm:px-8">
            <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 font-medium text-ocean hover:underline">
              <LayoutDashboard className="size-4" aria-hidden="true" /> Panoramica
            </Link>
            <Link href="/dashboard/proponi-classe" className="inline-flex min-h-11 items-center gap-2 font-medium text-ocean hover:underline">
              <Plus className="size-4" aria-hidden="true" /> Proponi una classe
            </Link>
            <Link href="/dashboard/password" className="inline-flex min-h-11 items-center gap-2 font-medium text-ocean hover:underline">
              <KeyRound className="size-4" aria-hidden="true" /> Password
            </Link>
          </nav>
          <div className="mx-auto flex w-full max-w-7xl flex-1">
            <aside className="sticky top-0 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-ivory px-5 py-8 lg:flex">
              <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Area professionisti</p>
              <nav aria-label="Navigazione dashboard" className="grid gap-1">
                <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ocean hover:bg-white">
                  <LayoutDashboard className="size-4" aria-hidden="true" /> Panoramica
                </Link>
                <Link href="/dashboard/proponi-classe" className="inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ocean hover:bg-white">
                  <Plus className="size-4" aria-hidden="true" /> Proponi una classe
                </Link>
                <Link href="/dashboard/password" className="inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ocean hover:bg-white">
                  <KeyRound className="size-4" aria-hidden="true" /> Modifica password
                </Link>
              </nav>
              <div className="mt-auto border-t border-border pt-5">
                <ProfessionalLogoutButton className="w-full justify-start rounded-lg" />
              </div>
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </>
      ) : children}
    </div>
  )
}
