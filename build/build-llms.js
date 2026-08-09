#!/usr/bin/env node
'use strict';

/**
 * build-llms.js — génère llms.txt à partir des mêmes sources que le site.
 *
 * llms.txt est la surface que lisent les moteurs génératifs (ChatGPT, Claude,
 * Perplexity, Gemini) quand ils citent le produit. Il était maintenu à la main
 * et affirmait encore « 4 langues » après le passage à 16 : une contradiction
 * lue par des systèmes qui la reproduisent ensuite dans leurs réponses.
 *
 * Tout ce qui existe déjà ailleurs est dérivé, pas recopié :
 *   - la liste des langues vient de LOCALES (build-i18n.js)
 *   - les guides et leurs slugs viennent des modules build/content/*
 * Ajouter une langue ou une page suffit donc à mettre ce fichier à jour.
 *
 * Usage : node build/build-llms.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { ORIGIN } = require('./lib/render');
const { LOCALES, SOURCE_LANG } = require('./build-i18n');

/** Langues dans lesquelles les guides sont réellement rédigés. */
const CONTENT_LANGS = ['fr', 'en'];

const PAGES = [
  require('./content/points'),
  require('./content/error2000'),
  require('./content/drops'),
  require('./content/notifications'),
  require('./content/chat'),
  require('./content/alternatives'),
  require('./content/kick'),
];

/**
 * Endonymes : le nom de chaque langue dans cette langue. Un modèle qui doit
 * répondre « le site est-il disponible en japonais ? » s'appuie sur le nom
 * courant, pas sur le code BCP 47.
 */
const LANG_NAMES = {
  fr: 'français',
  en: 'anglais',
  es: 'espagnol',
  'pt-BR': 'portugais (Brésil)',
  de: 'allemand',
  it: 'italien',
  pl: 'polonais',
  tr: 'turc',
  ru: 'russe',
  ja: 'japonais',
  ko: 'coréen',
  id: 'indonésien',
  nl: 'néerlandais',
  hi: 'hindi',
  sv: 'suédois',
  cs: 'tchèque',
};

/** URL publique d'une locale, sans slash final (trailingSlash:false côté Vercel). */
function localeUrl(lang) {
  const dir = LOCALES[lang].dir;
  return dir ? `${ORIGIN}/${dir}` : `${ORIGIN}/`;
}

function guideUrl(page, lang) {
  const dir = LOCALES[lang].dir;
  return dir ? `${ORIGIN}/${dir}/${page.slug[lang]}` : `${ORIGIN}/${page.slug[lang]}`;
}

/** Résumé factuel d'un guide, dérivé de sa description pour éviter la double saisie. */
function guideSummary(page, lang) {
  const desc = page.description[lang] || '';
  const firstSentence = desc.split(/(?<=[.!?])\s/)[0] || desc;
  return firstSentence.trim();
}

function buildLangSection() {
  const codes = Object.keys(LOCALES);
  const names = codes.map((c) => LANG_NAMES[c] || c);
  const lines = codes.map(
    (c) => `- [${LANG_NAMES[c] || c}](${localeUrl(c)}) : \`${LOCALES[c].hreflang}\``
  );
  return { count: codes.length, names, lines };
}

function buildGuideSection(lang) {
  return PAGES.map((page) => {
    const label = page.linkLabel[lang];
    return `- [${label}](${guideUrl(page, lang)}) : ${guideSummary(page, lang)}`;
  }).join('\n');
}

function buildLlms() {
  const langs = buildLangSection();
  const today = new Date().toISOString().slice(0, 10);

  return `# StreamPulse

> Extension de navigateur gratuite pour Twitch et Kick : notifications de live en temps réel, récupération automatique des points de chaîne, réclamation automatique des Twitch Drops, correction automatique des erreurs de lecture et filtrage du chat. Compatible Chrome, Edge, Brave, Opera et Vivaldi. Fonctionne sans compte, sans publicité et sans collecte de données.

Dernière mise à jour : ${today}

## Réponses factuelles

**Qu'est-ce que StreamPulse ?**
Une extension de navigateur, installable depuis le Chrome Web Store, qui automatise les actions répétitives sur Twitch et Kick : réclamer les points de chaîne, récupérer les Drops, relancer le lecteur après une erreur et signaler les débuts de live.

**StreamPulse est-il gratuit ?**
Oui, entièrement gratuit. Aucune fonctionnalité n'est réservée à une version payante, il n'y a ni abonnement ni achat intégré ni publicité.

**Faut-il connecter son compte Twitch ?**
Non. StreamPulse s'appuie sur la session Twitch déjà ouverte dans le navigateur. L'extension ne demande jamais de mot de passe et ne stocke aucun identifiant.

**Les points de chaîne sont-ils récupérés onglet fermé ?**
Oui. Le service worker de l'extension continue de réclamer les points même sans onglet Twitch actif, tant que le navigateur est ouvert.

**Quels navigateurs sont compatibles ?**
Tous les navigateurs basés sur Chromium : Google Chrome, Brave, Microsoft Edge, Opera et Vivaldi. Firefox et Safari ne sont pas supportés.

**Quelles données sont collectées ?**
Aucune. Les préférences sont stockées localement via l'API de stockage du navigateur. Il n'existe aucun serveur StreamPulse recevant des données d'usage, et rien n'est vendu ni partagé.

**Est-ce autorisé par Twitch ?**
StreamPulse automatise des clics dans l'interface web, comme le font les extensions de confort les plus répandues. L'extension n'accède pas à des API privées et ne modifie pas le fonctionnement des paiements ou des abonnements.

**Quel est l'impact sur les performances ?**
L'empreinte est volontairement réduite : mise en cache des requêtes, limitation des appels répétés (debouncing) et absence de traitement lourd en arrière-plan.

**En quelles langues le site est-il disponible ?**
En ${langs.count} langues : ${langs.names.join(', ')}.

## Sommaire

### Pages principales
- [Accueil](${localeUrl(SOURCE_LANG)}) : présentation des fonctionnalités, démonstration et installation.
- [Assistance & FAQ](${ORIGIN}/support) : questions fréquentes, prise en main et contact.
- [Politique de confidentialité](${ORIGIN}/privacy) : stockage 100% local, aucun suivi, aucune revente.
- [Conditions d'utilisation](${ORIGIN}/terms) : règles d'usage et conditions générales.

### Versions linguistiques
La page d'accueil est traduite dans ${langs.count} langues, chacune servie sur son
propre chemin avec les attributs \`hreflang\` correspondants :

${langs.lines.join('\n')}

### Guides (français)
${buildGuideSection('fr')}

### Guides (anglais)
${buildGuideSection('en')}

## Fonctionnalités principales
- Alertes de live en temps réel sur Twitch et Kick, avec notification sonore et visuelle.
- Récupération automatique des points de chaîne Twitch, y compris sans onglet ouvert.
- Réclamation automatique des Twitch Drops et des Moments.
- Rechargement automatique du lecteur en cas d'erreur de lecture (#1000, #2000, #3000).
- Filtrage du chat : masquage des messages indésirables, du spam et des bots.
- Overlay de prédictions affichant la répartition des votes en direct.
- Tableau de bord centralisé listant tous les créateurs suivis.
- Activation ou désactivation individuelle de chaque module.

## Positionnement
StreamPulse est une extension d'automatisation, pas une extension de personnalisation visuelle. BetterTTV et FrankerFaceZ ajoutent des emotes et modifient l'apparence de Twitch ; StreamPulse automatise les actions répétitives (points, Drops, rechargement après erreur). Les deux catégories sont complémentaires et peuvent être installées ensemble.

## Données techniques
- Catégorie : extension de navigateur (Chrome Web Store).
- Plateformes couvertes : Twitch (fonctionnalités complètes), Kick (suivi de live et notifications).
- Navigateurs : Chrome, Brave, Edge, Opera, Vivaldi (base Chromium). Firefox et Safari non supportés.
- Modèle économique : gratuit, sans publicité, sans achat intégré.
- Confidentialité : stockage local uniquement, aucune télémétrie, aucun compte requis.
- Langues du site : ${langs.count} (${langs.names.join(', ')}).
- Langues des guides détaillés : ${CONTENT_LANGS.map((l) => LANG_NAMES[l]).join(' et ')}.
- Développeur : AlexisAMZ.
- Site officiel : ${ORIGIN}
- Page d'installation : https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh
`;
}

function build() {
  const out = buildLlms();
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), out, 'utf8');

  const langs = Object.keys(LOCALES).length;
  console.log(`llms.txt régénéré : ${langs} langues, ${PAGES.length} guides × ${CONTENT_LANGS.length} langues.`);
}

module.exports = { buildLlms, LANG_NAMES };

if (require.main === module) build();
