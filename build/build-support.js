#!/usr/bin/env node
/**
 * build-support.js
 * Génère la page de support dans les 16 langues, à partir des dictionnaires
 * build/i18n/<locale>.js.
 *
 * Avant, /support n'existait qu'en français et vercel.json redirigeait
 * /de/support vers /support : un visiteur allemand tombait sur un formulaire
 * français. Chaque langue a désormais sa page, avec canonical et hreflang
 * propres, comme la page d'accueil.
 *
 * Le formulaire poste sur /api/support. Les catégories sont envoyées sous
 * forme de clé stable (bug, feature, ...) et non de libellé traduit, sinon les
 * e-mails reçus seraient étiquetés dans la langue du visiteur.
 *
 * Usage : node build/build-support.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const I18N_DIR = path.join(__dirname, 'i18n');
const ORIGIN = process.env.SITE_ORIGIN || 'https://www.streampulse.fr';

const { LOCALES, SOURCE_LANG } = require('./build-i18n');

/** Adresse affichée en secours si le formulaire échoue. */
const CONTACT_EMAIL = 'contact@alexisamz.fr';

/**
 * Catégories du formulaire : la clé part vers l'API, le libellé vient du
 * dictionnaire. À maintenir en accord avec CATEGORIES de api/support.js.
 */
const SUPPORT_CATEGORIES = [
  { key: 'bug', i18n: 'support.cat.bug' },
  { key: 'feature', i18n: 'support.cat.feature' },
  { key: 'question', i18n: 'support.cat.question' },
  { key: 'privacy', i18n: 'support.cat.privacy' },
  { key: 'other', i18n: 'support.cat.other' },
];

/** Nombre de questions de la FAQ support, clés support.faq.q1..a7. */
const FAQ_COUNT = 7;

/** Clés d'erreur renvoyées par l'API, mappées vers les libellés traduits. */
const ERROR_KEYS = [
  'message_required',
  'invalid_email',
  'too_long',
  'send_failed',
  'unavailable',
  'generic',
];

function loadDictionaries() {
  const dicts = {};
  for (const lang of Object.keys(LOCALES)) {
    const file = path.join(I18N_DIR, `${lang}.js`);
    if (!fs.existsSync(file)) {
      throw new Error(`Dictionnaire manquant : build/i18n/${lang}.js`);
    }
    dicts[lang] = require(file);
  }
  return dicts;
}

/**
 * Récupère une clé et échoue si elle manque.
 * Un fallback silencieux laisserait passer du français dans une page traduite,
 * exactement le bug que le garde-fou de build-i18n.js empêche déjà.
 */
function t(dict, key, lang) {
  const value = dict[key];
  if (value == null || value === '') {
    throw new Error(`build-support: clé manquante "${key}" pour ${lang}`);
  }
  return value;
}

/** Échappe un texte destiné au contenu HTML. */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Échappe une valeur d'attribut HTML. */
function attr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

/** URL de la page support pour une langue. */
function supportUrl(lang) {
  const dir = LOCALES[lang].dir;
  return dir ? `${ORIGIN}/${dir}/support` : `${ORIGIN}/support`;
}

/** URL de la page d'accueil pour une langue. */
function homeUrl(lang) {
  const dir = LOCALES[lang].dir;
  return dir ? `${ORIGIN}/${dir}` : `${ORIGIN}/`;
}

/** Chemin relatif de la home, pour les liens internes. */
function homePath(lang) {
  const dir = LOCALES[lang].dir;
  return dir ? `/${dir}` : '/';
}

function buildHreflang() {
  const links = Object.keys(LOCALES).map(
    (lang) =>
      `    <link rel="alternate" hreflang="${LOCALES[lang].hreflang}" href="${supportUrl(lang)}" />`,
  );
  links.push(
    `    <link rel="alternate" hreflang="x-default" href="${supportUrl(SOURCE_LANG)}" />`,
  );
  return links.join('\n');
}

/** FAQPage : données structurées cohérentes avec le contenu visible. */
function buildJsonLd(lang, dict) {
  const cfg = LOCALES[lang];
  const faq = [];
  for (let i = 1; i <= FAQ_COUNT; i++) {
    faq.push({
      '@type': 'Question',
      name: dict[`support.faq.q${i}`],
      acceptedAnswer: { '@type': 'Answer', text: dict[`support.faq.a${i}`] },
    });
  }

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'StreamPulse',
          item: homeUrl(lang),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t(dict, 'support.h1', lang),
          item: supportUrl(lang),
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: cfg.htmlLang,
      mainEntity: faq,
    },
  ];

  return JSON.stringify(graph, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
}

function buildFaq(dict) {
  const items = [];
  for (let i = 1; i <= FAQ_COUNT; i++) {
    items.push(
      `          <div class="faq-item">
            <h3>${esc(dict[`support.faq.q${i}`])}</h3>
            <p>${esc(dict[`support.faq.a${i}`])}</p>
          </div>`,
    );
  }
  return items.join('\n\n');
}

function buildCategories(dict, lang) {
  return SUPPORT_CATEGORIES.map(
    (c) =>
      `                  <option value="${c.key}">${esc(t(dict, c.i18n, lang))}</option>`,
  ).join('\n');
}

/** Libellés d'erreur exposés au script, indexés par le code renvoyé par l'API. */
function buildErrorMap(dict, lang) {
  const entries = ERROR_KEYS.map(
    (key) => `        ${JSON.stringify(key)}: ${JSON.stringify(t(dict, `support.err.${key}`, lang))}`,
  );
  return `{\n${entries.join(',\n')}\n      }`;
}

function renderPage(lang, dict) {
  const cfg = LOCALES[lang];
  const canonical = supportUrl(lang);
  const home = homePath(lang);

  return `<!DOCTYPE html>
<html lang="${cfg.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(t(dict, 'support.meta.title', lang))}</title>
    <meta name="description" content="${attr(t(dict, 'support.meta.desc', lang))}" />
    <link rel="canonical" href="${canonical}" />
${buildHreflang()}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${attr(t(dict, 'support.meta.title', lang))}" />
    <meta property="og:description" content="${attr(t(dict, 'support.meta.desc', lang))}" />
    <script type="application/ld+json">
${buildJsonLd(lang, dict)}
    </script>
    <link rel="stylesheet" href="/css/styles.css" />

    <style>
      /* Reuses the site's design tokens, no new palette. */
      .support-narrow {
        width: min(720px, 92vw);
        margin: 0 auto;
      }

      .support-form-card {
        background: var(--color-surface, rgba(255, 255, 255, 0.04));
        border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
        border-radius: 18px;
        padding: 1.8rem;
        margin-top: 1.4rem;
      }

      .support-field {
        margin-bottom: 1.25rem;
      }

      .support-field label {
        display: block;
        margin-bottom: 0.45rem;
        font-size: 0.92rem;
        font-weight: 600;
      }

      .support-field .opt {
        font-weight: 400;
        font-size: 0.82rem;
        color: var(--color-muted, rgba(255, 255, 255, 0.55));
      }

      .support-field input,
      .support-field select,
      .support-field textarea {
        width: 100%;
        padding: 0.75rem 0.9rem;
        border-radius: 12px;
        border: 1px solid var(--color-border, rgba(255, 255, 255, 0.12));
        background: rgba(255, 255, 255, 0.03);
        color: inherit;
        font: inherit;
      }

      .support-field textarea {
        min-height: 170px;
        resize: vertical;
      }

      .support-field input:focus,
      .support-field select:focus,
      .support-field textarea:focus {
        outline: 2px solid var(--color-highlight, #8b7bff);
        outline-offset: 1px;
      }

      .support-hint {
        margin: 0.4rem 0 0;
        font-size: 0.84rem;
        color: var(--color-muted, rgba(255, 255, 255, 0.55));
      }

      .support-submit {
        width: 100%;
        cursor: pointer;
        font-family: inherit;
        margin-top: 0.4rem;
      }

      .support-submit[aria-busy='true'] {
        opacity: 0.65;
        cursor: progress;
      }

      .support-note {
        margin: 1rem 0 0;
        text-align: center;
        font-size: 0.85rem;
        color: var(--color-muted, rgba(255, 255, 255, 0.55));
      }

      /* Feedback block: success and error share the markup, only the tint
         changes. aria-live announces the result to screen readers. */
      .support-confirm {
        display: none;
        gap: 0.75rem;
        align-items: flex-start;
        border: 1px solid rgba(139, 123, 255, 0.45);
        background: rgba(139, 123, 255, 0.12);
        border-radius: 14px;
        padding: 1rem 1.1rem;
        margin-bottom: 1.6rem;
        font-size: 0.95rem;
      }

      .support-confirm.show {
        display: flex;
      }

      .support-confirm.error {
        border-color: rgba(255, 107, 107, 0.5);
        background: rgba(255, 107, 107, 0.12);
      }
    </style>
  </head>
  <body class="legal-page">
    <header class="site-header">
      <div class="container header-content">
        <div class="branding">
          <a href="${home}" class="branding-link">
            <img src="/images/logo.png" alt="StreamPulse" class="logo" />
            <span class="brand-name">StreamPulse</span>
          </a>
        </div>
        <nav class="main-nav">
          <a href="${home}">StreamPulse</a>
          <a href="/privacy">${esc(t(dict, 'foot.privacy', lang))}</a>
          <a href="/terms">${esc(t(dict, 'foot.terms', lang))}</a>
        </nav>
      </div>
    </header>

    <main class="legal-main">
      <section class="legal-hero">
        <div class="container">
          <h1>${esc(t(dict, 'support.h1', lang))}</h1>
          <p>${esc(t(dict, 'support.lede', lang))}</p>
        </div>
      </section>

      <section class="faq">
        <div class="container support-narrow">
          <h2>${esc(t(dict, 'support.faq.title', lang))}</h2>

${buildFaq(dict)}
        </div>
      </section>

      <section class="support-section">
        <div class="container support-narrow">
          <h2>${esc(t(dict, 'support.form.title', lang))}</h2>
          <p>${esc(t(dict, 'support.form.sub', lang))}</p>

          <div class="support-form-card">
            <div class="support-confirm" id="confirm" role="status" aria-live="polite">
              <span aria-hidden="true" id="confirmIcon">✓</span>
              <div id="confirmText"></div>
            </div>

            <form id="supportForm" novalidate>
              <div class="support-field">
                <label for="category">${esc(t(dict, 'support.f.category', lang))}</label>
                <select id="category" name="category">
${buildCategories(dict, lang)}
                </select>
              </div>

              <div class="support-field">
                <label for="name">
                  ${esc(t(dict, 'support.f.name', lang))}
                  <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span>
                </label>
                <input type="text" id="name" name="name" placeholder="${attr(t(dict, 'support.f.namePh', lang))}" autocomplete="nickname" />
              </div>

              <div class="support-field">
                <label for="email">
                  ${esc(t(dict, 'support.f.email', lang))}
                  <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span>
                </label>
                <input type="email" id="email" name="email" placeholder="${attr(t(dict, 'support.f.emailPh', lang))}" autocomplete="email" />
              </div>

              <div class="support-field">
                <label for="discord">
                  ${esc(t(dict, 'support.f.discord', lang))}
                  <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span>
                </label>
                <input type="text" id="discord" name="discord" placeholder="${attr(t(dict, 'support.f.discordPh', lang))}" />
                <p class="support-hint">${esc(t(dict, 'support.f.contactHint', lang))}</p>
              </div>

              <div class="support-field">
                <label for="message">
                  ${esc(t(dict, 'support.f.message', lang))}
                  <span class="opt">(${esc(t(dict, 'support.f.required', lang))})</span>
                </label>
                <textarea id="message" name="message" placeholder="${attr(t(dict, 'support.f.messagePh', lang))}" required></textarea>
                <p class="support-hint">${esc(t(dict, 'support.f.messageHint', lang))}</p>
              </div>

              <!-- Honeypot: hidden from users, often filled by automated
                   scripts. The API silently drops those submissions. -->
              <input type="checkbox" name="botcheck" id="botcheck" style="display: none" tabindex="-1" autocomplete="off" />

              <button type="submit" class="btn primary support-submit">${esc(t(dict, 'support.submit', lang))}</button>
              <p class="support-note">
                ${esc(t(dict, 'support.direct', lang))}
                <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-content">
        <p>© <span id="current-year"></span> StreamPulse</p>
        <nav class="footer-links">
          <a href="/privacy">${esc(t(dict, 'foot.privacy', lang))}</a>
          <a href="/terms">${esc(t(dict, 'foot.terms', lang))}</a>
          <a href="${home}">StreamPulse</a>
        </nav>
      </div>
    </footer>

    <script>
      document.getElementById('current-year').textContent = new Date().getFullYear();

      /*
       * Posts to /api/support, which relays through Resend. No key here:
       * the API key lives in Vercel environment variables.
       *
       * Contact details are optional. When none is provided, the confirmation
       * says so, since no reply is possible without a way to reach the sender.
       */
      (function () {
        'use strict';

        var ENDPOINT = '/api/support';
        var LOCALE = ${JSON.stringify(cfg.htmlLang)};
        var ERRORS = ${buildErrorMap(dict, lang)};
        var OK_TITLE = ${JSON.stringify(t(dict, 'support.ok.title', lang))};
        var OK_BODY = ${JSON.stringify(t(dict, 'support.ok.body', lang))};
        var OK_ANON = ${JSON.stringify(t(dict, 'support.ok.anon', lang))};

        var form = document.getElementById('supportForm');
        var box = document.getElementById('confirm');
        var icon = document.getElementById('confirmIcon');
        var text = document.getElementById('confirmText');
        var submit = form.querySelector('.support-submit');
        var label = submit.textContent;

        function show(kind, content) {
          box.classList.toggle('error', kind === 'error');
          icon.textContent = kind === 'error' ? '!' : '✓';
          text.textContent = content;
          box.classList.add('show');
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        form.addEventListener('submit', function (e) {
          e.preventDefault();

          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }
          if (form.botcheck.checked) return;

          var hasContact = Boolean(form.email.value.trim() || form.discord.value.trim());

          submit.setAttribute('aria-busy', 'true');
          submit.disabled = true;
          submit.textContent = ${JSON.stringify(t(dict, 'support.sending', lang))};

          fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: form.category.value,
              name: form.name.value.trim(),
              email: form.email.value.trim(),
              discord: form.discord.value.trim(),
              message: form.message.value.trim(),
              browser: navigator.userAgent,
              page: window.location.href,
              locale: LOCALE,
              botcheck: false
            })
          })
            .then(function (res) {
              return res
                .json()
                .catch(function () {
                  return {};
                })
                .then(function (data) {
                  return { ok: res.ok, data: data };
                });
            })
            .then(function (result) {
              if (!result.ok || result.data.success !== true) {
                show('error', ERRORS[result.data.error] || ERRORS.generic);
                return;
              }
              show('ok', OK_TITLE + ' ' + (hasContact ? OK_BODY : OK_ANON));
              form.reset();
            })
            .catch(function () {
              show('error', ERRORS.send_failed);
            })
            .then(function () {
              submit.removeAttribute('aria-busy');
              submit.disabled = false;
              submit.textContent = label;
            });
        });
      })();
    </script>
  </body>
</html>
`;
}

function build() {
  const dicts = loadDictionaries();
  const written = [];

  for (const lang of Object.keys(LOCALES)) {
    const html = renderPage(lang, dicts[lang]);
    const dir = LOCALES[lang].dir;
    const outPath = dir
      ? path.join(ROOT, dir, 'support.html')
      : path.join(ROOT, 'support.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
    written.push(dir ? `/${dir}/support` : '/support');
  }

  console.log(`${written.length} pages de support générées :`);
  written.forEach((w) => console.log(`  - ${w}`));
}

module.exports = { SUPPORT_CATEGORIES, supportUrl };

if (require.main === module) build();
