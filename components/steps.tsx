import type { ReactNode } from 'react'

export type Step = { title: string; description: ReactNode }

export function Steps({ steps, label }: { steps: Step[]; label: string }) {
  return (
    <ol aria-label={label} className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative flex flex-col rounded-2xl border border-border bg-white p-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-ocean/20 bg-ivory font-heading text-sm font-semibold text-ocean"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-sage to-transparent" />
          </div>
          <h3 className="mt-5 text-lg font-semibold leading-snug text-ocean">
            <span className="sr-only">{`Fase ${index + 1}: `}</span>
            {step.title}
          </h3>
          <div className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground">
            {step.description}
          </div>
        </li>
      ))}
    </ol>
  )
}
