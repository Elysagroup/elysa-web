import { NextResponse, type NextRequest } from 'next/server'
import { classProposalReviewEmail } from '@/lib/professionals/emails'
import { jsonError, requireRole } from '@/lib/professionals/http'
import { sendMail } from '@/lib/professionals/mailer'
import { reviewClassProposalSchema } from '@/lib/professionals/schema'
import { findAccountById, getClassProposal, updateClassProposalStatus } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const { id } = await context.params
  const body = await request.json().catch(() => null)
  const parsed = reviewClassProposalSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(400, 'invalid_review')
  }

  try {
    const proposal = await getClassProposal(id)
    if (!proposal) return jsonError(404, 'not_found')
    if (proposal.status !== 'pending' && proposal.status !== 'in_revisione_admin') {
      return jsonError(409, 'already_reviewed')
    }

    await updateClassProposalStatus(id, parsed.data.action, parsed.data.note || undefined)

    try {
      const account = await findAccountById(proposal.psychologistId)
      if (account) {
        const mail = classProposalReviewEmail({
          firstName: account.firstName,
          title: proposal.title,
          status: parsed.data.action,
          note: parsed.data.note || undefined,
        })
        const sent = await sendMail({
          to: account.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          tag: `proposta_classe_${parsed.data.action}`,
          idempotencyKey: `class-proposal-${parsed.data.action}-${id}`,
        })
        if (!sent) console.error('Email esito proposta non inviata:', id)
      }
    } catch (emailError) {
      console.error('Errore notifica esito proposta di classe:', emailError)
    }

    return NextResponse.json({
      ok: true,
      message: parsed.data.action === 'approved' ? 'Proposta approvata e pubblicata.' : 'Proposta rifiutata.',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'CLASS_PROPOSAL_ALREADY_REVIEWED') {
      return jsonError(409, 'already_reviewed')
    }
    console.error('Errore aggiornamento stato proposta:', error)
    return jsonError(500, 'server_error')
  }
}