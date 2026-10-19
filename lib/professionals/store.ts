import 'server-only'
import { requireSupabaseAdmin, supabase, supabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/professionals/password'
import type {
  ClassProposal,
  PsychologistAccount,
  PsychologistApplication,
  PublicClass,
  PublicProfessional,
  StoredFile,
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
    authUserId: row.auth_user_id || undefined,
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

function mapClassProposal(row: any): ClassProposal {
  return {
    id: row.id,
    psychologistId: row.psychologist_id,
    createdAt: row.created_at,
    status: (row.status || 'pending') as ClassProposal['status'],
    reviewedAt: row.reviewed_at || undefined,
    reviewNote: row.review_note || undefined,
    title: row.title,
    description: row.description,
    thematicArea: row.thematic_area,
    targetAudience: row.target_audience || undefined,
    minParticipants: row.min_participants,
    maxParticipants: row.max_participants,
    pricePerParticipant: row.price_per_participant != null ? Number(row.price_per_participant) : undefined,
    totalHours: row.total_hours || undefined,
    duration: row.duration || undefined,
    weeklyFrequency: row.weekly_frequency || undefined,
    sessionDays: row.session_days || [],
    sessionTime: row.session_time || undefined,
    scheduleDetails: row.schedule_details || undefined,
    locationType: row.location_type || undefined,
    materials: row.materials_json || [],
  }
}

// ==========================================
// ACCOUNTS & APPLICATIONS
// ==========================================

export async function findAccountByEmail(email: string) {
  const client = supabaseAdmin ?? supabase
  const { data } = await client
    .from('accounts')
    .select('*')
    .ilike('email', email)
    .single()

  return data ? mapAccount(data) : null
}

export async function findAccountByAuthUserId(authUserId: string) {
  const client = supabaseAdmin ?? supabase
  const { data } = await client
    .from('accounts')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  return data ? mapAccount(data) : null
}

export async function isAccountApproved(accountId: string) {
  const client = supabaseAdmin ?? supabase
  const { data, error } = await client
    .from('applications')
    .select('id')
    .eq('account_id', accountId)
    .eq('status', 'approved')
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

export async function createOrUpdateProfessionalAuthUser(
  email: string,
  password: string,
  accountId: string,
): Promise<{ id: string; created: boolean }> {
  const admin = requireSupabaseAdmin()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { professional_account_id: accountId },
  })
  if (!error && data.user) return { id: data.user.id, created: true }

  if (!error || (error.code !== 'email_exists' && !error.message.toLowerCase().includes('already'))) {
    throw error ?? new Error('Creazione utente Supabase Auth non riuscita.')
  }

  for (let page = 1; ; page += 1) {
    const { data: users, error: listError } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (listError) throw listError
    const existing = users.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
    if (existing) {
      const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { ...existing.user_metadata, professional_account_id: accountId },
      })
      if (updateError) throw updateError
      if (!updated.user) throw new Error('Aggiornamento utente Supabase Auth non riuscito.')
      return { id: updated.user.id, created: false }
    }
    if (users.users.length < 1000) break
  }

  throw error
}

export async function linkAccountToAuthUser(accountId: string, authUserId: string) {
  const admin = requireSupabaseAdmin()
  const { data, error } = await admin
    .from('accounts')
    .update({ auth_user_id: authUserId })
    .eq('id', accountId)
    .or(`auth_user_id.is.null,auth_user_id.eq.${authUserId}`)
    .select('id')

  if (error) throw error
  if (!data?.length) throw new Error('Account professionista già collegato a un altro utente Auth.')
}

export async function findAccountById(id: string) {
  const client = supabaseAdmin ?? supabase
  const { data } = await client
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  return data ? mapAccount(data) : null
}

export async function listApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Errore Supabase listApplications:', error)
    return []
  }

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
  const authUser = await createOrUpdateProfessionalAuthUser(app.email, tempPassword, accountId)

  const admin = requireSupabaseAdmin()
  const { error: accError } = await admin.from('accounts').insert([
    {
      id: accountId,
      auth_user_id: authUser.id,
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
  if (accError) {
    if (authUser.created) await admin.auth.admin.deleteUser(authUser.id)
    throw accError
  }

  const { error: upError } = await admin
    .from('applications')
    .update({ status: 'approved', reviewed_at: now, account_id: accountId })
    .eq('id', applicationId)

  if (upError) {
    await admin.from('accounts').delete().eq('id', accountId)
    if (authUser.created) await admin.auth.admin.deleteUser(authUser.id)
    throw upError
  }
}

export async function rejectApplication(applicationId: string) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('applications')
    .update({ status: 'rejected', reviewed_at: now })
    .eq('id', applicationId)

  if (error) {
    console.error('❌ Errore Supabase in rejectApplication:', error)
    throw error
  }
}

// ==========================================
// CLASS PROPOSALS / CLASSI
// ==========================================

export async function createClassProposal(psychologistId: string, data: any) {
  const id = `class_${crypto.randomUUID()}`
  const now = new Date().toISOString()

  const { error } = await requireSupabaseAdmin().from('class_proposals').insert([
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
      price_per_participant: data.pricePerParticipant != null ? Number(data.pricePerParticipant) : null,
      schedule_details: data.scheduleDetails || null,
      total_hours: Number(data.totalHours) || 8,
      duration: data.duration || '4 settimane',
      weekly_frequency: data.weeklyFrequency || '1 volta a settimana',
      session_days: data.sessionDays || [],
      session_time: data.sessionTime || '18:30',
      location_type: data.locationType || 'online',
      materials_json: data.materials || [],
    },
  ])

  if (error) {
    console.error('❌ Errore Supabase in createClassProposal:', error)
    throw error
  }

  return id
}

export async function listClassProposalsFor(psychologistId: string): Promise<ClassProposal[]> {
  const client = supabaseAdmin ?? supabase
  const { data } = await client
    .from('class_proposals')
    .select('*')
    .eq('psychologist_id', psychologistId)
    .order('created_at', { ascending: false })

  return (data || []).map(mapClassProposal)
}

export async function listAllClassProposals(): Promise<ClassProposal[]> {
  const client = supabaseAdmin ?? supabase
  const { data } = await client
    .from('class_proposals')
    .select('*')
    .order('created_at', { ascending: false })

  return (data || []).map(mapClassProposal)
}

export async function listApprovedClassProposals(): Promise<ClassProposal[]> {
  const { data, error } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapClassProposal)
}

export async function updateClassProposalStatus(
  id: string,
  status: 'approved' | 'rejected',
  reviewNote?: string,
) {
  const { data, error } = await requireSupabaseAdmin()
    .from('class_proposals')
    .update({ status, review_note: reviewNote || null, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .in('status', ['pending', 'in_revisione_admin'])
    .select('id')

  if (error) throw new Error(error.message)
  if (!data?.length) throw new Error('CLASS_PROPOSAL_ALREADY_REVIEWED')
}

export async function saveClassMaterial(file: File): Promise<StoredFile> {
  if (!supabaseAdmin) throw new Error('SUPABASE_SERVICE_ROLE_KEY_MISSING')
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'material.pdf'
  const storedName = `${crypto.randomUUID()}/${safeName}`
  const { error } = await supabaseAdmin.storage
    .from('class-proposal-materials')
    .upload(storedName, Buffer.from(await file.arrayBuffer()), {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (error) throw error
  return {
    originalName: file.name,
    storedName,
    mimeType: 'application/pdf',
    size: file.size,
  }
}

export async function readClassMaterial(storedName: string) {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin.storage
    .from('class-proposal-materials')
    .download(storedName)
  if (error || !data) return null
  return Buffer.from(await data.arrayBuffer())
}

export async function deleteClassMaterials(materials: StoredFile[]) {
  if (!supabaseAdmin || materials.length === 0) return
  const { error } = await supabaseAdmin.storage
    .from('class-proposal-materials')
    .remove(materials.map((material) => material.storedName))
  if (error) console.error('Errore rimozione materiali proposta:', error)
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
// UPLOADS & STORAGE
// ==========================================

export async function saveUpload(kind: 'cv' | 'materials', file: File) {
  return {
    originalName: file.name,
    storedName: `${Date.now()}_${file.name}`,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
  }
}

export async function readUpload(_kind: 'cv' | 'materials', _storedName: string) {
  return null
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

export async function getClassProposal(id: string): Promise<ClassProposal | null> {
  const { data, error } = await supabase
    .from('class_proposals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapClassProposal(data)
}