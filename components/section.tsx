import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  children,
  className,
  tone = 'ivory',
  id,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  tone?: 'ivory' | 'white' | 'sage' | 'ocean'
  id?: string
  labelledBy?: string
}) {
  const tones = {
    ivory: 'bg-ivory',
    white: 'bg-white',
    sage: 'bg-sage-soft',
    ocean: 'bg-ocean text-white',
  }
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tones[tone], 'py-20 sm:py-24 lg:py-28', className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  )
}

export function Eyebrow({ children, inverted = false }: { children: ReactNode; inverted?: boolean }) {
  return (
    <p
      className={cn(
        'text-xs font-semibold uppercase tracking-[0.18em]',
        inverted ? 'text-sage' : 'text-sage-deep',
      )}
    >
      {children}
    </p>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
  inverted = false,
  as: Heading = 'h2',
}: {
  id?: string
  eyebrow?: string
  title: string
  intro?: ReactNode
  align?: 'left' | 'center'
  inverted?: boolean
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow inverted={inverted}>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={cn(
          'mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]',
          inverted ? 'text-white' : 'text-ocean',
        )}
      >
        {title}
      </Heading>
      {intro && (
        <div
          className={cn(
            'mt-5 text-lg leading-relaxed',
            inverted ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {intro}
        </div>
      )}
    </div>
  )
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon?: LucideIcon
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(26,43,72,0.04)] sm:p-7',
        className,
      )}
    >
      {Icon && (
        <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-sage-soft text-ocean">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </span>
      )}
      <h3 className="text-lg font-semibold text-ocean">{title}</h3>
      <div className="mt-2.5 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full border border-sage/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-10 size-[22rem] rounded-full bg-sage-soft/70"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-ocean sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          <div className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">{intro}</div>
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
      </div>
    </section>
  )
}
