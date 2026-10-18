import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/professionals/login-forms'

export const metadata: Metadata = {
  title: 'Accesso admin',
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const nextPath = next?.startsWith('/admin') ? next : '/admin/candidature'

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold text-ocean">Accesso riservato</h1>
      <p className="mt-3 text-muted-foreground">Area di valutazione delle candidature Elysa.</p>
      <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <AdminLoginForm nextPath={nextPath} />
      </div>
    </section>
  )
}
