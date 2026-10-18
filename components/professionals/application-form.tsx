'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, ShieldCheck, Upload } from 'lucide-react'
import {
  ALBO_SECTIONS,
  COMPETENCE_AREAS,
  MAX_CV_BYTES,
  REGIONAL_ORDERS,
  THERAPEUTIC_APPROACHES,
  WEEKDAYS,
} from '@/lib/professionals/constants'
import { candidaturaSchema, FIELD_LIMITS, type CandidaturaFormValues } from '@/lib/professionals/schema'
import { FieldLabel, FieldMessage, FormCard, StatusBanner, fieldInputClass } from '@/components/professionals/form-field'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Dati anagrafici' },
  { id: 2, title: 'Dati professionali' },
  { id: 3, title: 'Aree, disponibilità e CV' },
  { id: 4, title: 'Privacy e invio' },
] as const

const STEP_FIELDS: Array<Array<keyof CandidaturaFormValues>> = [
  ['firstName', 'lastName', 'email', 'phone', 'taxCode', 'vatNumber', 'city'],
  ['alboNumber', 'regionalOrder', 'alboSection', 'yearsExperience', 'therapeuticApproach', 'therapeuticApproachOther'],
  ['thematicAreas', 'availabilityDays', 'availabilityNotes', 'bio'],
  ['privacy'],
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ApplicationForm() {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [cv, setCv] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string>()
  const [startedAt] = useState(() => Date.now())
  const submissionIdRef = useRef(crypto.randomUUID())
  const honeypotRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CandidaturaFormValues>({
    resolver: zodResolver(candidaturaSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      taxCode: '',
      vatNumber: '',
      city: '',
      alboNumber: '',
      yearsExperience: 1,
      thematicAreas: [],
      availabilityDays: [],
      availabilityNotes: '',
      bio: '',
      therapeuticApproachOther: '',
      privacy: false,
    },
  })

  const approach = watch('therapeuticApproach')
  const selectedAreas = watch('thematicAreas') ?? []
  const selectedDays = watch('availabilityDays') ?? []

  const ids = (name: string) => ({ input: `cand-${name}`, error: `cand-${name}-error` })
  const describe = (name: keyof CandidaturaFormValues) => (errors[name] ? ids(name).error : undefined)

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true })
    if (step === 2) {
      if (!validateCv(cv)) return
    }
    if (!valid) return
    setStep((value) => Math.min(value + 1, STEPS.length - 1))
  }

  function validateCv(file: File | null) {
    if (!file) {
      setCvError('Carica il CV in PDF (massimo 5MB).')
      return false
    }
    if (file.size > MAX_CV_BYTES) {
      setCvError('Il CV non può superare i 5MB.')
      return false
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setCvError('Il CV deve essere in formato PDF.')
      return false
    }
    setCvError(undefined)
    return true
  }

  async function onSubmit(values: CandidaturaFormValues) {
    if (!validateCv(cv) || !cv || status === 'submitting') return
    setStatus('submitting')

    const form = new FormData()
    form.append(
      'payload',
      JSON.stringify({
        submissionId: submissionIdRef.current,
        startedAt,
        fax: honeypotRef.current?.value ?? '',
        data: values,
      }),
    )
    form.append('cv', cv)

    try {
      const response = await fetch('/api/candidatura', { method: 'POST', body: form })
      const json = (await response.json()) as { ok?: boolean; fieldErrors?: Record<string, string> }
      if (!response.ok || !json.ok) {
        if (json.fieldErrors?.cv) setCvError(json.fieldErrors.cv)
        setStatus('error')
        statusRef.current?.focus()
        return
      }
      setStatus('success')
      statusRef.current?.focus()
    } catch {
      setStatus('error')
      statusRef.current?.focus()
    }
  }

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step])

  if (status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} className="rounded-3xl border border-border bg-white p-8 shadow-sm sm:p-10">
        <CheckCircle2 className="size-10 text-sage-deep" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-ocean">Candidatura inviata</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Abbiamo ricevuto la tua candidatura per Elysa. Il nostro team clinico la valuterà entro 48 ore. Ti
          scriveremo all’indirizzo email indicato.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
        <p className="text-sm font-medium text-ocean">
          Passo {step + 1} di {STEPS.length}: {STEPS[step].title}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory">
          <div className="h-full rounded-full bg-ocean transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div ref={statusRef} tabIndex={-1}>
        {status === 'error' ? (
          <StatusBanner tone="error" title="Non è stato possibile inviare la candidatura.">
            Riprova tra qualche momento oppure scrivi a info@elysagroup.com.
          </StatusBanner>
        ) : null}
      </div>

      {step === 0 ? (
        <FormCard title="Dati anagrafici" description="Servono per identificarti e ricontattarti in modo diretto.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={ids('firstName').input} required>
                Nome
              </FieldLabel>
              <input id={ids('firstName').input} className={fieldInputClass} autoComplete="given-name" aria-invalid={!!errors.firstName} aria-describedby={describe('firstName')} {...register('firstName')} />
              <FieldMessage id={ids('firstName').error} error={errors.firstName} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('lastName').input} required>
                Cognome
              </FieldLabel>
              <input id={ids('lastName').input} className={fieldInputClass} autoComplete="family-name" aria-invalid={!!errors.lastName} aria-describedby={describe('lastName')} {...register('lastName')} />
              <FieldMessage id={ids('lastName').error} error={errors.lastName} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('email').input} required>
                Email
              </FieldLabel>
              <input id={ids('email').input} type="email" className={fieldInputClass} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describe('email')} {...register('email')} />
              <FieldMessage id={ids('email').error} error={errors.email} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('phone').input} required>
                Telefono
              </FieldLabel>
              <input id={ids('phone').input} type="tel" className={fieldInputClass} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describe('phone')} {...register('phone')} />
              <FieldMessage id={ids('phone').error} error={errors.phone} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('taxCode').input} required>
                Codice fiscale
              </FieldLabel>
              <input id={ids('taxCode').input} className={fieldInputClass} autoComplete="off" aria-invalid={!!errors.taxCode} aria-describedby={describe('taxCode')} {...register('taxCode')} />
              <FieldMessage id={ids('taxCode').error} error={errors.taxCode} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('vatNumber').input} required>
                Partita IVA
              </FieldLabel>
              <input id={ids('vatNumber').input} className={fieldInputClass} inputMode="numeric" aria-invalid={!!errors.vatNumber} aria-describedby={describe('vatNumber')} {...register('vatNumber')} />
              <FieldMessage id={ids('vatNumber').error} error={errors.vatNumber} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={ids('city').input} required>
                Città
              </FieldLabel>
              <input id={ids('city').input} className={fieldInputClass} autoComplete="address-level2" aria-invalid={!!errors.city} aria-describedby={describe('city')} {...register('city')} />
              <FieldMessage id={ids('city').error} error={errors.city} />
            </div>
          </div>
        </FormCard>
      ) : null}

      {step === 1 ? (
        <FormCard title="Dati professionali" description="Queste informazioni resteranno visibili in vetrina solo dopo l’approvazione.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={ids('alboNumber').input} required>
                Numero iscrizione Albo
              </FieldLabel>
              <input id={ids('alboNumber').input} className={fieldInputClass} aria-invalid={!!errors.alboNumber} aria-describedby={describe('alboNumber')} {...register('alboNumber')} />
              <FieldMessage id={ids('alboNumber').error} error={errors.alboNumber} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('regionalOrder').input} required>
                Ordine regionale
              </FieldLabel>
              <select id={ids('regionalOrder').input} className={fieldInputClass} aria-invalid={!!errors.regionalOrder} aria-describedby={describe('regionalOrder')} {...register('regionalOrder')}>
                <option value="">Seleziona</option>
                {REGIONAL_ORDERS.map((order) => (
                  <option key={order} value={order}>
                    {order}
                  </option>
                ))}
              </select>
              <FieldMessage id={ids('regionalOrder').error} error={errors.regionalOrder as FieldError | undefined} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('alboSection').input} required>
                Sezione Albo
              </FieldLabel>
              <select id={ids('alboSection').input} className={fieldInputClass} aria-invalid={!!errors.alboSection} {...register('alboSection')}>
                <option value="">Seleziona</option>
                {ALBO_SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    Sezione {section}
                  </option>
                ))}
              </select>
              <FieldMessage id={ids('alboSection').error} error={errors.alboSection as FieldError | undefined} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('yearsExperience').input} required>
                Anni di esperienza
              </FieldLabel>
              <input id={ids('yearsExperience').input} type="number" min={0} max={60} className={fieldInputClass} {...register('yearsExperience', { valueAsNumber: true })} />
              <FieldMessage id={ids('yearsExperience').error} error={errors.yearsExperience} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={ids('therapeuticApproach').input} required>
                Approccio terapeutico / specializzazione
              </FieldLabel>
              <select id={ids('therapeuticApproach').input} className={fieldInputClass} {...register('therapeuticApproach')}>
                <option value="">Seleziona</option>
                {THERAPEUTIC_APPROACHES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldMessage id={ids('therapeuticApproach').error} error={errors.therapeuticApproach as FieldError | undefined} />
            </div>
            {approach === 'Altro' ? (
              <div className="sm:col-span-2">
                <FieldLabel htmlFor={ids('therapeuticApproachOther').input} required>
                  Specifica l’approccio
                </FieldLabel>
                <input id={ids('therapeuticApproachOther').input} className={fieldInputClass} {...register('therapeuticApproachOther')} />
                <FieldMessage id={ids('therapeuticApproachOther').error} error={errors.therapeuticApproachOther} />
              </div>
            ) : null}
          </div>
        </FormCard>
      ) : null}

      {step === 2 ? (
        <FormCard title="Competenze, disponibilità e CV">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-ocean">
              Aree tematiche di competenza <span className="text-destructive">*</span>
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {COMPETENCE_AREAS.map((area) => (
                <label key={area.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-slate-ink">
                  <input
                    type="checkbox"
                    className="size-4 accent-[#1A2B48]"
                    checked={selectedAreas.includes(area.id)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedAreas, area.id]
                        : selectedAreas.filter((value) => value !== area.id)
                      setValue('thematicAreas', next, { shouldValidate: true })
                    }}
                  />
                  {area.label}
                </label>
              ))}
            </div>
            <FieldMessage id={ids('thematicAreas').error} error={errors.thematicAreas as FieldError | undefined} />
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-ocean">
              Giorni di disponibilità <span className="text-destructive">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-ivory px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 accent-[#1A2B48]"
                    checked={selectedDays.includes(day.id)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedDays, day.id]
                        : selectedDays.filter((value) => value !== day.id)
                      setValue('availabilityDays', next, { shouldValidate: true })
                    }}
                  />
                  {day.label}
                </label>
              ))}
            </div>
            <FieldMessage id={ids('availabilityDays').error} error={errors.availabilityDays as FieldError | undefined} />
          </fieldset>

          <div>
            <FieldLabel htmlFor={ids('availabilityNotes').input}>Fasce orarie</FieldLabel>
            <input id={ids('availabilityNotes').input} className={fieldInputClass} placeholder="Es. martedì e giovedì, 18:00–20:30" maxLength={FIELD_LIMITS.availabilityNotes} {...register('availabilityNotes')} />
          </div>
          <div>
            <FieldLabel htmlFor={ids('bio').input}>Breve presentazione</FieldLabel>
            <textarea id={ids('bio').input} rows={4} className={cn(fieldInputClass, 'resize-y')} maxLength={FIELD_LIMITS.bio} {...register('bio')} />
          </div>
          <div>
            <FieldLabel htmlFor="cand-cv" required>
              CV in PDF
            </FieldLabel>
            <label
              htmlFor="cand-cv"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ocean/30 bg-ivory px-4 py-8 text-center"
            >
              <Upload className="size-5 text-ocean" aria-hidden="true" />
              <span className="text-sm font-medium text-ocean">{cv ? cv.name : 'Carica il CV (PDF, max 5MB)'}</span>
            </label>
            <input
              id="cand-cv"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setCv(file)
                validateCv(file)
              }}
            />
            {cvError ? <FieldMessage id="cand-cv-error" error={{ type: 'validate', message: cvError }} /> : null}
          </div>
        </FormCard>
      ) : null}

      {step === 3 ? (
        <FormCard title="Privacy">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sage-deep" aria-hidden="true" />
            I dati della candidatura sono usati solo per la valutazione del team Elysa e, se approvata, per
            l’attivazione dell’area riservata e della scheda pubblica.
          </p>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-ink">
            <input type="checkbox" className="mt-1 size-4 accent-[#1A2B48]" {...register('privacy')} />
            <span>
              Dichiaro di aver preso visione dell’
              <Link href="/privacy-policy" target="_blank" className="font-semibold text-ocean underline underline-offset-4">
                informativa privacy
              </Link>
              . <span className="text-destructive">*</span>
            </span>
          </label>
          <FieldMessage id={ids('privacy').error} error={errors.privacy} />
        </FormCard>
      ) : null}

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cand-fax">Lascia vuoto questo campo</label>
        <input ref={honeypotRef} id="cand-fax" type="text" name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ocean/20 bg-white px-6 font-medium text-ocean disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Indietro
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 font-semibold text-white hover:bg-ocean-soft"
          >
            Continua
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 font-semibold text-white hover:bg-ocean-soft disabled:opacity-70"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Invio in corso…
              </>
            ) : (
              'Invia la candidatura'
            )}
          </button>
        )}
      </div>
    </form>
  )
}
