import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import {
  CentersSection,
  DepthSection,
  FaqBlock,
  FlexibleModel,
  PeopleStepsSection,
  ProStepsSection,
} from '@/components/content-blocks'
import { CtaBand } from '@/components/cta-band'
import { PageHero } from '@/components/section'

export const metadata: Metadata = {
  title: 'Come funziona',
  description:
    'Il modello Elysa: orientamento, incontri online guidati da professionisti e strumenti di continuità. Frequenza e durata dipendono dal tema e dal programma.',
  alternates: { canonical: '/come-funziona' },
}

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHero
        eyebrow="Come funziona"
        title="Percorsi progettati con intenzione, passo dopo passo."
        intro="Elysa mette in relazione persone e professionisti attorno a un tema condiviso. Ogni percorso ha obiettivi, modalità e una guida professionale; cadenza e durata dipendono dal tema, dagli obiettivi e dal programma del professionista."
      >
        <ButtonLink href="#passi-persone">
          Per le persone
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="#passi-professionisti" variant="secondary">
          Per i professionisti
        </ButtonLink>
      </PageHero>
      <FlexibleModel />
      <div id="persone" className="scroll-mt-20">
        <PeopleStepsSection />
      </div>
      <ProStepsSection tone="white" />
      <CentersSection />
      <DepthSection />
      <FaqBlock initialCategory="generali" />
      <CtaBand flushTop />
    </>
  )
}
