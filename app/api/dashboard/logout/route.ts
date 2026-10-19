import { NextResponse, type NextRequest } from 'next/server'
import { clearSupabaseSession } from '@/lib/supabase/logout'

export async function POST(request: NextRequest) {
  await clearSupabaseSession()
  const response = NextResponse.redirect(new URL('/login', request.url), 303)
  return response
}
