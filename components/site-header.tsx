'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { buttonLinkClass } from '@/components/button-link'
import { Logo } from '@/components/logo'
import { mainNav } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ivory/90 backdrop-blur supports-[backdrop-filter]:bg-ivory/75">
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ocean focus:px-4 focus:py-2 focus:text-white"
      >
        Vai al contenuto
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Elysa, torna alla homepage" onClick={close} className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Navigazione principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-[0.95rem] text-slate-ink transition-colors hover:bg-sage-soft hover:text-ocean',
                    isActive(item.href) && 'bg-sage-soft font-medium text-ocean',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/aree-tematiche" className={buttonLinkClass('primary', 'hidden sm:inline-flex')}>
            Scopri i percorsi
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ocean hover:bg-sage-soft lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Chiudi il menu' : 'Apri il menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-border/70 bg-ivory lg:hidden"
      >
        <nav aria-label="Navigazione mobile" className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center rounded-lg px-3 text-base text-slate-ink hover:bg-sage-soft',
                    isActive(item.href) && 'bg-sage-soft font-medium text-ocean',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contatti"
                onClick={close}
                aria-current={isActive('/contatti') ? 'page' : undefined}
                className="flex min-h-12 items-center rounded-lg px-3 text-base text-slate-ink hover:bg-sage-soft"
              >
                Contatti
              </Link>
            </li>
          </ul>
          <Link
            href="/aree-tematiche"
            onClick={close}
            className={buttonLinkClass('primary', 'mt-3 w-full sm:hidden')}
          >
            Scopri i percorsi
          </Link>
        </nav>
      </div>
    </header>
  )
}
