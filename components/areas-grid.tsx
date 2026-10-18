import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AreaIcon } from '@/components/area-icon'
import { thematicAreas } from '@/lib/areas'

export function AreasGrid({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {thematicAreas.map((area) => (
        <li key={area.slug}>
          <Link
            href={`/aree-tematiche/${area.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-ocean/30 hover:shadow-[0_12px_32px_-16px_rgba(26,43,72,0.25)]"
          >
            <AreaIcon slug={area.slug} />
            <Heading className="mt-5 text-lg font-semibold leading-snug text-ocean">{area.title}</Heading>
            <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted-foreground">
              {area.summary}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ocean">
              Approfondisci
              <span className="sr-only">{`: ${area.title}`}</span>
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function AreasDisclaimer() {
  return (
    <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
      Le aree tematiche sono indicative; disponibilità e idoneità dipendono dai programmi attivati
      e dalla valutazione del professionista.
    </p>
  )
}
