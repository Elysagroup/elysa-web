import { NextResponse, type NextRequest } from 'next/server'
import { jsonError, requireRole } from '@/lib/professionals/http'
import { applicationApprovedEmail } from '@/lib/professionals/emails'
import { sendMail } from '@/lib/professionals/mailer'
import { generateTemporaryPassword } from '@/lib/professionals/password'
import { approveApplication, getApplication } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // 1. Verifica autenticazione (supporta sia requireRole che la lettura diretta del cookie admin)
  const session = await requireRole('admin')
  const adminCookie = request.cookies.get('elysa_admin_session')?.value || request.cookies.get('elysa_admin')?.value

  if (!session && !adminCookie) {
    console.error('❌ [POST /approve] Sessione non valida o cookie admin mancante')
    return jsonError(401, 'unauthorized')
  }

  const { id } = await context.params
  console.log('🚀 [POST /approve] Ricevuta richiesta di approvazione per ID:', id)

  try {
    const application = await getApplication(id)
    if (!application) {
      console.error('❌ [POST /approve] Application non trovata per ID:', id)
      return jsonError(404, 'not_found')
    }

    const tempPassword = generateTemporaryPassword()

    // Scrittura su Supabase
    await approveApplication(id, tempPassword)

    // Invio Email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://elysagroup.com'
    const loginUrl = `${baseUrl}/dashboard/login`

    const mail = applicationApprovedEmail({
      firstName: application.firstName,
      email: application.email,
      tempPassword,
      loginUrl,
    })

    await sendMail({
      to: application.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      tag: 'candidatura_approvata',
      idempotencyKey: `approve-${id}-${Date.now()}`,
    })

    console.log('🎉 [POST /approve] Approvazione completata con successo!')
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('💥 [POST /approve] CATCH ERROR:', error)
    return jsonError(500, error.message || 'server_error')
  }
}