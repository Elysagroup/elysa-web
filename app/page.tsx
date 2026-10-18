import type { Metadata } from 'next'
import { HomeHero } from '@/components/home/hero'
import { AreasPreview, WhatIsElysa, WhyElysa } from '@/components/home/home-sections'
import {
  CentersSection,
  DepthSection,
  FaqBlock,
  FlexibleModel,
  PeopleStepsSection,
  ProStepsSection,
} from '@/components/content-blocks'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: { absolute: 'Elysa | Percorsi di gruppo e continuità psicologica' },
  description:
    'Scopri Elysa, la piattaforma che mette in relazione persone e professionisti attraverso percorsi tematici di gruppo, incontri online e strumenti di continuità.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WhatIsElysa />
      <WhyElysa />
      <AreasPreview />
      <PeopleStepsSection />
      <FlexibleModel />
      <ProStepsSection />
      <CentersSection />
      <DepthSection />
      <FaqBlock />
      <CtaBand flushTop />
    </>
  )
}
