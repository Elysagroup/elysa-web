import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, Placeholder } from '@/components/legal-page'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Termini e condizioni',
  description: 'Termini e condizioni di utilizzo del sito Elysa.',
  alternates: { canonical: '/termini-e-condizioni' },
}

export default function TerminiPage() {
  return (
    <LegalPage
      title="Termini e condizioni"
      intro="Condizioni generali di utilizzo del sito informativo Elysa. Le condizioni di partecipazione ai singoli percorsi saranno comunicate separatamente prima dell’adesione."
    >
      <p>
        Ultimo aggiornamento: <Placeholder>data</Placeholder>
      </p>

      <h2>1. Gestore del sito</h2>
      <p>
        Il sito è gestito da <Placeholder>ragione sociale</Placeholder>, con sede in{' '}
        <Placeholder>indirizzo</Placeholder>, P. IVA <Placeholder>numero</Placeholder>. Contatto:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Oggetto</h2>
      <p>
        Il sito presenta il progetto Elysa, le aree tematiche e le modalità con cui persone,
        professionisti e strutture possono manifestare interesse. Le informazioni pubblicate hanno
        carattere generale e non costituiscono consulenza, valutazione o indicazione terapeutica.
      </p>

      <h2>3. Natura del servizio</h2>
      <ul>
        <li>Elysa non è un servizio di emergenza. In caso di urgenza contatta il 112.</li>
        <li>
          I percorsi di gruppo non sostituiscono automaticamente un percorso individuale o altri
          interventi necessari; l’idoneità è valutata dal professionista responsabile.
        </li>
        <li>
          L’invio di una manifestazione di interesse non costituisce iscrizione né garantisce
          l’attivazione di un percorso o l’ammissione a un gruppo.
        </li>
        <li>
          Funzionalità come orientamento digitale, area riservata e strumenti tra gli incontri sono
          previste e saranno disciplinate da condizioni specifiche quando disponibili.
        </li>
      </ul>

      <h2>4. Professionisti</h2>
      <p>
        I professionisti che propongono percorsi restano responsabili della propria attività nel
        rispetto delle norme deontologiche e di legge applicabili. Le condizioni di collaborazione
        sono definite in accordi separati. <Placeholder>da completare</Placeholder>
      </p>

      <h2>5. Proprietà intellettuale</h2>
      <p>
        Testi, marchi, elementi grafici e contenuti del sito sono di titolarità di{' '}
        <Placeholder>titolare</Placeholder> o dei rispettivi aventi diritto e non possono essere
        riprodotti senza autorizzazione.
      </p>

      <h2>6. Responsabilità</h2>
      <p>
        Il gestore si impegna a mantenere le informazioni accurate e aggiornate, senza tuttavia
        garantirne l’assenza di errori o la disponibilità continua del sito.{' '}
        <Placeholder>clausole da verificare con consulente legale</Placeholder>
      </p>

      <h2>7. Dati personali</h2>
      <p>
        Il trattamento dei dati è descritto nella <Link href="/privacy-policy">Privacy Policy</Link>{' '}
        e nella <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>8. Legge applicabile e foro</h2>
      <p>
        I presenti termini sono regolati dalla legge italiana. Foro competente:{' '}
        <Placeholder>da definire, fatti salvi i diritti del consumatore</Placeholder>.
      </p>
    </LegalPage>
  )
}
