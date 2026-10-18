import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { Eyebrow } from '@/components/section'
import { HeroVisual } from '@/components/home/hero-visual'

export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <Eyebrow>Il percorso continua, anche insieme</Eyebrow>
          <h1
            id="hero-title"
            className="mt-5 text-[2.6rem] font-semibold leading-[1.05] text-ocean sm:text-6xl lg:text-[4.25rem]"
          >
            La continuità che dà spazio al tuo percorso.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Elysa mette in relazione persone e professionisti attraverso percorsi tematici di
            gruppo, incontri guidati e strumenti per dare continuità al lavoro su di sé. Perché
            comprendere ciò che viviamo è importante, ma trovare uno spazio in cui condividerlo può
            fare la differenza.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/aree-tematiche">
              Scopri i percorsi
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/per-professionisti" variant="secondary">
              Sei un professionista?
            </ButtonLink>
          </div>
          <p className="mt-8 flex items-center gap-3 text-sm text-slate-ink">
            <span aria-hidden="true" className="h-px w-8 bg-sage-deep" />
            Gruppi tematici, confronto guidato e percorsi progettati da professionisti
          </p>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}
