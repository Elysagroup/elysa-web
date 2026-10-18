import Link from 'next/link'
import { Mail } from 'lucide-react'
import { CookiePreferencesButton } from '@/components/cookie-consent'
import { Logo } from '@/components/logo'
import { legalNav, mainNav, siteConfig } from '@/lib/site'

const linkClass =
  'rounded text-sm text-white/80 transition-colors hover:text-white underline-offset-4 hover:underline'

export function SiteFooter() {
  return (
    <footer className="bg-ocean text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="Elysa, torna alla homepage" className="inline-block rounded-md">
              <Logo inverted />
            </Link>
            <p className="mt-4 leading-relaxed text-white/80">{siteConfig.tagline}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex items-center gap-2 rounded text-white underline-offset-4 hover:underline"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>

          <nav aria-label="Esplora Elysa">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">Esplora</h2>
            <ul className="mt-4 space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informazioni legali">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">Informazioni</h2>
            <ul className="mt-4 space-y-3">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className={linkClass} />
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Elysa. Tutti i diritti riservati.</p>
          <p className="max-w-xl md:text-right">
            Elysa non è un servizio di emergenza. In caso di emergenza chiama il 112 o rivolgiti al
            pronto soccorso più vicino.
          </p>
        </div>
      </div>
    </footer>
  )
}
