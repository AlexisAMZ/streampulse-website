/**
 * Réception du formulaire de support et envoi de l'e-mail via Resend.
 *
 * Fonction serverless Vercel. Elle existe pour une seule raison : la clé API
 * Resend ne doit jamais se trouver dans le HTML. Contrairement à une clé de
 * formulaire publique, elle autorise l'envoi d'e-mails au nom du domaine, donc
 * elle reste côté serveur, dans les variables d'environnement Vercel.
 *
 * Variables d'environnement requises (Vercel > Settings > Environment Variables) :
 *   RESEND_API_KEY   Clé API Resend (secret, jamais dans le repo)
 *   SUPPORT_TO       Optionnel. Adresse de réception. Défaut : contact@alexisamz.fr
 *   SUPPORT_FROM     Optionnel. Expéditeur, sur un domaine vérifié chez Resend.
 *                    Défaut : StreamPulse <support@alexisamz.fr>
 *
 * L'expéditeur doit appartenir à un domaine vérifié chez Resend. Le
 * destinataire, lui, n'a aucune contrainte de domaine : c'est pour cela qu'il
 * n'est pas nécessaire d'ajouter streampulse.fr chez Resend.
 */

const TO = process.env.SUPPORT_TO || 'contact@alexisamz.fr';
const FROM = process.env.SUPPORT_FROM || 'StreamPulse <support@alexisamz.fr>';

// Bornes de longueur : évite qu'un envoi automatisé remplisse la boîte.
const LIMITS = { name: 100, email: 200, subject: 120, message: 5000, browser: 400 };

// Sujets acceptés, recopiés du <select id="subject"> de support.html.
// Toute autre valeur est ramenée à « Autre » plutôt que transmise telle quelle.
// À maintenir en accord avec le formulaire si les options changent.
const SUBJECTS = new Set([
  'Question générale',
  'Signaler un bug',
  'Suggestion / fonctionnalité',
  'Confidentialité & données',
  'Autre',
]);

/** Neutralise le HTML : le contenu utilisateur est inséré dans un e-mail HTML. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Supprime CR/LF d'une valeur reprise dans un en-tête (reply_to, subject).
 * Sans ça, un saut de ligne permettrait d'injecter des en-têtes arbitraires.
 */
function sanitizeHeader(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

function isValidEmail(value) {
  // Volontairement simple : Resend et le rebond réel font le vrai filtrage.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  if (!process.env.RESEND_API_KEY) {
    // Erreur de configuration, pas une erreur utilisateur : on la trace côté
    // serveur sans exposer le détail au visiteur.
    console.error('[support] RESEND_API_KEY absente des variables d’environnement.');
    return res.status(500).json({
      success: false,
      message: 'Le formulaire est momentanément indisponible.',
    });
  }

  // Vercel parse le JSON automatiquement, mais pas si le Content-Type diffère.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Requête invalide.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Requête invalide.' });
  }

  // Champ piège rempli : robot. On répond 200 pour ne pas lui indiquer
  // qu'il a été détecté, mais rien n'est envoyé.
  if (body.botcheck) {
    return res.status(200).json({ success: true });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();
  const browser = String(body.browser ?? '').trim();
  const page = String(body.page ?? '').trim();

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Merci de remplir tous les champs obligatoires.',
    });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Adresse e-mail invalide.' });
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ success: false, message: 'Message trop long.' });
  }

  const safeSubject = SUBJECTS.has(subject) ? subject : 'Autre';

  const rows = [
    ['Nom', name],
    ['E-mail', email],
    ['Type de demande', safeSubject],
    ['Navigateur', browser.slice(0, LIMITS.browser) || 'non communiqué'],
    ['Page', page.slice(0, 300) || 'non communiquée'],
  ]
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#111827">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join('');

  const html =
    `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">` +
    `<table style="border-collapse:collapse;margin-bottom:20px">${rows}</table>` +
    `<div style="white-space:pre-wrap;padding:16px;background:#f9fafb;border-radius:10px;color:#111827">` +
    `${escapeHtml(message)}` +
    `</div></div>`;

  const text =
    `Nom : ${name}\n` +
    `E-mail : ${email}\n` +
    `Type de demande : ${safeSubject}\n` +
    `Navigateur : ${browser || 'non communiqué'}\n` +
    `Page : ${page || 'non communiquée'}\n\n` +
    message;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // reply_to = l'utilisateur : répondre depuis sa boîte suffit.
        reply_to: sanitizeHeader(email),
        subject: sanitizeHeader(`[StreamPulse] ${safeSubject} : ${name}`),
        html,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[support] Resend a refusé l’envoi :', response.status, detail);
      return res.status(502).json({
        success: false,
        message: 'L’envoi a échoué. Réessayez ou écrivez-nous directement.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[support] Erreur réseau vers Resend :', error);
    return res.status(502).json({
      success: false,
      message: 'L’envoi a échoué. Réessayez ou écrivez-nous directement.',
    });
  }
}
