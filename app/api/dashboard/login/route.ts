import { NextResponse, type NextRequest } from 'next/server'
import { getClientIdentifier, jsonError } from '@/lib/professionals/http'
import { verifyPassword } from '@/lib/professionals/password'
import { loginSchema } from '@/lib/professionals/schema'
import {
  createOrUpdateProfessionalAuthUser,
  findAccountByEmail,
  isAccountApproved,
  linkAccountToAuthUser,
} from '@/lib/professionals/store'
import { rateLimit } from '@/lib/rate-limit'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { allowed } = await rateLimit(getClientIdentifier(request), 'pro-login')
  if (!allowed) return jsonError(429, 'rate_limited')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'invalid_request')
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return jsonError(422, 'validation_error')

  const account = await findAccountByEmail(parsed.data.email)
  if (!account || !verifyPassword(parsed.data.password, account.passwordHash)) {
    return jsonError(401, 'invalid_credentials')
  }

  const approved = await isAccountApproved(account.id)
  if (!approved) return jsonError(403, 'not_approved')

  try {
    if (!account.authUserId && !verifyPassword(parsed.data.password, account.passwordHash)) {
      return jsonError(401, 'invalid_credentials')
    }

    const supabase = await createSupabaseServerClient()
    let { data, error } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: parsed.data.password,
    })

    if (error && !account.authUserId) {
      const authUser = await createOrUpdateProfessionalAuthUser(
        account.email,
        parsed.data.password,
        account.id,
      )
      await linkAccountToAuthUser(account.id, authUser.id)
      const result = await supabase.auth.signInWithPassword({
        email: account.email,
        password: parsed.data.password,
      })
      data = result.data
      error = result.error
    }

    if (error || !data.user) return jsonError(401, 'invalid_credentials')
    if (account.authUserId && account.authUserId !== data.user.id) {
      return jsonError(403, 'account_auth_mismatch')
    }
    if (!account.authUserId) await linkAccountToAuthUser(account.id, data.user.id)

    return NextResponse.json({ ok: true, name: `${account.firstName} ${account.lastName}` })
  } catch (error) {
    console.error('Errore login professionista Supabase Auth:', error)
    return jsonError(503, 'auth_service_unavailable')
  }
}
