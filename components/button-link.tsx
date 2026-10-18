import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverted'

const variants: Record<Variant, string> = {
  primary: 'bg-ocean text-white hover:bg-ocean-soft',
  secondary: 'border border-ocean/25 bg-white text-ocean hover:border-ocean/50 hover:bg-ivory',
  ghost: 'text-ocean hover:bg-sage-soft',
  inverted: 'bg-white text-ocean hover:bg-ivory',
}

export const buttonLinkClass = (variant: Variant = 'primary', className?: string) =>
  cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[0.95rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:size-4 [&_svg]:shrink-0',
    variants[variant],
    className,
  )

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonLinkClass(variant, className)} {...props} />
}
