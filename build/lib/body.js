'use strict';

/**
 * body.js — rendu du corps d'article + données structurées.
 *
 * Choix GEO (Generative Engine Optimization) :
 * chaque section pose une question en <h2> et y répond immédiatement dans un
 * bloc .answer-block de 2-3 phrases factuelles. Ce motif question -> réponse
 * courte et autonome est celui que les moteurs génératifs extraient le plus
 * facilement pour citer une source.
 */

const { ORIGIN, CWS, UI, esc, prefix } = require('./render');

/** Bloc de réponse directe, extractible par les moteurs génératifs. */
function answerBlock(text) {
  return `        <div class="answer-block">
          <p>${text}</p>
        </div>`;
}

function renderSections(page, lang) {
  return page.sections[lang]
    .map((s) => {
      const parts = [`        <h2 id="${s.id}">${esc(s.h2)}</h2>`];
      if (s.answer) parts.push(answerBlock(s.answer));
      if (s.body) s.body.forEach((p) => parts.push(`        <p>${p}</p>`));
      if (s.steps) {
        parts.push('        <ol class="step-list">');
        s.steps.forEach((st) =>
          parts.push(`          <li><strong>${esc(st.name)}</strong> ${st.text}</li>`)
        );
        parts.push('        </ol>');
      }
      if (s.list) {
        parts.push('        <ul class="check-list">');
        s.list.forEach((li) => parts.push(`          <li>${li}</li>`));
        parts.push('        </ul>');
      }
      if (s.table) {
        parts.push('        <div class="table-wrap"><table class="cmp-table">');
        parts.push(
          `          <thead><tr>${s.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>`
        );
        parts.push('          <tbody>');
        s.table.rows.forEach((r) => {
          parts.push(
            `            <tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`
          );
        });
        parts.push('          </tbody>');
        parts.push('        </table></div>');
      }
      return parts.join('\n');
    })
    .join('\n\n');
}

function renderToc(page, lang) {
  const t = UI[lang];
  const items = page.sections[lang]
    .map((s) => `          <li><a href="#${s.id}">${esc(s.h2)}</a></li>`)
    .join('\n');
  return `        <nav class="toc" aria-label="${t.onThisPage}">
          <p class="toc-title">${t.onThisPage}</p>
          <ul>
${items}
          </ul>
        </nav>`;
}

function renderFaq(page, lang) {
  if (!page.faq || !page.faq[lang]) return '';
  const t = UI[lang];
  const items = page.faq[lang]
    .map(
      (f) => `          <div class="faq-item">
            <h3>${esc(f.q)}</h3>
            <p>${f.a}</p>
          </div>`
    )
    .join('\n');
  return `        <h2 id="faq">${t.faq}</h2>
        <div class="faq-inline">
${items}
        </div>`;
}

function renderRelated(page, lang, allPages) {
  if (!page.related || !page.related.length) return '';
  const t = UI[lang];
  const links = page.related
    .map((key) => {
      const target = allPages.find((p) => p.key === key);
      if (!target) return '';
      return `          <li><a href="${prefix(lang)}/${target.slug[lang]}">${esc(target.linkLabel[lang])}</a></li>`;
    })
    .filter(Boolean)
    .join('\n');
  if (!links) return '';
  return `        <h2>${t.relatedTitle}</h2>
        <ul class="related-list">
${links}
        </ul>`;
}

function renderCta(lang) {
  const t = UI[lang];
  return `      <section class="cta-banner">
        <div class="container">
          <h2>${t.ctaTitle}</h2>
          <p>${t.ctaDesc}</p>
          <p>
            <a class="btn primary" href="${CWS}" target="_blank" rel="noopener">${t.install}</a>
            <a class="btn" href="/support">${t.readFaq}</a>
          </p>
        </div>
      </section>`;
}

/** JSON-LD : Article + Breadcrumb, plus HowTo ou FAQPage selon la page. */
function buildSchema(page, lang) {
  const canonical = `${ORIGIN}${prefix(lang)}/${page.slug[lang]}`;
  const graph = [];

  graph.push({
    '@context': 'https://schema.org',
    '@type': page.type === 'howto' ? 'HowTo' : 'Article',
    name: page.h1[lang],
    headline: page.h1[lang],
    description: page.description[lang],
    inLanguage: lang,
    url: canonical,
    image: `${ORIGIN}/images/extension-screenshot.png`,
    datePublished: page.published,
    dateModified: page.modified,
    author: { '@type': 'Person', name: 'AlexisAMZ', url: 'https://github.com/AlexisAMZ' },
    publisher: {
      '@type': 'Organization',
      name: 'StreamPulse',
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/images/logo.png` },
    },
    ...(page.type === 'howto' && page.howToSteps && page.howToSteps[lang]
      ? {
          totalTime: page.totalTime || 'PT2M',
          step: page.howToSteps[lang].map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: s.name,
            text: s.text,
            url: `${canonical}#${page.sections[lang][0].id}`,
          })),
        }
      : {}),
  });

  graph.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: UI[lang].home,
        item: `${ORIGIN}${prefix(lang)}/`,
      },
      { '@type': 'ListItem', position: 2, name: page.h1[lang], item: canonical },
    ],
  });

  if (page.faq && page.faq[lang] && page.faq[lang].length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: page.faq[lang].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: String(f.a).replace(/<[^>]*>/g, ''),
        },
      })),
    });
  }

  return graph;
}

module.exports = {
  renderSections,
  renderToc,
  renderFaq,
  renderRelated,
  renderCta,
  buildSchema,
};
