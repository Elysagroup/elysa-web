import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  const response = NextResponse.redirect(new URL('/dashboard/login', request.url), 303)
  return response
}
