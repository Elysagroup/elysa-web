'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { FieldLabel, FieldMessage, fieldInputClass } from '@/components/professionals/form-field'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function PsychologistLoginForm({ nextPath = '/dashboard' }: { nextPath?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      const response = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        setError('Email o password non corretti, oppure account non ancora approvato.')
        return
      }
      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Accesso non riuscito. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <FieldLabel htmlFor="pro-email" required>
          Email
        </FieldLabel>
        <input id="pro-email" type="email" autoComplete="email" className={fieldInputClass} value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor="pro-password" required>
          Password
        </FieldLabel>
        <input id="pro-password" type="password" autoComplete="current-password" className={fieldInputClass} value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {error ? <FieldMessage id="pro-login-error" error={{ type: 'validate', message: error }} /> : null}
      <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ocean font-semibold text-white disabled:opacity-70">
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Entra nell’area riservata
      </button>
    </form>
  )
}

export function PasswordRecoveryForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/password`,
      })
      if (resetError) throw resetError
      setSent(true)
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Impossibile inviare il link di recupero.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 border-t border-border pt-5">
      <div>
        <FieldLabel htmlFor="recovery-email" required>Email per il recupero</FieldLabel>
        <input
          id="recovery-email"
          type="email"
          autoComplete="email"
          className={fieldInputClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      {error ? <FieldMessage id="recovery-error" error={{ type: 'validate', message: error }} /> : null}
      {sent ? <p role="status" className="text-sm text-sage-deep">Se l’indirizzo è associato a un account, riceverai un link per reimpostare la password.</p> : null}
      <button type="submit" disabled={submitting} className="font-medium text-ocean underline underline-offset-4 disabled:opacity-60">
        {submitting ? 'Invio in corso…' : 'Invia link per reimpostare la password'}
      </button>
    </form>
  )
}

export function PasswordUpdateForm() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string>()
  const [updated, setUpdated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(undefined)
    setUpdated(false)
    if (password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.')
      return
    }
    if (password !== confirmation) {
      setError('Le password non coincidono.')
      return
    }

    setSubmitting(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setPassword('')
      setConfirmation('')
      setUpdated(true)
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Impossibile aggiornare la password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <FieldLabel htmlFor="new-password" required>Nuova password</FieldLabel>
        <input id="new-password" type="password" autoComplete="new-password" minLength={8} className={fieldInputClass} value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor="confirm-password" required>Conferma nuova password</FieldLabel>
        <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} className={fieldInputClass} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
      </div>
      {error ? <FieldMessage id="password-update-error" error={{ type: 'validate', message: error }} /> : null}
      {updated ? <p role="status" className="text-sm font-medium text-sage-deep">Password aggiornata.</p> : null}
      <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ocean font-semibold text-white disabled:opacity-70">
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Aggiorna password
      </button>
    </form>
  )
}

export function AdminLoginForm({ nextPath = '/admin/candidature' }: { nextPath?: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setError('Password non corretta.')
        return
      }
      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Accesso non riuscito. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <FieldLabel htmlFor="admin-password" required>
          Password amministratore
        </FieldLabel>
        <input id="admin-password" type="password" autoComplete="current-password" className={fieldInputClass} value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {error ? <FieldMessage id="admin-login-error" error={{ type: 'validate', message: error }} /> : null}
      <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ocean font-semibold text-white disabled:opacity-70">
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Accedi
      </button>
    </form>
  )
}
