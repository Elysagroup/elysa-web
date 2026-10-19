import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PasswordUpdateForm } from '@/components/professionals/login-forms'
import { requireRole } from '@/lib/professionals/http'

export const metadata: Metadata = {
  title: 'Modifica password',
}

export default async function DashboardPasswordPage() {
  const session = await requireRole('psychologist')
  if (!session) redirect('/dashboard/login')

  return (
    <section className="mx-auto max-w-xl px-5 py-12 sm:px-8">
      <Link href="/dashboard" className="text-sm font-medium text-ocean underline underline-offset-4">
        Torna alla panoramica
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ocean">Modifica password</h1>
      <p className="mt-3 text-muted-foreground">
        Scegli una password di almeno 8 caratteri per il tuo account professionista.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
        <PasswordUpdateForm />
      </div>
    </section>
  )
}
