import { jsonError, requireRole } from '@/lib/professionals/http'
import { getApplication, readUpload } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const { id } = await context.params
  const application = await getApplication(id)
  if (!application) return jsonError(404, 'not_found')

  const file = await readUpload('cv', application.cv.storedName)
  if (!file || file.length === 0) return jsonError(404, 'cv_unavailable')

  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${application.cv.originalName.replace(/"/g, '')}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
