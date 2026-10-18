import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/professionals/http'
import { getClassProposal, findAccountById } from '@/lib/professionals/store' // <-- Usa getClassProposal
import { classEnrollmentEmail } from '@/lib/professionals/emails'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const { proposalId, name, email, phone, notes } = body || {}

    if (!proposalId || !name || !email) {
      return jsonError(400, 'missing_required_fields')
    }

    // Recupera la classe approvata usando la funzione corretta del tuo store
    const proposal = await getClassProposal(proposalId) // <-- Qui
    if (!proposal || proposal.status !== 'approved') {
      return jsonError(404, 'class_not_found')
    }

    // ... resto del codice invariato ...

    // Recupera i dati dello psicologo organizzatore
    const psychologist = await findAccountById(proposal.psychologistId)
    const psychologistEmail = psychologist?.email || 'info@elysagroup.com'
    const psychologistName = psychologist ? `${psychologist.firstName} ${psychologist.lastName}` : 'Psicologo Elysa'

    // Invia l'email con i dettagli
    await classEnrollmentEmail({
      psychologistEmail,
      psychologistName,
      classTitle: proposal.title,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userNotes: notes,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Errore durante l\'iscrizione alla classe:', error)
    return jsonError(500, 'server_error')
  }
}