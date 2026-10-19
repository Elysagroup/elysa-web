import type { Metadata } from 'next'
import { AdminApplications } from '@/components/professionals/admin-applications'
import { listApplications } from '@/lib/professionals/store'

export const metadata: Metadata = {
  title: 'Candidature',
}

export const dynamic = 'force-dynamic'

export default async function AdminCandidaturePage() {
  let applications: any[] = []
  
  try {
    applications = await listApplications()
  } catch (error) {
    console.error('Errore durante il recupero delle candidature:', error)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Approvazione</p>
          <h1 className="mt-2 text-3xl font-semibold text-ocean">Candidature psicologi</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Approva o rifiuta le candidature. L’approvazione genera le credenziali e invia il link di accesso
            all’area riservata.
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-sm font-medium text-ocean underline underline-offset-4">
            Esci
          </button>
        </form>
      </div>
      <AdminApplications initial={applications} />
    </section>
  )
}