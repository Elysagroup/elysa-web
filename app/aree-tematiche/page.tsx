import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { AreasDisclaimer, AreasGrid } from '@/components/areas-grid'
import { ButtonLink } from '@/components/button-link'
import { CtaBand } from '@/components/cta-band'
import { PageHero, Section } from '@/components/section'

export const metadata: Metadata = {
  title: 'Aree tematiche',
  description:
    'Ansia, umore, autostima, relazioni, lutto, genitorialità, stress, giovani e solitudine: le aree tematiche dei percorsi di gruppo Elysa guidati da professionisti.',
  alternates: { canonical: '/aree-tematiche' },
}

export default function AreeTematichePage() {
  return (
    <>
      <PageHero
        eyebrow="Aree tematiche"
        title="Percorsi diversi, bisogni diversi."
        intro="Elysa raccoglie percorsi tematici per affrontare domande, difficoltà e passaggi della vita insieme a un professionista."
      >
        <ButtonLink href="/contatti?tipo=partecipante">
          Manifesta il tuo interesse
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/come-funziona" variant="secondary">
          Scopri come funziona
        </ButtonLink>
      </PageHero>

      <Section tone="white" labelledBy="elenco-aree">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="elenco-aree" className="text-2xl font-semibold text-ocean">
            Esplora le aree
          </h2>
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-sage-soft px-4 py-1.5 text-sm font-medium text-ocean">
            <span aria-hidden="true" className="size-2 rounded-full bg-sage-deep" />
            Percorsi in fase di attivazione
          </p>
        </div>
        <AreasGrid />
        <AreasDisclaimer />
      </Section>
      <CtaBand />
    </>
  )
}
