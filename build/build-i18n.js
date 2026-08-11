#!/usr/bin/env node
/**
 * build-i18n.js
 * Génère des versions statiques pré-traduites de index.html pour chaque langue.
 *
 * Les traductions vivent dans build/i18n/<locale>.js, lues au build. Le HTML
 * traduit est réellement statique (canonicals distincts, hreflang réciproques),
 * au lieu d'un i18n client-side qui masquait les versions aux crawlers.
 *
 * Usage : node build/build-i18n.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const og = require('./lib/og');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'index.html');
const I18N_DIR = path.join(__dirname, 'i18n');
// Doit correspondre au domaine qui répond 200 (l'apex redirige en 308 vers www).
const ORIGIN = process.env.SITE_ORIGIN || 'https://www.streampulse.fr';

// Langue source (déjà en dur dans index.html) + langues à générer dans un sous-dossier.
const SOURCE_LANG = 'fr';
// dir : sous-dossier de sortie. htmlLang : valeur du <html lang>. hreflang : valeur hreflang.
// Il faut un fichier build/i18n/<locale>.js complet pour chaque langue, sinon le build échoue.
const LOCALES = {
  fr: { dir: '', htmlLang: 'fr', hreflang: 'fr' },
  en: { dir: 'en', htmlLang: 'en', hreflang: 'en' },
  es: { dir: 'es', htmlLang: 'es', hreflang: 'es' },
  'pt-BR': { dir: 'pt-br', htmlLang: 'pt-BR', hreflang: 'pt-BR' },
  de: { dir: 'de', htmlLang: 'de', hreflang: 'de' },
  it: { dir: 'it', htmlLang: 'it', hreflang: 'it' },
  pl: { dir: 'pl', htmlLang: 'pl', hreflang: 'pl' },
  tr: { dir: 'tr', htmlLang: 'tr', hreflang: 'tr' },
  ru: { dir: 'ru', htmlLang: 'ru', hreflang: 'ru' },
  ja: { dir: 'ja', htmlLang: 'ja', hreflang: 'ja' },
  ko: { dir: 'ko', htmlLang: 'ko', hreflang: 'ko' },
  id: { dir: 'id', htmlLang: 'id', hreflang: 'id' },
  nl: { dir: 'nl', htmlLang: 'nl', hreflang: 'nl' },
  hi: { dir: 'hi', htmlLang: 'hi', hreflang: 'hi' },
  sv: { dir: 'sv', htmlLang: 'sv', hreflang: 'sv' },
  cs: { dir: 'cs', htmlLang: 'cs', hreflang: 'cs' },
};

/** Métadonnées par langue : title/description doivent être traduits eux aussi,
 *  sinon les pages /de/ se cannibalisent avec un title français. */
const META = {
  fr: {
    title: 'StreamPulse : extension Chrome pour Twitch et Kick',
    description:
      "Extension gratuite pour Twitch et Kick : notifications de live, points de chaîne et Drops automatiques (Chrome, Edge, Brave, Opera).",
    ogDescription:
      "Extension gratuite Twitch & Kick : notifications de live, points de chaîne et Drops automatiques.",
    ogLocale: 'fr_FR',
    keywords:
      'StreamPulse, extension Twitch, extension Kick, notifications Twitch, points de chaîne automatiques, auto-claim Twitch, Twitch Drops automatique, erreur 2000 Twitch',
    appDescription:
      'Extension Chrome gratuite pour Twitch et Kick. Notifications en temps réel, récupération automatique des points de chaîne, prédictions et tableau de bord unifié.',
  },
  en: {
    title: 'StreamPulse: Chrome extension for Twitch and Kick',
    description:
      'Free Chrome extension for Twitch and Kick: instant live notifications, automatic channel points and Drops claiming. Works on Chrome, Edge, Brave and Opera.',
    ogLocale: 'en_US',
    keywords:
      'Twitch extension, Kick extension, auto claim channel points, Twitch live notifications, Twitch Drops auto claim, Twitch error 2000 fix, StreamPulse',
    appDescription:
      'Free Chrome extension for Twitch and Kick. Real-time live notifications, automatic channel points collection, predictions overlay and a unified dashboard.',
  },
  es: {
    title: 'StreamPulse: extensión de Chrome para Twitch y Kick',
    description:
      'Extensión de Chrome gratuita para Twitch y Kick: notificaciones de directo instantáneas, channel points automáticos y Drops automáticos. Compatible con Chrome, Edge, Brave y Opera.',
    ogLocale: 'es_ES',
    keywords:
      'extensión Twitch, extensión Kick, channel points automáticos, notificaciones Twitch, Twitch Drops automático, error 2000 Twitch, StreamPulse',
    appDescription:
      'Extensión de Chrome gratuita para Twitch y Kick. Notificaciones en tiempo real, reclamo automático de channel points, predicciones y dashboard unificado.',
  },
  'pt-BR': {
    title: 'StreamPulse: extensão do Chrome para Twitch e Kick',
    description:
      'Extensão do Chrome gratuita para Twitch e Kick: notificações de live instantâneas, channel points automáticos e Drops automáticos. Compatível com Chrome, Edge, Brave e Opera.',
    ogLocale: 'pt_BR',
    keywords:
      'extensão Twitch, extensão Kick, channel points automáticos, notificações Twitch, Twitch Drops automático, erro 2000 Twitch, StreamPulse',
    appDescription:
      'Extensão do Chrome gratuita para Twitch e Kick. Notificações em tempo real, resgate automático de channel points, previsões e dashboard unificado.',
  },
  de: {
    title: 'StreamPulse: Chrome Erweiterung für Twitch und Kick',
    description:
      'Kostenlose Chrome Erweiterung für Twitch und Kick: sofortige Live Benachrichtigungen, automatische Kanalpunkte und Drops. Läuft in Chrome, Edge, Brave und Opera.',
    ogLocale: 'de_DE',
    keywords:
      'Twitch Erweiterung, Kick Erweiterung, Kanalpunkte automatisch sammeln, Twitch Benachrichtigungen, Twitch Drops automatisch, Twitch Fehler 2000 beheben, StreamPulse',
    appDescription:
      'Kostenlose Chrome-Erweiterung für Twitch und Kick. Echtzeit-Benachrichtigungen, automatisches Sammeln von Kanalpunkten, Predictions-Overlay und ein einheitliches Dashboard.',
  },
  it: {
    title: 'StreamPulse: estensione Chrome per Twitch e Kick',
    description:
      'Estensione Chrome gratuita per Twitch e Kick: notifiche live istantanee, punti canale e Drops automatici. Compatibile con Chrome, Edge, Brave e Opera.',
    ogLocale: 'it_IT',
    keywords:
      'estensione Twitch, estensione Kick, punti canale automatici, notifiche Twitch, Twitch Drops automatici, errore 2000 Twitch, StreamPulse',
    appDescription:
      'Estensione Chrome gratuita per Twitch e Kick. Notifiche in tempo reale, raccolta automatica dei punti canale, overlay previsioni e dashboard unificata.',
  },
  pl: {
    title: 'StreamPulse: rozszerzenie Chrome do Twitcha i Kicka',
    description:
      'Bezpłatne rozszerzenie Chrome do Twitcha i Kicka: natychmiastowe powiadomienia o transmisjach, automatyczne punkty kanału i Drops. Działa w Chrome, Edge, Brave i Opera.',
    ogLocale: 'pl_PL',
    keywords:
      'rozszerzenie Twitch, rozszerzenie Kick, automatyczne punkty kanału, powiadomienia Twitch, automatyczne Twitch Drops, błąd 2000 Twitch, StreamPulse',
    appDescription:
      'Bezpłatne rozszerzenie Chrome dla Twitcha i Kicka. Powiadomienia w czasie rzeczywistym, automatyczne zbieranie punktów kanału, nakładka przewidywań i wspólny panel.',
  },
  tr: {
    title: 'StreamPulse: Twitch ve Kick için Chrome uzantısı',
    description:
      'Twitch ve Kick için ücretsiz Chrome uzantısı: anında yayın bildirimleri, otomatik kanal puanları ve Drops. Chrome, Edge, Brave ve Opera ile uyumlu.',
    ogLocale: 'tr_TR',
    keywords:
      'Twitch uzantısı, Kick uzantısı, otomatik kanal puanı toplama, Twitch bildirimleri, otomatik Twitch Drops, Twitch 2000 hatası çözümü, StreamPulse',
    appDescription:
      'Twitch ve Kick için ücretsiz Chrome uzantısı. Gerçek zamanlı bildirimler, otomatik kanal puanı toplama, tahmin katmanı ve birleşik panel.',
  },
  ru: {
    title: 'StreamPulse: расширение Chrome для Twitch и Kick',
    description:
      'Бесплатное расширение Chrome для Twitch и Kick: мгновенные уведомления о стримах, автосбор баллов канала и Drops. Работает в Chrome, Edge, Brave и Opera.',
    ogLocale: 'ru_RU',
    keywords:
      'расширение Twitch, расширение Kick, автосбор баллов канала, уведомления Twitch, автоматические Twitch Drops, ошибка 2000 Twitch, StreamPulse',
    appDescription:
      'Бесплатное расширение Chrome для Twitch и Kick. Уведомления в реальном времени, автоматический сбор баллов канала, оверлей прогнозов и единая панель.',
  },
  ja: {
    title: 'StreamPulse: Twitch と Kick 用 Chrome 拡張機能',
    description:
      'Twitch と Kick 用の無料 Chrome 拡張機能。配信の即時通知、チャンネルポイントと Drops の自動取得。Chrome、Edge、Brave、Opera に対応。',
    ogLocale: 'ja_JP',
    keywords:
      'Twitch 拡張機能, Kick 拡張機能, チャンネルポイント 自動取得, Twitch 通知, Twitch Drops 自動, Twitch エラー 2000 対処, StreamPulse',
    appDescription:
      'Twitch と Kick 向けの無料 Chrome 拡張機能。リアルタイム通知、チャンネルポイントの自動取得、予測オーバーレイ、統合ダッシュボード。',
  },
  ko: {
    title: 'StreamPulse: Twitch와 Kick용 Chrome 확장 프로그램',
    description:
      'Twitch와 Kick을 위한 무료 Chrome 확장 프로그램. 실시간 방송 알림, 채널 포인트와 Drops 자동 수령. Chrome, Edge, Brave, Opera 지원.',
    ogLocale: 'ko_KR',
    keywords:
      'Twitch 확장 프로그램, Kick 확장 프로그램, 채널 포인트 자동 적립, Twitch 알림, Twitch Drops 자동, Twitch 오류 2000 해결, StreamPulse',
    appDescription:
      'Twitch와 Kick을 위한 무료 Chrome 확장 프로그램. 실시간 알림, 채널 포인트 자동 적립, 예측 오버레이, 통합 대시보드.',
  },
  id: {
    title: 'StreamPulse: ekstensi Chrome untuk Twitch dan Kick',
    description:
      'Ekstensi Chrome gratis untuk Twitch dan Kick: notifikasi live instan, poin kanal dan Drops otomatis. Mendukung Chrome, Edge, Brave, dan Opera.',
    ogLocale: 'id_ID',
    keywords:
      'ekstensi Twitch, ekstensi Kick, poin kanal otomatis, notifikasi Twitch, Twitch Drops otomatis, cara mengatasi error 2000 Twitch, StreamPulse',
    appDescription:
      'Ekstensi Chrome gratis untuk Twitch dan Kick. Notifikasi real-time, pengumpulan poin kanal otomatis, overlay prediksi, dan dasbor terpadu.',
  },
  nl: {
    title: 'StreamPulse: Chrome extensie voor Twitch en Kick',
    description:
      'Gratis Chrome extensie voor Twitch en Kick: directe live meldingen, automatische kanaalpunten en Drops. Werkt in Chrome, Edge, Brave en Opera.',
    ogLocale: 'nl_NL',
    keywords:
      'Twitch extensie, Kick extensie, automatisch kanaalpunten ophalen, Twitch meldingen, automatische Twitch Drops, Twitch fout 2000 oplossen, StreamPulse',
    appDescription:
      'Gratis Chrome-extensie voor Twitch en Kick. Realtime meldingen, automatisch ophalen van kanaalpunten, Predictions-overlay en één dashboard.',
  },
  hi: {
    title: 'StreamPulse: Twitch और Kick के लिए Chrome एक्सटेंशन',
    description:
      'Twitch और Kick के लिए निःशुल्क Chrome एक्सटेंशन: तुरंत लाइव सूचनाएँ, स्वचालित चैनल पॉइंट्स और Drops। Chrome, Edge, Brave और Opera पर काम करता है।',
    ogLocale: 'hi_IN',
    keywords:
      'Twitch एक्सटेंशन, Kick एक्सटेंशन, स्वचालित चैनल पॉइंट्स, Twitch सूचनाएँ, स्वचालित Twitch Drops, Twitch त्रुटि 2000 समाधान, StreamPulse',
    appDescription:
      'Twitch और Kick के लिए निःशुल्क Chrome एक्सटेंशन। रीयल-टाइम सूचनाएँ, चैनल पॉइंट्स का स्वचालित संग्रह, प्रेडिक्शन ओवरले और एकीकृत डैशबोर्ड।',
  },
  sv: {
    title: 'StreamPulse: Chrome tillägg för Twitch och Kick',
    description:
      'Gratis Chrome tillägg för Twitch och Kick: direkta liveaviseringar, automatiska kanalpoäng och Drops. Fungerar i Chrome, Edge, Brave och Opera.',
    ogLocale: 'sv_SE',
    keywords:
      'Twitch-tillägg, Kick-tillägg, samla kanalpoäng automatiskt, Twitch-aviseringar, automatiska Twitch Drops, Twitch-fel 2000 lösning, StreamPulse',
    appDescription:
      'Gratis Chrome-tillägg för Twitch och Kick. Aviseringar i realtid, automatisk insamling av kanalpoäng, Predictions-overlay och en samlad instrumentpanel.',
  },
  cs: {
    title: 'StreamPulse: rozšíření Chrome pro Twitch a Kick',
    description:
      'Bezplatné rozšíření Chrome pro Twitch a Kick: okamžitá upozornění na vysílání, automatické body kanálu a Drops. Funguje v Chrome, Edge, Brave a Opera.',
    ogLocale: 'cs_CZ',
    keywords:
      'rozšíření Twitch, rozšíření Kick, automatický sběr bodů kanálu, upozornění Twitch, automatické Twitch Drops, chyba 2000 Twitch řešení, StreamPulse',
    appDescription:
      'Bezplatné rozšíření Chrome pro Twitch a Kick. Upozornění v reálném čase, automatický sběr bodů kanálu, překryv predikcí a jednotný přehled.',
  },
};

/**
 * Charge les dictionnaires depuis build/i18n/<locale>.js.
 *
 * Le dictionnaire vivait auparavant en dur dans index.html, ce qui l'expédiait
 * à chaque visiteur (~23 Ko inutiles) et devenait ingérable au-delà de quelques
 * langues. Il est désormais externalisé, une langue par fichier.
 */
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
 * Vérifie que chaque langue couvre toutes les clés de la langue source.
 *
 * Sans ce garde-fou, une clé absente laissait passer le texte français dans une
 * page traduite (fallback silencieux) : c'est ainsi que /es et /pt-br servaient
 * trois blocs de fonctionnalités en français.
 */
function assertComplete(dicts) {
  const reference = Object.keys(dicts[SOURCE_LANG]);
  const problems = [];

  for (const [lang, dict] of Object.entries(dicts)) {
    const missing = reference.filter((k) => dict[k] == null);
    const unknown = Object.keys(dict).filter((k) => !reference.includes(k));
    if (missing.length) problems.push(`  ${lang} : ${missing.length} clé(s) manquante(s) -> ${missing.join(', ')}`);
    if (unknown.length) problems.push(`  ${lang} : ${unknown.length} clé(s) inconnue(s) -> ${unknown.join(', ')}`);
  }

  if (problems.length) {
    throw new Error(`Dictionnaires incomplets :\n${problems.join('\n')}`);
  }
  return reference.length;
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

  // La boucle s'arrête à la première question absente : ajouter faq.q11/a11
  // aux dictionnaires suffit pour l'inclure au rich result, sans toucher ici.
  const faq = [];
  for (let i = 1; ; i++) {
    const q = dict[`faq.q${i}`];
    const a = dict[`faq.a${i}`];
    if (!q || !a) break;
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
    `<meta property="og:description" content="${escapeAttr(meta.ogDescription || meta.description)}" />`
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${meta.ogLocale}" />`
  );
  // La source FR porte la carte française : toute autre langue reprend l'anglaise.
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${og.imageUrl(ORIGIN, lang)}" />`
  );
  html = html.replace(
    /<meta property="og:image:alt" content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeAttr(og.imageAlt(lang))}" />`
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
    `<meta name="twitter:description" content="${escapeAttr(meta.ogDescription || meta.description)}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${og.imageUrl(ORIGIN, lang)}" />`
  );
  html = html.replace(
    /<meta name="twitter:image:alt" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image:alt" content="${escapeAttr(og.imageAlt(lang))}" />`
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
    fr: 'Langue', en: 'Language', es: 'Idioma', 'pt-BR': 'Idioma',
    de: 'Sprache', it: 'Lingua', pl: 'Język', tr: 'Dil',
    ru: 'Язык', ja: '言語', ko: '언어', id: 'Bahasa',
    nl: 'Taal', hi: 'भाषा', sv: 'Språk', cs: 'Jazyk',
  };
  const FLAGS = {
    fr: '🇫🇷 FR', en: '🇬🇧 EN', es: '🇪🇸 ES', 'pt-BR': '🇧🇷 PT',
    de: '🇩🇪 DE', it: '🇮🇹 IT', pl: '🇵🇱 PL', tr: '🇹🇷 TR',
    ru: '🇷🇺 RU', ja: '🇯🇵 JA', ko: '🇰🇷 KO', id: '🇮🇩 ID',
    nl: '🇳🇱 NL', hi: '🇮🇳 HI', sv: '🇸🇪 SV', cs: '🇨🇿 CS',
  };

  const options = Object.entries(LOCALES)
    .map(([code, cfg]) => {
      const href = cfg.dir ? `/${cfg.dir}` : '/';
      const selected = code === lang ? ' selected' : '';
      return `        <option value="${href}"${selected}>${FLAGS[code] || code}</option>`;
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
 * Réécrit les liens internes selon la langue.
 *
 * /support existe désormais dans les 16 langues (build/build-support.js) : le
 * lien est donc préfixé par la locale, sinon un visiteur allemand cliquant sur
 * « Support » retomberait sur le formulaire français.
 *
 * Les pages légales (privacy, terms) n'existent qu'en français : on les laisse
 * pointer vers /privacy et /terms plutôt que de générer /de/privacy, qui
 * n'existe pas et forcerait une redirection.
 *
 * Les guides ne sont rédigés qu'en FR et EN. Les autres langues affichent la
 * section (ses libellés sont traduits) mais pointent vers la version anglaise :
 * un lien vers un guide lisible vaut mieux qu'une section supprimée, et le
 * hreflang de la page cible reste cohérent.
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

  Object.entries(GUIDE_SLUGS).forEach(([frPath, enSlug]) => {
    html = html.replace(
      new RegExp(`href="${frPath}"`, 'g'),
      `href="/en/${enSlug}"`
    );
  });

  // Préfixe /support par la locale. La source FR n'étant jamais réécrite,
  // ce remplacement ne s'applique qu'aux langues générées.
  const dir = LOCALES[lang].dir;
  if (dir) {
    html = html.replace(/href="\/support"/g, `href="/${dir}/support"`);
  }

  return html;
}

function build() {
  const src = fs.readFileSync(SRC, 'utf8');
  const dicts = loadDictionaries();
  const keyCount = assertComplete(dicts);
  const generated = [];

  for (const [lang, cfg] of Object.entries(LOCALES)) {
    // La racine FR est la source : on ne la réécrit pas, sinon le build
    // deviendrait non idempotent.
    if (lang === SOURCE_LANG) continue;

    const dict = dicts[lang];

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
    generated.push(`/${cfg.dir || '(racine)'}`);
  }

  console.log(`✓ ${Object.keys(LOCALES).length} langues × ${keyCount} clés traduites`);
  console.log(`✓ Pages générées :`);
  generated.forEach((g) => console.log(`    ${g}`));
  console.log(
    '\nRappel : la racine / (FR) doit recevoir hreflang + selector via patch manuel.'
  );
}

// Exporté pour que build-content.js dérive le sitemap de la même liste :
// une locale ajoutée ici apparaît automatiquement dans sitemap.xml.
module.exports = { LOCALES, SOURCE_LANG };

if (require.main === module) build();
