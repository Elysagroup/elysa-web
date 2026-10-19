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

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message
  }
  return 'Errore sconosciuto'
}

function getErrorDetails(err: unknown) {
  if (err instanceof Error) {
    const cause = err as Error & { code?: unknown; details?: unknown; hint?: unknown }
    return {
      name: cause.name,
      message: cause.message,
      ...(cause.code ? { code: cause.code } : {}),
      ...(cause.details ? { details: cause.details } : {}),
      ...(cause.hint ? { hint: cause.hint } : {}),
    }
  }
  if (err && typeof err === 'object') return err
  return { value: err }
}

export async function POST(request: NextRequest) {
  const materials: StoredFile[] = []
  let proposalSaved = false

  try {
    const session = await requireRole('psychologist')
    if (!session?.accountId) return jsonError(401, 'unauthorized')

    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.includes('multipart/form-data')) {
      throw new Error('Tipo di richiesta non valido: invia il modulo completo.')
    }

    const form = await request.formData()
    const rawPayload = form.get('payload')
    if (typeof rawPayload !== 'string') throw new Error('Dati della proposta mancanti.')

    const parsedPayload: unknown = JSON.parse(rawPayload)
    const parsed = classProposalSchema.safeParse(parsedPayload)
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Dati della proposta non validi.')

    const account = await findAccountById(session.accountId)
    if (!account) throw new Error('Profilo professionista non trovato o non autorizzato.')

    const files = form.getAll('materials').filter((item): item is File => item instanceof File && item.size > 0)
    if (files.length > MAX_MATERIALS) {
      throw new Error(`Puoi allegare al massimo ${MAX_MATERIALS} documenti.`)
    }

    for (const file of files) {
      if (!isPdfFile(file, MAX_MATERIAL_BYTES)) {
        throw new Error('Ogni allegato deve essere un PDF di massimo 8MB.')
      }
      materials.push(await saveClassMaterial(file))
    }

    const proposalId = await createClassProposal(account.id, { ...parsed.data, materials })
    proposalSaved = true

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
      if (!notificationSent) throw new Error('Resend non ha accettato la notifica email.')
    } catch (err) {
      console.error('[PROPONI-CLASSE EMAIL ERROR]:', err)
    }

    return NextResponse.json({
      ok: true,
      id: proposalId,
      notificationSent,
      message: 'Proposta salvata e in attesa di revisione.',
    })
  } catch (err) {
    if (!proposalSaved) {
      try {
        await deleteClassMaterials(materials)
      } catch (cleanupError) {
        console.error('[PROPONI-CLASSE CLEANUP ERROR]:', cleanupError)
      }
    }
    console.error('[PROPONI-CLASSE ERROR]:', err)
    return NextResponse.json(
      { error: getErrorMessage(err), details: getErrorDetails(err) },
      { status: 500 },
    )
  }
}