#!/usr/bin/env node
'use strict';

/**
 * build-content.js — génère les pages de contenu SEO (FR + EN) et le sitemap.
 *
 * Objectif : passer de 4 URLs à une surface de requêtes réelle. Chaque page
 * cible une intention de recherche distincte plutôt que la marque.
 *
 * Usage : node build/build-content.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { ORIGIN, UI, esc, prefix, buildHead, buildHeader, buildFooter } = require('./lib/render');
const { LOCALES, SOURCE_LANG } = require('./build-i18n');
const {
  renderSections,
  renderToc,
  renderFaq,
  renderRelated,
  renderCta,
  buildSchema,
} = require('./lib/body');

const LANGS = ['fr', 'en'];

const PAGES = [
  require('./content/points'),
  require('./content/error2000'),
  require('./content/drops'),
  require('./content/notifications'),
  require('./content/chat'),
  require('./content/alternatives'),
  require('./content/kick'),
];

/** CSS additionnel commun aux pages de contenu, aligné sur les tokens du site. */
const CONTENT_CSS = `
      .article-wrap { width: min(760px, 92vw); margin: 0 auto; }
      .article-wrap h2 {
        margin: 2.6rem 0 0.9rem;
        font-size: 1.55rem;
        letter-spacing: -0.01em;
        scroll-margin-top: 90px;
      }
      .article-wrap h3 { margin: 1.6rem 0 0.6rem; font-size: 1.12rem; }
      .article-wrap p { line-height: 1.75; margin: 0 0 1rem; }
      .article-lede { font-size: 1.1rem; color: var(--color-text); }
      /* Bloc de réponse directe : cible privilégiée d'extraction par les
         moteurs de recherche et les moteurs génératifs. */
      .answer-block {
        border-left: 3px solid var(--color-highlight);
        background: var(--color-surface);
        border-radius: 0 14px 14px 0;
        padding: 1rem 1.2rem;
        margin: 0 0 1.4rem;
      }
      .answer-block p { margin: 0; font-weight: 500; }
      .toc {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 1.1rem 1.3rem;
        margin: 0 0 2.2rem;
      }
      .toc-title {
        margin: 0 0 .6rem;
        font-size: .8rem;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--color-muted);
      }
      .toc ul { margin: 0; padding-left: 1.1rem; }
      .toc li { margin: .3rem 0; }
      .toc a { color: var(--color-text); text-decoration: none; }
      .toc a:hover { color: var(--color-highlight); text-decoration: underline; }
      .step-list { padding-left: 1.3rem; line-height: 1.75; }
      .step-list li { margin: 0 0 .7rem; }
      .check-list { padding-left: 1.3rem; line-height: 1.75; }
      .check-list li { margin: 0 0 .55rem; }
      .table-wrap { overflow-x: auto; margin: 0 0 1.4rem; }
      .cmp-table { width: 100%; border-collapse: collapse; font-size: .95rem; }
      .cmp-table th, .cmp-table td {
        text-align: left;
        padding: .7rem .9rem;
        border-bottom: 1px solid var(--color-border);
        vertical-align: top;
      }
      .cmp-table thead th {
        font-size: .78rem;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: var(--color-muted);
      }
      .breadcrumb { font-size: .85rem; color: var(--color-muted); margin: 0 0 1rem; }
      .breadcrumb a { color: var(--color-muted); }
      .breadcrumb a:hover { color: var(--color-highlight); }
      .faq-inline .faq-item { margin: 0 0 1.3rem; }
      .faq-inline h3 { margin: 0 0 .4rem; font-size: 1.05rem; }
      .related-list { padding-left: 1.2rem; line-height: 1.9; }
      .article-meta { font-size: .82rem; color: var(--color-muted); margin: 0 0 2rem; }
      .cta-banner { margin-top: 3rem; text-align: center; }
`;

function renderPage(page, lang, allPages) {
  const t = UI[lang];
  const p = prefix(lang);
  const schema = buildSchema(page, lang);
  const dateLabel = new Date(page.modified).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
${buildHead(page, lang)}
    <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
    </script>
    <style>${CONTENT_CSS}    </style>
  </head>
  <body class="legal-page">
${buildHeader(lang)}

    <main class="legal-main">
      <section class="legal-hero">
        <div class="container article-wrap">
          <p class="breadcrumb">
            <a href="${p || '/'}">${t.home}</a> / <span>${esc(page.h1[lang])}</span>
          </p>
          <h1>${esc(page.h1[lang])}</h1>
          <p class="article-lede">${page.intro[lang]}</p>
        </div>
      </section>

      <section class="legal-section">
        <div class="container article-wrap">
          <p class="article-meta">${t.updated} ${dateLabel}</p>
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

/** Sitemap complet : home multilingue, pages légales, pages de contenu. */
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  // Pas de slash final : vercel.json applique trailingSlash:false, donc /en/
  // redirige vers /en. Un sitemap ne doit lister que des URLs finales.
  //
  // La liste est dérivée de LOCALES (build-i18n.js) : ajouter une langue
  // là-bas suffit pour qu'elle apparaisse ici, sans duplication à maintenir.
  Object.entries(LOCALES).forEach(([lang, cfg]) => {
    urls.push({
      loc: cfg.dir ? `${ORIGIN}/${cfg.dir}` : `${ORIGIN}/`,
      pri: lang === SOURCE_LANG ? '1.0' : '0.8',
      freq: 'weekly',
      lastmod: today,
    });
  });

  PAGES.forEach((page) => {
    LANGS.forEach((lang) => {
      urls.push({
        loc: `${ORIGIN}${prefix(lang)}/${page.slug[lang]}`,
        pri: lang === 'fr' ? '0.8' : '0.7',
        freq: 'monthly',
        lastmod: page.modified,
      });
    });
  });

  // /support existe dans les 16 langues (build/build-support.js), avec des
  // canonicals distincts : chaque version doit donc figurer au sitemap.
  Object.entries(LOCALES).forEach(([lang, cfg]) => {
    urls.push({
      loc: cfg.dir ? `${ORIGIN}/${cfg.dir}/support` : `${ORIGIN}/support`,
      pri: lang === SOURCE_LANG ? '0.6' : '0.5',
      freq: 'monthly',
      lastmod: today,
    });
  });

  // Pages légales : uniquement en français, les autres langues y sont
  // redirigées par vercel.json. Une seule URL à lister.
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

  PAGES.forEach((page) => {
    LANGS.forEach((lang) => {
      const html = renderPage(page, lang, PAGES);
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

module.exports = { PAGES, LANGS };
