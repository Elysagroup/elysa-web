import type { Metadata } from 'next'
import { ArrowRight, DoorOpen, HeartHandshake, MessagesSquare, Repeat, ShieldCheck } from 'lucide-react'
import { ButtonLink } from '@/components/button-link'
import { FaqBlock, PeopleStepsSection } from '@/components/content-blocks'
import { CtaBand } from '@/components/cta-band'
import { AreasDisclaimer, AreasGrid } from '@/components/areas-grid'
import { FeatureCard, PageHero, Section, SectionHeading } from '@/components/section'

export const metadata: Metadata = {
  title: 'Per le persone',
  description:
    'Percorsi tematici di gruppo guidati da professionisti della salute mentale, per chi è già in terapia e per chi desidera avvicinarsi al supporto psicologico in un contesto condiviso.',
  alternates: { canonical: '/per-le-persone' },
}

export default function PerLePersonePage() {
  return (
    <>
      <PageHero
        eyebrow="Per le persone"
        title="Uno spazio condiviso per dare continuità al tuo percorso."
        intro="Uno spazio condiviso, guidato da professionisti, per dare continuità al proprio percorso psicologico e trasformare il confronto in un’opportunità di consapevolezza."
      >
        <ButtonLink href="/aree-tematiche">
          Esplora le aree tematiche
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/contatti?tipo=partecipante" variant="secondary">
          Manifesta il tuo interesse
        </ButtonLink>
      </PageHero>

      <Section tone="white" labelledBy="a-chi">
        <SectionHeading
          id="a-chi"
          eyebrow="A chi si rivolge"
          title="Accanto alla terapia, oppure come primo passo."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <FeatureCard icon={Repeat} title="Se sei già in un percorso individuale">
            La terapia individuale è uno spazio prezioso di approfondimento. Un percorso di gruppo
            su Elysa può offrire un contesto complementare in cui confrontarsi con persone che vivono
            esperienze affini e riportare nella quotidianità quanto emerso. Se sei in terapia, è
            utile parlarne anche con il tuo professionista di riferimento.
          </FeatureCard>
          <FeatureCard icon={DoorOpen} title="Se desideri avvicinarti al supporto psicologico">
            Per alcune persone un contesto condiviso è meno intimidatorio di un primo colloquio
            individuale. Alcuni programmi possono accogliere chi desidera iniziare da qui, secondo i
            criteri del professionista e previa valutazione dell’idoneità.
          </FeatureCard>
        </div>
      </Section>

      <Section labelledBy="cosa-trovi">
        <SectionHeading id="cosa-trovi" eyebrow="Cosa trovi su Elysa" title="Un confronto guidato, con confini chiari." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <FeatureCard icon={HeartHandshake} title="Guida professionale">
              Ogni percorso è progettato e condotto da uno psicologo o da un professionista della
              salute mentale.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={MessagesSquare} title="Persone con esperienze affini">
              Gruppi costruiti attorno a un tema, per sentirsi meno soli nell’affrontarlo.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={Repeat} title="Continuità tra gli incontri">
              Quando previsti dal programma, strumenti e attività per riflettere tra una sessione e
              l’altra.
            </FeatureCard>
          </li>
          <li>
            <FeatureCard icon={ShieldCheck} title="Regole condivise">
              Rispetto, riservatezza e limiti chiari, comunicati prima dell’adesione.
            </FeatureCard>
          </li>
        </ul>
        <div className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h3 className="font-semibold text-ocean">Un’indicazione importante</h3>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
            I percorsi di gruppo non sono servizi di emergenza e non sostituiscono automaticamente
            altri interventi eventualmente necessari. Se stai vivendo una situazione di urgenza o
            pericolo, rivolgiti al 112 o al pronto soccorso più vicino.
          </p>
        </div>
      </Section>

      <PeopleStepsSection tone="white" />

      <Section labelledBy="aree-persone">
        <SectionHeading
          id="aree-persone"
          eyebrow="Aree tematiche"
          title="Percorsi diversi, bisogni diversi."
          intro="Ogni area descrive temi, obiettivi e modalità. I percorsi sono in fase di attivazione: puoi manifestare il tuo interesse per essere ricontattato."
        />
        <div className="mt-12">
          <AreasGrid />
        </div>
        <AreasDisclaimer />
      </Section>

      {/* Box per accedere alle classi approvate */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <div className="bg-ocean/5 border border-ocean/20 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-ocean mb-3">Vuoi partecipare a un percorso di gruppo?</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
            Esplora l'elenco dei gruppi attivi approvati dai nostri professionisti e richiedi subito l'iscrizione.
          </p>
          <ButtonLink href="/per-le-persone/classi">
            Vedi tutte le classi disponibili
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>

      <FaqBlock initialCategory="persone" tone="white" />
      <CtaBand tone="white" flushTop />
    </>
  )
}