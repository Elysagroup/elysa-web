'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { FieldLabel, FieldMessage, fieldInputClass } from '@/components/professionals/form-field'

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
