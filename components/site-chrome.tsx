'use client'

import { usePathname } from 'next/navigation'
import { CookieConsent } from '@/components/cookie-consent'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAppShell = pathname.startsWith('/admin') || pathname.startsWith('/dashboard')

  return (
    <>
      {!isAppShell ? <SiteHeader /> : null}
      <main id="contenuto" className="flex-1">
        {children}
      </main>
      {!isAppShell ? <SiteFooter /> : null}
      {!isAppShell ? <CookieConsent /> : null}
    </>
  )
}
