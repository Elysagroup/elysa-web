import { requireRole, jsonError } from '@/lib/professionals/http'
import { getClassProposal, readClassMaterial } from '@/lib/professionals/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; index: string }> },
) {
  const session = await requireRole('admin')
  if (!session) return jsonError(401, 'unauthorized')

  const { id, index: rawIndex } = await context.params
  const index = Number(rawIndex)
  if (!Number.isSafeInteger(index) || index < 0) return jsonError(404, 'not_found')

  const proposal = await getClassProposal(id)
  const material = proposal?.materials[index]
  if (!material) return jsonError(404, 'not_found')

  const content = await readClassMaterial(material.storedName)
  if (!content) return jsonError(404, 'material_not_found')

  return new Response(new Uint8Array(content), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(material.originalName)}`,
      'Cache-Control': 'private, no-store',
    },
  })
}