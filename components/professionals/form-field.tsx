import type { FieldError } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const fieldInputClass =
  'block w-full rounded-xl border border-input bg-white px-4 py-3 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/80 focus-visible:border-ocean focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ocean/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15'

export function FieldMessage({ id, error }: { id: string; error?: FieldError }) {
  if (!error?.message) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {error.message}
    </p>
  )
}

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ocean">
      {children}
      {required ? (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-1.5 font-normal text-muted-foreground">(facoltativo)</span>
      )}
    </label>
  )
}

export function FormCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-ocean">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

export function StatusBanner({
  tone,
  title,
  children,
}: {
  tone: 'success' | 'error'
  title: string
  children?: React.ReactNode
}) {
  return (
    <div
      role="status"
      className={cn(
        'rounded-2xl border p-4',
        tone === 'success' ? 'border-sage bg-sage-soft/70 text-ocean' : 'border-destructive/30 bg-destructive/5 text-destructive',
      )}
    >
      <p className="font-semibold">{title}</p>
      {children ? <div className="mt-1 text-sm leading-relaxed">{children}</div> : null}
    </div>
  )
}
