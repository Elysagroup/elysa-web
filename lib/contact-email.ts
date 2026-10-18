import 'server-only'
import { getAreaBySlug } from '@/lib/areas'
import { requestTypeLabels, type ContactFormValues } from '@/lib/contact-schema'

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildRows(data: ContactFormValues, receivedAt: string) {
  const rows: Array<[string, string]> = [
    ['Tipologia', requestTypeLabels[data.tipo]],
    ['Nome e cognome', data.nome],
    ['Email', data.email],
    ['Telefono', data.telefono || '—'],
  ]

  if (data.tipo === 'partecipante') {
    rows.push(['Area di interesse', data.area ? (getAreaBySlug(data.area)?.title ?? '—') : '—'])
  }

  if (data.tipo === 'professionista') {
    rows.push(
      ['Professione', data.professione],
      ['Ambito di interesse', data.ambito],
      ['Sito web', data.sitoWeb || '—'],
    )
  }

  if (data.tipo === 'centro') {
    rows.push(
      ['Nome struttura', data.nomeStruttura],
      ['Ruolo del referente', data.ruoloReferente],
      ['Sito web', data.sitoWeb || '—'],
    )
  }

  rows.push(
    ['Presa visione informativa privacy', 'Sì'],
    ['Consenso comunicazioni informative/promozionali', data.marketing ? 'Sì' : 'No'],
    ['Ricevuta il', receivedAt],
  )

  return rows
}

export function buildContactEmail(data: ContactFormValues, receivedAt: Date) {
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Rome',
  }).format(receivedAt)

  const rows = buildRows(data, formattedDate)
  const message = data.messaggio || '—'

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e4de;color:#46505e;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e4de;color:#1a2b48;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:24px;background:#f8f7f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dedcd5;border-radius:12px;border-collapse:separate;">
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0;color:#3e5245;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Modulo di contatto</p>
          <h1 style="margin:8px 0 0;color:#1a2b48;font-size:20px;">Nuova richiesta Elysa</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 12px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">${htmlRows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;">
          <p style="margin:0 0 8px;color:#46505e;font-size:13px;">Messaggio</p>
          <div style="white-space:pre-wrap;color:#1a2b48;font-size:14px;line-height:1.6;background:#f8f7f4;border-radius:8px;padding:12px;">${escapeHtml(message)}</div>
          <p style="margin:16px 0 0;color:#46505e;font-size:12px;">Rispondi a questa email per scrivere direttamente a chi ha inviato la richiesta.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    'Nuova richiesta Elysa',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Messaggio:',
    message,
  ].join('\n')

  return {
    subject: `Nuova richiesta Elysa — ${requestTypeLabels[data.tipo]}`,
    html,
    text,
  }
}
