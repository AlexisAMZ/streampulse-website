#!/usr/bin/env node
'use strict';

/**
 * build-content.js — génère les pages de contenu SEO (toutes langues) et le sitemap.
 *
 * Objectif : passer de 4 URLs à une surface de requêtes réelle. Chaque page
 * cible une intention de recherche distincte plutôt que la marque.
 *
 * Usage : node build/build-content.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { ORIGIN, UI, getUI, esc, prefix, buildHead, buildHeader, buildFooter } = require('./lib/render');
const { LOCALES, SOURCE_LANG } = require('./build-i18n');
const {
  renderSections,
  renderToc,
  renderFaq,
  renderRelated,
  renderCta,
  buildSchema,
} = require('./lib/body');

const LANGS = Object.keys(LOCALES);

const PAGES = [
  require('./content/points'),
  require('./content/error2000'),
  require('./content/drops'),
  require('./content/notifications'),
  require('./content/chat'),
  require('./content/alternatives'),
  require('./content/kick'),
  require('./content/error3000'),
  require('./content/extensionTwitch'),
  require('./content/extensionKick'),
  require('./content/dashboard')
];

/** CSS additionnel commun aux pages de contenu, aligné sur la D.A de l'accueil. */
const CONTENT_CSS = `
      .article-wrap { width: min(760px, 92vw); margin: 0 auto; }
      .article-wrap h2 {
        margin: 3.2rem 0 1.2rem;
        font-size: 1.8rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        scroll-margin-top: 100px;
        background: linear-gradient(135deg, #fff 0%, #a79af9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .article-wrap h3 { margin: 1.8rem 0 0.8rem; font-size: 1.25rem; font-weight: 500; }
      .article-wrap p { line-height: 1.8; margin: 0 0 1.2rem; font-size: 1.05rem; color: rgba(255,255,255,0.85); }
      .article-lede { font-size: 1.25rem !important; color: rgba(255,255,255,0.7) !important; font-weight: 400; line-height: 1.6 !important; }
      
      /* Glowing blocks */
      .answer-block {
        border-left: 4px solid var(--color-highlight);
        background: linear-gradient(90deg, rgba(145, 70, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border-radius: 0 16px 16px 0;
        padding: 1.2rem 1.6rem;
        margin: 0 0 1.8rem;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      }
      .answer-block p { margin: 0; font-weight: 500; font-size: 1.1rem; color: #fff; }
      
      .toc {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 1.5rem 1.8rem;
        margin: 0 0 3rem;
        backdrop-filter: blur(12px);
      }
      .toc-title {
        margin: 0 0 1rem;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-muted);
        font-weight: 600;
      }
      .toc ul { margin: 0; padding-left: 1.2rem; }
      .toc li { margin: 0.5rem 0; }
      .toc a { color: rgba(255,255,255,0.8); text-decoration: none; transition: color 0.2s; }
      .toc a:hover { color: var(--color-highlight); }
      
      .step-list { padding-left: 1.4rem; line-height: 1.8; font-size: 1.05rem; }
      .step-list li { margin: 0 0 1rem; color: rgba(255,255,255,0.85); }
      .step-list strong { color: #fff; display: inline-block; margin-bottom: 0.2rem; }
      
      .check-list { padding-left: 1.4rem; line-height: 1.8; font-size: 1.05rem; }
      .check-list li { margin: 0 0 0.7rem; color: rgba(255,255,255,0.85); }
      
      .table-wrap { overflow-x: auto; margin: 0 0 2rem; border-radius: 12px; border: 1px solid var(--border); }
      .cmp-table { width: 100%; border-collapse: collapse; font-size: 1rem; background: var(--surface); }
      .cmp-table th, .cmp-table td {
        text-align: left;
        padding: 1rem 1.2rem;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }
      .cmp-table thead th {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-muted);
        background: rgba(255,255,255,0.02);
      }
      
      .breadcrumb { font-size: 0.9rem; color: var(--color-muted); margin: 0 0 1.5rem; }
      .breadcrumb a { color: var(--color-muted); text-decoration: none; transition: color 0.2s; }
      .breadcrumb a:hover { color: var(--color-highlight); }
      
      .related-list { padding-left: 1.2rem; line-height: 2; font-size: 1.05rem; }
      .article-meta { font-size: 0.9rem; color: var(--color-muted); margin: 0 0 2.5rem; display: flex; align-items: center; gap: 0.5rem; }
      
      .content-hero { padding: 4rem 0 2rem; position: relative; }
      .content-hero::before {
        content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
        width: 600px; height: 300px; background: var(--color-highlight); filter: blur(120px); opacity: 0.15; z-index: -1;
      }
`;

/** Helper pour récupérer les traductions DeepL ou fallback sur les valeurs natives. */
function getPageContent(page, lang) {
  let i18n = {};
  if (lang !== 'fr') {
    try {
      i18n = require(`./content/i18n/${page.key}.json`)[lang] || {};
    } catch (e) {
      // Fichier absent
    }
  }

  const get = (key) => {
    if (i18n[key]) return i18n[key];
    if (page[key]) {
      return page[key][lang] || page[key]['en'] || page[key]['fr'];
    }
    return undefined;
  };

  return {
    ...page,
    slug: { [lang]: get('slug') },
    linkLabel: { [lang]: get('linkLabel') },
    title: { [lang]: get('title') },
    h1: { [lang]: get('h1') },
    description: { [lang]: get('description') },
    intro: { [lang]: get('intro') },
    howToSteps: { [lang]: get('howToSteps') },
    sections: { [lang]: get('sections') },
    faq: { [lang]: get('faq') },
    related: { [lang]: get('related') }
  };
}

function renderPage(rawPage, lang, allPages) {
  const t = getUI(lang);
  const p = prefix(lang);
  const page = getPageContent(rawPage, lang);
  const schema = buildSchema(page, lang);
  const dateLabel = new Date(page.modified).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Utilisation des classes D.A de l'accueil (.reveal pour animations, styling poussé)
  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
${buildHead(page, lang)}
    <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
    </script>
    <style>${CONTENT_CSS}</style>
  </head>
  <body class="legal-page">
${buildHeader(lang)}

    <main class="legal-main">
      <section class="content-hero reveal">
        <div class="container article-wrap">
          <p class="breadcrumb">
            <a href="${p || '/'}">${t.home}</a> / <span>${esc(page.h1[lang])}</span>
          </p>
          <h1>${esc(page.h1[lang])}</h1>
          <p class="article-lede">${page.intro[lang]}</p>
        </div>
      </section>

      <section class="section reveal" style="padding-top: 1rem;">
        <div class="container article-wrap">
          <p class="article-meta">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            ${t.updated} ${dateLabel}
          </p>
${renderToc(page, lang)}

${renderSections(page, lang)}

${renderFaq(page, lang)}

${renderRelated(page, lang, allPages)}
        </div>
      </section>

${renderCta(lang)}
    </main>

${buildFooter(lang)}
  </body>
</html>
`;
}

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  Object.entries(LOCALES).forEach(([lang, cfg]) => {
    urls.push({
      loc: cfg.dir ? `${ORIGIN}/${cfg.dir}` : `${ORIGIN}/`,
      pri: lang === SOURCE_LANG ? '1.0' : '0.8',
      freq: 'weekly',
      lastmod: today,
    });
  });

  PAGES.forEach((rawPage) => {
    LANGS.forEach((lang) => {
      const page = getPageContent(rawPage, lang);
      if (page.slug[lang]) {
        urls.push({
          loc: `${ORIGIN}${prefix(lang)}/${page.slug[lang]}`,
          pri: lang === 'fr' ? '0.8' : '0.7',
          freq: 'monthly',
          lastmod: page.modified,
        });
      }
    });
  });

  Object.entries(LOCALES).forEach(([lang, cfg]) => {
    urls.push({
      loc: cfg.dir ? `${ORIGIN}/${cfg.dir}/support` : `${ORIGIN}/support`,
      pri: lang === SOURCE_LANG ? '0.6' : '0.5',
      freq: 'monthly',
      lastmod: today,
    });
  });

  [
    { path: 'privacy', pri: '0.4' },
    { path: 'terms', pri: '0.4' },
  ].forEach((l) => {
    urls.push({ loc: `${ORIGIN}/${l.path}`, pri: l.pri, freq: 'monthly', lastmod: today });
  });

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function build() {
  let count = 0;
  const written = [];

  PAGES.forEach((rawPage) => {
    LANGS.forEach((lang) => {
      const page = getPageContent(rawPage, lang);
      if (!page.slug[lang]) return; // Skip if no slug exists for this lang
      
      const html = renderPage(rawPage, lang, PAGES);
      const outPath =
        lang === 'fr'
          ? path.join(ROOT, `${page.slug[lang]}.html`)
          : path.join(ROOT, lang, `${page.slug[lang]}.html`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');
      written.push(`${prefix(lang)}/${page.slug[lang]}`);
      count++;
    });
  });

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');

  console.log(`${count} pages de contenu générées :`);
  written.forEach((w) => console.log(`  - ${w}`));
  console.log('\nsitemap.xml régénéré.');
}

build();

module.exports = { PAGES, LANGS, getPageContent };
