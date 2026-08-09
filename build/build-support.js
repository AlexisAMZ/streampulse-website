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
 * Direction artistique : la page reprend les tokens et les composants de
 * index.html (nav flottante, atmosphère, Space Grotesk, accordéon FAQ) et non
 * ceux de css/styles.css, qui sert les anciennes pages légales. Les deux
 * chartes coexistent dans le dépôt ; celle de la landing fait référence.
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

/** Fiche Chrome Web Store, reprise du bouton d'installation de la landing. */
const STORE_URL =
  'https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh';

/** Drapeaux du sélecteur de langue, alignés sur ceux de index.html. */
const FLAGS = {
  fr: '🇫🇷 FR',
  en: '🇬🇧 EN',
  es: '🇪🇸 ES',
  'pt-BR': '🇧🇷 PT-BR',
  de: '🇩🇪 DE',
  it: '🇮🇹 IT',
  pl: '🇵🇱 PL',
  tr: '🇹🇷 TR',
  ru: '🇷🇺 RU',
  ja: '🇯🇵 JA',
  ko: '🇰🇷 KO',
  id: '🇮🇩 ID',
  nl: '🇳🇱 NL',
  hi: '🇮🇳 HI',
  sv: '🇸🇪 SV',
  cs: '🇨🇿 CS',
};

/**
 * Catégories du formulaire : la clé part vers l'API, le libellé vient du
 * dictionnaire. À maintenir en accord avec CATEGORIES de api/support.mjs.
 */
const SUPPORT_CATEGORIES = [
  { key: 'bug', i18n: 'support.cat.bug' },
  { key: 'feature', i18n: 'support.cat.feature' },
  { key: 'question', i18n: 'support.cat.question' },
  { key: 'privacy', i18n: 'support.cat.privacy' },
  { key: 'other', i18n: 'support.cat.other' },
];

/**
 * Questions conservées sur cette page, par index de clé support.faq.qN.
 *
 * Les questions 2 (« mes données sont-elles collectées ») et 4 (« est-ce
 * gratuit ») dupliquaient faq.q6 et faq.q1 de la page d'accueil : deux
 * FAQPage concurrentes sur le même contenu se cannibalisent. Ne restent ici
 * que les questions de dépannage, absentes de l'accueil.
 */
const FAQ_INDEXES = [1, 3, 5, 6, 7];

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
      `<link rel="alternate" hreflang="${LOCALES[lang].hreflang}" href="${supportUrl(lang)}" />`,
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${supportUrl(SOURCE_LANG)}" />`,
  );
  return links.join('\n');
}

/** FAQPage : données structurées cohérentes avec le contenu visible. */
function buildJsonLd(lang, dict) {
  const cfg = LOCALES[lang];
  const faq = FAQ_INDEXES.map((i) => ({
    '@type': 'Question',
    name: t(dict, `support.faq.q${i}`, lang),
    acceptedAnswer: {
      '@type': 'Answer',
      text: t(dict, `support.faq.a${i}`, lang),
    },
  }));

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

  return JSON.stringify(graph, null, 2);
}

/** Accordéon FAQ, même markup et même interaction que la page d'accueil. */
function buildFaq(dict, lang) {
  return FAQ_INDEXES.map(
    (i) =>
      `      <div class="faq-item reveal">
        <div class="faq-q"><span>${esc(t(dict, `support.faq.q${i}`, lang))}</span> <span class="plus">+</span></div>
        <div class="faq-a">${esc(t(dict, `support.faq.a${i}`, lang))}</div>
      </div>`,
  ).join('\n');
}

function buildCategories(dict, lang) {
  return SUPPORT_CATEGORIES.map(
    (c) =>
      `            <option value="${c.key}">${esc(t(dict, c.i18n, lang))}</option>`,
  ).join('\n');
}

/** Sélecteur de langue : chaque option pointe vers la page support traduite. */
function buildLangSelector(lang) {
  return Object.keys(LOCALES)
    .map((code) => {
      const dir = LOCALES[code].dir;
      const href = dir ? `/${dir}/support` : '/support';
      const selected = code === lang ? ' selected' : '';
      return `          <option value="${href}"${selected}>${FLAGS[code] || code}</option>`;
    })
    .join('\n');
}

/** Libellés d'erreur exposés au script, indexés par le code renvoyé par l'API. */
function buildErrorMap(dict, lang) {
  const entries = ERROR_KEYS.map(
    (key) =>
      `      ${JSON.stringify(key)}: ${JSON.stringify(t(dict, `support.err.${key}`, lang))}`,
  );
  return `{\n${entries.join(',\n')}\n    }`;
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
<meta property="og:image" content="${ORIGIN}/images/extension-screenshot.png" />
<link rel="icon" href="/images/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="application/ld+json">
${buildJsonLd(lang, dict)}
</script>
<style>
  /* Tokens repris de index.html : la page support partage la charte de la
     landing, pas celle de css/styles.css (anciennes pages légales). */
  :root {
    --bg: #07060c;
    --bg-2: #0d0a18;
    --surface: rgba(255,255,255,0.04);
    --surface-2: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.14);
    --text: #f5f3ff;
    --text-muted: rgba(245,243,255,0.62);
    --text-dim: rgba(245,243,255,0.42);
    --violet: #9146FF;
    --violet-2: #B68CFF;
    --magenta: #FF4FB8;
    --cyan: #4FE3FF;
    --green: #44FFB1;
    --red: #FF4D6D;
    --display: 'Space Grotesk', 'Outfit', system-ui, sans-serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }

  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  .atmosphere { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .atmosphere::before, .atmosphere::after {
    content: ''; position: absolute; border-radius: 50%;
    filter: blur(120px); opacity: 0.55;
  }
  .atmosphere::before {
    width: 720px; height: 720px;
    background: radial-gradient(circle, #6E2BFF 0%, transparent 60%);
    top: -200px; left: -180px;
    animation: float1 22s ease-in-out infinite;
  }
  .atmosphere::after {
    width: 640px; height: 640px;
    background: radial-gradient(circle, #FF4FB8 0%, transparent 60%);
    top: 20%; right: -200px;
    animation: float2 26s ease-in-out infinite;
    opacity: 0.35;
  }
  @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(80px,60px)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,80px)} }

  .grid-overlay {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
  }

  .noise {
    position: fixed; inset: 0; z-index: 2; pointer-events: none;
    opacity: 0.04; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .container { width: min(1280px, 92vw); margin: 0 auto; position: relative; z-index: 5; }

  /* Nav flottante, identique à la landing. */
  .nav {
    position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
    width: min(1280px, 94vw);
    z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px 10px 20px;
    background: rgba(13, 10, 24, 0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid var(--border);
    border-radius: 100px;
  }
  .nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 600; font-size: 17px; letter-spacing: -0.02em; color: var(--text); text-decoration: none; }
  .nav-brand img { width: 26px; height: 26px; border-radius: 7px; }
  .nav-links { display: flex; gap: 4px; align-items: center; }
  .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; padding: 8px 14px; border-radius: 100px; transition: all .25s; }
  .nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--surface); }
  .nav-actions { display: flex; gap: 8px; align-items: center; }
  .lang-pill { display: flex; align-items: center; gap: 4px; padding: 8px 12px; border-radius: 100px; background: var(--surface); border: 1px solid var(--border); font-size: 12.5px; font-weight: 500; cursor: pointer; }
  .lang-pill select { background: transparent; border: none; color: var(--text); font: inherit; cursor: pointer; outline: none; }
  .lang-pill select option { background: var(--bg-2); color: var(--text); }
  .btn-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 100px;
    background: linear-gradient(180deg, #A565FF 0%, #7B30E5 100%);
    color: #fff; font-weight: 600; font-size: 13.5px; text-decoration: none;
    border: 1px solid rgba(255,255,255,0.16);
    box-shadow: 0 10px 30px -10px rgba(145,70,255,0.6), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: transform .2s;
  }
  .btn-cta:hover { transform: translateY(-1px); }

  .section { padding: 100px 0; position: relative; z-index: 5; }
  .section-eyebrow { display: inline-block; font-size: 12px; color: var(--violet-2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 18px; }

  h1 {
    font-family: var(--display);
    font-size: clamp(38px, 5.2vw, 62px);
    font-weight: 600; line-height: 1.04; letter-spacing: -0.035em;
    max-width: 14ch;
  }
  h1 .gradient {
    background: linear-gradient(120deg, #B68CFF 0%, #9146FF 35%, #FF4FB8 75%, #FF7AB8 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  h2 {
    font-family: var(--display);
    font-size: clamp(30px, 3.6vw, 44px);
    font-weight: 600; letter-spacing: -0.03em; line-height: 1.1;
  }
  .lede { font-size: 18px; color: var(--text-muted); max-width: 620px; margin-top: 20px; line-height: 1.6; }

  .support-hero { padding: 150px 0 0; }

  /* Carte du formulaire, calée sur les cartes bento de la landing. */
  .form-card {
    margin-top: 44px;
    max-width: 720px;
    background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 32px;
  }

  .field { margin-bottom: 20px; }
  .field label {
    display: block; margin-bottom: 8px;
    font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em;
  }
  .field .opt { font-weight: 400; color: var(--text-dim); font-size: 12.5px; }
  .field input, .field select, .field textarea {
    width: 100%;
    padding: 13px 15px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--text);
    font-family: var(--sans); font-size: 14.5px;
    transition: border-color .2s, background .2s;
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--text-dim); }
  .field select option { background: var(--bg-2); color: var(--text); }
  .field textarea { min-height: 160px; resize: vertical; line-height: 1.6; }
  .field input:focus, .field select:focus, .field textarea:focus {
    outline: none;
    border-color: var(--violet-2);
    background: rgba(255,255,255,0.05);
  }
  .hint { margin-top: 7px; font-size: 12.5px; color: var(--text-dim); line-height: 1.5; }

  .btn-submit {
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px 24px; border-radius: 100px;
    background: linear-gradient(180deg, #A565FF 0%, #7B30E5 100%);
    color: #fff; font-family: var(--sans); font-weight: 600; font-size: 15px;
    border: 1px solid rgba(255,255,255,0.16);
    box-shadow: 0 14px 40px -10px rgba(145,70,255,0.6), inset 0 1px 0 rgba(255,255,255,0.25);
    cursor: pointer; transition: transform .2s, opacity .2s;
  }
  .btn-submit:hover:not(:disabled) { transform: translateY(-1px); }
  .btn-submit:disabled { opacity: 0.6; cursor: progress; }

  .direct { margin-top: 16px; text-align: center; font-size: 13px; color: var(--text-dim); }
  .direct a { color: var(--violet-2); text-decoration: none; }
  .direct a:hover { text-decoration: underline; }

  /* Retour d'envoi : succès en vert, erreur en rouge, tokens du site. */
  .confirm {
    display: none; gap: 12px; align-items: flex-start;
    border: 1px solid rgba(68,255,177,0.35);
    background: rgba(68,255,177,0.08);
    border-radius: 14px; padding: 14px 16px; margin-bottom: 22px;
    font-size: 14.5px; line-height: 1.55;
  }
  .confirm.show { display: flex; }
  .confirm.error { border-color: rgba(255,77,109,0.4); background: rgba(255,77,109,0.08); }
  .confirm .ico {
    flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
    display: grid; place-items: center; font-size: 12px; font-weight: 700;
    background: var(--green); color: #04120b;
  }
  .confirm.error .ico { background: var(--red); color: #fff; }

  /* FAQ : même accordéon que la page d'accueil. */
  .faq-list { margin-top: 48px; max-width: 880px; }
  .faq-item { border-top: 1px solid var(--border); padding: 22px 0; cursor: pointer; }
  .faq-q {
    display: flex; justify-content: space-between; align-items: center; gap: 20px;
    font-family: var(--display); font-size: 19px; font-weight: 500; letter-spacing: -0.01em;
  }
  .faq-q .plus { color: var(--violet-2); font-size: 22px; transition: transform .3s; }
  .faq-item.open .plus { transform: rotate(45deg); }
  .faq-a {
    max-height: 0; overflow: hidden;
    transition: max-height .4s ease, margin-top .4s ease;
    color: var(--text-muted); font-size: 15.5px; line-height: 1.6;
  }
  .faq-item.open .faq-a { max-height: 400px; margin-top: 14px; }

  footer { padding: 60px 0 40px; border-top: 1px solid var(--border); position: relative; z-index: 5; }
  .footer-grid { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .footer-brand { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 600; }
  .footer-brand img { width: 24px; height: 24px; border-radius: 6px; }
  footer .links { display: flex; gap: 22px; flex-wrap: wrap; }
  footer .links a { color: var(--text-muted); text-decoration: none; font-size: 14px; }
  footer .links a:hover { color: var(--text); }
  .copy { margin-top: 28px; font-size: 13px; color: var(--text-dim); }

  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s, transform .8s; }
  .reveal.in { opacity: 1; transform: none; }

  @media (max-width: 860px) {
    .nav-links { display: none; }
    .support-hero { padding: 120px 0 0; }
    .section { padding: 70px 0; }
    .form-card { padding: 24px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    .atmosphere::before, .atmosphere::after { animation: none; }
  }
</style>
</head>
<body>

<div class="atmosphere"></div>
<div class="grid-overlay"></div>
<div class="noise"></div>

<nav class="nav">
  <a href="${home}" class="nav-brand">
    <img src="/images/logo.png" alt="StreamPulse">
    <span>StreamPulse</span>
  </a>
  <div class="nav-links">
    <a href="${home}#features">${esc(t(dict, 'nav.features', lang))}</a>
    <a href="${home}#faq">${esc(t(dict, 'nav.faq', lang))}</a>
    <a href="${canonical.replace(ORIGIN, '')}" class="active">${esc(t(dict, 'nav.support', lang))}</a>
  </div>
  <div class="nav-actions">
    <div class="lang-pill">
      <select id="lang" aria-label="${attr(t(dict, 'nav.support', lang))}">
${buildLangSelector(lang)}
      </select>
    </div>
    <a href="${STORE_URL}" target="_blank" rel="noopener" class="btn-cta">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
      <span>${esc(t(dict, 'nav.install', lang))}</span>
    </a>
  </div>
</nav>

<section class="support-hero">
  <div class="container">
    <div class="reveal">
      <span class="section-eyebrow">${esc(t(dict, 'nav.support', lang))}</span>
      <h1><span class="gradient">${esc(t(dict, 'support.h1', lang))}</span></h1>
      <p class="lede">${esc(t(dict, 'support.lede', lang))}</p>
    </div>

    <div class="form-card reveal">
      <div class="confirm" id="confirm" role="status" aria-live="polite">
        <span class="ico" id="confirmIcon" aria-hidden="true">✓</span>
        <div id="confirmText"></div>
      </div>

      <form id="supportForm" novalidate>
        <div class="field">
          <label for="category">${esc(t(dict, 'support.f.category', lang))}</label>
          <select id="category" name="category">
${buildCategories(dict, lang)}
          </select>
        </div>

        <div class="field">
          <label for="name">${esc(t(dict, 'support.f.name', lang))} <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span></label>
          <input type="text" id="name" name="name" placeholder="${attr(t(dict, 'support.f.namePh', lang))}" autocomplete="nickname" />
        </div>

        <div class="field">
          <label for="email">${esc(t(dict, 'support.f.email', lang))} <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span></label>
          <input type="email" id="email" name="email" placeholder="${attr(t(dict, 'support.f.emailPh', lang))}" autocomplete="email" />
        </div>

        <div class="field">
          <label for="discord">${esc(t(dict, 'support.f.discord', lang))} <span class="opt">(${esc(t(dict, 'support.f.optional', lang))})</span></label>
          <input type="text" id="discord" name="discord" placeholder="${attr(t(dict, 'support.f.discordPh', lang))}" />
          <p class="hint">${esc(t(dict, 'support.f.contactHint', lang))}</p>
        </div>

        <div class="field">
          <label for="message">${esc(t(dict, 'support.f.message', lang))} <span class="opt">(${esc(t(dict, 'support.f.required', lang))})</span></label>
          <textarea id="message" name="message" placeholder="${attr(t(dict, 'support.f.messagePh', lang))}" required></textarea>
          <p class="hint">${esc(t(dict, 'support.f.messageHint', lang))}</p>
        </div>

        <!-- Honeypot: hidden from users, often filled by automated scripts.
             The API silently drops those submissions. -->
        <input type="checkbox" name="botcheck" id="botcheck" style="display:none" tabindex="-1" autocomplete="off" />

        <button type="submit" class="btn-submit">${esc(t(dict, 'support.submit', lang))}</button>
        <p class="direct">
          ${esc(t(dict, 'support.direct', lang))}
          <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
        </p>
      </form>
    </div>
  </div>
</section>

<!-- La FAQ vient après le formulaire : la page existe d'abord pour signaler
     un bug, les questions de dépannage ne sont qu'un recours secondaire. -->
<section class="section" id="faq">
  <div class="container">
    <div class="reveal">
      <span class="section-eyebrow">FAQ</span>
      <h2>${esc(t(dict, 'support.faq.title', lang))}</h2>
    </div>
    <div class="faq-list">
${buildFaq(dict, lang)}
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/images/logo.png" alt="StreamPulse">
        <span>StreamPulse</span>
      </div>
      <div class="links">
        <a href="/privacy">${esc(t(dict, 'foot.privacy', lang))}</a>
        <a href="/terms">${esc(t(dict, 'foot.terms', lang))}</a>
        <a href="${home}">StreamPulse</a>
        <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
      </div>
    </div>
    <div class="copy">© <span id="year"></span> StreamPulse.</div>
  </div>
</footer>

<script>
  document.getElementById('year').textContent = new Date().getFullYear();

  // Chaque langue a sa propre page support statique.
  var langSel = document.getElementById('lang');
  if (langSel) {
    langSel.addEventListener('change', function () {
      window.location.href = this.value;
    });
  }

  // Reveal au scroll, même seuil que la page d'accueil.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // FAQ : accordéon identique à la page d'accueil.
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () { item.classList.toggle('open'); });
  });

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
    var submit = form.querySelector('.btn-submit');
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
            .catch(function () { return {}; })
            .then(function (data) { return { ok: res.ok, data: data }; });
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
