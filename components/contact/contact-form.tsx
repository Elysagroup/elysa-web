'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react'
import { thematicAreas } from '@/lib/areas'
import {
  FIELD_LIMITS,
  REQUEST_TYPES,
  contactSchema,
  requestTypeLabels,
  type ContactFormValues,
  type RequestType,
} from '@/lib/contact-schema'
import { CONTACT_EMAIL } from '@/lib/site'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const ERROR_MESSAGE =
  'Non è stato possibile inviare la richiesta. Riprova tra qualche momento oppure scrivi a info@elysagroup.com.'
const SUCCESS_MESSAGE =
  'Grazie per aver contattato Elysa. Abbiamo ricevuto la tua richiesta. Il team Elysa ti risponderà all’indirizzo email che hai indicato.'
const REQUEST_TIMEOUT_MS = 15_000

const inputClass =
  'block w-full rounded-xl border border-input bg-white px-4 py-3 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/80 focus-visible:border-ocean focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ocean/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15'

function FieldMessage({ id, error }: { id: string; error?: FieldError }) {
  if (!error?.message) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {error.message}
    </p>
  )
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ocean">
      {children}
      {required ? (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-1.5 font-normal text-muted-foreground">(facoltativo)</span>
      )}
    </label>
  )
}

export function ContactForm({
  initialType,
  initialArea,
}: {
  initialType?: RequestType
  initialArea?: string
}) {
  const formId = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const submissionIdRef = useRef<string | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      tipo: initialType,
      nome: '',
      email: '',
      telefono: '',
      area: initialType === 'partecipante' ? (initialArea ?? '') : '',
      professione: '',
      ambito:
        initialType === 'professionista' && initialArea
          ? (thematicAreas.find((a) => a.slug === initialArea)?.title ?? '')
          : '',
      sitoWeb: '',
      nomeStruttura: '',
      ruoloReferente: '',
      messaggio: '',
      privacy: false,
      marketing: false,
    },
  })

  const tipo = watch('tipo')
  const messageLength = watch('messaggio')?.length ?? 0
  const ids = (name: string) => ({ input: `${formId}-${name}`, error: `${formId}-${name}-error` })

  const describe = (name: keyof ContactFormValues, extra?: string) =>
    [errors[name] ? ids(name).error : null, extra].filter(Boolean).join(' ') || undefined

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus())

  async function onSubmit(values: ContactFormValues) {
    if (status === 'submitting') return
    setStatus('submitting')
    submissionIdRef.current ??= crypto.randomUUID()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submissionIdRef.current,
          startedAt,
          fax: honeypotRef.current?.value ?? '',
          data: values,
        }),
        signal: controller.signal,
      })
      const result: { ok?: boolean; fieldErrors?: Record<string, string> } = await response
        .json()
        .catch(() => ({}))

      if (response.ok && result.ok) {
        setStatus('success')
        submissionIdRef.current = null
        reset()
        setStartedAt(Date.now())
        focusStatus()
        return
      }

      if (response.status === 422 && result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactFormValues, { type: 'server', message })
        }
      }
      setStatus('error')
      focusStatus()
    } catch {
      setStatus('error')
      focusStatus()
    } finally {
      clearTimeout(timeout)
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <div>
      <div
        ref={statusRef}
        tabIndex={-1}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live={status === 'error' ? 'assertive' : 'polite'}
        className="outline-none"
      >
        {status === 'success' && (
          <div className="mb-8 flex gap-3 rounded-2xl border border-sage-deep/40 bg-sage-soft p-5 text-ocean">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sage-deep" aria-hidden="true" />
            <p className="leading-relaxed">{SUCCESS_MESSAGE}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-8 flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-slate-ink">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="leading-relaxed">
              Non è stato possibile inviare la richiesta. Riprova tra qualche momento oppure scrivi a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ocean underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
              <span className="sr-only">{ERROR_MESSAGE}</span>
            </p>
          </div>
        )}
        {isSubmitting && <p className="sr-only">Invio della richiesta in corso…</p>}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, () => setStatus((s) => (s === 'success' ? 'idle' : s)))}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-7"
      >
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ocean">
            Tipologia di richiesta
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (obbligatorio)</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {REQUEST_TYPES.map((type) => (
              <label
                key={type}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 text-sm leading-snug transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ocean/25',
                  tipo === type
                    ? 'border-ocean bg-ocean/[0.03] text-ocean'
                    : 'border-input text-slate-ink hover:border-ocean/40',
                )}
              >
                <input
                  type="radio"
                  value={type}
                  aria-invalid={errors.tipo ? true : undefined}
                  aria-describedby={describe('tipo')}
                  {...register('tipo')}
                  className="mt-0.5 size-4 shrink-0 accent-[#1A2B48]"
                />
                <span className="font-medium">{requestTypeLabels[type]}</span>
              </label>
            ))}
          </div>
          <FieldMessage id={ids('tipo').error} error={errors.tipo} />
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor={ids('nome').input} required>
              Nome e cognome
            </FieldLabel>
            <input
              id={ids('nome').input}
              type="text"
              autoComplete="name"
              maxLength={FIELD_LIMITS.nome}
              aria-required="true"
              aria-invalid={errors.nome ? true : undefined}
              aria-describedby={describe('nome')}
              className={inputClass}
              {...register('nome')}
            />
            <FieldMessage id={ids('nome').error} error={errors.nome} />
          </div>
          <div>
            <FieldLabel htmlFor={ids('email').input} required>
              Email
            </FieldLabel>
            <input
              id={ids('email').input}
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={FIELD_LIMITS.email}
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describe('email')}
              className={inputClass}
              {...register('email')}
            />
            <FieldMessage id={ids('email').error} error={errors.email} />
          </div>
          <div>
            <FieldLabel htmlFor={ids('telefono').input}>Telefono</FieldLabel>
            <input
              id={ids('telefono').input}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={FIELD_LIMITS.telefono}
              aria-invalid={errors.telefono ? true : undefined}
              aria-describedby={describe('telefono')}
              className={inputClass}
              {...register('telefono')}
            />
            <FieldMessage id={ids('telefono').error} error={errors.telefono} />
          </div>
        </div>

        {tipo === 'partecipante' && (
          <div className="rounded-2xl border border-border bg-ivory/70 p-5 sm:p-6">
            <FieldLabel htmlFor={ids('area').input}>Area tematica di interesse</FieldLabel>
            <select
              id={ids('area').input}
              aria-invalid={errors.area ? true : undefined}
              aria-describedby={describe('area')}
              className={inputClass}
              {...register('area')}
            >
              <option value="">Non ho ancora un’idea precisa</option>
              {thematicAreas.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.title}
                </option>
              ))}
            </select>
            <FieldMessage id={ids('area').error} error={errors.area} />
          </div>
        )}

        {tipo === 'professionista' && (
          <div className="grid gap-6 rounded-2xl border border-border bg-ivory/70 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <FieldLabel htmlFor={ids('professione').input} required>
                Professione
              </FieldLabel>
              <input
                id={ids('professione').input}
                type="text"
                placeholder="Es. psicologa, psicoterapeuta"
                autoComplete="organization-title"
                maxLength={FIELD_LIMITS.professione}
                aria-required="true"
                aria-invalid={errors.professione ? true : undefined}
                aria-describedby={describe('professione')}
                className={inputClass}
                {...register('professione')}
              />
              <FieldMessage id={ids('professione').error} error={errors.professione} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('ambito').input} required>
                Ambito d’interesse
              </FieldLabel>
              <input
                id={ids('ambito').input}
                type="text"
                placeholder="Es. genitorialità, ansia"
                maxLength={FIELD_LIMITS.ambito}
                aria-required="true"
                aria-invalid={errors.ambito ? true : undefined}
                aria-describedby={describe('ambito')}
                className={inputClass}
                {...register('ambito')}
              />
              <FieldMessage id={ids('ambito').error} error={errors.ambito} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={ids('sitoWeb').input}>Sito web</FieldLabel>
              <input
                id={ids('sitoWeb').input}
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="www.esempio.it"
                maxLength={FIELD_LIMITS.sitoWeb}
                aria-invalid={errors.sitoWeb ? true : undefined}
                aria-describedby={describe('sitoWeb')}
                className={inputClass}
                {...register('sitoWeb')}
              />
              <FieldMessage id={ids('sitoWeb').error} error={errors.sitoWeb} />
            </div>
          </div>
        )}

        {tipo === 'centro' && (
          <div className="grid gap-6 rounded-2xl border border-border bg-ivory/70 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <FieldLabel htmlFor={ids('nomeStruttura').input} required>
                Nome della struttura
              </FieldLabel>
              <input
                id={ids('nomeStruttura').input}
                type="text"
                autoComplete="organization"
                maxLength={FIELD_LIMITS.nomeStruttura}
                aria-required="true"
                aria-invalid={errors.nomeStruttura ? true : undefined}
                aria-describedby={describe('nomeStruttura')}
                className={inputClass}
                {...register('nomeStruttura')}
              />
              <FieldMessage id={ids('nomeStruttura').error} error={errors.nomeStruttura} />
            </div>
            <div>
              <FieldLabel htmlFor={ids('ruoloReferente').input} required>
                Ruolo del referente
              </FieldLabel>
              <input
                id={ids('ruoloReferente').input}
                type="text"
                autoComplete="organization-title"
                maxLength={FIELD_LIMITS.ruoloReferente}
                aria-required="true"
                aria-invalid={errors.ruoloReferente ? true : undefined}
                aria-describedby={describe('ruoloReferente')}
                className={inputClass}
                {...register('ruoloReferente')}
              />
              <FieldMessage id={ids('ruoloReferente').error} error={errors.ruoloReferente} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={`${ids('sitoWeb').input}-centro`}>Sito web</FieldLabel>
              <input
                id={`${ids('sitoWeb').input}-centro`}
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="www.esempio.it"
                maxLength={FIELD_LIMITS.sitoWeb}
                aria-invalid={errors.sitoWeb ? true : undefined}
                aria-describedby={describe('sitoWeb')}
                className={inputClass}
                {...register('sitoWeb')}
              />
              <FieldMessage id={ids('sitoWeb').error} error={errors.sitoWeb} />
            </div>
          </div>
        )}

        <div>
          <FieldLabel htmlFor={ids('messaggio').input}>Messaggio</FieldLabel>
          <p id={`${formId}-health-note`} className="mb-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sage-deep" aria-hidden="true" />
            Ti chiediamo di non inserire diagnosi, anamnesi, farmaci o altre informazioni sanitarie:
            per orientarti bastano poche indicazioni generali.
          </p>
          <textarea
            id={ids('messaggio').input}
            rows={5}
            maxLength={FIELD_LIMITS.messaggio}
            aria-invalid={errors.messaggio ? true : undefined}
            aria-describedby={describe('messaggio', `${formId}-health-note ${formId}-count`)}
            className={cn(inputClass, 'resize-y')}
            {...register('messaggio')}
          />
          <div className="flex justify-between gap-4">
            <FieldMessage id={ids('messaggio').error} error={errors.messaggio} />
            <p id={`${formId}-count`} className="ml-auto mt-2 text-xs text-muted-foreground">
              {messageLength}/{FIELD_LIMITS.messaggio}
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${formId}-fax`}>Lascia vuoto questo campo</label>
          <input ref={honeypotRef} id={`${formId}-fax`} type="text" name="fax" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-ink">
              <input
                type="checkbox"
                aria-required="true"
                aria-invalid={errors.privacy ? true : undefined}
                aria-describedby={describe('privacy')}
                className="mt-1 size-4 shrink-0 accent-[#1A2B48]"
                {...register('privacy')}
              />
              <span>
                Dichiaro di aver preso visione dell’
                <Link href="/privacy-policy" target="_blank" className="font-semibold text-ocean underline underline-offset-4">
                  informativa privacy
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </Link>{' '}
                relativa al trattamento dei dati per rispondere alla mia richiesta.
                <span className="ml-1 text-destructive" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            <FieldMessage id={ids('privacy').error} error={errors.privacy} />
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-ink">
            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[#1A2B48]" {...register('marketing')} />
            <span>
              Facoltativo: acconsento a ricevere comunicazioni informative e promozionali su
              iniziative e percorsi Elysa. Il consenso è separato e revocabile in qualsiasi momento.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive" aria-hidden="true">
              *
            </span>{' '}
            Campi obbligatori
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ocean px-7 text-base font-semibold text-white transition-colors hover:bg-slate-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ocean/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Invio della richiesta in corso…
              </>
            ) : (
              'Invia la richiesta'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
