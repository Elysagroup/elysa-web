import Link from 'next/link'
import { ArrowRight, Compass, Radio, Repeat, Building2 } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { FeatureCard, Section, SectionHeading } from '@/components/section'
import { Steps, type Step } from '@/components/steps'
import { FaqList } from '@/components/faq-section'
import type { FaqCategory } from '@/lib/faq'

export const peopleSteps: Step[] = [
  {
    title: 'Raccontaci cosa cerchi',
    description:
      'Esplora le aree tematiche e manifesta il tuo interesse. Un eventuale questionario di orientamento aiuta a chiarire cosa cerchi, senza formulare diagnosi automatiche e senza richiedere dati sanitari.',
  },
  {
    title: 'Individuiamo il percorso pertinente',
    description:
      'I bisogni espressi vengono messi in relazione con temi e requisiti dei programmi. In futuro questo orientamento potrà essere supportato da strumenti digitali, sempre con supervisione professionale.',
  },
  {
    title: 'Conosci il programma',
    description:
      'Prima dell’adesione ricevi tema, obiettivi, professionista responsabile, modalità, calendario, frequenza, durata complessiva, dimensione del gruppo, requisiti, regole di riservatezza e condizioni applicabili.',
  },
  {
    title: 'Il gruppo prende forma',
    description:
      'Il percorso si avvia quando sono soddisfatte le condizioni organizzative e il numero di partecipanti previsto. Conferma e tempistiche vengono comunicate appena definite.',
  },
  {
    title: 'Dai continuità al percorso',
    description:
      'Incontri online guidati e, quando previsti, strumenti o attività tra le sessioni. Il gruppo non sostituisce automaticamente altri interventi eventualmente necessari.',
  },
]

export const proSteps: Step[] = [
  {
    title: 'Manifesti interesse',
    description:
      'Invii il tuo profilo, le competenze pertinenti e l’area tematica che desideri proporre.',
  },
  {
    title: 'Confronto e verifica',
    description:
      'Valutiamo insieme la richiesta e i requisiti applicabili, attraverso un confronto diretto con il team Elysa.',
  },
  {
    title: 'Progetti il programma',
    description:
      'Definisci area, destinatari, criteri di partecipazione, obiettivi, struttura, frequenza, durata, dimensione minima e massima, eventuali strumenti asincroni e modalità di valutazione dell’adeguatezza del gruppo.',
  },
  {
    title: 'Presenti il percorso',
    description:
      'Il programma viene descritto in modo trasparente per raccogliere interesse. L’attivazione è subordinata al raggiungimento delle condizioni previste.',
  },
  {
    title: 'Conduci il percorso',
    description:
      'Guidi gli incontri online, definisci le regole di confronto e gli strumenti di continuità più adatti al gruppo.',
  },
]

export function PeopleStepsSection({ tone = 'ivory' }: { tone?: 'ivory' | 'white' }) {
  return (
    <Section tone={tone} labelledBy="passi-persone">
      <SectionHeading
        id="passi-persone"
        eyebrow="Come funziona per le persone"
        title="Il tuo percorso, passo dopo passo."
      />
      <div className="mt-12">
        <Steps steps={peopleSteps} label="Le fasi del percorso per le persone" />
      </div>
      <ButtonLink href="/aree-tematiche" className="mt-10">
        Esplora i percorsi
        <ArrowRight aria-hidden="true" />
      </ButtonLink>
    </Section>
  )
}

export function ProStepsSection({ tone = 'ivory' }: { tone?: 'ivory' | 'white' }) {
  return (
    <Section tone={tone} labelledBy="passi-professionisti">
      <SectionHeading
        id="passi-professionisti"
        eyebrow="Come funziona per i professionisti"
        title="La tua competenza merita uno spazio in cui esprimersi."
        intro="Elysa offre a psicologi e professionisti della salute mentale la possibilità di progettare percorsi tematici strutturati, incontrare persone interessate e valorizzare il proprio approccio in un ambiente digitale dedicato."
      />
      <div className="mt-12">
        <Steps steps={proSteps} label="Le fasi del percorso per i professionisti" />
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/contatti?tipo=professionista">
          Candidati come professionista
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/contatti?tipo=centro" variant="secondary">
          Hai un centro? Parliamone
        </ButtonLink>
      </div>
    </Section>
  )
}

export function FlexibleModel({ tone = 'white' }: { tone?: 'ivory' | 'white' }) {
  return (
    <Section tone={tone} labelledBy="modello-flessibile">
      <SectionHeading
        id="modello-flessibile"
        eyebrow="Un modello flessibile"
        title="Non un format rigido, ma percorsi progettati con intenzione."
        intro="Frequenza, durata, struttura e modalità dipendono dall’area tematica e dal programma del professionista. L’obiettivo è un accompagnamento continuativo, con un ritmo pensato per il tema e per le persone coinvolte."
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        <li>
          <FeatureCard icon={Compass} title="Screening e orientamento">
            Comprensione dell’area di interesse e individuazione dei programmi potenzialmente
            pertinenti.
          </FeatureCard>
        </li>
        <li>
          <FeatureCard icon={Radio} title="Incontri live guidati">
            Confronti online organizzati secondo il calendario del programma e condotti dal
            professionista.
          </FeatureCard>
        </li>
        <li>
          <FeatureCard icon={Repeat} title="Strumenti di continuità">
            Risorse e attività, quando previste, per mantenere vivo il collegamento tra un incontro
            e l’altro.
          </FeatureCard>
        </li>
      </ul>
    </Section>
  )
}

export function DepthSection() {
  return (
    <Section tone="ocean" labelledBy="profondita">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionHeading
          id="profondita"
          eyebrow="Valore professionale"
          title="La profondità non si esaurisce in pochi secondi."
          inverted
        />
        <div className="space-y-5 text-lg leading-relaxed text-white/85">
          <p>
            Elysa intende offrire ai professionisti uno spazio digitale autorevole per contenuti
            strutturati e percorsi approfonditi, in cui il tempo dedicato a un tema è proporzionato
            alla sua complessità.
          </p>
          <p>
            Un esempio: un gruppo sulla genitorialità può esplorare, con la guida di un
            professionista, i cambiamenti generazionali, la comunicazione in famiglia e i bisogni
            dei figli nelle diverse fasi di crescita, dando ai partecipanti il tempo di
            confrontarsi e di riportare quanto emerso nella propria quotidianità.
          </p>
          <Link
            href="/aree-tematiche/genitorialita-e-relazioni-familiari"
            className="inline-flex items-center gap-2 rounded font-medium text-white underline underline-offset-4 hover:text-sage"
          >
            Scopri l’area Genitorialità e relazioni familiari
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  )
}

export function CentersSection() {
  return (
    <Section tone="sage" labelledBy="centri-titolo" id="centri" className="scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-ocean">
            <Building2 className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="mt-6">
            <SectionHeading
              id="centri-titolo"
              eyebrow="Per centri e strutture"
              title="Un nuovo modo di dare continuità ai percorsi delle persone che accompagni."
              intro="Centri, studi associati e strutture possono valutare con Elysa collaborazioni per percorsi di gruppo complementari ai servizi già offerti."
            />
          </div>
          <ButtonLink href="/contatti?tipo=centro" className="mt-8">
            Parliamo di una collaborazione
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {[
            ['Progettazione condivisa', 'Definire insieme temi, destinatari e struttura dei percorsi.'],
            ['Organizzazione flessibile', 'Adattare calendario e modalità alle esigenze della struttura.'],
            ['Qualità dell’esperienza', 'Percorsi chiari e trasparenti per le persone che partecipano.'],
            ['Riservatezza', 'Attenzione alla riservatezza nelle regole di gruppo e nel trattamento dei dati.'],
          ].map(([title, text]) => (
            <li key={title} className="rounded-2xl border border-ocean/10 bg-white p-6">
              <h3 className="font-semibold text-ocean">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export function FaqBlock({
  initialCategory,
  tone = 'ivory',
}: {
  initialCategory?: FaqCategory
  tone?: 'ivory' | 'white'
}) {
  return (
    <Section tone={tone} labelledBy="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeading
          id="faq"
          eyebrow="Domande frequenti"
          title="Risposte chiare, prima di iniziare."
          intro={
            <p>
              Non trovi la risposta che cerchi?{' '}
              <Link href="/contatti" className="font-medium text-ocean underline underline-offset-4">
                Scrivici
              </Link>
              .
            </p>
          }
        />
        <FaqList initialCategory={initialCategory} />
      </div>
    </Section>
  )
}
