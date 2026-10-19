import { NextResponse } from 'next/server'
import { clearSupabaseSession } from '@/lib/supabase/logout'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  await clearSupabaseSession()
  return NextResponse.json({ ok: true })
}
