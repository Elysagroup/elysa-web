import 'server-only'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function clearSupabaseSession() {
  const cookieStore = await cookies()

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Errore signOut Supabase:', error)
  } catch (error) {
    console.error('Errore logout Supabase server-side:', error)
  }

  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
      cookieStore.delete(cookie.name)
    }
  }
}
