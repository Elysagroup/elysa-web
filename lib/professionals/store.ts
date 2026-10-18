import 'server-only'
import path from 'node:path'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/professionals/password'
import type {
  ClassProposal,
  PsychologistAccount,
  PsychologistApplication,
  PublicClass,
  PublicProfessional,
} from '@/lib/professionals/types'

export const DEMO_PSYCHOLOGIST_EMAIL = 'chiara.bianchi@elysa.demo'
export const DEMO_PSYCHOLOGIST_PASSWORD = 'DemoElysa2026!'

// ==========================================
// MAPPERS (da snake_case SQL a camelCase TS)
// ==========================================

function mapApplication(row: any): PsychologistApplication {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    reviewedAt: row.reviewed_at,
    accountId: row.account_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    taxCode: row.tax_code,
    vatNumber: row.vat_number,
    city: row.city,
    alboNumber: row.albo_number,
    regionalOrder: row.regional_order,
    alboSection: row.albo_section,
    yearsExperience: row.years_experience,
    therapeuticApproach: row.therapeutic_approach,
    thematicAreas: row.thematic_areas || [],
    availabilityDays: row.availability_days || [],
    availabilityNotes: row.availability_notes,
    bio: row.bio,
    cv: row.cv_json,
  }
}

function mapAccount(row: any): PsychologistAccount {
  return {
    id: row.id,
    applicationId: row.application_id,
    email: row.email,
    passwordHash: row.password_hash,
    firstName: row.first_name,
    lastName: row.last_name,
    city: row.city,
    regionalOrder: row.regional_order,
    alboNumber: row.albo_number,
    alboSection: row.albo_section,
    yearsExperience: row.years_experience,
    therapeuticApproach: row.therapeutic_approach,
    thematicAreas: row.thematic_areas || [],
    bio: row.bio,
    createdAt: row.created_at,
  }
}

function ClassProposal(row: any): ClassProposal {
  return {
    id: row.id,
    psychologistId: row.psychologist_id,
    createdAt: row.created_at,
    status: (row.status || 'pending') as ClassProposal['status'],
    title: row.title,
    description: row.description,
    thematicArea: row.thematic_area,
    minParticipants: row.min_participants,
    maxParticipants: row.max_participants,
    totalHours: row.total_hours || undefined,
    duration: row.duration || undefined,
    weeklyFrequency: row.weekly_frequency || undefined,
    sessionDays: row.session_days || [],
    sessionTime: row.session_time || undefined,
    materials: row.materials_json || [],
    adminNotes: row.admin_notes || undefined,
    pricePerParticipant: row.price_per_participant ? Number(row.price_per_participant) : undefined,
    targetAudience: row.target_audience || undefined,
  }

}

// ==========================================
// ACCOUNTS & APPLICATIONS
// ==========================================

export async function findAccountByEmail(email: string) {
  const { data } = await supabase
    .from('accounts')
    .select('*')
    .ilike('email', email)
    .single()

  return data ? mapAccount(data) : null
}

export async function findAccountById(id: string) {
  const { data } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  return data ? mapAccount(data) : null
}

export async function listApplications() {
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  return (data || []).map(mapApplication)
}

export async function getApplication(id: string) {
  const { data } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  return data ? mapApplication(data) : null
}

export async function createApplication(data: any) {
  const id = `app_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const { error } = await supabase.from('applications').insert([
    {
      id,
      created_at: now,
      status: 'pending',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      tax_code: data.taxCode || null,
      vat_number: data.vatNumber || null,
      city: data.city,
      albo_number: data.alboNumber,
      regional_order: data.regionalOrder,
      albo_section: data.alboSection,
      years_experience: Number(data.yearsExperience) || 0,
      therapeutic_approach: data.therapeuticApproach,
      thematic_areas: data.thematicAreas || [],
      availability_days: data.availabilityDays || [],
      availability_notes: data.availabilityNotes || null,
      bio: data.bio || '',
      cv_json: data.cv || null,
    },
  ])

  if (error) {
    console.error('❌ Errore Supabase in createApplication:', error)
    throw error
  }
}

export async function approveApplication(applicationId: string, tempPassword: string) {
  const app = await getApplication(applicationId)
  if (!app) throw new Error('Candidatura non trovata')

  const accountId = `pro_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const { error: accError } = await supabase.from('accounts').insert([
    {
      id: accountId,
      application_id: applicationId,
      email: app.email,
      password_hash: hashPassword(tempPassword),
      first_name: app.firstName,
      last_name: app.lastName,
      city: app.city,
      regional_order: app.regionalOrder,
      albo_number: app.alboNumber,
      albo_section: app.alboSection,
      years_experience: app.yearsExperience,
      therapeutic_approach: app.therapeuticApproach,
      thematic_areas: app.thematicAreas,
      bio: app.bio,
      created_at: now,
    },
  ])
  if (accError) throw accError

  const { error: upError } = await supabase
    .from('applications')
    .update({ status: 'approved', reviewed_at: now, account_id: accountId })
    .eq('id', applicationId)

  if (upError) throw upError
}

// ==========================================
// CLASS PROPOSALS / CLASSI
// ==========================================

export async function createClassProposal(psychologistId: string, data: any) {
  const id = `class_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const { error } = await supabase.from('class_proposals').insert([
    {
      id,
      psychologist_id: psychologistId,
      created_at: now,
      status: 'pending',
      title: data.title,
      description: data.description,
      thematic_area: data.thematicArea,
      target_audience: data.targetAudience || null,
      min_participants: Number(data.minParticipants) || 3,
      max_participants: Number(data.maxParticipants) || 10,
      price_per_participant: data.pricePerParticipant ? Number(data.pricePerParticipant) : null,
      schedule_details: data.scheduleDetails || null,
      total_hours: Number(data.totalHours) || 8,
      duration: data.duration || '4 settimane',
      weekly_frequency: data.weeklyFrequency || '1 volta a settimana',
      session_days: data.sessionDays || [],
      session_time: data.sessionTime || '18:30',
      location_type: data.locationType || 'online',
    },
  ])

  if (error) {
    console.error('❌ Errore Supabase in createClassProposal:', error)
    throw error
  }

  return id
}

export async function listClassProposalsFor(psychologistId: string): Promise<ClassProposal[]> {
  const { data } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('psychologist_id', psychologistId)
    .order('created_at', { ascending: false })

  return (data || []).map(mapClassProposal)
}

export async function listAllClassProposals(): Promise<ClassProposal[]> {
  const { data } = await supabase
    .from('class_proposals')
    .select('*')
    .order('created_at', { ascending: false })

  return (data || []).map(mapClassProposal)
}

export async function updateClassProposalStatus(id: string, status: 'approved' | 'rejected') {
  const { error } = await supabase
    .from('class_proposals')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('❌ Errore aggiornamento stato classe:', error)
    throw new Error(error.message)
  }
}

// ==========================================
// PROFILI PUBBLICI & CORSI
// ==========================================

export async function listPublicProfessionals(): Promise<PublicProfessional[]> {
  const { data: accounts } = await supabase.from('accounts').select('*')
  if (!accounts) return []

  const { data: classes } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('status', 'approved')

  return accounts.map((acc) => {
    const classCount = (classes || []).filter((c) => c.psychologist_id === acc.id).length
    return {
      id: acc.id,
      firstName: acc.first_name,
      lastName: acc.last_name,
      city: acc.city,
      regionalOrder: acc.regional_order,
      alboNumber: acc.albo_number,
      alboSection: acc.albo_section,
      yearsExperience: acc.years_experience,
      therapeuticApproach: acc.therapeutic_approach,
      thematicAreas: acc.thematic_areas || [],
      bio: acc.bio,
      classCount,
    }
  })
}

export async function toPublicProfessional(
  account: any,
  classProposals: any[],
): Promise<PublicProfessional> {
  return {
    id: account.id,
    firstName: account.first_name,
    lastName: account.last_name,
    city: account.city,
    regionalOrder: account.regional_order,
    alboNumber: account.albo_number,
    alboSection: account.albo_section,
    yearsExperience: account.years_experience,
    therapeuticApproach: account.therapeutic_approach,
    thematicAreas: account.thematic_areas || [],
    bio: account.bio,
    classCount: classProposals.filter(
      (item) => item.psychologist_id === account.id && item.status === 'approved',
    ).length,
  }
}

export async function toPublicClass(proposal: any): Promise<PublicClass> {
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    thematicArea: proposal.thematic_area,
    minParticipants: proposal.min_participants,
    maxParticipants: proposal.max_participants,
    totalHours: proposal.total_hours,
    duration: proposal.duration,
    weeklyFrequency: proposal.weekly_frequency,
    sessionDays: proposal.session_days || [],
    sessionTime: proposal.session_time,
  }
}

export async function getPublicProfessional(id: string) {
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  if (!account) return null

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('account_id', account.id)
    .eq('status', 'approved')

  if (!applications || applications.length === 0) return null

  const { data: classProposals } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('psychologist_id', account.id)
    .eq('status', 'approved')

  const professional = await toPublicProfessional(account, classProposals || [])
  const classes = await Promise.all((classProposals || []).map(toPublicClass))

  return {
    professional,
    classes,
  }
}

// ==========================================
// UPLOADS & LOCAL STORAGE
// ==========================================

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads')

export async function saveUpload(kind: 'cv' | 'materials', file: File) {
  await mkdir(path.join(UPLOADS_DIR, kind), { recursive: true })
  const id = crypto.randomUUID()
  const extension = path.extname(file.name) || '.bin'
  const storedName = `${id}${extension.toLowerCase()}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOADS_DIR, kind, storedName), buffer)
  return {
    originalName: file.name,
    storedName,
    mimeType: file.type || 'application/octet-stream',
    size: buffer.length,
  }
}

export async function readUpload(kind: 'cv' | 'materials', storedName: string) {
  const filePath = path.join(UPLOADS_DIR, kind, storedName)
  if (!storedName || storedName.includes('..') || storedName.includes('/') || storedName.includes('\\')) {
    return null
  }
  try {
    return await readFile(filePath)
  } catch {
    return null
  }
}

// ==========================================
// UTILS COMPATIBILITÀ (STORE HELPERS)
// ==========================================

export async function getStore() {
  const applications = await listApplications()
  const { data: accounts } = await supabase.from('accounts').select('*')
  const { data: classProposals } = await supabase.from('class_proposals').select('*')

  return {
    applications,
    accounts: (accounts || []).map(mapAccount),
    classProposals: (classProposals || []).map(mapClassProposal),
  }
}

export async function mutateStore<T>(mutator: (store: any) => T | Promise<T>) {
  const store = await getStore()
  return await mutator(store)
}

function mapClassProposal(row: any): ClassProposal {
  return {
    id: row.id,
    psychologistId: row.psychologist_id,
    createdAt: row.created_at,
    status: row.status,
    title: row.title,
    description: row.description,
    thematicArea: row.thematic_area,
    minParticipants: row.min_participants,
    maxParticipants: row.max_participants,
    totalHours: row.total_hours,
    duration: row.duration,
    weeklyFrequency: row.weekly_frequency,
    sessionDays: row.session_days || [],
    sessionTime: row.session_time,
    materials: row.materials_json || [],
    adminNotes: row.admin_notes || undefined,
    pricePerParticipant: row.price_per_participant || undefined,
    targetAudience: row.target_audience || undefined,
  }
}

export async function getClassProposal(id: string): Promise<ClassProposal | null> {
  const { data, error } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapClassProposal(data)
}