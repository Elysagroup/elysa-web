import {
  ArrowRight,
  BookOpen,
  DoorOpen,
  Layers,
  MessagesSquare,
  Repeat,
  ShieldCheck,
  Target,
  Users,
  Waypoints,
  Workflow,
  UserRoundCheck,
} from 'lucide-react'
import { AreasDisclaimer, AreasGrid } from '@/components/areas-grid'
import { ButtonLink } from '@/components/button-link'
import { FeatureCard, Section, SectionHeading } from '@/components/section'

export function WhatIsElysa() {
  return (
    <Section tone="white" labelledBy="cosa-e-elysa">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="cosa-e-elysa"
            eyebrow="Che cos’è Elysa"
            title="Un percorso personale non deve essere un percorso solitario."
          />
          <ButtonLink href="/come-funziona" variant="secondary" className="mt-8">
            Scopri come funziona
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Elysa è uno spazio digitale dedicato a percorsi tematici di gruppo guidati da psicologi
            e professionisti della salute mentale. Ogni programma ha un tema, obiettivi definiti,
            modalità chiare e una guida professionale responsabile.
          </p>
          <p>
            Gli incontri si svolgono online e, quando previsto dal programma, sono integrati da
            strumenti di supporto per la quotidianità. Elysa può affiancare la terapia individuale
            o rappresentare un primo passo per avvicinarsi al confronto con un professionista.
          </p>
          <p className="rounded-xl border-l-2 border-sage-deep bg-ivory px-5 py-4 text-base text-slate-ink">
            Elysa non è un social network, non offre consigli generici e non sostituisce
            automaticamente un percorso individuale.
          </p>
        </div>
      </div>

      <ul className="mt-16 grid gap-5 md:grid-cols-3">
        <li>
          <FeatureCard icon={Repeat} title="Continuità">
            Riprendere e integrare nella quotidianità i temi affrontati durante gli incontri.
          </FeatureCard>
        </li>
        <li>
          <FeatureCard icon={MessagesSquare} title="Confronto">
            Incontrare persone con esperienze affini, nel rispetto delle regole condivise dal
            gruppo.
          </FeatureCard>
        </li>
        <li>
          <FeatureCard icon={UserRoundCheck} title="Guida professionale">
            Percorsi strutturati e condotti da professionisti qualificati della salute mentale.
          </FeatureCard>
        </li>
      </ul>
    </Section>
  )
}

const peopleBenefits = [
  {
    icon: DoorOpen,
    title: 'Un primo passo più accessibile',
    text: 'Un contesto condiviso per chi esita ad avvicinarsi a un percorso individuale, previa valutazione dell’idoneità.',
  },
  {
    icon: MessagesSquare,
    title: 'Un confronto che non banalizza',
    text: 'Uno spazio guidato, lontano da consigli superficiali e semplificazioni social.',
  },
  {
    icon: Repeat,
    title: 'Continuità nella quotidianità',
    text: 'Strumenti e attività, quando previsti, per riflettere su quanto emerso.',
  },
  {
    icon: ShieldCheck,
    title: 'Una comunità con confini chiari',
    text: 'Regole condivise, rispetto e attenzione alla riservatezza.',
  },
]

const proBenefits = [
  {
    icon: Workflow,
    title: 'Dare forma al proprio metodo',
    text: 'Progettare percorsi con obiettivi, struttura e calendario definiti.',
  },
  {
    icon: Target,
    title: 'Raggiungere persone interessate',
    text: 'Presentare programmi coerenti con bisogni e temi specifici.',
  },
  {
    icon: BookOpen,
    title: 'Valorizzare le competenze',
    text: 'Dare spazio alla profondità professionale, oltre la superficialità dei contenuti virali.',
  },
  {
    icon: Layers,
    title: 'Una struttura di supporto',
    text: 'Strumenti organizzativi per presentare programmi, raccogliere interesse e gestire adesioni, nei limiti delle funzionalità disponibili.',
  },
]

function BenefitList({
  items,
}: {
  items: { icon: typeof Users; title: string; text: string }[]
}) {
  return (
    <ul className="mt-8 space-y-6">
      {items.map((item) => (
        <li key={item.title} className="flex gap-4">
          <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-ocean">
            <item.icon className="size-[1.1rem]" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div>
            <h4 className="font-semibold text-ocean">{item.title}</h4>
            <p className="mt-1 leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function WhyElysa() {
  return (
    <Section labelledBy="perche-elysa">
      <SectionHeading
        id="perche-elysa"
        eyebrow="Perché scegliere Elysa"
        title="Dare continuità significa creare spazio per ciò che conta."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <article className="flex flex-col rounded-3xl border border-border bg-white p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Users className="size-5 text-sage-deep" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-ocean">Per le persone</h3>
          </div>
          <BenefitList items={peopleBenefits} />
          <ButtonLink href="/per-le-persone" className="mt-10 self-start">
            Trova il percorso più adatto a te
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </article>
        <article className="flex flex-col rounded-3xl border border-border bg-white p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Waypoints className="size-5 text-sage-deep" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-ocean">Per i professionisti</h3>
          </div>
          <BenefitList items={proBenefits} />
          <ButtonLink href="/per-professionisti" variant="secondary" className="mt-10 self-start">
            Proponi un percorso su Elysa
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </article>
      </div>
    </Section>
  )
}

export function AreasPreview() {
  return (
    <Section tone="white" labelledBy="aree-home">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="aree-home"
          eyebrow="Aree tematiche"
          title="Percorsi diversi, bisogni diversi."
          intro="Elysa raccoglie percorsi tematici per affrontare domande, difficoltà e passaggi della vita insieme a un professionista."
        />
        <ButtonLink href="/aree-tematiche" variant="secondary" className="self-start lg:self-auto">
          Esplora tutte le aree tematiche
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </div>
      <div className="mt-12">
        <AreasGrid />
      </div>
      <AreasDisclaimer />
    </Section>
  )
}
