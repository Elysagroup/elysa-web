import 'server-only'
import { escapeHtml } from '@/lib/contact-email'
import { competenceAreaLabel, weekdayLabel } from '@/lib/professionals/constants'
import type { ClassProposal, PsychologistApplication } from '@/lib/professionals/types'
import { siteConfig } from '@/lib/site'
import { sendMail } from './mailer'
function wrapEmail(eyebrow: string, title: string, body: string) {
  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:24px;background:#f8f7f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dedcd5;border-radius:12px;border-collapse:separate;">
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0;color:#3e5245;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:8px 0 0;color:#1a2b48;font-size:20px;">${escapeHtml(title)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 24px;color:#2c3e50;font-size:14px;line-height:1.6;">
          ${body}
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function rowsHtml(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" style="border-collapse:collapse;margin:12px 0 8px;">
    ${rows
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e6e4de;color:#46505e;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e6e4de;color:#1a2b48;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
      )
      .join('')}
  </table>`
}

export function applicationAdminEmail(application: PsychologistApplication) {
  const rows: Array<[string, string]> = [
    ['Nome', application.firstName],
    ['Cognome', application.lastName],
    ['Email', application.email],
    ['Telefono', application.phone],
    ['Codice fiscale', application.taxCode || '-'],
    ['Partita IVA', application.vatNumber || '-'],
    ['Città', application.city],
    ['N. iscrizione Albo', application.alboNumber],
    ['Ordine regionale', application.regionalOrder],
    ['Sezione Albo', application.alboSection],
    ['Anni di esperienza', String(application.yearsExperience)],
    ['Approccio / specializzazione', application.therapeuticApproach],
    ['Aree tematiche', application.thematicAreas.map(competenceAreaLabel).join(', ')],
    ['Disponibilità', application.availabilityDays.map(weekdayLabel).join(', ')],
    ['Note orarie', application.availabilityNotes || '-'],
    ['CV', application.cv?.originalName || '-'],
  ]

  return {
    subject: `Nuova candidatura psicologo — ${application.firstName} ${application.lastName}`,
    html: wrapEmail(
      'Candidature Elysa',
      'Nuova candidatura ricevuta',
      `${rowsHtml(rows)}${
        application.bio
          ? `<p style="margin:16px 0 8px;color:#46505e;font-size:13px;">Breve presentazione</p>
             <div style="white-space:pre-wrap;background:#f8f7f4;border-radius:8px;padding:12px;">${escapeHtml(application.bio)}</div>`
          : ''
      }<p style="margin:16px 0 0;color:#46505e;font-size:12px;">Il CV è in allegato, quando disponibile.</p>`,
    ),
    text: [
      'Nuova candidatura psicologo Elysa',
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      application.bio || '',
    ].join('\n'),
  }
}

export function applicationReceivedEmail(application: PsychologistApplication) {
  return {
    subject: 'Abbiamo ricevuto la tua candidatura per Elysa',
    html: wrapEmail(
      'Elysa',
      'Candidatura ricevuta',
      `<p>Ciao ${escapeHtml(application.firstName)},</p>
       <p>Abbiamo ricevuto la tua candidatura per Elysa. Il nostro team clinico la valuterà entro 48 ore.</p>
       <p>Ti scriveremo a questo indirizzo con l’esito e, se la candidatura verrà confermata, con le indicazioni per accedere all’area riservata.</p>
       <p style="margin-top:20px;color:#46505e;font-size:13px;">Il team Elysa</p>`,
    ),
    text: `Ciao ${application.firstName},\n\nAbbiamo ricevuto la tua candidatura per Elysa. Il nostro team clinico la valuterà entro 48 ore.\n\nIl team Elysa`,
  }
}

export function applicationApprovedEmail(data: {
  firstName: string
  email: string
  tempPassword: string
  loginUrl: string
}) {
  const subject = 'La tua candidatura su Elysa è stata approvata!'

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111111; line-height: 1.6;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Benvenuto/a in Elysa, ${data.firstName}!</h2>
      <p>Siamo felici di comunicarti che la tua candidatura come professionista è stata approvata dal nostro team.</p>
      <p>È stato creato il tuo account per accedere all'area riservata. Di seguito trovi le tue credenziali di accesso temporanee:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="margin: 0;"><strong>Password temporanea:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${data.tempPassword}</code></p>
      </div>

      <p>Puoi accedere subito alla tua area riservata cliccando sul pulsante qui sotto:</p>
      
      <div style="margin: 24px 0;">
        <a href="${data.loginUrl}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Accedi all'Area Riservata
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; margin-top: 32px;">
        Ti consigliamo di modificare la password dopo il primo accesso nell'area impostazioni del tuo profilo.
      </p>
    </div>
  `

  const text = `
Benvenuto/a in Elysa, ${data.firstName}!

La tua candidatura è stata approvata.
Ecco le tue credenziali di accesso:

Email: ${data.email}
Password temporanea: ${data.tempPassword}

Accedi da qui: ${data.loginUrl}
  `.trim()

  return { subject, html, text }
}

export function applicationRejectedEmail(firstName: string, note?: string) {
  return {
    subject: 'Aggiornamento sulla tua candidatura Elysa',
    html: wrapEmail(
      'Elysa',
      'Esito della candidatura',
      `<p>Ciao ${escapeHtml(firstName)},</p>
       <p>Grazie per l’interesse mostrato verso Elysa e per il tempo dedicato alla candidatura. In questa fase non è stato possibile accogliere la proposta.</p>
       ${note ? `<p>${escapeHtml(note)}</p>` : ''}
       <p>La valutazione riguarda l’aderenza al modello della piattaforma in questo momento, non il valore del tuo lavoro. Se in futuro si apriranno nuove possibilità, saremo lieti di riconsiderare un contatto.</p>
       <p style="margin-top:20px;color:#46505e;font-size:13px;">Il team Elysa</p>`,
    ),
    text: `Ciao ${firstName},\n\nGrazie per l’interesse mostrato verso Elysa. In questa fase non è stato possibile accogliere la proposta.\n${note ? `\n${note}\n` : ''}\nIl team Elysa`,
  }
}

export function classProposalAdminEmail(
  proposal: ClassProposal,
  psychologistName: string,
  psychologistEmail: string,
) {
  const rows: Array<[string, string]> = [
    ['Professionista', psychologistName],
    ['Email', psychologistEmail],
    ['Titolo', proposal.title],
    ['Area tematica', competenceAreaLabel(proposal.thematicArea)],
    ['Partecipanti', `${proposal.minParticipants} - ${proposal.maxParticipants}`],
    ['Prezzo a partecipante', proposal.pricePerParticipant ? `€${proposal.pricePerParticipant}` : '-'],
    ['Ore totali', proposal.totalHours ? String(proposal.totalHours) : '-'],
    ['Durata', proposal.duration || '-'],
    ['Frequenza', proposal.weeklyFrequency || '-'],
    ['Giorni', proposal.sessionDays?.length ? proposal.sessionDays.map(weekdayLabel).join(', ') : '-'],
    ['Orario', proposal.sessionTime || '-'],
    ['Materiali', proposal.materials?.length ? proposal.materials.map((file) => file.originalName).join(', ') : '-'],
  ]

  return {
    subject: `Nuova proposta di classe — ${proposal.title}`,
    html: wrapEmail(
      'Percorsi Elysa',
      'Proposta di classe in revisione',
      `<p>È arrivata una nuova proposta di percorso, in attesa di approvazione prima della pubblicazione.</p>
       ${rowsHtml(rows)}
       <p style="margin:16px 0 8px;color:#46505e;font-size:13px;">Descrizione</p>
       <div style="white-space:pre-wrap;background:#f8f7f4;border-radius:8px;padding:12px;">${escapeHtml(proposal.description)}</div>`,
    ),
    text: [
      'Nuova proposta di classe Elysa',
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
      '',
      proposal.description,
    ].join('\n'),
  }
}

export async function classEnrollmentEmail({
  psychologistEmail,
  psychologistName,
  classTitle,
  userName,
  userEmail,
  userPhone,
  userNotes,
}: {
  psychologistEmail: string
  psychologistName: string
  classTitle: string
  userName: string
  userEmail: string
  userPhone?: string
  userNotes?: string
}) {
  const subject = `Nuova richiesta di iscrizione per la classe: "${classTitle}"`
  
  const text = `
È stata ricevuta una nuova richiesta di iscrizione per la classe "${classTitle}".

Dettagli dell'utente:
- Nome: ${userName}
- Email: ${userEmail}
- Telefono: ${userPhone || 'Non specificato'}
- Note / Richieste: ${userNotes || 'Nessuna nota aggiuntiva'}

Lo psicologo di riferimento è ${psychologistName} (${psychologistEmail}).
  `.trim()

  const html = wrapEmail(
    'Elysa',
    'Nuova richiesta di iscrizione',
    `
      <p>È stata ricevuta una nuova richiesta di iscrizione per la classe <strong>"${classTitle}"</strong>.</p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px 0;"><strong>Utente:</strong> ${userName} (${userEmail})</p>
        <p style="margin: 0 0 8px 0;"><strong>Telefono:</strong> ${userPhone || 'Non specificato'}</p>
        <p style="margin: 0;"><strong>Note / Richieste:</strong> ${userNotes || 'Nessuna nota aggiuntiva'}</p>
      </div>
      <p style="color: #64748b; font-size: 13px;">Psicologo di riferimento: ${psychologistName}</p>
    `
  )

  // Inviamo l'email sia a info@elysagroup.com che allo psicologo usando il mailer del progetto
  // (Verifica se nel tuo progetto importi sendMail da './mailer' o usi un metodo simile)
  await sendMail({
    to: ['info@elysagroup.com', psychologistEmail],
    subject,
    html,
    text,
  })
}