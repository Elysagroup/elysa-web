import { listAllClassProposals, findAccountById } from '@/lib/professionals/store'
import { competenceAreaLabel } from '@/lib/professionals/constants'
import PublicEnrollModal from './PublicEnrollModal'

export const dynamic = 'force-dynamic'

export default async function PublicClassesPage() {
  const allProposals = await listAllClassProposals()
  
  // Filtriamo solo le classi approvate
  const approvedClasses = allProposals.filter((p) => p.status === 'approved')

  const classesWithPro = await Promise.all(
    approvedClasses.map(async (item) => {
      const pro = await findAccountById(item.psychologistId)
      return { ...item, psychologist: pro }
    })
  )

  return (
    <div className="max-w-6xl mx-auto py-16 px-5 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl font-bold text-ocean mb-4">Percorsi di Gruppo e Classi</h1>
        <p className="text-muted-foreground text-lg">
          Esplora i percorsi psicologici di gruppo approvati dai nostri esperti e richiedi l'iscrizione per partecipare.
        </p>
      </div>

      {classesWithPro.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
          Al momento non ci sono classi aperte o approvate. Torna a trovarci presto!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classesWithPro.map((item) => {
            const areaLabel = competenceAreaLabel(item.thematicArea) || item.thematicArea

            return (
              <div key={item.id} className="bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-sage-deep bg-sage-light/30 px-3 py-1 rounded-md">
                      {areaLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Con {item.psychologist ? `${item.psychologist.firstName} ${item.psychologist.lastName}` : 'Professionista Elysa'}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold text-ocean mb-3">{item.title}</h2>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-6 bg-secondary/10 p-4 rounded-xl border border-border/50">
                    <div><strong>Partecipanti:</strong> {item.minParticipants} - {item.maxParticipants} persone</div>
                    <div><strong>Prezzo:</strong> {item.pricePerParticipant ? `€${item.pricePerParticipant}` : 'Su richiesta'}</div>
                    <div><strong>Durata:</strong> {item.duration || '8 settimane'}</div>
                    <div><strong>Frequenza:</strong> {item.weeklyFrequency || 'Settimanale'}</div>
                  </div>
                </div>

                {/* Modale/Form interattivo per richiedere l'iscrizione */}
                <PublicEnrollModal proposalId={item.id} classTitle={item.title} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}