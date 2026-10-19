'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminClassActions({ proposalId, currentStatus }: { proposalId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleStatusChange(action: 'approved' | 'rejected') {
    const note = action === 'rejected' ? window.prompt('Nota facoltativa per lo psicologo:') : ''
    if (action === 'rejected' && note === null) return
    if (!confirm(`Sei sicuro di voler impostare la classe come ${action === 'approved' ? 'APPROVATA' : 'RIFIUTATA'}?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/classi/${proposalId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: note || '' }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const result = await res.json().catch(() => null)
        alert(result?.error === 'already_reviewed'
          ? 'Questa proposta è già stata revisionata. Aggiorna la pagina.'
          : 'Errore durante l\'aggiornamento dello stato.')
      }
    } catch {
      alert('Errore di connessione.')
    } finally {
      setLoading(false)
    }
  }

  // Se la proposta è già approvata, i pulsanti spariscono e mostra un messaggio pulito
  if (currentStatus === 'approved') {
    return (
      <div className="border-t border-border pt-4 text-right text-xs text-emerald-600 font-medium">
        ✓ Proposta approvata e pubblicata
      </div>
    )
  }

  // Se è già rifiutata, spariscono i pulsanti e mostra che è rifiutata
  if (currentStatus === 'rejected') {
    return (
      <div className="border-t border-border pt-4 text-right text-xs text-rose-600 font-medium">
        ✕ Proposta rifiutata
      </div>
    )
  }

  // Se è in attesa (pending / in_revisione_admin), mostra entrambi i pulsanti
  return (
    <div className="flex gap-3 justify-end border-t border-border pt-4">
      <button
        onClick={() => handleStatusChange('approved')}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition disabled:opacity-50 shadow-sm"
      >
        Approva e Pubblica
      </button>
      <button
        onClick={() => handleStatusChange('rejected')}
        disabled={loading}
        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-sm px-4 py-2 rounded-xl transition disabled:opacity-50"
      >
        Rifiuta Proposta
      </button>
    </div>
  )
}