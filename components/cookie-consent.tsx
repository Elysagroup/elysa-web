'use client'

import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { useSyncExternalStore } from 'react'

const COOKIE_NAME = 'elysa_consent'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180
const CHANGE_EVENT = 'elysa-consent-change'

type Consent = 'necessary' | 'statistics' | 'unset'

function readConsent(): Consent {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  const value = match?.[1]
  return value === 'necessary' || value === 'statistics' ? value : 'unset'
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function saveConsent(value: Exclude<Consent, 'unset'>) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function resetCookieConsent() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function CookieConsent() {
  const consent = useSyncExternalStore<Consent | 'server'>(subscribe, readConsent, () => 'server')

  return (
    <>
      {consent === 'statistics' && process.env.NODE_ENV === 'production' && <Analytics />}
      {consent === 'unset' && (
        <section
          aria-labelledby="cookie-title"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-white p-5 shadow-[0_12px_40px_-12px_rgba(26,43,72,0.25)] sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <h2 id="cookie-title" className="text-base font-semibold text-ocean">
            Le tue preferenze sulla privacy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Utilizziamo solo strumenti tecnici necessari al funzionamento del sito. Con il tuo
            consenso attiviamo anche Vercel Web Analytics, un servizio di misurazione aggregata
            delle visite. Puoi modificare la scelta in qualsiasi momento. Maggiori dettagli nella{' '}
            <Link href="/cookie-policy" className="font-medium text-ocean underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveConsent('necessary')}
              className="min-h-11 rounded-full border border-ocean/25 px-5 text-sm font-medium text-ocean hover:bg-ivory"
            >
              Solo necessari
            </button>
            <button
              type="button"
              onClick={() => saveConsent('statistics')}
              className="min-h-11 rounded-full bg-ocean px-5 text-sm font-medium text-white hover:bg-ocean-soft"
            >
              Accetta statistiche
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={resetCookieConsent} className={className}>
      Preferenze cookie
    </button>
  )
}
