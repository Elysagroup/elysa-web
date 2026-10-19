import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { applicationApprovedEmail } from '@/lib/professionals/emails'
import { sendMail } from '@/lib/professionals/mailer'
import { generateTemporaryPassword } from '@/lib/professionals/password'
import { approveApplication, getApplication } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // 1. Verifichiamo direttamente la presenza di qualsiasi cookie di sessione admin valido
  const adminCookie = 
    request.cookies.get('elysa_admin_session')?.value || 
    request.cookies.get('elysa_admin')?.value ||
    request.cookies.get('admin_session')?.value

  if (!adminCookie) {
    console.error('❌ [POST /approve] Nessun cookie admin trovato tra le intestazioni')
    return jsonError(401, 'Sessione non valida o scaduta. Effettua nuovamente il login.')
  }

  const { id } = await context.params
  console.log('🚀 [POST /approve] Ricevuta richiesta di approvazione per ID:', id)

  try {
    const application = await getApplication(id)
    if (!application) {
      console.error('❌ [POST /approve] Candidatura non trovata per ID:', id)
      return jsonError(404, 'candidatura_non_trovata')
    }

    const tempPassword = generateTemporaryPassword()

    // Scrittura su Supabase
    await approveApplication(id, tempPassword)

    // Invio Email con try/catch isolato per sicurezza
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.elysagroup.com'
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
    } catch (emailErr) {
      console.error('⚠️ [POST /approve] Errore durante l’invio dell’email:', emailErr)
    }

    console.log('🎉 [POST /approve] Approvazione completata!')
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('💥 [POST /approve] Errore runtime:', error)
    return jsonError(500, error?.message || 'server_error')
  }
}