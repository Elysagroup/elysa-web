'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function ProfessionalLogoutButton({ className }: { className?: string }) {
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)

    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Errore logout Supabase lato client:', error)
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })
    } catch (error) {
      console.error('Errore pulizia cookie logout:', error)
    }

    window.location.replace('/login')
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={signingOut}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-rose-200 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-wait disabled:opacity-70',
        className,
      )}
    >
      {signingOut ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4" aria-hidden="true" />}
      <span>{signingOut ? 'Uscita…' : 'Esci'}</span>
    </button>
  )
}
