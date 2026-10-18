import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Radio, UserRoundCheck } from 'lucide-react'
import { AreaIcon } from '@/components/area-icon'
import { ButtonLink } from '@/components/button-link'
import { Eyebrow } from '@/components/section'
import { getAreaBySlug, thematicAreas } from '@/lib/areas'

export function generateStaticParams() {
  return thematicAreas.map((area) => ({ slug: area.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/aree-tematiche/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) return {}
  return {
    title: `${area.title} — Aree tematiche`,
    description: area.summary,
    alternates: { canonical: `/aree-tematiche/${area.slug}` },
  }
}

function DetailBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Check
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
        <h2 className="text-xl font-semibold text-ocean">{title}</h2>
      </div>
      <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check className="mt-1 size-4 shrink-0 text-sage-deep" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default async function AreaPage({ params }: PageProps<'/aree-tematiche/[slug]'>) {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) notFound()

  const isOther = area.slug === 'altre-aree'

  return (
    <>
      <section className="border-b border-border/70 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <nav aria-label="Percorso di navigazione">
            <Link
              href="/aree-tematiche"
              className="inline-flex items-center gap-2 rounded text-sm font-medium text-ocean hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Tutte le aree tematiche
            </Link>
          </nav>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <AreaIcon slug={area.slug} className="size-16" />
            <div className="max-w-3xl">
              <Eyebrow>Area tematica</Eyebrow>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-ocean sm:text-5xl">
                {area.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {area.summary}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-1.5 text-sm font-medium text-ocean">
                <span aria-hidden="true" className="size-2 rounded-full bg-sage-deep" />
                Percorsi in fase di attivazione
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <DetailBlock title="A chi si rivolge" icon={UserRoundCheck}>
              <p>{area.audience}</p>
            </DetailBlock>
            <DetailBlock title="Temi che possono essere affrontati" icon={Check}>
              <CheckList items={area.themes} />
            </DetailBlock>
            <DetailBlock title="Obiettivi" icon={Check}>
              <CheckList items={area.goals} />
              {area.note && (
                <p className="mt-6 rounded-xl border-l-2 border-sage-deep bg-ivory px-5 py-4 text-slate-ink">
                  {area.note}
                </p>
              )}
            </DetailBlock>
            <DetailBlock title="Modalità degli incontri" icon={Radio}>
              <p>
                Gli incontri si svolgono online e sono guidati dal professionista responsabile del
                programma. Frequenza, durata complessiva, dimensione del gruppo ed eventuali
                strumenti di continuità tra le sessioni dipendono dal singolo programma e vengono
                comunicati prima dell’adesione.
              </p>
            </DetailBlock>
            <DetailBlock title="Ruolo del professionista" icon={UserRoundCheck}>
              <p>
                Il professionista progetta il percorso, definisce obiettivi e regole di confronto,
                conduce gli incontri e valuta l’adeguatezza del gruppo rispetto alle esigenze dei
                partecipanti.
              </p>
            </DetailBlock>
            <DetailBlock title="Requisiti di partecipazione" icon={ClipboardCheck}>
              <p>
                Ogni programma indica i propri criteri di partecipazione. L’idoneità viene valutata
                dal professionista: un percorso di gruppo potrebbe non essere la risposta più
                adatta a ogni situazione e non sostituisce automaticamente un percorso individuale
                o altri interventi necessari.
              </p>
            </DetailBlock>
          </div>

          <aside aria-labelledby="interesse" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-ocean p-7 text-white sm:p-8">
              <h2 id="interesse" className="text-xl font-semibold text-white">
                {isOther ? 'Hai un tema da proporre?' : 'Ti interessa quest’area?'}
              </h2>
              <p className="mt-3 leading-relaxed text-white/85">
                Non ci sono ancora programmi pubblicati in quest’area. Puoi manifestare il tuo
                interesse: ti informeremo quando saranno disponibili percorsi pertinenti.
              </p>
              <ButtonLink
                href={`/contatti?tipo=partecipante&area=${area.slug}`}
                variant="inverted"
                className="mt-6 w-full"
              >
                Manifesta il tuo interesse
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <Link
                href={`/contatti?tipo=professionista&area=${area.slug}`}
                className="mt-4 block rounded text-center text-sm font-medium text-white underline underline-offset-4 hover:text-sage"
              >
                Sei un professionista? Proponi un percorso
              </Link>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Le aree tematiche sono indicative; disponibilità e idoneità dipendono dai programmi
              attivati e dalla valutazione del professionista.
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}
