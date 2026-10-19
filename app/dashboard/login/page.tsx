import type { Metadata } from 'next'
import { PasswordRecoveryForm, PsychologistLoginForm } from '@/components/professionals/login-forms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Accesso professionisti',
}

export default async function ProfessionalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const nextPath = next?.startsWith('/dashboard') && !next.startsWith('//') ? next : '/dashboard'

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sage-deep">Area Riservata</p>
        <h1 className="mt-2 text-2xl font-semibold text-ocean">Accedi come Professionista</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inserisci le credenziali ricevute via email per accedere al tuo profilo.
        </p>
        <div className="mt-6">
          <PsychologistLoginForm nextPath={nextPath} />
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-medium text-ocean underline underline-offset-4">
            Hai dimenticato la password?
          </summary>
          <PasswordRecoveryForm />
        </details>
      </div>
    </div>
  )
}