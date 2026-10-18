'use client'

import { useMemo, useState } from 'react'
import { MapPin, Search, UserRound } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { COMPETENCE_AREAS, REGIONAL_ORDERS, THERAPEUTIC_APPROACHES, competenceAreaLabel } from '@/lib/professionals/constants'
import type { PublicProfessional } from '@/lib/professionals/types'
import { fieldInputClass } from '@/components/professionals/form-field'

export function ProfessionalsDirectory({ professionals }: { professionals: PublicProfessional[] }) {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('')
  const [order, setOrder] = useState('')
  const [approach, setApproach] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return professionals.filter((item) => {
      const name = `${item.firstName} ${item.lastName}`.toLowerCase()
      if (needle && !name.includes(needle)) return false
      if (area && !item.thematicAreas.includes(area)) return false
      if (order && item.regionalOrder !== order && item.city !== order) return false
      if (approach && item.therapeuticApproach !== approach) return false
      return true
    })
  }, [professionals, query, area, order, approach])

  const cities = useMemo(
    () => Array.from(new Set(professionals.map((item) => item.city))).sort((a, b) => a.localeCompare(b, 'it')),
    [professionals],
  )

  return (
    <div>
      <form
        className="grid gap-3 rounded-3xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Filtra i professionisti"
      >
        <label className="relative sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Cerca per nome</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome o cognome"
            className={`${fieldInputClass} pl-10`}
          />
        </label>
        <select value={area} onChange={(event) => setArea(event.target.value)} className={fieldInputClass} aria-label="Area tematica">
          <option value="">Tutte le aree</option>
          {COMPETENCE_AREAS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select value={order} onChange={(event) => setOrder(event.target.value)} className={fieldInputClass} aria-label="Ordine o città">
          <option value="">Ordine / città</option>
          <optgroup label="Ordini regionali">
            {REGIONAL_ORDERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </optgroup>
          <optgroup label="Città">
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </optgroup>
        </select>
        <select value={approach} onChange={(event) => setApproach(event.target.value)} className={fieldInputClass} aria-label="Approccio terapeutico">
          <option value="">Tutti gli approcci</option>
          {THERAPEUTIC_APPROACHES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} professionist{filtered.length === 1 ? 'a' : 'i'} confermat{filtered.length === 1 ? 'o' : 'i'}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
          Nessun professionista corrisponde ai filtri selezionati.
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((item) => (
            <li key={item.id}>
              <ProfessionalCard professional={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ProfessionalCard({
  professional,
  showCta = true,
}: {
  professional: PublicProfessional
  showCta?: boolean
}) {
  const initials = `${professional.firstName[0] ?? ''}${professional.lastName[0] ?? ''}`.toUpperCase()
  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(26,43,72,0.04)]">
      <div className="flex items-start gap-4">
        <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-sage-soft text-lg font-semibold text-ocean">
          {initials || <UserRound className="size-6" />}
        </span>
        <div>
          <h2 className="text-xl font-semibold text-ocean">
            {professional.firstName} {professional.lastName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{professional.therapeuticApproach}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-ink">
            <MapPin className="size-4 text-sage-deep" aria-hidden="true" />
            {professional.city} · Ordine {professional.regionalOrder} n. {professional.alboNumber} (sez. {professional.alboSection})
          </p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {professional.thematicAreas.map((area) => (
          <li key={area} className="rounded-full bg-ivory px-3 py-1 text-xs font-medium text-ocean">
            {competenceAreaLabel(area)}
          </li>
        ))}
      </ul>
      {professional.bio ? <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{professional.bio}</p> : null}
      {showCta ? (
        <div className="mt-6">
          <ButtonLink href={`/professionisti/${professional.id}`} variant="secondary" className="w-full">
            Vedi percorsi attivi
          </ButtonLink>
        </div>
      ) : null}
    </article>
  )
}

