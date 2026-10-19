import { NextResponse, type NextRequest } from 'next/server'
import { MAX_CV_BYTES } from '@/lib/professionals/constants'
import { applicationAdminEmail, applicationReceivedEmail } from '@/lib/professionals/emails'
import { getClientIdentifier, isPdfFile, jsonError } from '@/lib/professionals/http'
import { ADMIN_INBOX, sendMail } from '@/lib/professionals/mailer'
import { candidaturaRequestSchema } from '@/lib/professionals/schema'
import { createApplication } from '@/lib/professionals/store'
import { isDuplicateSubmission, markSubmissionSent, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIN_FILL_TIME_MS = 2500

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return jsonError(415, 'unsupported_media_type')
  }

  const { allowed, retryAfterSeconds } = await rateLimit(getClientIdentifier(request), 'candidatura')
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
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

  const envelope = candidaturaRequestSchema.safeParse(parsedPayload)
  if (!envelope.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of envelope.error.issues) {
      const field = issue.path.at(-1)
      if (typeof field === 'string' && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return jsonError(422, 'validation_error', { fieldErrors })
  }

  const { submissionId, startedAt, fax, data } = envelope.data
  if (fax && fax.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }
  if (Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return jsonError(400, 'too_fast')
  }
  if (isDuplicateSubmission(submissionId)) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 })
  }

  const cv = form.get('cv')
  if (!(cv instanceof File) || !isPdfFile(cv, MAX_CV_BYTES)) {
    return jsonError(422, 'validation_error', {
      fieldErrors: { cv: 'Carica un CV in PDF di massimo 5MB.' },
    })
  }

  // Convertiamo il file PDF direttamente in buffer di memoria per l'allegato email
  const cvArrayBuffer = await cv.arrayBuffer()
  const cvBuffer = Buffer.from(cvArrayBuffer)

  const storedCv = {
    originalName: cv.name,
    storedName: `${Date.now()}_${cv.name}`,
    mimeType: cv.type,
    sizeBytes: cv.size,
  }

  const applicationPayload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    taxCode: data.taxCode,
    vatNumber: data.vatNumber,
    city: data.city,
    alboNumber: data.alboNumber,
    regionalOrder: data.regionalOrder,
    alboSection: data.alboSection,
    yearsExperience: data.yearsExperience,
    therapeuticApproach:
      data.therapeuticApproach === 'Altro' && data.therapeuticApproachOther
        ? data.therapeuticApproachOther
        : data.therapeuticApproach,
    thematicAreas: data.thematicAreas,
    availabilityDays: data.availabilityDays,
    availabilityNotes: data.availabilityNotes ?? '',
    bio: data.bio ?? '',
    cv: storedCv,
  }

  // Tenta di creare la candidatura nel DB se configurato
  try {
    await createApplication(applicationPayload)
  } catch (err) {
    console.warn('Salvataggio DB saltato o avviso:', err)
  }

  // Costruiamo l'oggetto candidatura per la composizione delle mail
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const application: any = {
    id: `app_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...applicationPayload,
  }

  const adminMail = applicationAdminEmail(application)
  const confirmMail = applicationReceivedEmail(application)

  await Promise.all([
    sendMail({
      to: ADMIN_INBOX,
      replyTo: application.email,
      subject: adminMail.subject,
      html: adminMail.html,
      text: adminMail.text,
      tag: 'candidatura',
      idempotencyKey: `candidatura-admin/${submissionId}`,
      attachments:
        cvBuffer.length > 0
          ? [{ filename: cv.name, content: cvBuffer }]
          : undefined,
    }),
    sendMail({
      to: application.email,
      subject: confirmMail.subject,
      html: confirmMail.html,
      text: confirmMail.text,
      tag: 'candidatura_conferma',
      idempotencyKey: `candidatura-confirm/${submissionId}`,
    }),
  ])

  markSubmissionSent(submissionId)
  return NextResponse.json({ ok: true }, { status: 200 })
}

function methodNotAllowed() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405, headers: { Allow: 'POST' } })
}

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed