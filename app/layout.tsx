import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { SiteChrome } from '@/components/site-chrome'
import { siteConfig } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const description =
  'Scopri Elysa, la piattaforma che mette in relazione persone e professionisti attraverso percorsi tematici di gruppo, incontri online e strumenti di continuità.'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Elysa | Percorsi di gruppo e continuità psicologica',
    template: '%s | Elysa',
  },
  description,
  applicationName: 'Elysa',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Elysa',
    title: 'Elysa | Percorsi di gruppo e continuità psicologica',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elysa | Percorsi di gruppo e continuità psicologica',
    description,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1a2b48',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
