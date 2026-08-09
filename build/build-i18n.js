#!/usr/bin/env node
/**
 * build-i18n.js
 * Génère des versions statiques pré-traduites de index.html pour chaque langue.
 *
 * Problème résolu : les traductions vivaient uniquement dans le JS côté client,
 * sur une URL unique (streampulse.fr/). Google n'indexait donc que le FR.
 * On produit maintenant /en/, /es/, /pt-br/ avec du HTML réellement traduit,
 * des canonicals distincts et des hreflang réciproques.
 *
 * Usage : node build/build-i18n.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');
// Doit correspondre au domaine qui répond 200 (l'apex redirige en 308 vers www).
const ORIGIN = process.env.SITE_ORIGIN || 'https://www.streampulse.fr';

// Langue source (déjà en dur dans index.html) + langues à générer dans un sous-dossier.
const SOURCE_LANG = 'fr';
const LOCALES = {
  fr: { dir: '', htmlLang: 'fr', hreflang: 'fr' },
  en: { dir: 'en', htmlLang: 'en', hreflang: 'en' },
  es: { dir: 'es', htmlLang: 'es', hreflang: 'es' },
  'pt-BR': { dir: 'pt-br', htmlLang: 'pt-BR', hreflang: 'pt-BR' },
};

// Métadonnées par langue : title/description doivent être traduits eux aussi,
// sinon les pages /en/ se cannibalisent avec un title français.
const META = {
  fr: {
    title: 'StreamPulse : Vivez Twitch & Kick sans rien rater',
    description:
      "L'extension Chrome ultime pour les passionnés de streaming : notifications en direct, points de chaîne automatiques, prédictions et tableau de bord tout-en-un.",
    ogLocale: 'fr_FR',
    keywords:
      'StreamPulse, extension Twitch, extension Kick, notifications Twitch, points de chaîne automatiques, auto-claim Twitch, Twitch Drops automatique, erreur 2000 Twitch',
    appDescription:
      'Extension Chrome gratuite pour Twitch et Kick. Notifications en temps réel, récupération automatique des points de chaîne, prédictions et tableau de bord unifié.',
  },
  en: {
    title: 'StreamPulse: Twitch & Kick Auto Channel Points',
    description:
      'Free Chrome extension for Twitch and Kick: instant live notifications, automatic channel points and Drops claiming. No ads, no tracking.',
    ogLocale: 'en_US',
    keywords:
      'Twitch extension, Kick extension, auto claim channel points, Twitch live notifications, Twitch Drops auto claim, Twitch error 2000 fix, StreamPulse',
    appDescription:
      'Free Chrome extension for Twitch and Kick. Real-time live notifications, automatic channel points collection, predictions overlay and a unified dashboard.',
  },
  es: {
    title: 'StreamPulse: Twitch y Kick, puntos automáticos',
    description:
      'Extensión de Chrome gratuita para Twitch y Kick: notificaciones de directo instantáneas, channel points automáticos, Drops automáticos y dashboard unificado.',
    ogLocale: 'es_ES',
    keywords:
      'extensión Twitch, extensión Kick, channel points automáticos, notificaciones Twitch, Twitch Drops automático, error 2000 Twitch, StreamPulse',
    appDescription:
      'Extensión de Chrome gratuita para Twitch y Kick. Notificaciones en tiempo real, reclamo automático de channel points, predicciones y dashboard unificado.',
  },
  'pt-BR': {
    title: 'StreamPulse: notificações Twitch e Kick + pontos automáticos',
    description:
      'Extensão do Chrome gratuita para Twitch e Kick: notificações de live instantâneas, channel points automáticos, Drops automáticos e dashboard unificado.',
    ogLocale: 'pt_BR',
    keywords:
      'extensão Twitch, extensão Kick, channel points automáticos, notificações Twitch, Twitch Drops automático, erro 2000 Twitch, StreamPulse',
    appDescription:
      'Extensão do Chrome gratuita para Twitch e Kick. Notificações em tempo real, resgate automático de channel points, previsões e dashboard unificado.',
  },
};

/** Extrait l'objet I18N du fichier source sans l'exécuter dans un DOM. */
function extractI18N(html) {
  const start = html.indexOf('const I18N = {');
  if (start === -1) throw new Error('Bloc I18N introuvable dans index.html');

  // Balayage des accolades pour trouver la fin exacte de l'objet,
  // en ignorant celles présentes dans les chaînes de caractères.
  const objStart = html.indexOf('{', start);
  let depth = 0;
  let inString = null;
  let escaped = false;
  let end = -1;

  for (let i = objStart; i < html.length; i++) {
    const c = html[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === '\\') {
      escaped = true;
      continue;
    }
    if (inString) {
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('Fin du bloc I18N introuvable');

  const objSrc = html.slice(objStart, end + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${objSrc});`)();
}

/** Échappe une valeur destinée à un attribut HTML. */
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Remplace la première occurrence (ou toutes avec /g) et échoue bruyamment
 * si le motif ne matche rien. Un replace() silencieux qui ne matche pas a
 * déjà causé un bug : le sélecteur de langue n'était jamais réécrit quand la
 * source FR a évolué (ajout d'aria-label).
 */
function safeReplace(input, re, replacement, label) {
  if (!re.global && input.search(re) === -1) {
    throw new Error(`build-i18n: remplacement introuvable "${label}" (${re})`);
  }
  const out = input.replace(re, replacement);
  if (re.global && input === out) {
    throw new Error(`build-i18n: remplacement introuvable "${label}" (${re})`);
  }
  return out;
}

/** Convertit du HTML de traduction en texte brut (pour data-i18n non-html). */
function stripTags(s) {
  return String(s).replace(/<[^>]*>/g, '');
}

/**
 * Remplace le contenu des éléments porteurs de data-i18n / data-i18n-html.
 * On traite uniquement des éléments sans enfants imbriqués complexes : le
 * markup source place systématiquement le texte traduisible dans une feuille.
 */
function translateBody(html, dict) {
  // data-i18n="key" -> textContent (donc tags échappés)
  html = html.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (match, openTag, tagName, key, _inner, closeTag) => {
      if (dict[key] == null) return match;
      const text = stripTags(dict[key])
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `${openTag}${text}${closeTag}`;
    }
  );

  // data-i18n-html="key" -> innerHTML (on conserve <br>, <em>, <strong>…)
  html = html.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (match, openTag, tagName, key, _inner, closeTag) => {
      if (dict[key] == null) return match;
      return `${openTag}${dict[key]}${closeTag}`;
    }
  );

  return html;
}

/**
 * URL canonique d'une langue.
 *
 * vercel.json utilise cleanUrls + trailingSlash:false : /en/index.html est
 * servi à /en, et /en/ renvoie une redirection 308. Les canonicals et hreflang
 * doivent donc pointer vers /en (sans slash final) pour ne jamais désigner
 * une URL redirigée.
 */
function localeUrl(cfg) {
  return cfg.dir ? `${ORIGIN}/${cfg.dir}` : `${ORIGIN}/`;
}

/** Construit les balises hreflang réciproques (incluant x-default). */
function buildHreflang() {
  const links = Object.entries(LOCALES).map(([lang, cfg]) => {
    return `<link rel="alternate" hreflang="${cfg.hreflang}" href="${localeUrl(cfg)}" />`;
  });
  links.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/" />`);
  return links.join('\n');
}

/**
 * Régénère le bloc JSON-LD dans la langue cible.
 *
 * Laisser la FAQPage en français sur /en/ créerait une incohérence entre les
 * données structurées et le contenu visible : Google traite ce mismatch comme
 * un signal de faible qualité et peut ignorer le rich result.
 */
function rewriteJsonLd(html, lang, dict) {
  const cfg = LOCALES[lang];
  const meta = META[lang];
  const canonical = localeUrl(cfg);

  const faq = [];
  for (let i = 1; i <= 6; i++) {
    const q = dict[`faq.q${i}`];
    const a = dict[`faq.a${i}`];
    if (!q || !a) continue;
    faq.push({
      '@type': 'Question',
      name: stripTags(q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
    });
  }

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'StreamPulse',
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Chrome, Brave, Edge, Opera',
      url: canonical,
      inLanguage: cfg.htmlLang,
      image: `${ORIGIN}/images/logo.png`,
      screenshot: `${ORIGIN}/images/extension-screenshot.png`,
      description: meta.appDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      author: {
        '@type': 'Person',
        name: 'AlexisAMZ',
        url: 'https://github.com/AlexisAMZ',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'StreamPulse',
      url: ORIGIN + '/',
      logo: `${ORIGIN}/images/logo.png`,
      sameAs: ['https://github.com/AlexisAMZ'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'StreamPulse',
      url: canonical,
      inLanguage: cfg.htmlLang,
      description: meta.description,
    },
  ];

  if (faq.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: cfg.htmlLang,
      mainEntity: faq,
    });
  }

  const json = JSON.stringify(graph, null, 2);
  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${json}\n</script>`
  );
}

/** Réécrit le <head> : title, description, canonical, OG, hreflang. */
function rewriteHead(html, lang) {
  const cfg = LOCALES[lang];
  const meta = META[lang];
  const canonical = localeUrl(cfg);

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${cfg.htmlLang}"`);
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(meta.title)}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`
  );
  html = html.replace(
    /<meta name="keywords" content="[^"]*"\s*\/>/,
    `<meta name="keywords" content="${escapeAttr(meta.keywords)}" />`
  );
  // La source FR contient déjà un bloc hreflang (ajouté au patch de la racine).
  // On le supprime avant de réinjecter, sinon chaque page traduite se retrouve
  // avec deux jeux de balises hreflang contradictoires.
  html = html.replace(
    /\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/>/g,
    ''
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />\n${buildHreflang()}`
  );

  // Open Graph / Twitter alignés sur la langue générée.
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${meta.ogLocale}" />`
  );
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/>/,
    `<meta name="twitter:url" content="${canonical}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
  );

  return html;
}

/**
 * Le sélecteur de langue doit naviguer vers de vraies URLs plutôt que
 * de permuter du texte en JS, sinon les versions traduites restent
 * inaccessibles aux crawlers.
 *
 * La regex tolère des attributs supplémentaires sur le <select> : la source
 * FR porte déjà aria-label, et un motif trop strict échouait silencieusement
 * (toutes les langues héritaient alors du drapeau FR marqué "selected").
 */
function rewriteLangSelector(html, lang) {
  const ARIA = {
    fr: 'Langue',
    en: 'Language',
    es: 'Idioma',
    'pt-BR': 'Idioma',
  };

  const options = Object.entries(LOCALES)
    .map(([code, cfg]) => {
      const flag = { fr: '🇫🇷 FR', en: '🇬🇧 EN', es: '🇪🇸 ES', 'pt-BR': '🇧🇷 PT-BR' }[code];
      const href = cfg.dir ? `/${cfg.dir}` : '/';
      const selected = code === lang ? ' selected' : '';
      return `        <option value="${href}"${selected}>${flag}</option>`;
    })
    .join('\n');

  return safeReplace(
    html,
    /<select id="lang"[^>]*>[\s\S]*?<\/select>/,
    `<select id="lang" aria-label="${escapeAttr(ARIA[lang] || 'Language')}">\n${options}\n      </select>`,
    'sélecteur de langue'
  );
}

/**
 * Neutralise l'i18n runtime : le HTML est déjà traduit au build.
 * On garde uniquement une navigation sur changement de langue.
 */
function stripRuntimeI18N(html) {
  // Retire l'application automatique du dictionnaire au chargement.
  html = html.replace(
    /const langSel = document\.getElementById\('lang'\);[\s\S]*?applyLang\(initLang\);/,
    `const langSel = document.getElementById('lang');
  if (langSel) {
    langSel.addEventListener('change', function () {
      window.location.href = this.value;
    });
  }`
  );

  // Filet de sécurité si la structure du script évolue.
  html = html.replace(
    /langSel\.addEventListener\('change',\s*e\s*=>\s*applyLang\(e\.target\.value\)\);/,
    ''
  );

  return html;
}

/** Corrige les liens relatifs pour les pages servies depuis un sous-dossier. */
function absolutizeAssets(html) {
  html = html.replace(/(href|src)="(images\/[^"]+)"/g, '$1="/$2"');
  html = html.replace(/(href|src)="(css\/[^"]+)"/g, '$1="/$2"');
  html = html.replace(/(href|src)="(js\/[^"]+)"/g, '$1="/$2"');
  return html;
}

/**
 * Ajoute les liens vers les pages de contenu traduites.
 *
 * Les pages légales (privacy, terms, support) n'existent qu'en français :
 * on les laisse pointer vers /privacy, /terms et /support plutôt que de
 * générer /en/privacy, qui n'existe pas et forcerait une redirection.
 *
 * Les guides n'existent qu'en FR et EN. Pour ES et pt-BR, la section est
 * retirée : renvoyer vers des pages anglaises depuis une page espagnole
 * dégraderait l'expérience et brouillerait les signaux de langue.
 */
function localizeInternalLinks(html, lang) {
  const GUIDE_SLUGS = {
    '/points-de-chaine-automatiques-twitch': 'auto-claim-twitch-channel-points',
    '/erreur-2000-twitch-solution': 'twitch-error-2000-fix',
    '/twitch-drops-automatique': 'twitch-drops-auto-claim',
    '/notifications-live-twitch-kick': 'twitch-kick-live-notifications',
    '/filtrer-chat-twitch': 'filter-twitch-chat',
    '/meilleures-extensions-twitch': 'best-twitch-extensions',
  };

  if (lang === 'en') {
    Object.entries(GUIDE_SLUGS).forEach(([frPath, enSlug]) => {
      html = html.replace(
        new RegExp(`href="${frPath}"`, 'g'),
        `href="/en/${enSlug}"`
      );
    });
    return html;
  }

  // ES / pt-BR : suppression de la section guides faute de traduction.
  return html.replace(
    /\n<!-- GUIDES[\s\S]*?<section class="section" id="guides">[\s\S]*?<\/section>\n/,
    '\n'
  );
}

function build() {
  const src = fs.readFileSync(SRC, 'utf8');
  const I18N = extractI18N(src);
  const generated = [];

  for (const [lang, cfg] of Object.entries(LOCALES)) {
    // La racine FR est la source : on ne la réécrit pas pour éviter que le
    // build ne devienne non-idempotent (le dictionnaire I18N y est stocké).
    if (lang === SOURCE_LANG) continue;

    const dict = I18N[lang];
    if (!dict) {
      console.warn(`  ! Dictionnaire manquant pour "${lang}", ignoré.`);
      continue;
    }

    let html = src;
    html = translateBody(html, dict);
    html = absolutizeAssets(html);
    html = localizeInternalLinks(html, lang);
    html = rewriteHead(html, lang);
    html = rewriteJsonLd(html, lang, dict);
    html = rewriteLangSelector(html, lang);
    html = stripRuntimeI18N(html);

    const outDir = path.join(ROOT, cfg.dir);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    generated.push(`/${cfg.dir}/`);
  }

  console.log('Pages traduites générées :');
  generated.forEach((g) => console.log(`  - ${g}`));
  console.log(
    '\nRappel : la racine / (FR) doit recevoir hreflang + selector via patch manuel.'
  );
}

build();
