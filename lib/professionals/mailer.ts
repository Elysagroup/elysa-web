import 'server-only'
import { Resend } from 'resend'
import { CONTACT_EMAIL } from '@/lib/site'

const SEND_TIMEOUT_MS = 12_000

type Attachment = {
  filename: string
  content: Buffer
}

type MailInput = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  attachments?: Attachment[]
  idempotencyKey?: string
  tag?: string
}

export function mailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export async function sendMail(input: MailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    console.warn('[professionals] RESEND_API_KEY or RESEND_FROM_EMAIL missing; email not sent:', input.subject)
    return false
  }

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
          to: Array.isArray(input.to) ? input.to : [input.to],
          replyTo: input.replyTo,
          subject: input.subject,
          html: input.html,
          text: input.text,
          attachments: input.attachments?.map((file) => ({
            filename: file.filename,
            content: file.content,
          })),
          tags: input.tag ? [{ name: 'source', value: input.tag }] : undefined,
        },
        input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
      ),
      timeout,
    ])

    if (sendResult === 'timeout') {
      console.error('[professionals] Resend timed out:', input.subject)
      return false
    }
    if (sendResult.error) {
      console.error('[professionals] Resend rejected:', sendResult.error.name, input.subject)
      return false
    }
    return true
  } catch (error) {
    console.error('[professionals] Unexpected mail error:', (error as Error).name, input.subject)
    return false
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  }
}

export const ADMIN_INBOX = process.env.CONTACT_EMAIL || CONTACT_EMAIL
