import type { Metadata } from 'next'
import Link from 'next/link'
import { PsychologistLoginForm } from '@/components/professionals/login-forms'

export const metadata: Metadata = {
  title: 'Accesso professionisti',
}

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const nextPath = next?.startsWith('/dashboard') ? next : '/dashboard'

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold text-ocean">Area riservata professionisti</h1>
      <p className="mt-3 text-muted-foreground">
        Accesso per psicologi con candidatura approvata. Se non hai ancora inviato la richiesta, puoi farlo dalla
        pagina di candidatura.
      </p>
      <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <PsychologistLoginForm nextPath={nextPath} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Non sei ancora in Elysa?{' '}
        <Link href="/candidatura-psicologo" className="font-medium text-ocean underline underline-offset-4">
          Invia la candidatura
        </Link>
      </p>
    </section>
  )
}
