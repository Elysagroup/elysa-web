import { NextResponse, type NextRequest } from 'next/server'
import { MAX_MATERIAL_BYTES, MAX_MATERIALS } from '@/lib/professionals/constants'
import { classProposalAdminEmail } from '@/lib/professionals/emails'
import { isPdfFile, jsonError, requireRole } from '@/lib/professionals/http'
import { ADMIN_INBOX, sendMail } from '@/lib/professionals/mailer'
import { classProposalSchema } from '@/lib/professionals/schema'
import {
  createClassProposal,
  deleteClassMaterials,
  findAccountById,
  readClassMaterial,
  saveClassMaterial,
} from '@/lib/professionals/store'
import type { StoredFile } from '@/lib/professionals/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await requireRole('psychologist')
  if (!session?.accountId) return jsonError(401, 'unauthorized')

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return jsonError(415, 'unsupported_media_type')
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return jsonError(400, 'invalid_request')
  }

  const rawPayload = form.get('payload')
  if (typeof rawPayload !== 'string') return jsonError(400, 'invalid_request')

  let parsedPayload: unknown
  try {
    parsedPayload = JSON.parse(rawPayload)
  } catch {
    return jsonError(400, 'invalid_request')
  }

  const parsed = classProposalSchema.safeParse(parsedPayload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return jsonError(422, 'validation_error', { fieldErrors })
  }

  const account = await findAccountById(session.accountId)
  if (!account) return jsonError(401, 'unauthorized')

  const materials: StoredFile[] = []
  const files = form.getAll('materials').filter((item): item is File => item instanceof File && item.size > 0)
  if (files.length > MAX_MATERIALS) {
    return jsonError(422, 'validation_error', {
      fieldErrors: { materials: `Puoi allegare al massimo ${MAX_MATERIALS} documenti.` },
    })
  }
  for (const file of files) {
    if (!isPdfFile(file, MAX_MATERIAL_BYTES)) {
      return jsonError(422, 'validation_error', {
        fieldErrors: { materials: 'Ogni allegato deve essere un PDF di massimo 8MB.' },
      })
    }
    try {
      materials.push(await saveClassMaterial(file))
    } catch (error) {
      await deleteClassMaterials(materials)
      console.error('Errore salvataggio materiale proposta:', error)
      if (error instanceof Error && error.message === 'SUPABASE_SERVICE_ROLE_KEY_MISSING') {
        return jsonError(503, 'supabase_service_key_missing')
      }
      return jsonError(503, 'material_storage_unavailable')
    }
  }

  let proposalId: string
  try {
    proposalId = await createClassProposal(account.id, { ...parsed.data, materials })
  } catch (error) {
    await deleteClassMaterials(materials)
    console.error('Errore salvataggio proposta di classe:', error)
    if (error instanceof Error && error.message === 'SUPABASE_SERVICE_ROLE_KEY_MISSING') {
      return jsonError(503, 'supabase_service_key_missing')
    }
    const databaseCode = error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : undefined
    return jsonError(500, 'proposal_save_failed', databaseCode ? { databaseCode } : undefined)
  }

  // 2. Prepara e invia l'e-mail di notifica all'amministrazione Elysa
  const proposalForEmail = {
    id: proposalId,
    psychologistId: account.id,
    createdAt: new Date().toISOString(),
    status: 'pending' as const,
    ...parsed.data,
    materials,
  }

  let notificationSent = false
  try {
    const mail = classProposalAdminEmail(
      proposalForEmail,
      `${account.firstName} ${account.lastName}`,
      account.email,
    )
    const attachments = []
    for (const file of materials) {
      const buffer = await readClassMaterial(file.storedName)
      if (buffer) attachments.push({ filename: file.originalName, content: buffer })
    }

    notificationSent = await sendMail({
      to: ADMIN_INBOX,
      replyTo: account.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      tag: 'proposta_classe',
      attachments: attachments.length ? attachments : undefined,
      idempotencyKey: `proposta-classe-${proposalId}`,
    })
    if (!notificationSent) console.error('Notifica email non inviata per la proposta di classe:', proposalId)
  } catch (error) {
    console.error('Errore notifica email proposta di classe:', error)
  }

  return NextResponse.json({
    ok: true,
    id: proposalId,
    notificationSent,
    message: 'Proposta salvata e in attesa di revisione.',
  })
}