'use client'

import { useMemo, useState } from 'react'
import { Check, FileText, Loader2, X } from 'lucide-react'
import { applicationStatusLabels, competenceAreaLabel, weekdayLabel, type ApplicationStatus } from '@/lib/professionals/constants'
import type { PsychologistApplication } from '@/lib/professionals/types'
import { cn } from '@/lib/utils'

const FILTERS: Array<{ id: 'all' | ApplicationStatus; label: string }> = [
  { id: 'all', label: 'Tutte' },
  { id: 'pending', label: 'In attesa' },
  { id: 'approved', label: 'Approvate' },
  { id: 'rejected', label: 'Rifiutate' },
]

export function AdminApplications({ initial }: { initial: PsychologistApplication[] }) {
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all')
  const [selectedId, setSelectedId] = useState(initial.find((item) => item.status === 'pending')?.id ?? initial[0]?.id)
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null)
  const [note, setNote] = useState('')
  const [message, setMessage] = useState<string>()

  const filtered = useMemo(
    () => items.filter((item) => filter === 'all' || item.status === filter),
    [items, filter],
  )
  const selected = items.find((item) => item.id === selectedId) ?? filtered[0]

  async function act(kind: 'approve' | 'reject') {
    if (!selected || busy) return
    setBusy(kind)
    setMessage(undefined)
    try {
      const response = await fetch(`/api/admin/candidature/${selected.id}/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kind === 'reject' ? JSON.stringify({ note }) : undefined,
      })
      if (!response.ok) {
        setMessage('Operazione non riuscita. Riprova.')
        return
      }
      setItems((current) =>
        current.map((item) =>
          item.id === selected.id
            ? { ...item, status: kind === 'approve' ? 'approved' : 'rejected', reviewedAt: new Date().toISOString(), reviewNote: note }
            : item,
        ),
      )
      setMessage(kind === 'approve' ? 'Candidatura approvata. È stata inviata l’email di attivazione.' : 'Candidatura rifiutata. È stata inviata la notifica.')
    } catch {
      setMessage('Operazione non riuscita. Riprova.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
      <div className="rounded-3xl border border-border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium',
                filter === item.id ? 'bg-ocean text-white' : 'bg-ivory text-ocean hover:bg-sage-soft',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-3">Professionista</th>
                <th className="py-3 pr-3">Ordine</th>
                <th className="py-3 pr-3">Stato</th>
                <th className="py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-border/70 py-2 pr-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn('rounded-lg px-2 py-2 text-left hover:bg-ivory', selected?.id === item.id && 'bg-sage-soft')}
                    >
                      <span className="block font-medium text-ocean">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="block text-xs text-muted-foreground">{item.email}</span>
                    </button>
                  </td>
                  <td className="border-b border-border/70 py-2 pr-3 text-slate-ink">
                    {item.regionalOrder}
                    <span className="block text-xs text-muted-foreground">{item.city}</span>
                  </td>
                  <td className="border-b border-border/70 py-2 pr-3">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="border-b border-border/70 py-2 text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nessuna candidatura in questa vista.</p> : null}
        </div>
      </div>

      <aside className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        {!selected ? (
          <p className="text-sm text-muted-foreground">Seleziona una candidatura.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <StatusPill status={selected.status} />
              <h2 className="mt-3 text-2xl font-semibold text-ocean">
                {selected.firstName} {selected.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
            </div>
            <dl className="grid gap-2 text-sm">
              {[
                ['Telefono', selected.phone],
                ['Codice fiscale', selected.taxCode],
                ['Partita IVA', selected.vatNumber],
                ['Città', selected.city],
                ['Albo', `${selected.regionalOrder} n. ${selected.alboNumber} · sez. ${selected.alboSection}`],
                ['Esperienza', `${selected.yearsExperience} anni`],
                ['Approccio', selected.therapeuticApproach],
                ['Aree', selected.thematicAreas.map(competenceAreaLabel).join(', ')],
                ['Disponibilità', `${selected.availabilityDays.map(weekdayLabel).join(', ')}${selected.availabilityNotes ? ` · ${selected.availabilityNotes}` : ''}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="text-slate-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {selected.bio ? <p className="text-sm leading-relaxed text-muted-foreground">{selected.bio}</p> : null}
            {selected.cv.size > 0 ? (
              <a
                href={`/api/admin/candidature/${selected.id}/cv`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ocean/20 px-4 py-2 text-sm font-medium text-ocean hover:bg-ivory"
              >
                <FileText className="size-4" aria-hidden="true" />
                Apri CV ({selected.cv.originalName})
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">CV non disponibile per questa scheda di esempio.</p>
            )}
            {message ? <p className="text-sm text-ocean">{message}</p> : null}
            {selected.status === 'pending' ? (
              <div className="space-y-3 border-t border-border pt-4">
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-ocean">Nota per un eventuale rifiuto</span>
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="w-full rounded-xl border border-input px-3 py-2 text-sm" />
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => act('approve')}
                    disabled={busy !== null}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ocean px-4 font-semibold text-white disabled:opacity-70"
                  >
                    {busy === 'approve' ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    Approva candidatura
                  </button>
                  <button
                    type="button"
                    onClick={() => act('reject')}
                    disabled={busy !== null}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-destructive/30 bg-white px-4 font-semibold text-destructive disabled:opacity-70"
                  >
                    {busy === 'reject' ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                    Rifiuta candidatura
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </aside>
    </div>
  )
}

function StatusPill({ status }: { status: ApplicationStatus }) {
  const tones = {
    pending: 'bg-ivory text-ocean',
    approved: 'bg-sage-soft text-sage-deep',
    rejected: 'bg-destructive/10 text-destructive',
  }
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', tones[status])}>
      {applicationStatusLabels[status]}
    </span>
  )
}
