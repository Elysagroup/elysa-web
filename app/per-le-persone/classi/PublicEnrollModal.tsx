'use client'

import { useState } from 'react'

export default function PublicEnrollModal({ proposalId, classTitle }: { proposalId: string; classTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, ...form }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        alert('Errore durante l\'invio della richiesta. Riprova più tardi.')
      }
    } catch {
      alert('Errore di connessione.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-ocean hover:bg-ocean/90 text-white font-medium py-3 rounded-2xl transition shadow-sm text-sm"
        >
          Richiedi Iscrizione
        </button>
      ) : (
        <div className="bg-secondary/20 border border-border p-5 rounded-2xl mt-4">
          {success ? (
            <div className="text-center py-4">
              <h3 className="font-semibold text-emerald-700 mb-1">Richiesta inviata con successo!</h3>
              <p className="text-xs text-muted-foreground mb-3">Ti ricontatteremo presto con tutti i dettagli.</p>
              <button
                onClick={() => { setIsOpen(false); setSuccess(false) }}
                className="text-xs text-ocean underline font-medium"
              >
                Chiudi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-ocean">Iscriviti a: {classTitle}</span>
                <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-ocean">✕ Annulla</button>
              </div>

              <input
                type="text"
                required
                placeholder="Nome e Cognome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean"
              />
              <input
                type="email"
                required
                placeholder="La tua email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean"
              />
              <input
                type="tel"
                placeholder="Telefono (opzionale)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean"
              />
              <textarea
                placeholder="Eventuali richieste o note aggiuntive..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ocean hover:bg-ocean/90 text-white font-medium py-2.5 rounded-xl transition text-xs disabled:opacity-50"
              >
                {loading ? 'Invio in corso...' : 'Invia Richiesta'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}