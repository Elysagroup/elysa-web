import {
  CloudSun,
  Compass,
  Gauge,
  HeartHandshake,
  Leaf,
  Orbit,
  Shapes,
  Sprout,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const icons: Record<string, LucideIcon> = {
  'ansia-e-preoccupazioni': Wind,
  'umore-e-momenti-di-difficolta': CloudSun,
  'autostima-e-conoscenza-di-se': Sprout,
  'relazioni-e-legami': HeartHandshake,
  'lutto-perdita-e-cambiamento': Leaf,
  'genitorialita-e-relazioni-familiari': Users,
  'stress-e-sovraccarico-emotivo': Gauge,
  'giovani-identita-e-passaggi-di-vita': Compass,
  'solitudine-e-appartenenza': Orbit,
  'altre-aree': Shapes,
}

export function AreaIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Shapes
  return (
    <span
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full bg-sage-soft text-ocean',
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
    </span>
  )
}
