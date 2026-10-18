import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: 'Admin Elysa',
    template: '%s | Admin Elysa',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ivory">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/admin/candidature" className="rounded-md">
            <Logo />
          </Link>
          <span className="text-sm font-medium text-ocean">Pannello amministratori</span>
        </div>
      </header>
      {children}
    </div>
  )
}
