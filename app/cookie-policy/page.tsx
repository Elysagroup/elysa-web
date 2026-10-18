import type { Metadata } from 'next'
import { CookiePreferencesButton } from '@/components/cookie-consent'
import { LegalPage, Placeholder } from '@/components/legal-page'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informazioni sui cookie e sugli strumenti di misurazione utilizzati dal sito Elysa.',
  alternates: { canonical: '/cookie-policy' },
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="Questa pagina descrive i cookie e gli strumenti simili effettivamente utilizzati dal sito e come puoi gestire le tue preferenze."
    >
      <p>
        Ultimo aggiornamento: <Placeholder>data</Placeholder> — Titolare:{' '}
        <Placeholder>ragione sociale del titolare</Placeholder>
      </p>

      <h2>1. Cookie tecnici</h2>
      <p>
        Il sito utilizza un unico cookie tecnico, necessario a ricordare la tua scelta sul banner:
      </p>
      <ul>
        <li>
          <strong>elysa_consent</strong> — memorizza la preferenza espressa (solo necessari oppure
          anche statistiche). Durata: 6 mesi. Non richiede consenso.
        </li>
      </ul>

      <h2>2. Strumenti statistici (solo con consenso)</h2>
      <p>
        Se acconsenti, attiviamo <strong>Vercel Web Analytics</strong>, che misura in forma
        aggregata le visite alle pagine. Secondo la documentazione del fornitore non utilizza
        cookie né identificatori persistenti e non traccia gli utenti tra siti diversi. Abbiamo
        comunque scelto di attivarlo solo dopo il tuo consenso. Senza consenso lo script non viene
        caricato.
      </p>

      <h2>3. Strumenti non utilizzati</h2>
      <p>
        Il sito non utilizza cookie di profilazione, pixel pubblicitari, né strumenti di
        remarketing o social plugin. Qualora venissero introdotti, questa pagina e il banner saranno
        aggiornati e saranno attivati solo previo consenso.
      </p>

      <h2>4. Gestire le preferenze</h2>
      <p>Puoi modificare o revocare la tua scelta in qualsiasi momento:</p>
      <CookiePreferencesButton className="min-h-11 rounded-full border border-ocean/25 bg-white px-5 text-sm font-semibold text-ocean hover:bg-sage-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ocean/25" />
      <p>
        Puoi anche cancellare i cookie dalle impostazioni del browser. Per domande scrivi a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
