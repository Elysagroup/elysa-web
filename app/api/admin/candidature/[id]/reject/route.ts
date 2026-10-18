import { jsonError, requireRole } from '@/lib/professionals/http'
import { applicationRejectedEmail } from '@/lib/professionals/emails'
import { sendMail } from '@/lib/professionals/mailer'
import { rejectApplicationSchema } from '@/lib/professionals/schema'
import { mutateStore } from '@/lib/professionals/store'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const { id } = await context.params
  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  const parsed = rejectApplicationSchema.safeParse(body)
  const note = parsed.success ? parsed.data.note : ''

  const result = await mutateStore((store) => {
    const application = store.applications.find((item) => item.id === id)
    if (!application) return { error: 'not_found' as const }
    application.status = 'rejected'
    application.reviewedAt = new Date().toISOString()
    application.reviewNote = note || undefined
    return { application }
  })

  if ('error' in result) return jsonError(404, 'not_found')

  const mail = applicationRejectedEmail(result.application.firstName, note || undefined)
  await sendMail({
    to: result.application.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    tag: 'candidatura_rifiutata',
    idempotencyKey: `candidatura-reject/${id}`,
  })

  return NextResponse.json({ ok: true })
}
