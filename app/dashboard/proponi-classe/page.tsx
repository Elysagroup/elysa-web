import type { Metadata } from 'next'
import { ClassProposalForm } from '@/components/professionals/class-proposal-form'

export const metadata: Metadata = {
  title: 'Proponi una classe',
}

export default function ProponiClassePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold text-ocean">Proponi una nuova classe</h1>
      <p className="mt-3 text-muted-foreground">
        Definisci titolo, struttura del gruppo, orari ipotetici e materiali. La proposta viene salvata in revisione e
        notificata a info@elysagroup.com prima della pubblicazione.
      </p>
      <div className="mt-8">
        <ClassProposalForm />
      </div>
    </section>
  )
}
