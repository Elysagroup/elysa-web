import type { Metadata } from 'next'
import { AdminApplications } from '@/components/professionals/admin-applications'
import { listApplications } from '@/lib/professionals/store'

export const metadata: Metadata = {
  title: 'Candidature',
}

export const dynamic = 'force-dynamic'

export default async function AdminCandidaturePage() {
  let applications: any[] = []
  let hasError = false

  try {
    applications = await listApplications()
  } catch (err) {
    console.error('Errore nel caricamento delle candidature:', err)
    hasError = true
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      {/* Header Pannello Admin */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Pannello Amministrazione
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ocean">
            Candidature Psicologi
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Gestisci ed esamina le richieste di adesione dei professionisti.
          </p>
        </div>

        {/* Form di Logout */}
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-ocean transition-colors hover:bg-accent"
          >
            Disconnetti / Esci
          </button>
        </form>
      </div>

      {/* Contenuto / Tabella Candidature */}
      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h3 className="text-base font-semibold">Impossibile caricare le candidature</h3>
          <p className="mt-1 text-sm">
            Si è verificato un problema di connessione al database. Verifica le variabili d'ambiente di Supabase su Vercel.
          </p>
        </div>
      ) : (
        <AdminApplications initial={applications} />
      )}
    </section>
  )
} 