import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Eyebrow } from '@/components/section'

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <div className="bg-ivory">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <Eyebrow>Documenti legali</Eyebrow>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-ocean sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>

        <div
          role="note"
          className="mt-8 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            <strong>Bozza da completare prima della pubblicazione.</strong> Le parti indicate tra
            parentesi quadre devono essere compilate con i dati reali del titolare e verificate da
            un consulente legale o privacy.
          </p>
        </div>

        <div className="legal-prose mt-12">{children}</div>
      </div>
    </div>
  )
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-sage-soft px-1.5 py-0.5 font-medium text-ocean">[{children}]</mark>
  )
}
