'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2, Upload } from 'lucide-react'
import { CLASS_FREQUENCIES, COMPETENCE_AREAS, MAX_MATERIAL_BYTES, MAX_MATERIALS, WEEKDAYS } from '@/lib/professionals/constants'
import { classProposalSchema, FIELD_LIMITS, type ClassProposalFormValues } from '@/lib/professionals/schema'
import { FieldLabel, FieldMessage, FormCard, StatusBanner, fieldInputClass } from '@/components/professionals/form-field'
import { cn } from '@/lib/utils'

export function ClassProposalForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [notificationSent, setNotificationSent] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClassProposalFormValues>({
    resolver: zodResolver(classProposalSchema),
    defaultValues: {
      title: '',
      description: '',
      minParticipants: 6,
      maxParticipants: 12,
      totalHours: 12,
      duration: '',
      sessionTime: '',
      sessionDays: [],
      locationType: 'online',
    },
  })

  const sessionDays = watch('sessionDays') ?? []

  async function onSubmit(values: ClassProposalFormValues) {
    if (status === 'submitting') return
    if (files.some((file) => file.size > MAX_MATERIAL_BYTES || !file.name.toLowerCase().endsWith('.pdf'))) {
      setFileError('Ogni allegato deve essere un PDF di massimo 8MB.')
      return
    }
    setStatus('submitting')
    setErrorMessage('')
    const form = new FormData()
    form.append('payload', JSON.stringify(values))
    for (const file of files) form.append('materials', file)

    try {
      const response = await fetch('/api/dashboard/proponi-classe', { method: 'POST', body: form })
      const json = (await response.json().catch(() => null)) as {
        ok?: boolean
        error?: string
        notificationSent?: boolean
        fieldErrors?: Record<string, string>
      } | null
      if (!response.ok || !json?.ok) {
        const validationMessage = json?.fieldErrors ? Object.values(json.fieldErrors).join(' ') : ''
        const messages: Record<string, string> = {
          unauthorized: 'La sessione è scaduta. Accedi di nuovo all’area riservata.',
          SUPABASE_SERVICE_ROLE_KEY_MISSING: 'Configurazione Supabase incompleta: contatta l’amministratore della piattaforma.',
          supabase_service_key_missing: 'Configurazione Supabase incompleta: contatta l’amministratore della piattaforma.',
          material_storage_unavailable: 'Non è stato possibile caricare i PDF. Riprova senza allegati o contatta l’amministratore.',
          proposal_save_failed: 'Supabase non ha salvato la proposta. Riprova tra poco; il problema è stato registrato.',
        }
        setErrorMessage(validationMessage || messages[json?.error ?? ''] || json?.error || 'Invio non riuscito. Verifica i dati e riprova.')
        setStatus('error')
        return
      }
      setNotificationSent(json.notificationSent === true)
      setStatus('success')
      reset()
      setFiles([])
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-border bg-white p-8">
        <CheckCircle2 className="size-10 text-sage-deep" />
        <h2 className="mt-4 text-2xl font-semibold text-ocean">Proposta salvata</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          La proposta è stata registrata e resta in revisione.{' '}
          {notificationSent
            ? 'Il team Elysa ha ricevuto la notifica e la valuterà prima della pubblicazione.'
            : 'La notifica email non è partita, ma la proposta è visibile nel pannello admin.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/dashboard" className="font-medium text-ocean underline underline-offset-4">
            Torna alla panoramica
          </Link>
          <button type="button" onClick={() => setStatus('idle')} className="font-medium text-ocean underline underline-offset-4">
            Invia un’altra proposta
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {status === 'error' ? (
        <StatusBanner tone="error" title="Invio non riuscito.">
          {errorMessage || 'Verifica i dati e riprova. Se il problema continua, scrivi a info@elysagroup.com.'}
        </StatusBanner>
      ) : null}

      <FormCard title="Il percorso" description="Descrivi il gruppo in modo chiaro: tema, obiettivi e struttura.">
        <div>
          <FieldLabel htmlFor="class-title" required>
            Titolo
          </FieldLabel>
          <input id="class-title" className={fieldInputClass} maxLength={FIELD_LIMITS.classTitle} {...register('title')} />
          <FieldMessage id="class-title-error" error={errors.title} />
        </div>
        <div>
          <FieldLabel htmlFor="class-description" required>
            Descrizione dettagliata
          </FieldLabel>
          <textarea id="class-description" rows={7} className={cn(fieldInputClass, 'resize-y')} maxLength={FIELD_LIMITS.classDescription} {...register('description')} />
          <FieldMessage id="class-description-error" error={errors.description} />
        </div>
        <div>
          <FieldLabel htmlFor="class-area" required>
            Area tematica
          </FieldLabel>
          <select id="class-area" className={fieldInputClass} {...register('thematicArea')}>
            <option value="">Seleziona</option>
            {COMPETENCE_AREAS.map((area) => (
              <option key={area.id} value={area.id}>
                {area.label}
              </option>
            ))}
          </select>
          <FieldMessage id="class-area-error" error={errors.thematicArea} />
        </div>
        <div>
          <FieldLabel htmlFor="class-target">Destinatari</FieldLabel>
          <input id="class-target" className={fieldInputClass} placeholder="Es. adulti, genitori, giovani adulti" {...register('targetAudience')} />
          <FieldMessage id="class-target-error" error={errors.targetAudience} />
        </div>
      </FormCard>

      <FormCard title="Struttura del gruppo">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="class-min" required>
              Numero minimo di partecipanti
            </FieldLabel>
            <input id="class-min" type="number" min={3} max={40} className={fieldInputClass} {...register('minParticipants', { valueAsNumber: true })} />
            <FieldMessage id="class-min-error" error={errors.minParticipants} />
          </div>
          <div>
            <FieldLabel htmlFor="class-max" required>
              Numero massimo di partecipanti
            </FieldLabel>
            <input id="class-max" type="number" min={3} max={50} className={fieldInputClass} {...register('maxParticipants', { valueAsNumber: true })} />
            <FieldMessage id="class-max-error" error={errors.maxParticipants} />
          </div>
          <div>
            <FieldLabel htmlFor="class-hours" required>
              Ore totali
            </FieldLabel>
            <input id="class-hours" type="number" min={2} max={200} step="0.5" className={fieldInputClass} {...register('totalHours', { valueAsNumber: true })} />
            <FieldMessage id="class-hours-error" error={errors.totalHours} />
          </div>
          <div>
            <FieldLabel htmlFor="class-price">Prezzo per partecipante (€)</FieldLabel>
            <input id="class-price" type="number" min={0} max={10000} step="0.01" className={fieldInputClass} {...register('pricePerParticipant', { setValueAs: (value) => value === '' ? undefined : Number(value) })} />
            <FieldMessage id="class-price-error" error={errors.pricePerParticipant} />
          </div>
          <div>
            <FieldLabel htmlFor="class-duration" required>
              Durata complessiva
            </FieldLabel>
            <input id="class-duration" className={fieldInputClass} placeholder="Es. 8 settimane" {...register('duration')} />
            <FieldMessage id="class-duration-error" error={errors.duration} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="class-freq" required>
              Frequenza
            </FieldLabel>
            <select id="class-freq" className={fieldInputClass} {...register('weeklyFrequency')}>
              <option value="">Seleziona</option>
              {CLASS_FREQUENCIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <FieldMessage id="class-freq-error" error={errors.weeklyFrequency} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="class-location" required>Modalità</FieldLabel>
            <select id="class-location" className={fieldInputClass} {...register('locationType')}>
              <option value="online">Online</option>
              <option value="in-person">In presenza</option>
              <option value="hybrid">Ibrida</option>
            </select>
            <FieldMessage id="class-location-error" error={errors.locationType} />
          </div>
        </div>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ocean">
            Giorni ipotetici delle sessioni live <span className="text-destructive">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => (
              <label key={day.id} className="flex items-center gap-2 rounded-full border border-border bg-ivory px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-[#1A2B48]"
                  checked={sessionDays.includes(day.id)}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...sessionDays, day.id]
                      : sessionDays.filter((value) => value !== day.id)
                    setValue('sessionDays', next, { shouldValidate: true })
                  }}
                />
                {day.label}
              </label>
            ))}
          </div>
          <FieldMessage id="class-days-error" error={errors.sessionDays as { type: string; message?: string } | undefined} />
        </fieldset>
        <div>
          <FieldLabel htmlFor="class-time" required>
            Orario ipotetico
          </FieldLabel>
          <input id="class-time" className={fieldInputClass} placeholder="Es. 18:30–20:00" {...register('sessionTime')} />
          <FieldMessage id="class-time-error" error={errors.sessionTime} />
        </div>
        <div>
          <FieldLabel htmlFor="class-schedule-details">Date e dettagli del calendario</FieldLabel>
          <textarea id="class-schedule-details" rows={3} className={cn(fieldInputClass, 'resize-y')} placeholder="Indica eventuali date di avvio o vincoli di calendario" {...register('scheduleDetails')} />
          <FieldMessage id="class-schedule-details-error" error={errors.scheduleDetails} />
        </div>
      </FormCard>

      <FormCard title="Materiale didattico" description="Puoi allegare programma o documenti integrativi in PDF.">
        <label htmlFor="class-files" className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-ocean/30 bg-ivory px-4 py-8 text-center">
          <Upload className="size-5 text-ocean" />
          <span className="text-sm font-medium text-ocean">Carica PDF (max {MAX_MATERIALS} file, 8MB ciascuno)</span>
        </label>
        <input
          ref={fileRef}
          id="class-files"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="sr-only"
          onChange={(event) => {
            const next = Array.from(event.target.files ?? []).slice(0, MAX_MATERIALS)
            setFiles(next)
            setFileError(undefined)
          }}
        />
        {files.length ? (
          <ul className="text-sm text-slate-ink">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        ) : null}
        {fileError ? <FieldMessage id="class-files-error" error={{ type: 'validate', message: fileError }} /> : null}
      </FormCard>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 font-semibold text-white disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="size-4 animate-spin" /> : null}
        Invia proposta di classe
      </button>
    </form>
  )
}
