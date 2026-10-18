import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { LogoMark } from '@/components/logo'
import { cn } from '@/lib/utils'

export function CtaBand({ tone = 'ivory', flushTop = false }: { tone?: 'ivory' | 'white'; flushTop?: boolean }) {
  return (
    <section
      aria-labelledby="cta-finale"
      className={cn(
        tone === 'white' ? 'bg-white' : 'bg-ivory',
        'pb-20 sm:pb-24',
        !flushTop && 'pt-20 sm:pt-24',
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ocean px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full border border-sage/40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-24 size-72 rounded-full border border-white/10"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <LogoMark className="size-10 text-white" />
              <h2 id="cta-finale" className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                La continuità del percorso, la forza del confronto.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">
                Esplora le aree tematiche o scrivici per saperne di più. Ti risponderemo
                all’indirizzo email che indicherai.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href="/aree-tematiche" variant="inverted">
                Scopri i percorsi
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="/contatti"
                className="border border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Contattaci
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
