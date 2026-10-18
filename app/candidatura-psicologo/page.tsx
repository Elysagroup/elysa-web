import type { Metadata } from 'next'
import { BadgeCheck, Clock3, ShieldCheck } from 'lucide-react'
import { ApplicationForm } from '@/components/professionals/application-form'
import { PageHero } from '@/components/section'

export const metadata: Metadata = {
  title: 'Candidatura psicologo',
  description:
    'Porta il tuo metodo su Elysa: candidati come psicologo per progettare percorsi tematici di gruppo in uno spazio strutturato, trasparente e valutato dal team clinico.',
  alternates: { canonical: '/candidatura-psicologo' },
}

export default function CandidaturaPsicologoPage() {
  return (
    <>
      <PageHero
        eyebrow="Candidatura professionisti"
        title="Porta il tuo metodo su Elysa"
        intro="Uno spazio per psicologi che vogliono progettare percorsi di gruppo con struttura, trasparenza e continuità. Ogni candidatura è valutata dal team clinico prima di comparire in vetrina e di accedere all’area riservata."
      >
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ocean shadow-sm">
            <ShieldCheck className="size-4 text-sage-deep" aria-hidden="true" />
            Valutazione clinica
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ocean shadow-sm">
            <BadgeCheck className="size-4 text-sage-deep" aria-hidden="true" />
            Trasparenza su Albo e approccio
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ocean shadow-sm">
            <Clock3 className="size-4 text-sage-deep" aria-hidden="true" />
            Risposta entro 48 ore
          </span>
        </div>
      </PageHero>

      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <ApplicationForm />
        </div>
      </section>
    </>
  )
}
