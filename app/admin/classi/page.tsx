import { requireRole } from '@/lib/professionals/http'
import { listAllClassProposals, findAccountById } from '@/lib/professionals/store'
import { competenceAreaLabel } from '@/lib/professionals/constants'
import AdminClassActions from './AdminClassActions'

export const dynamic = 'force-dynamic'

export default async function AdminClassesPage() {
  const session = await requireRole('admin')
  if (!session) return null

  const proposals = await listAllClassProposals()

  // Arricchiamo le proposte con i dati dello psicologo mittente
  const proposalsWithPro = await Promise.all(
    proposals.map(async (prop) => {
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
                </div>

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