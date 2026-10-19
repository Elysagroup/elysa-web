export const siteConfig = {
  name: 'Elysa',
  payoff: 'Elysa. La continuità del percorso, la forza del confronto.',
  tagline: 'Percorsi tematici di gruppo, confronto guidato e continuità.',
  email: 'info@elysagroup.com',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://www.elysagroup.com',
}

export const CONTACT_EMAIL = siteConfig.email

export const mainNav = [
  { href: '/come-funziona', label: 'Come funziona' },
  { href: '/aree-tematiche', label: 'Aree tematiche' },
  { href: '/professionisti', label: 'Professionisti' },
  { href: '/per-le-persone', label: 'Per le persone' },
  { href: '/per-professionisti', label: 'Per i professionisti' },
] as const

export const legalNav = [
  { href: '/contatti', label: 'Contatti' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/termini-e-condizioni', label: 'Termini e condizioni' },
] as const
