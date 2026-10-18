import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('size-8', className)}
      fill="none"
    >
      <circle cx="12" cy="16" r="8.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="16" r="8.5" stroke="#a9b9ac" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-heading text-xl font-semibold tracking-tight',
        inverted ? 'text-white' : 'text-ocean',
        className,
      )}
    >
      <LogoMark />
      Elysa
    </span>
  )
}
