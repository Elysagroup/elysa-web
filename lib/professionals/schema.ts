import { z } from 'zod'
import {
  ALBO_SECTIONS,
  CLASS_FREQUENCIES,
  COMPETENCE_AREAS,
  competenceAreaIds,
  REGIONAL_ORDERS,
  THERAPEUTIC_APPROACHES,
  WEEKDAY_IDS,
} from '@/lib/professionals/constants'

export const FIELD_LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 25,
  taxCode: 16,
  vatNumber: 11,
  city: 80,
  alboNumber: 40,
  yearsExperience: 60,
  therapeuticApproachOther: 80,
  bio: 800,
  availabilityNotes: 400,
  classTitle: 140,
  classDescription: 4000,
  duration: 80,
  sessionTime: 80,
} as const

const PHONE_PATTERN = /^[+()\d\s.-]{6,25}$/
const CF_PATTERN = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i
const VAT_PATTERN = /^\d{11}$/

const requiredText = (max: number, message: string) =>
  z.string().trim().min(2, message).max(max, `Massimo ${max} caratteri.`)

export const candidaturaSchema = z
  .object({
    firstName: requiredText(FIELD_LIMITS.firstName, 'Inserisci il nome.'),
    lastName: requiredText(FIELD_LIMITS.lastName, 'Inserisci il cognome.'),
    email: z
      .string()
      .trim()
      .min(1, 'Inserisci il tuo indirizzo email.')
      .max(FIELD_LIMITS.email, 'Indirizzo email troppo lungo.')
      .email('Inserisci un indirizzo email valido.'),
    phone: z
      .string()
      .trim()
      .min(6, 'Inserisci un numero di telefono valido.')
      .max(FIELD_LIMITS.phone, `Massimo ${FIELD_LIMITS.phone} caratteri.`)
      .refine((value) => PHONE_PATTERN.test(value), 'Inserisci un numero di telefono valido.'),
    taxCode: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s/g, '').toUpperCase())
      .pipe(
        z
          .string()
          .length(16, 'Il codice fiscale deve contenere 16 caratteri.')
          .refine((value) => CF_PATTERN.test(value), 'Inserisci un codice fiscale valido.'),
      ),
    vatNumber: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s/g, ''))
      .pipe(
        z.string().regex(VAT_PATTERN, 'La partita IVA deve contenere 11 cifre.'),
      ),
    city: requiredText(FIELD_LIMITS.city, 'Inserisci la città.'),
    alboNumber: requiredText(FIELD_LIMITS.alboNumber, 'Inserisci il numero di iscrizione all’Albo.'),
    regionalOrder: z.enum(REGIONAL_ORDERS, {
      message: 'Seleziona l’Ordine regionale.',
    }),
    alboSection: z.enum(ALBO_SECTIONS, {
      message: 'Seleziona la sezione dell’Albo (A o B).',
    }),
    yearsExperience: z
      .number({ message: 'Indica gli anni di esperienza.' })
      .int('Indica un numero intero.')
      .min(0, 'Gli anni di esperienza non possono essere negativi.')
      .max(FIELD_LIMITS.yearsExperience, 'Verifica gli anni di esperienza indicati.'),
    therapeuticApproach: z.enum(THERAPEUTIC_APPROACHES, {
      message: 'Seleziona l’approccio terapeutico.',
    }),
    therapeuticApproachOther: z
      .string()
      .trim()
      .max(FIELD_LIMITS.therapeuticApproachOther, `Massimo ${FIELD_LIMITS.therapeuticApproachOther} caratteri.`)
      .optional(),
    thematicAreas: z
      .array(z.enum(competenceAreaIds as [string, ...string[]]))
      .min(1, 'Seleziona almeno un’area tematica di competenza.'),
    availabilityDays: z
      .array(z.enum(WEEKDAY_IDS as [string, ...string[]]))
      .min(1, 'Indica almeno un giorno di disponibilità.'),
    availabilityNotes: z
      .string()
      .trim()
      .max(FIELD_LIMITS.availabilityNotes, `Massimo ${FIELD_LIMITS.availabilityNotes} caratteri.`)
      .optional(),
    bio: z
      .string()
      .trim()
      .max(FIELD_LIMITS.bio, `Massimo ${FIELD_LIMITS.bio} caratteri.`)
      .optional(),
    privacy: z.boolean().refine((value) => value === true, {
      message: 'Per inviare la candidatura è necessario prendere visione dell’informativa privacy.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.therapeuticApproach === 'Altro' && !(data.therapeuticApproachOther ?? '').trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['therapeuticApproachOther'],
        message: 'Specifica l’approccio terapeutico.',
      })
    }
  })

export type CandidaturaFormValues = z.infer<typeof candidaturaSchema>

export const candidaturaRequestSchema = z.object({
  submissionId: z.string().uuid(),
  startedAt: z.number().int().positive(),
  fax: z.string().max(200).optional(),
  data: candidaturaSchema,
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Inserisci l’indirizzo email.')
    .email('Inserisci un indirizzo email valido.'),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri.'),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Inserisci la password di accesso.'),
})

const frequencyIds = CLASS_FREQUENCIES.map((item) => item.id) as [string, ...string[]]

export const classProposalSchema = z
  .object({
    title: requiredText(FIELD_LIMITS.classTitle, 'Inserisci il titolo del percorso.'),
    description: z
      .string()
      .trim()
      .min(40, 'Descrivi il percorso in almeno 40 caratteri.')
      .max(FIELD_LIMITS.classDescription, `Massimo ${FIELD_LIMITS.classDescription} caratteri.`),
    thematicArea: z.enum(competenceAreaIds as [string, ...string[]], {
      message: 'Seleziona l’area tematica di riferimento.',
    }),
    minParticipants: z.number({ message: 'Indica il numero minimo di partecipanti.' }).int().min(3, 'Il minimo è 3 partecipanti.').max(40),
    maxParticipants: z.number({ message: 'Indica il numero massimo di partecipanti.' }).int().min(3, 'Il massimo deve essere almeno 3.').max(50),
    totalHours: z.number({ message: 'Indica le ore totali del percorso.' }).min(2, 'Indica le ore totali del percorso.').max(200),
    duration: requiredText(FIELD_LIMITS.duration, 'Indica la durata complessiva (es. 8 settimane).'),
    weeklyFrequency: z.enum(frequencyIds, {
      message: 'Seleziona la frequenza delle sessioni.',
    }),
    sessionDays: z
      .array(z.enum(WEEKDAY_IDS as [string, ...string[]]))
      .min(1, 'Indica almeno un giorno ipotetico per le sessioni live.'),
    sessionTime: requiredText(FIELD_LIMITS.sessionTime, 'Indica un orario ipotetico (es. 18:30–20:00).'),
  })
  .superRefine((data, ctx) => {
    if (data.maxParticipants < data.minParticipants) {
      ctx.addIssue({
        code: 'custom',
        path: ['maxParticipants'],
        message: 'Il numero massimo deve essere uguale o superiore al minimo.',
      })
    }
  })

export type ClassProposalFormValues = z.infer<typeof classProposalSchema>

export const rejectApplicationSchema = z.object({
  note: z.string().trim().max(600).optional().or(z.literal('')),
})

export const competenceAreaOptions = COMPETENCE_AREAS
