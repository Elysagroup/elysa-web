import type { Metadata } from 'next'
import { ArrowRight, BookOpen, CalendarRange, Layers, LockKeyhole, Target, Workflow } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import {
  CentersSection,
  DepthSection,
  FaqBlock,
  FlexibleModel,
  ProStepsSection,
} from '@/components/content-blocks'
import { FeatureCard, PageHero, Section, SectionHeading } from '@/components/section'

export const metadata: Metadata = {
  title: 'Per i professionisti',
  description:
    'Psicologi e professionisti della salute mentale possono progettare percorsi tematici di gruppo strutturati su Elysa, incontrare persone interessate e valorizzare il proprio metodo.',
  alternates: { canonical: '/per-professionisti' },
}

export default function PerProfessionistiPage() {
  return (
    <>
      <PageHero
        eyebrow="Per psicologi e professionisti della salute mentale"
        title="La tua competenza merita uno spazio in cui esprimersi."
        intro="Elysa offre a psicologi e professionisti della salute mentale la possibilità di progettare percorsi tematici strutturati, incontrare persone interessate e valorizzare il proprio approccio in un ambiente digitale dedicato."
      >
        <ButtonLink href="/candidatura-psicologo">
          Candidati come professionista
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/contatti?tipo=centro" variant="secondary">
          Hai un centro? Parliamone
        </ButtonLink>
      </PageHero>

      <Section tone="white" labelledBy="valore-pro">
        <SectionHeading
          id="valore-pro"
          eyebrow="Cosa offre Elysa"
          title="Uno spazio strutturato per progettare con intenzione."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          <li>
            <FeatureCard icon={Workflow} title="Dare forma al proprio metodo">
              Progettare percorsi con obiettivi, struttura e calendario definiti, coerenti con il
              proprio approccio.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={Target} title="Raggiungere persone interessate">
              Presentare programmi coerenti con bisogni e temi specifici, descritti in modo
              trasparente.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={BookOpen} title="Valorizzare le competenze">
              Dare spazio alla profondità professionale, oltre la superficialità dei contenuti
              virali.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={Layers} title="Una struttura di supporto">
              Strumenti organizzativi per presentare programmi, raccogliere interesse e gestire
              adesioni, nei limiti delle funzionalità disponibili.
            </FeatureCard>
          </li>
        </ul>
      </Section>

      <ProStepsSection />

      <Section tone="white" labelledBy="cosa-definisci">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            id="cosa-definisci"
            eyebrow="Progettazione del programma"
            title="Sei tu a definire la forma del percorso."
            intro="Ogni programma viene costruito sulla base del tema, degli obiettivi e delle persone a cui si rivolge, nel rispetto dei requisiti Elysa."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'Area tematica e destinatari',
              'Criteri di partecipazione',
              'Obiettivi del percorso',
              'Struttura degli incontri',
              'Frequenza e durata complessiva',
              'Dimensione minima e massima del gruppo',
              'Eventuali strumenti asincroni',
              'Valutazione dell’adeguatezza del gruppo',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-ivory px-4 py-3.5 text-slate-ink"
              >
                <CalendarRange className="size-4 shrink-0 text-sage-deep" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FlexibleModel tone="ivory" />
      <DepthSection />
      <CentersSection />

      <Section tone="white" labelledBy="area-riservata">
        <div className="flex flex-col gap-6 rounded-3xl border border-dashed border-ocean/25 bg-ivory p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-ocean">
              <LockKeyhole className="size-5" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div>
              <h2 id="area-riservata" className="text-xl font-semibold text-ocean">
                Area professionisti
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                Dopo l’approvazione della candidatura puoi accedere all’area riservata per proporre
                un percorso di gruppo. La pubblicazione resta subordinata alla revisione del team Elysa.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <ButtonLink href="/candidatura-psicologo">Invia una candidatura</ButtonLink>
            <ButtonLink href="/dashboard/login" variant="secondary">
              Accedi all’area riservata
            </ButtonLink>
          </div>
        </div>
      </Section>

      <FaqBlock initialCategory="professionisti" />
    </>
  )
}
