export const dynamic = 'force-dynamic'

export default function ProfessionalLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sage-deep">Area Riservata</p>
        <h1 className="mt-2 text-2xl font-semibold text-ocean">Accedi come Professionista</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inserisci le credenziali ricevute via email per accedere al tuo profilo.
        </p>

        <form action="/api/dashboard/login" method="post" className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-ink">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-xl border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
              placeholder="nome@esempio.it"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-ink">Password Temporanea</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-xl border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-ocean py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  )
}