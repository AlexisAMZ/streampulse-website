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
 *
 * Le formulaire est servi en 16 langues. Deux conséquences sur ce fichier :
 *   - la catégorie arrive sous forme de clé stable (bug, feature, ...) et non
 *     de libellé traduit, sinon il faudrait connaître ici les 16 traductions
 *     et les e-mails reçus seraient étiquetés dans la langue du visiteur ;
 *   - les messages d'erreur renvoyés sont des codes, traduits côté client.
 */

const TO = process.env.SUPPORT_TO || 'contact@alexisamz.fr';
const FROM = process.env.SUPPORT_FROM || 'StreamPulse <support@alexisamz.fr>';

// Bornes de longueur : évite qu'un envoi automatisé remplisse la boîte.
const LIMITS = {
  name: 100,
  email: 200,
  discord: 100,
  message: 5000,
  browser: 400,
  page: 300,
  locale: 10,
};

/**
 * Catégories acceptées, par clé stable. Le libellé sert uniquement à l'e-mail
 * que tu reçois, il reste donc en français quelle que soit la langue du
 * visiteur. À maintenir en accord avec SUPPORT_CATEGORIES de build/build-support.js.
 */
const CATEGORIES = {
  bug: 'Bug',
  feature: 'Idée de fonctionnalité',
  question: 'Question',
  privacy: 'Confidentialité & données',
  other: 'Autre',
};

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

/** Réponse d'erreur : un code que le client traduit, pas une phrase française. */
function fail(res, status, code) {
  return res.status(status).json({ success: false, error: code });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'method');
  }

  if (!process.env.RESEND_API_KEY) {
    // Erreur de configuration, pas une erreur utilisateur : on la trace côté
    // serveur sans exposer le détail au visiteur.
    console.error('[support] RESEND_API_KEY absente des variables d’environnement.');
    return fail(res, 500, 'unavailable');
  }

  // Vercel parse le JSON automatiquement, mais pas si le Content-Type diffère.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return fail(res, 400, 'invalid');
    }
  }
  if (!body || typeof body !== 'object') {
    return fail(res, 400, 'invalid');
  }

  // Champ piège rempli : robot. On répond 200 pour ne pas lui indiquer
  // qu'il a été détecté, mais rien n'est envoyé.
  if (body.botcheck) {
    return res.status(200).json({ success: true });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const discord = String(body.discord ?? '').trim();
  const category = String(body.category ?? '').trim();
  const message = String(body.message ?? '').trim();
  const browser = String(body.browser ?? '').trim();
  const page = String(body.page ?? '').trim();
  const locale = String(body.locale ?? '').trim();

  // Le message est le seul champ obligatoire : les moyens de contact sont
  // volontairement optionnels, un envoi anonyme est accepté.
  if (!message) {
    return fail(res, 400, 'message_required');
  }
  if (message.length > LIMITS.message) {
    return fail(res, 400, 'too_long');
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    discord.length > LIMITS.discord
  ) {
    return fail(res, 400, 'too_long');
  }
  // Un e-mail vide est accepté, un e-mail mal formé ne l'est pas : sinon
  // l'utilisateur croit pouvoir être recontacté alors que non.
  if (email && !isValidEmail(email)) {
    return fail(res, 400, 'invalid_email');
  }

  const categoryLabel = CATEGORIES[category] || CATEGORIES.other;
  const hasContact = Boolean(email || discord);

  const rows = [
    ['Type', categoryLabel],
    ['Nom / pseudo', name || '—'],
    ['E-mail', email || '—'],
    ['Discord', discord || '—'],
    ['Langue de la page', locale.slice(0, LIMITS.locale) || '—'],
    ['Navigateur', browser.slice(0, LIMITS.browser) || '—'],
    ['Page', page.slice(0, LIMITS.page) || '—'],
  ]
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#111827">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join('');

  // Sans moyen de contact, aucune précision ne pourra être demandée : autant
  // le voir immédiatement en ouvrant l'e-mail.
  const notice = hasContact
    ? ''
    : `<p style="margin:0 0 16px;padding:10px 14px;background:#fef3c7;border-radius:8px;color:#92400e">` +
      `Envoi anonyme : aucune réponse possible.</p>`;

  const html =
    `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">` +
    notice +
    `<table style="border-collapse:collapse;margin-bottom:20px">${rows}</table>` +
    `<div style="white-space:pre-wrap;padding:16px;background:#f9fafb;border-radius:10px;color:#111827">` +
    `${escapeHtml(message)}` +
    `</div></div>`;

  const text =
    (hasContact ? '' : 'Envoi anonyme : aucune réponse possible.\n\n') +
    `Type : ${categoryLabel}\n` +
    `Nom / pseudo : ${name || '—'}\n` +
    `E-mail : ${email || '—'}\n` +
    `Discord : ${discord || '—'}\n` +
    `Langue de la page : ${locale || '—'}\n` +
    `Navigateur : ${browser || '—'}\n` +
    `Page : ${page || '—'}\n\n` +
    message;

  // Identifie l'expéditeur dans l'objet, en retombant sur le Discord puis sur
  // « anonyme » quand aucun nom n'est donné.
  const who = name || discord || 'anonyme';

  const payload = {
    from: FROM,
    to: [TO],
    subject: sanitizeHeader(`[StreamPulse] ${categoryLabel} : ${who}`),
    html,
    text,
  };
  // reply_to seulement si l'e-mail est utilisable : un reply_to vide ou invalide
  // ferait rejeter l'envoi par Resend.
  if (email) {
    payload.reply_to = sanitizeHeader(email);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[support] Resend a refusé l’envoi :', response.status, detail);
      return fail(res, 502, 'send_failed');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[support] Erreur réseau vers Resend :', error);
    return fail(res, 502, 'send_failed');
  }
}
