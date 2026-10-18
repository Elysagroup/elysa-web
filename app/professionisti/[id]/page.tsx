import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarRange, Clock3, Users } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { ProfessionalCard } from '@/components/professionals/directory'
import { PageHero, Section } from '@/components/section'
import { competenceAreaLabel, weekdayLabel } from '@/lib/professionals/constants'
import { getPublicProfessional } from '@/lib/professionals/store'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const data = await getPublicProfessional(id)
  if (!data) return { title: 'Professionista' }
  const { professional } = data
  return {
    title: `${professional.firstName} ${professional.lastName}`,
    description: professional.bio || `Scheda di ${professional.firstName} ${professional.lastName} su Elysa.`,
  }
}

export default async function ProfessionistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getPublicProfessional(id)
  if (!data) notFound()
  const { professional, classes } = data

  return (
    <>
      <PageHero
        eyebrow="Professionista confermato"
        title={`${professional.firstName} ${professional.lastName}`}
        intro={professional.bio || professional.therapeuticApproach}
      >
        <ButtonLink href="/professionisti" variant="secondary">
          <ArrowLeft aria-hidden="true" />
          Torna alla vetrina
        </ButtonLink>
      </PageHero>
      <Section tone="ivory" labelledBy="scheda-pro">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
          <div id="scheda-pro">
            <ProfessionalCard professional={professional} showCta={false} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ocean">Percorsi attivi</h2>
            {classes.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-border bg-white p-6 text-muted-foreground">
                Al momento non ci sono percorsi pubblicati per questo professionista.
              </p>
            ) : (
              <ul className="mt-4 grid gap-4">
                {classes.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-border bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                      {competenceAreaLabel(item.thematicArea)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-ocean">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <ul className="mt-4 grid gap-2 text-sm text-slate-ink sm:grid-cols-3">
                      <li className="flex items-center gap-2">
                        <Users className="size-4 text-sage-deep" />
                        {item.minParticipants}–{item.maxParticipants} persone
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock3 className="size-4 text-sage-deep" />
                        {item.totalHours} ore · {item.duration}
                      </li>
                      <li className="flex items-center gap-2">
                        <CalendarRange className="size-4 text-sage-deep" />
                        {item.sessionDays.map(weekdayLabel).join(', ')} · {item.sessionTime}
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}

