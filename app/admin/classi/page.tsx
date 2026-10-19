import { requireRole } from '@/lib/professionals/http'
import { listAllClassProposals, findAccountById } from '@/lib/professionals/store'
import { competenceAreaLabel } from '@/lib/professionals/constants'
import AdminClassActions from './AdminClassActions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await requireRole('admin')
  if (!session) return null

  const { status = 'all' } = await searchParams
  const proposals = await listAllClassProposals()
  const filteredProposals = status === 'all'
    ? proposals
    : proposals.filter((proposal) => status === 'pending'
      ? proposal.status === 'pending' || proposal.status === 'in_revisione_admin'
      : proposal.status === status)

  // Arricchiamo le proposte con i dati dello psicologo mittente
  const proposalsWithPro = await Promise.all(
    filteredProposals.map(async (prop) => {
      const pro = await findAccountById(prop.psychologistId)
      return { ...prop, psychologist: pro }
    })
  )

  return (
    <div className="max-w-6xl mx-auto py-12 px-5 sm:px-8">
      <h1 className="text-3xl font-semibold text-ocean mb-2">Gestione Proposte Classi</h1>
      <p className="text-muted-foreground mb-8">
        Revisiona, approva o rifiuta le proposte di gruppi psicologici inviate dai professionisti.
      </p>

      <nav aria-label="Filtra proposte per stato" className="mb-8 flex flex-wrap gap-2">
        {[
          { id: 'all', label: `Tutte (${proposals.length})` },
          { id: 'pending', label: `In attesa (${proposals.filter((item) => item.status === 'pending' || item.status === 'in_revisione_admin').length})` },
          { id: 'approved', label: `Approvate (${proposals.filter((item) => item.status === 'approved').length})` },
          { id: 'rejected', label: `Rifiutate (${proposals.filter((item) => item.status === 'rejected').length})` },
        ].map((filter) => (
          <Link
            key={filter.id}
            href={filter.id === 'all' ? '/admin/classi' : `/admin/classi?status=${filter.id}`}
            aria-current={status === filter.id ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${status === filter.id ? 'border-ocean bg-ocean text-white' : 'border-border bg-white text-ocean hover:bg-secondary'}`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {proposalsWithPro.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-8 text-center text-muted-foreground">
          Nessuna proposta di classe trovata.
        </div>
      ) : (
        <div className="space-y-6">
          {proposalsWithPro.map((item) => {
            const areaLabel = competenceAreaLabel(item.thematicArea) || item.thematicArea

            return (
              <div key={item.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-sage-deep bg-sage-light/30 px-2.5 py-1 rounded-md">
                      {areaLabel}
                    </span>
                    <h2 className="text-xl font-semibold text-ocean mt-2">{item.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Proposta da: <strong className="text-ocean">{item.psychologist ? `${item.psychologist.firstName} ${item.psychologist.lastName}` : 'Psicologo'}</strong> ({item.psychologist?.email})
                    </p>
                  </div>

                  <div>
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        In attesa
                      </span>
                    )}
                    {item.status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Approvata
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Rifiutata
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-700 bg-secondary/30 p-4 rounded-xl text-sm mb-4">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-6 bg-secondary/10 p-3 rounded-lg border border-border/50">
                  <div><strong>Partecipanti:</strong> {item.minParticipants} - {item.maxParticipants}</div>
                  <div><strong>Prezzo/persona:</strong> {item.pricePerParticipant ? `€${item.pricePerParticipant}` : 'Non specificato'}</div>
                  <div><strong>Durata:</strong> {item.duration || '8 ore'}</div>
                  <div><strong>Frequenza:</strong> {item.weeklyFrequency || 'Settimanale'}</div>
                  <div><strong>Modalità:</strong> {item.locationType === 'in-person' ? 'In presenza' : item.locationType === 'hybrid' ? 'Ibrida' : 'Online'}</div>
                  <div><strong>Orario:</strong> {item.sessionTime || 'Da definire'}</div>
                </div>

                {item.targetAudience || item.scheduleDetails ? (
                  <div className="mb-5 space-y-2 text-sm text-muted-foreground">
                    {item.targetAudience ? <p><strong>Destinatari:</strong> {item.targetAudience}</p> : null}
                    {item.scheduleDetails ? <p className="whitespace-pre-wrap"><strong>Calendario:</strong> {item.scheduleDetails}</p> : null}
                  </div>
                ) : null}

                {item.materials.length ? (
                  <p className="mb-5 text-sm text-muted-foreground">
                    <strong>Materiali:</strong>{' '}
                    {item.materials.map((file, index) => (
                      <span key={file.storedName}>
                        {index > 0 ? ', ' : null}
                        <a
                          href={`/api/admin/classi/${encodeURIComponent(item.id)}/materials/${index}`}
                          className="font-medium text-ocean underline underline-offset-4"
                        >
                          {file.originalName}
                        </a>
                      </span>
                    ))}
                  </p>
                ) : null}

                {item.reviewNote ? (
                  <p className="mb-5 rounded-lg border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
                    <strong>Nota revisione:</strong> {item.reviewNote}
                  </p>
                ) : null}

                {/* Pulsanti di azione client-side */}
                <AdminClassActions proposalId={item.id} currentStatus={item.status} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}