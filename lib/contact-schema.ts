import { z } from 'zod'
import { areaSlugs } from '@/lib/areas'

export const REQUEST_TYPES = [
  'partecipante',
  'professionista',
  'centro',
  'informazioni',
] as const

export type RequestType = (typeof REQUEST_TYPES)[number]

export const requestTypeLabels: Record<RequestType, string> = {
  partecipante: 'Desidero partecipare a un percorso',
  professionista: 'Sono uno psicologo/un professionista',
  centro: 'Rappresento un centro/una struttura',
  informazioni: 'Desidero informazioni generali',
}

export const FIELD_LIMITS = {
  nome: 100,
  email: 254,
  telefono: 25,
  messaggio: 2000,
  professione: 120,
  ambito: 160,
  sitoWeb: 200,
  nomeStruttura: 150,
  ruoloReferente: 120,
} as const

const PHONE_PATTERN = /^[+()\d\s.-]{6,25}$/
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Massimo ${max} caratteri.`)

export const contactSchema = z
  .object({
    tipo: z.enum(REQUEST_TYPES, {
      message: 'Seleziona la tipologia di richiesta.',
    }),
    nome: z
      .string()
      .trim()
      .min(2, 'Inserisci nome e cognome.')
      .max(FIELD_LIMITS.nome, `Massimo ${FIELD_LIMITS.nome} caratteri.`),
    email: z
      .string()
      .trim()
      .min(1, 'Inserisci il tuo indirizzo email.')
      .max(FIELD_LIMITS.email, 'Indirizzo email troppo lungo.')
      .email('Inserisci un indirizzo email valido.'),
    telefono: optionalText(FIELD_LIMITS.telefono).refine(
      (value) => value === '' || PHONE_PATTERN.test(value),
      'Inserisci un numero di telefono valido.',
    ),
    area: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || areaSlugs.includes(value),
        'Seleziona un’area tra quelle proposte.',
      ),
    professione: optionalText(FIELD_LIMITS.professione),
    ambito: optionalText(FIELD_LIMITS.ambito),
    sitoWeb: optionalText(FIELD_LIMITS.sitoWeb).refine(
      (value) => value === '' || WEBSITE_PATTERN.test(value),
      'Inserisci un indirizzo web valido (es. www.esempio.it).',
    ),
    nomeStruttura: optionalText(FIELD_LIMITS.nomeStruttura),
    ruoloReferente: optionalText(FIELD_LIMITS.ruoloReferente),
    messaggio: optionalText(FIELD_LIMITS.messaggio),
    privacy: z.boolean().refine((value) => value === true, {
      message: 'Per inviare la richiesta è necessario prendere visione dell’informativa privacy.',
    }),
    marketing: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'professionista') {
      if (data.professione.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['professione'],
          message: 'Indica la tua professione.',
        })
      }
      if (data.ambito.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['ambito'],
          message: 'Indica l’ambito di interesse.',
        })
      }
    }
    if (data.tipo === 'centro') {
      if (data.nomeStruttura.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['nomeStruttura'],
          message: 'Indica il nome della struttura.',
        })
      }
      if (data.ruoloReferente.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['ruoloReferente'],
          message: 'Indica il tuo ruolo nella struttura.',
        })
      }
    }
  })

export type ContactFormValues = z.infer<typeof contactSchema>

export const contactRequestSchema = z.object({
  submissionId: z.string().uuid(),
  startedAt: z.number().int().positive(),
  fax: z.string().max(200).optional(),
  data: z.unknown(),
})

export function isRequestType(value: unknown): value is RequestType {
  return typeof value === 'string' && (REQUEST_TYPES as readonly string[]).includes(value)
}
