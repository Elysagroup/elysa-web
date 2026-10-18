export const COMPETENCE_AREAS = [
  { id: 'ansia', label: 'Ansia' },
  { id: 'umore', label: 'Umore' },
  { id: 'autostima', label: 'Autostima' },
  { id: 'relazioni', label: 'Relazioni' },
  { id: 'lutto', label: 'Lutto' },
  { id: 'genitorialita', label: 'Genitorialità' },
  { id: 'stress', label: 'Stress' },
  { id: 'giovani', label: 'Giovani' },
  { id: 'altro', label: 'Altro' },
] as const

export type CompetenceAreaId = (typeof COMPETENCE_AREAS)[number]['id']

export const competenceAreaIds = COMPETENCE_AREAS.map((area) => area.id)

export const REGIONAL_ORDERS = [
  'Abruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli-Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  "Valle d'Aosta",
  'Veneto',
] as const

export const ALBO_SECTIONS = ['A', 'B'] as const

export const THERAPEUTIC_APPROACHES = [
  'Cognitivo-comportamentale (CBT)',
  'Psicodinamico',
  'Sistemico-relazionale',
  'Umanistico',
  'EMDR',
  'Integrato',
  'Gestalt',
  'Analitico',
  'Altro',
] as const

export const WEEKDAYS = [
  { id: 'lunedi', label: 'Lunedì' },
  { id: 'martedi', label: 'Martedì' },
  { id: 'mercoledi', label: 'Mercoledì' },
  { id: 'giovedi', label: 'Giovedì' },
  { id: 'venerdi', label: 'Venerdì' },
  { id: 'sabato', label: 'Sabato' },
  { id: 'domenica', label: 'Domenica' },
] as const

export const WEEKDAY_IDS = WEEKDAYS.map((day) => day.id)

export const CLASS_FREQUENCIES = [
  { id: 'settimanale', label: 'Settimanale' },
  { id: 'quindicinale', label: 'Quindicinale' },
  { id: 'mensile', label: 'Mensile' },
] as const

export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'In attesa',
  approved: 'Approvata',
  rejected: 'Rifiutata',
}

export const CLASS_PROPOSAL_STATUSES = ['pending', 'in_revisione_admin', 'approved', 'rejected'] as const
export type ClassProposalStatus = (typeof CLASS_PROPOSAL_STATUSES)[number]

export const classProposalStatusLabels: Record<ClassProposalStatus, string> = {
  pending: 'In attesa',
  in_revisione_admin: 'In attesa',
  approved: 'Approvata',
  rejected: 'Non approvata',
}

export const MAX_CV_BYTES = 5 * 1024 * 1024
export const MAX_MATERIAL_BYTES = 8 * 1024 * 1024
export const MAX_MATERIALS = 5

export function competenceAreaLabel(id: string) {
  return COMPETENCE_AREAS.find((area) => area.id === id)?.label ?? id
}

export function weekdayLabel(id: string) {
  return WEEKDAYS.find((day) => day.id === id)?.label ?? id
}
