import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { classEnrollmentSchema } from '@/lib/professionals/schema'
import { getClassProposal, findAccountById } from '@/lib/professionals/store'
import { classEnrollmentEmail } from '@/lib/professionals/emails'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = classEnrollmentSchema.safeParse(body)
    if (!parsed.success) return jsonError(422, 'validation_error')
    const { proposalId, name, email, phone, notes } = parsed.data

    const proposal = await getClassProposal(proposalId)
    if (!proposal || proposal.status !== 'approved') {
      return jsonError(404, 'class_not_found')
    }

    // ... resto del codice invariato ...

    // Recupera i dati dello psicologo organizzatore
    const psychologist = await findAccountById(proposal.psychologistId)
    const psychologistEmail = psychologist?.email || 'info@elysagroup.com'
    const psychologistName = psychologist ? `${psychologist.firstName} ${psychologist.lastName}` : 'Psicologo Elysa'

    const sent = await classEnrollmentEmail({
      psychologistEmail,
      psychologistName,
      classTitle: proposal.title,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userNotes: notes,
    })

    if (!sent) return jsonError(503, 'notification_unavailable')
    return NextResponse.json({ ok: true, message: 'Richiesta inviata. Ti ricontatteremo presto.' })
  } catch (error) {
    console.error('❌ Errore durante l\'iscrizione alla classe:', error)
    return jsonError(500, 'server_error')
  }
}