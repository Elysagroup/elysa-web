import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, Placeholder } from '@/components/legal-page'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali raccolti tramite il sito Elysa.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Informativa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR) sul trattamento dei dati personali raccolti tramite questo sito."
    >
      <p>
        Ultimo aggiornamento: <Placeholder>data</Placeholder>
      </p>

      <h2>1. Titolare del trattamento</h2>
      <ul>
        <li>
          Ragione sociale: <Placeholder>ragione sociale del titolare</Placeholder>
        </li>
        <li>
          Sede legale: <Placeholder>indirizzo completo</Placeholder>
        </li>
        <li>
          Partita IVA / Codice fiscale: <Placeholder>P. IVA / C.F.</Placeholder>
        </li>
        <li>
          Email di contatto: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
        <li>
          Responsabile della protezione dei dati (DPO), se nominato:{' '}
          <Placeholder>nome e contatto del DPO o indicazione “non nominato”</Placeholder>
        </li>
      </ul>

      <h2>2. Dati trattati tramite il modulo di contatto</h2>
      <p>
        Attraverso il modulo nella pagina <Link href="/contatti">Contatti</Link> raccogliamo: nome e
        cognome, indirizzo email, numero di telefono (facoltativo), tipologia di richiesta, area
        tematica di interesse (facoltativa), messaggio (facoltativo) e, per professionisti e
        strutture, professione, ambito di interesse, nome della struttura, ruolo del referente e
        sito web.
      </p>
      <p>
        Il modulo non è destinato alla raccolta di dati relativi alla salute. Ti chiediamo di non
        inserire diagnosi, anamnesi, terapie farmacologiche o altre informazioni sanitarie. Qualora
        venissero comunque comunicate, saranno trattate solo nella misura strettamente necessaria a
        rispondere e cancellate quando non più necessarie.
      </p>

      <h2>3. Finalità e basi giuridiche</h2>
      <ul>
        <li>
          <strong>Rispondere alla tua richiesta</strong> e fornire le informazioni richieste: esecuzione
          di misure precontrattuali adottate su tua richiesta (art. 6.1.b GDPR).
        </li>
        <li>
          <strong>Invio di comunicazioni informative e promozionali</strong>, solo se hai prestato lo
          specifico consenso facoltativo: consenso (art. 6.1.a GDPR), revocabile in qualsiasi momento.
        </li>
        <li>
          <strong>Sicurezza del sito e prevenzione degli abusi</strong> (ad esempio limitazione degli
          invii ripetuti): legittimo interesse del titolare (art. 6.1.f GDPR).
        </li>
        <li>
          <strong>Statistiche di utilizzo aggregate</strong>, solo se acconsenti tramite il banner
          cookie: consenso (art. 6.1.a GDPR). Vedi la <Link href="/cookie-policy">Cookie Policy</Link>.
        </li>
      </ul>

      <h2>4. Modalità del trattamento e destinatari</h2>
      <p>
        I dati sono trattati con strumenti elettronici e misure di sicurezza adeguate. Possono essere
        trattati da fornitori che agiscono come responsabili del trattamento, tra cui:
      </p>
      <ul>
        <li>Vercel Inc. — hosting del sito e, previo consenso, misurazione statistica aggregata;</li>
        <li>Resend — servizio di invio delle email generate dal modulo di contatto;</li>
        <li>
          <Placeholder>eventuali altri fornitori, ad es. servizio di posta elettronica</Placeholder>.
        </li>
      </ul>
      <p>I dati non sono diffusi né ceduti a terzi per finalità proprie.</p>

      <h2>5. Trasferimenti extra UE</h2>
      <p>
        Alcuni fornitori possono trattare dati al di fuori dello Spazio Economico Europeo. In tali
        casi il trasferimento avviene sulla base di garanzie adeguate, come le Clausole Contrattuali
        Standard della Commissione europea o il Data Privacy Framework UE-USA.{' '}
        <Placeholder>verificare e dettagliare per ciascun fornitore</Placeholder>
      </p>

      <h2>6. Conservazione</h2>
      <p>
        I dati delle richieste sono conservati per il tempo necessario a gestirle e comunque non
        oltre <Placeholder>periodo, es. 12 mesi</Placeholder> dall’ultimo contatto, salvo obblighi di
        legge. I dati trattati sulla base del consenso sono conservati fino alla revoca.
      </p>

      <h2>7. Diritti dell’interessato</h2>
      <p>
        Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione,
        limitazione, portabilità e opposizione (artt. 15-22 GDPR), nonché revocare il consenso senza
        pregiudicare la liceità del trattamento precedente, scrivendo a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Hai inoltre diritto di proporre
        reclamo al Garante per la protezione dei dati personali (
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
          www.garanteprivacy.it
        </a>
        ).
      </p>

      <h2>8. Natura del conferimento</h2>
      <p>
        Il conferimento dei dati contrassegnati come obbligatori è necessario per rispondere alla
        richiesta; il mancato conferimento impedisce l’invio del modulo. Gli altri dati e il consenso
        alle comunicazioni promozionali sono facoltativi.
      </p>

      <h2>9. Percorsi e servizi futuri</h2>
      <p>
        L’eventuale partecipazione ai percorsi, la registrazione a un’area riservata o l’uso di
        strumenti di orientamento saranno regolati da informative specifiche, fornite prima della
        raccolta dei relativi dati.
      </p>
    </LegalPage>
  )
}
