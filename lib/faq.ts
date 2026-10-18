export type FaqCategory = 'persone' | 'professionisti' | 'generali'

export type FaqItem = {
  category: FaqCategory
  question: string
  answer: string
}

export const faqCategoryLabels: Record<FaqCategory, string> = {
  persone: 'Per le persone',
  professionisti: 'Per i professionisti',
  generali: 'Generali',
}

export const faqItems: FaqItem[] = [
  {
    category: 'persone',
    question: 'Che cos’è Elysa?',
    answer:
      'Elysa è una piattaforma digitale di percorsi tematici di gruppo guidati da psicologi e professionisti della salute mentale. Prevede incontri online e, quando previsti dal programma, strumenti di continuità tra un incontro e l’altro.',
  },
  {
    category: 'persone',
    question: 'Sostituisce la terapia individuale?',
    answer:
      'No. Un percorso di gruppo può affiancare la terapia individuale, ma non la sostituisce automaticamente. L’appropriatezza della partecipazione dipende dalle tue esigenze e dalla valutazione del professionista.',
  },
  {
    category: 'persone',
    question: 'Come trovo il gruppo adatto?',
    answer:
      'Puoi esplorare le aree tematiche e manifestare il tuo interesse. La scelta del percorso tiene conto del programma, dei requisiti di partecipazione e delle indicazioni del professionista responsabile.',
  },
  {
    category: 'persone',
    question: 'Quanto spesso si svolgono gli incontri?',
    answer:
      'La frequenza varia in base al programma, al tema e agli obiettivi. Viene sempre comunicata prima dell’adesione, insieme al calendario.',
  },
  {
    category: 'persone',
    question: 'Quanto dura il percorso?',
    answer:
      'La durata complessiva viene definita dal professionista per ciascun programma e comunicata prima dell’adesione.',
  },
  {
    category: 'persone',
    question: 'I gruppi sono piccoli?',
    answer:
      'La dimensione del gruppo dipende dagli obiettivi del percorso. Il numero di partecipanti previsto e i limiti minimi e massimi sono comunicati per ogni programma.',
  },
  {
    category: 'persone',
    question: 'Come si svolgono gli incontri?',
    answer:
      'Gli incontri si svolgono online, secondo le modalità indicate nella descrizione del programma e comunicate prima dell’avvio.',
  },
  {
    category: 'persone',
    question: 'I miei dati sono riservati?',
    answer:
      'Il trattamento dei dati personali avviene nel rispetto della normativa applicabile e delle informative pubblicate. Le regole di ciascun gruppo chiariscono anche i limiti della riservatezza rispetto agli altri partecipanti, che si impegnano a rispettare quanto condiviso durante gli incontri.',
  },
  {
    category: 'persone',
    question: 'Posso partecipare senza essere già in terapia?',
    answer:
      'Alcuni programmi possono accogliere chi desidera iniziare da uno spazio condiviso. Dipende dai criteri di partecipazione definiti dal professionista e dalla sua valutazione.',
  },
  {
    category: 'professionisti',
    question: 'Chi può proporre percorsi?',
    answer:
      'Psicologi e professionisti della salute mentale con competenze pertinenti all’area tematica proposta, previa verifica dei requisiti applicabili.',
  },
  {
    category: 'professionisti',
    question: 'Posso definire frequenza e durata?',
    answer:
      'Sì. Frequenza, durata e struttura sono definite in base agli obiettivi, al tema e alle caratteristiche del programma, nel rispetto dei requisiti di Elysa.',
  },
  {
    category: 'professionisti',
    question: 'Posso proporre percorsi sulla genitorialità o su altri temi?',
    answer:
      'Sì, se il tema è coerente con le tue competenze professionali e con i criteri di partecipazione previsti.',
  },
  {
    category: 'professionisti',
    question: 'Come può collaborare un centro o una struttura?',
    answer:
      'Contattando Elysa tramite il modulo dedicato, per valutare insieme il progetto e le possibili modalità di collaborazione.',
  },
  {
    category: 'professionisti',
    question: 'L’adesione garantisce l’avvio del percorso?',
    answer:
      'No. L’avvio dipende dalla valutazione della proposta, dalle condizioni organizzative e dal raggiungimento dei requisiti previsti, incluso il numero di partecipanti.',
  },
  {
    category: 'generali',
    question: 'Come posso contattare Elysa?',
    answer:
      'Puoi scriverci tramite il modulo di contatto oppure all’indirizzo info@elysagroup.com.',
  },
]
