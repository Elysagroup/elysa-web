import { NextResponse, type NextRequest } from 'next/server'
import { jsonError, requireRole } from '@/lib/professionals/http'
import { updateClassProposalStatus } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const { id } = await context.params
  const body = await request.json().catch(() => null)
  const action = body?.action // 'approved' | 'rejected'

  if (!action || !['approved', 'rejected'].includes(action)) {
    return jsonError(400, 'invalid_action')
  }

  try {
    await updateClassProposalStatus(id, action)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Errore aggiornamento stato classe:', error)
    return jsonError(500, 'server_error')
  }
}