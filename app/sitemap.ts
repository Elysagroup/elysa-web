import type { MetadataRoute } from 'next'
import { thematicAreas } from '@/lib/areas'
import { siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/come-funziona', priority: 0.9 },
    { path: '/aree-tematiche', priority: 0.9 },
    { path: '/per-le-persone', priority: 0.9 },
    { path: '/per-professionisti', priority: 0.9 },
    { path: '/professionisti', priority: 0.8 },
    { path: '/candidatura-psicologo', priority: 0.7 },
    { path: '/contatti', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.3 },
    { path: '/cookie-policy', priority: 0.3 },
    { path: '/termini-e-condizioni', priority: 0.3 },
  ]

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...thematicAreas.map((area) => ({
      url: `${siteConfig.url}/aree-tematiche/${area.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
