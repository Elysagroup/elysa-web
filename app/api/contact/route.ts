import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { buildContactEmail } from '@/lib/contact-email'
import { contactRequestSchema, contactSchema, type ContactFormValues } from '@/lib/contact-schema'
import { isDuplicateSubmission, markSubmissionSent, rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 16 * 1024
const MIN_FILL_TIME_MS = 2500
const SEND_TIMEOUT_MS = 10_000

type ErrorCode =
  | 'invalid_request'
  | 'validation_error'
  | 'rate_limited'
  | 'not_configured'
  | 'send_failed'
  | 'timeout'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'too_fast'

function errorResponse(
  status: number,
  code: ErrorCode,
  extra?: Record<string, unknown>,
  headers?: HeadersInit,
) {
  return NextResponse.json({ ok: false, error: code, ...extra }, { status, headers })
}

function getClientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return (
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/** Keep only the fields relevant to the selected request type. */
function pickRelevantFields(data: ContactFormValues): ContactFormValues {
  return {
    ...data,
    area: data.tipo === 'partecipante' ? data.area : '',
    professione: data.tipo === 'professionista' ? data.professione : '',
    ambito: data.tipo === 'professionista' ? data.ambito : '',
    sitoWeb: data.tipo === 'professionista' || data.tipo === 'centro' ? data.sitoWeb : '',
    nomeStruttura: data.tipo === 'centro' ? data.nomeStruttura : '',
    ruoloReferente: data.tipo === 'centro' ? data.ruoloReferente : '',
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return errorResponse(415, 'unsupported_media_type')
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return errorResponse(413, 'payload_too_large')
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return errorResponse(413, 'payload_too_large')
  }

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(rawBody)
  } catch {
    return errorResponse(400, 'invalid_request')
  }

  const envelope = contactRequestSchema.safeParse(parsedBody)
  if (!envelope.success) {
    return errorResponse(400, 'invalid_request')
  }

  const { submissionId, startedAt, fax, data } = envelope.data

  // Honeypot filled: treat as a bot and drop silently.
  if (fax && fax.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // Implausibly fast submissions are rejected (not silently accepted) so a real person never sees a false success.
  if (Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return errorResponse(400, 'too_fast')
  }

  const { allowed, retryAfterSeconds } = await rateLimit(getClientIdentifier(request))
  if (!allowed) {
    return errorResponse(429, 'rate_limited', undefined, {
      'Retry-After': String(retryAfterSeconds),
    })
  }

  const result = contactSchema.safeParse(data)
  if (!result.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return errorResponse(422, 'validation_error', { fieldErrors })
  }

  if (isDuplicateSubmission(submissionId)) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.CONTACT_EMAIL || 'info@elysagroup.com'

  if (!apiKey || !from) {
    console.error('[contact] Missing RESEND_API_KEY or RESEND_FROM_EMAIL configuration')
    return errorResponse(503, 'not_configured')
  }

  const cleanData = pickRelevantFields(result.data)
  const email = buildContactEmail(cleanData, new Date())
  const resend = new Resend(apiKey)

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<'timeout'>((resolve) => {
    timeoutHandle = setTimeout(() => resolve('timeout'), SEND_TIMEOUT_MS)
  })

  try {
    const sendResult = await Promise.race([
      resend.emails.send(
        {
          from,
          to: [to],
          replyTo: cleanData.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
          tags: [{ name: 'source', value: 'contact_form' }],
        },
        { idempotencyKey: `contact-form/${submissionId}` },
      ),
      timeout,
    ])

    if (sendResult === 'timeout') {
      console.error('[contact] Resend request timed out')
      return errorResponse(504, 'timeout')
    }

    if (sendResult.error) {
      console.error('[contact] Resend rejected the request:', sendResult.error.name)
      return errorResponse(502, 'send_failed')
    }

    markSubmissionSent(submissionId)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('[contact] Unexpected error while sending:', (error as Error).name)
    return errorResponse(502, 'send_failed')
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  }
}

function methodNotAllowed() {
  return NextResponse.json(
    { ok: false, error: 'method_not_allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
