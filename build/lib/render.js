'use strict';

/**
 * render.js — gabarit HTML partagé pour les pages de contenu SEO.
 *
 * Les pages produites réutilisent css/styles.css afin de rester visuellement
 * cohérentes avec support.html / privacy.html sans dupliquer de CSS.
 */

const og = require('./og');

// Doit correspondre au domaine qui répond 200 (l'apex redirige en 308 vers www).
// Un canonical pointant vers une redirection dilue le signal envoyé à Google.
const ORIGIN = process.env.SITE_ORIGIN || 'https://www.streampulse.fr';
const CWS =
  'https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh';

const contentKeys = ['error2000', 'error3000', 'drops', 'points', 'extensionKick'];
const contentSlugs = {};
contentKeys.forEach(k => {
  try {
    contentSlugs[k] = require(`../content/i18n/${k}.json`);
  } catch (e) {
    console.warn(`Could not load i18n JSON for ${k} in render.js`);
  }
});

const UI = {
  fr: {
    features: 'Fonctionnalités',
    faq: 'FAQ',
    privacy: 'Confidentialité',
    terms: "Conditions d'utilisation",
    support: 'Assistance',
    install: 'Ajouter à Chrome (gratuit)',
    home: 'Accueil',
    guides: 'Guides',
    onThisPage: 'Sur cette page',
    ctaTitle: 'Installez StreamPulse',
    ctaDesc:
      'Gratuit, sans publicité, sans compte. Vos données restent dans votre navigateur.',
    readFaq: 'Lire la FAQ',
    relatedTitle: 'À lire aussi',
    updated: 'Mis à jour le',
    rights: 'Tous droits réservés.',
  },
  en: {
    features: 'Features',
    faq: 'FAQ',
    privacy: 'Privacy',
    terms: 'Terms of use',
    support: 'Support',
    install: 'Add to Chrome (free)',
    home: 'Home',
    guides: 'Guides',
    onThisPage: 'On this page',
    ctaTitle: 'Install StreamPulse',
    ctaDesc:
      'Free, no ads, no account. Your data stays inside your own browser.',
    readFaq: 'Read the FAQ',
    relatedTitle: 'Related reading',
    updated: 'Updated on',
    rights: 'All rights reserved.',
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Prefixe d'URL : '' pour le FR (racine), '/en' pour l'anglais. */
function prefix(lang) {
  return lang === 'fr' ? '' : `/${lang}`;
}

function buildHead(page, lang) {
  const t = getUI(lang);
  const canonical = `${ORIGIN}${prefix(lang)}/${page.slug[lang]}`;
  const alts = Object.keys(page.slug)
    .map(
      (l) =>
        `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${prefix(l)}/${page.slug[l]}" />`
    )
    .join('\n    ');


  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t.home,
        "item": ORIGIN + prefix(lang) + "/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": page.h1[lang] || page.title[lang],
        "item": canonical
      }
    ]
  };

  const schemaOrgAndSoftware = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORIGIN + "/#organization",
        "name": "StreamPulse",
        "url": ORIGIN,
        "logo": ORIGIN + "/images/logo.png",
        "sameAs": [
          "https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh",
          "https://github.com/AlexisAMZ/streampulse-extension",
          "https://github.com/AlexisAMZ",
          "https://alternativeto.net/software/streampulse/"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": ORIGIN + "/#software",
        "name": "StreamPulse",
        "description": page.description[lang],
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "Chrome, Edge, Brave, Opera",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@id": ORIGIN + "/#organization"
        },
        "url": CWS
      }
    ]
  };

  const jsonLdScripts = `<script type="application/ld+json">\n${JSON.stringify(schemaBreadcrumb, null, 2)}\n</script>\n    <script type="application/ld+json">\n${JSON.stringify(schemaOrgAndSoftware, null, 2)}\n</script>`;

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(page.title[lang])}</title>
    <meta name="description" content="${esc(page.description[lang])}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="AlexisAMZ" />
    <meta name="theme-color" content="#9146FF" />
    <meta name="apple-mobile-web-app-title" content="StreamPulse" />
    <link rel="canonical" href="${canonical}" />
    ${alts}
    <link rel="alternate" hreflang="x-default" href="${ORIGIN}/${page.slug.fr}" />

    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(page.title[lang])}" />
    <meta property="og:description" content="${esc(page.description[lang])}" />
    <meta property="og:site_name" content="StreamPulse" />
    ${og.ogImageTags(ORIGIN, lang, '    ')}
    <meta property="og:image:type" content="image/png" />
    <meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_US'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@AlexisAMZ" />
    <meta name="twitter:creator" content="@AlexisAMZ" />
    <meta name="twitter:domain" content="streampulse.fr" />
    <meta name="twitter:title" content="${esc(page.title[lang])}" />
    <meta name="twitter:description" content="${esc(page.description[lang])}" />
    ${og.twitterImageTags(ORIGIN, lang, '    ')}

    <link rel="icon" type="image/png" href="/images/logo.png" />
    <link rel="stylesheet" href="/css/styles.css" />\n    ${jsonLdScripts}`;
}

function buildHeader(lang) {
  const t = getUI(lang);
  const p = prefix(lang);
  
  const s2000 = contentSlugs['error2000']?.[lang]?.slug || 'erreur-2000-twitch-solution';
  const s3000 = contentSlugs['error3000']?.[lang]?.slug || 'erreur-3000-twitch-solution';
  const sDrops = contentSlugs['drops']?.[lang]?.slug || 'twitch-drops-automatique';
  const sPoints = contentSlugs['points']?.[lang]?.slug || 'points-de-chaine-automatiques-twitch';
  const sKick = contentSlugs['extensionKick']?.[lang]?.slug || 'extension-kick';

  return `    <header class="site-header">
      <div class="container header-content">
        <div class="branding">
          <a href="${p || '/'}" class="branding-link">
            <img src="/images/logo.png" alt="StreamPulse" class="logo" />
            <span class="brand-name">StreamPulse</span>
          </a>
        </div>
        <nav class="main-nav">
          <a href="${p}/#features">${t.features}</a>
          <a href="${p}/#faq">${t.faq}</a>
          <div class="nav-dropdown">
            <a href="#" style="cursor: default;" onclick="event.preventDefault()">${t.guides || 'Guides'} ▾</a>
            <div class="nav-dropdown-content">
              <a href="${p}/${s2000}">${contentSlugs['error2000']?.[lang]?.title || 'Erreur 2000'}</a>
              <a href="${p}/${s3000}">${contentSlugs['error3000']?.[lang]?.title || 'Erreur 3000'}</a>
              <a href="${p}/${sDrops}">${contentSlugs['drops']?.[lang]?.title || 'Twitch Drops'}</a>
              <a href="${p}/${sPoints}">${contentSlugs['points']?.[lang]?.title || 'Points de chaîne'}</a>
              <a href="${p}/${sKick}">${contentSlugs['extensionKick']?.[lang]?.title || 'Kick Extension'}</a>
            </div>
          </div>
          <a href="/support">${t.support}</a>
          <a href="${CWS}" target="_blank" rel="noopener">${t.install}</a>
        </nav>
      </div>
    </header>`;
}

function buildFooter(lang) {
  const t = getUI(lang);
  const p = prefix(lang);
  
  const s2000 = contentSlugs['error2000']?.[lang]?.slug || 'erreur-2000-twitch-solution';
  const s3000 = contentSlugs['error3000']?.[lang]?.slug || 'erreur-3000-twitch-solution';
  const sDrops = contentSlugs['drops']?.[lang]?.slug || 'twitch-drops-automatique';
  const sPoints = contentSlugs['points']?.[lang]?.slug || 'points-de-chaine-automatiques-twitch';
  const sKick = contentSlugs['extensionKick']?.[lang]?.slug || 'extension-kick';

  return `    <footer class="site-footer">
      <div class="container footer-content">
        <p>&copy; <span id="current-year"></span> StreamPulse. ${t.rights}</p>
        <nav class="footer-links">
          <a href="${p}/${s2000}">${contentSlugs['error2000']?.[lang]?.title || 'Erreur 2000'}</a>
          <a href="${p}/${s3000}">${contentSlugs['error3000']?.[lang]?.title || 'Erreur 3000'}</a>
          <a href="${p}/${sDrops}">${contentSlugs['drops']?.[lang]?.title || 'Twitch Drops'}</a>
          <a href="${p}/${sPoints}">${contentSlugs['points']?.[lang]?.title || 'Points de chaîne'}</a>
          <a href="${p}/${sKick}">${contentSlugs['extensionKick']?.[lang]?.title || 'Kick Extension'}</a>
        </nav>
        <nav class="footer-links">
          <a href="/privacy">${t.privacy}</a>
          <a href="/terms">${t.terms}</a>
          <a href="/support">${t.support}</a>
          <a href="${CWS}" target="_blank" rel="noopener">${t.install}</a>
        </nav>
      </div>
    </footer>
    <script>
      document.getElementById("current-year").textContent =
        new Date().getFullYear();
    </script>`;
}


function getUI(lang) {
  if (UI[lang]) return UI[lang];
  return UI['en'];
}

module.exports = {
  getUI, ORIGIN, CWS, UI, esc, slugify, prefix, buildHead, buildHeader, buildFooter };
