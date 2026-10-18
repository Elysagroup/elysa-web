export type ThematicArea = {
  slug: string
  title: string
  summary: string
  audience: string
  themes: string[]
  goals: string[]
  note?: string
}

export const thematicAreas: ThematicArea[] = [
  {
    slug: 'ansia-e-preoccupazioni',
    title: 'Ansia e preoccupazioni',
    summary:
      'Esplorare paure, tensioni e schemi ricorrenti, sviluppando modalità più consapevoli per affrontare la quotidianità.',
    audience:
      'Persone che sentono che preoccupazioni, tensione o paure occupano spazio nella loro giornata e desiderano comprenderle meglio in un contesto condiviso e guidato.',
    themes: [
      'Riconoscere i segnali della tensione nel corpo e nei pensieri',
      'Schemi di preoccupazione ricorrenti e situazioni che li attivano',
      'Il rapporto con l’incertezza e con il bisogno di controllo',
      'Strategie quotidiane più consapevoli e sostenibili',
    ],
    goals: [
      'Dare un nome a ciò che si prova e condividerlo con chi vive esperienze affini',
      'Osservare i propri schemi con maggiore distanza e curiosità',
      'Sperimentare, con la guida del professionista, modalità diverse di affrontare le situazioni',
    ],
  },
  {
    slug: 'umore-e-momenti-di-difficolta',
    title: 'Umore e momenti di difficoltà',
    summary:
      'Dare spazio a tristezza, demotivazione, isolamento o perdita di interesse, comprendendo risorse e forme di supporto appropriate.',
    audience:
      'Persone che attraversano una fase di tristezza, stanchezza emotiva o perdita di interesse e desiderano uno spazio di confronto guidato, accanto alle forme di supporto più appropriate.',
    themes: [
      'Riconoscere e dare parola agli stati d’animo',
      'Il rapporto tra umore, abitudini e relazioni',
      'Isolamento, motivazione e piccoli passi nella quotidianità',
      'Conoscere le forme di supporto disponibili e quando chiedere aiuto',
    ],
    goals: [
      'Condividere la propria esperienza in un contesto rispettoso e non giudicante',
      'Individuare risorse personali e relazionali',
      'Orientarsi verso le forme di supporto più adatte alla propria situazione',
    ],
    note:
      'I percorsi di gruppo non sostituiscono il trattamento individualizzato della depressione o di altre condizioni che richiedono un intervento specifico. Il professionista valuta l’adeguatezza della partecipazione e, se necessario, indica percorsi più appropriati.',
  },
  {
    slug: 'autostima-e-conoscenza-di-se',
    title: 'Autostima e conoscenza di sé',
    summary:
      'Esplorare giudizio personale, bisogno di approvazione e riconoscimento del proprio valore.',
    audience:
      'Persone che desiderano approfondire il rapporto con se stesse, il proprio dialogo interiore e il modo in cui si percepiscono nelle relazioni e nel lavoro.',
    themes: [
      'Il dialogo interiore e il giudizio verso se stessi',
      'Il bisogno di approvazione e il confronto con gli altri',
      'Riconoscere risorse, limiti e valori personali',
      'Esprimere i propri bisogni con maggiore chiarezza',
    ],
    goals: [
      'Osservare con maggiore consapevolezza il proprio modo di valutarsi',
      'Confrontarsi con altri partecipanti su esperienze simili',
      'Costruire uno sguardo su di sé più equilibrato',
    ],
  },
  {
    slug: 'relazioni-e-legami',
    title: 'Relazioni e legami',
    summary:
      'Comprendere dinamiche relazionali, comunicazione, bisogni e confini personali.',
    audience:
      'Persone interessate a comprendere come vivono le relazioni affettive, amicali o professionali e a riflettere su comunicazione e confini.',
    themes: [
      'Dinamiche ricorrenti nelle relazioni',
      'Comunicazione, ascolto ed espressione dei bisogni',
      'Confini personali e rispetto reciproco',
      'Gestione dei conflitti e delle incomprensioni',
    ],
    goals: [
      'Riconoscere i propri modi di stare in relazione',
      'Esercitare, nel gruppo, nuove modalità di comunicazione',
      'Riflettere sui confini come forma di cura di sé e dell’altro',
    ],
  },
  {
    slug: 'lutto-perdita-e-cambiamento',
    title: 'Lutto, perdita e cambiamento',
    summary:
      'Affrontare separazioni e trasformazioni rispettando tempi ed esperienze individuali.',
    audience:
      'Persone che stanno vivendo una perdita, una separazione o un cambiamento significativo e desiderano condividerne il significato con altri, con una guida professionale.',
    themes: [
      'Le diverse forme della perdita: persone, relazioni, ruoli, progetti',
      'I tempi personali dell’elaborazione',
      'Il rapporto tra memoria, continuità e cambiamento',
      'Ritrovare spazio per sé nella nuova fase',
    ],
    goals: [
      'Trovare uno spazio in cui dare parola all’esperienza della perdita',
      'Sentirsi meno soli nel confronto con chi vive passaggi simili',
      'Accogliere il cambiamento nel rispetto dei propri tempi',
    ],
  },
  {
    slug: 'genitorialita-e-relazioni-familiari',
    title: 'Genitorialità e relazioni familiari',
    summary:
      'Comprendere i bisogni dei figli, le difficoltà comunicative e i cambiamenti generazionali.',
    audience:
      'Genitori, futuri genitori e adulti con responsabilità educative che desiderano riflettere sul proprio ruolo e sulle dinamiche familiari.',
    themes: [
      'I bisogni dei figli nelle diverse fasi di crescita',
      'Comunicazione in famiglia e gestione dei conflitti',
      'Cambiamenti generazionali, tecnologia e nuove sfide educative',
      'Il benessere del genitore come parte della relazione',
    ],
    goals: [
      'Confrontarsi con altri genitori in uno spazio guidato',
      'Comprendere meglio i bisogni propri e dei figli',
      'Esplorare modalità comunicative più consapevoli',
    ],
  },
  {
    slug: 'stress-e-sovraccarico-emotivo',
    title: 'Stress e sovraccarico emotivo',
    summary:
      'Riconoscere le fonti di pressione e individuare modalità più sostenibili di gestione.',
    audience:
      'Persone che sentono di vivere una fase di pressione prolungata, legata a lavoro, studio, cura di altri o eventi di vita, e desiderano riflettere su come gestirla.',
    themes: [
      'Riconoscere le fonti di pressione e i segnali di sovraccarico',
      'Il rapporto tra aspettative, responsabilità e limiti',
      'Ritmi, pause e cura di sé nella quotidianità',
      'Chiedere supporto e condividere il carico',
    ],
    goals: [
      'Comprendere come lo stress si manifesta nella propria esperienza',
      'Confrontarsi su strategie concrete e sostenibili',
      'Riconoscere quando è opportuno cercare ulteriore supporto',
    ],
  },
  {
    slug: 'giovani-identita-e-passaggi-di-vita',
    title: 'Giovani, identità e passaggi di vita',
    summary:
      'Esplorare appartenenza, autonomia, relazioni e cambiamenti generazionali.',
    audience:
      'Giovani adulti che attraversano passaggi come la fine degli studi, l’ingresso nel lavoro, l’autonomia abitativa o la definizione della propria identità. Eventuali percorsi per minori richiedono condizioni specifiche, incluso il coinvolgimento di chi esercita la responsabilità genitoriale.',
    themes: [
      'Identità, appartenenza e scelte personali',
      'Autonomia e rapporto con la famiglia di origine',
      'Relazioni, confronto sociale e vita digitale',
      'Incertezza sul futuro e progettualità',
    ],
    goals: [
      'Condividere domande e passaggi con coetanei in un contesto guidato',
      'Riflettere sulle proprie scelte con maggiore consapevolezza',
      'Riconoscere risorse e possibilità nei momenti di transizione',
    ],
  },
  {
    slug: 'solitudine-e-appartenenza',
    title: 'Solitudine e appartenenza',
    summary:
      'Affrontare la difficoltà di sentirsi compresi e costruire relazioni significative.',
    audience:
      'Persone che vivono una sensazione di distanza dagli altri, che si sono trasferite o che desiderano riflettere sul bisogno di appartenenza e di legami significativi.',
    themes: [
      'Solitudine scelta e solitudine subita',
      'Il bisogno di sentirsi compresi',
      'Ostacoli e possibilità nella costruzione di nuovi legami',
      'Appartenenza, comunità e identità',
    ],
    goals: [
      'Fare esperienza di uno spazio condiviso e rispettoso',
      'Comprendere i propri modi di avvicinarsi e allontanarsi dagli altri',
      'Individuare passi concreti verso relazioni più significative',
    ],
  },
  {
    slug: 'altre-aree',
    title: 'Altre aree',
    summary:
      'Accogliere proposte coerenti con le competenze del professionista e i criteri di partecipazione.',
    audience:
      'Persone interessate a temi non elencati e professionisti che desiderano proporre percorsi su aree coerenti con le proprie competenze.',
    themes: [
      'Temi proposti dai professionisti in base alle proprie competenze',
      'Bisogni emersi dalle richieste di interesse',
      'Passaggi di vita specifici o contesti particolari',
    ],
    goals: [
      'Ampliare nel tempo le aree tematiche in modo coerente e responsabile',
      'Valutare ogni proposta in base a competenze, obiettivi e criteri di partecipazione',
    ],
  },
]

export const areaSlugs = thematicAreas.map((area) => area.slug)

export function getAreaBySlug(slug: string) {
  return thematicAreas.find((area) => area.slug === slug)
}
