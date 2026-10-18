import { NextResponse } from 'next/server'
import { jsonError, requireRole } from '@/lib/professionals/http'
import { listApplications } from '@/lib/professionals/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const applications = await listApplications()
  return NextResponse.json({
    ok: true,
    applications: applications.map((item) => ({
      ...item,
      taxCode: item.taxCode,
    })),
  })
}
