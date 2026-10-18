import type { Metadata } from 'next'
import { ProfessionalsDirectory } from '@/components/professionals/directory'
import { PageHero } from '@/components/section'
import { listPublicProfessionals } from '@/lib/professionals/store'

export const metadata: Metadata = {
  title: 'Professionisti',
  description:
    'Incontra gli psicologi confermati su Elysa: filtra per area tematica, Ordine regionale, città e approccio terapeutico, e scopri i percorsi di gruppo attivi.',
  alternates: { canonical: '/professionisti' },
}

export const dynamic = 'force-dynamic'

export default async function ProfessionistiPage() {
  const professionals = await listPublicProfessionals()

  return (
    <>
      <PageHero
        eyebrow="Vetrina pubblica"
        title="Professionisti confermati"
        intro="Queste schede riguardano solo psicologi la cui candidatura è stata approvata dal team Elysa. Ogni profilo indica Albo, approccio e aree tematiche trattate."
      />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ProfessionalsDirectory professionals={professionals} />
        </div>
      </section>
    </>
  )
}
