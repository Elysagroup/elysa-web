import type { Metadata } from 'next'
import { Clock, Mail, ShieldCheck } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { PageHero } from '@/components/section'
import { areaSlugs } from '@/lib/areas'
import { isRequestType } from '@/lib/contact-schema'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Scrivi a Elysa per manifestare interesse verso un percorso, proporti come professionista, valutare una collaborazione o chiedere informazioni.',
  alternates: { canonical: '/contatti' },
}

export default async function ContattiPage({ searchParams }: PageProps<'/contatti'>) {
  const params = await searchParams
  const tipo = typeof params.tipo === 'string' && isRequestType(params.tipo) ? params.tipo : undefined
  const area =
    typeof params.area === 'string' && areaSlugs.includes(params.area) ? params.area : undefined

  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title="Parliamone."
        intro="Che tu stia cercando un percorso, voglia proporne uno come professionista o rappresenti un centro, raccontaci in poche righe cosa ti interessa. Ti risponderemo via email."
      />
      <section aria-label="Modulo di contatto" className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6">
              <Mail className="size-5 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ocean">Scrivici direttamente</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Preferisci l’email? Puoi scriverci a
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-block break-all rounded font-semibold text-ocean underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <ShieldCheck className="size-5 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ocean">Dati essenziali</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Questo modulo serve a metterci in contatto: non è il luogo per condividere
                informazioni sanitarie. Eventuali aspetti personali potranno essere approfonditi
                nelle sedi appropriate con il professionista.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <Clock className="size-5 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ocean">Non per le urgenze</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Elysa non è un servizio di emergenza. In caso di pericolo immediato per te o per
                altri contatta il 112 o rivolgiti al pronto soccorso più vicino.
              </p>
            </div>
          </aside>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-10">
            <ContactForm initialType={tipo} initialArea={area} />
          </div>
        </div>
      </section>
    </>
  )
}
