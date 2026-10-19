import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ButtonLink } from '@/components/button-link'
import { classProposalStatusLabels, competenceAreaLabel } from '@/lib/professionals/constants'
import { requireRole } from '@/lib/professionals/http'
import { findAccountById, listClassProposalsFor } from '@/lib/professionals/store'

export const metadata: Metadata = {
  title: 'Panoramica',
}

export const dynamic = 'force-dynamic'

export default async function DashboardHomePage() {
  const session = await requireRole('psychologist')
  if (!session) redirect('/dashboard/login')
  const account = session?.accountId ? await findAccountById(session.accountId) : null
  const proposals = session?.accountId ? await listClassProposalsFor(session.accountId) : []

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold text-ocean">
        Ciao{account ? `, ${account.firstName}` : ''}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Da qui puoi proporre un nuovo percorso di gruppo. Ogni proposta resta in revisione fino all’approvazione del
        team Elysa, prima di comparire nella vetrina percorsi.
      </p>
      <div className="mt-8">
        <ButtonLink href="/dashboard/proponi-classe">Proponi una classe</ButtonLink>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-ocean">Le tue proposte</h2>
      {proposals.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-border bg-white p-6 text-muted-foreground">
          Non hai ancora inviato proposte di classe.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {proposals.map((item) => {
            const statusKey = item.status as keyof typeof classProposalStatusLabels
            const statusLabel = classProposalStatusLabels[statusKey] || 'In attesa'
            const areaLabel = competenceAreaLabel(item.thematicArea) || item.thematicArea

            return (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                    • {areaLabel}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ocean">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                </div>

                <div className="shrink-0">
                  {(item.status === 'pending' || item.status === 'in_revisione_admin') && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {statusLabel}
                    </span>
                  )}
                  {item.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {statusLabel}
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {statusLabel}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}