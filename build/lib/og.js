'use strict';

/**
 * og.js — carte de partage Open Graph / Twitter, partagée par tous les
 * générateurs (landing traduite, pages de contenu, page support).
 *
 * Avant, chaque page pointait son og:image sur extension-screenshot.png (596x591)
 * et son twitter:image sur logo.png (1080x1080) : deux formats carrés là où X,
 * LinkedIn et Discord attendent du 1.91:1. Les aperçus étaient rognés et le
 * logo apparaissait seul, sans le nom du produit ni sa promesse.
 *
 * Les visuels sont générés par build/og/build-og.js et versionnés dans
 * images/. Deux variantes seulement : la racine du site est en français, les
 * quinze autres langues partagent la carte anglaise — traduire le visuel dans
 * chaque langue coûterait seize rendus pour un gain marginal sur des locales
 * où le partage social reste résiduel.
 */

const IMAGES = {
  fr: '/images/og-image.png',
  en: '/images/og-image-en.png',
};

const ALTS = {
  fr:
    'StreamPulse, extension Chrome pour Twitch et Kick : notifications de live, ' +
    'points de chaine et Drops automatiques.',
  en:
    'StreamPulse, Chrome extension for Twitch and Kick: live notifications, ' +
    'channel points and automatic Drops.',
};

const WIDTH = 1200;
const HEIGHT = 630;

/** Toute langue autre que le français retombe sur la carte anglaise. */
function variant(lang) {
  return lang === 'fr' ? 'fr' : 'en';
}

function imagePath(lang) {
  return IMAGES[variant(lang)];
}

function imageAlt(lang) {
  return ALTS[variant(lang)];
}

function imageUrl(origin, lang) {
  return `${origin}${imagePath(lang)}`;
}

/**
 * Balises og:image. Les dimensions explicites évitent que Facebook et LinkedIn
 * servent un aperçu vide au premier partage, avant d'avoir téléchargé l'image.
 */
function ogImageTags(origin, lang, indent = '') {
  return [
    `<meta property="og:image" content="${imageUrl(origin, lang)}" />`,
    `<meta property="og:image:width" content="${WIDTH}" />`,
    `<meta property="og:image:height" content="${HEIGHT}" />`,
    `<meta property="og:image:alt" content="${imageAlt(lang)}" />`,
  ].join(`\n${indent}`);
}

function twitterImageTags(origin, lang, indent = '') {
  return [
    `<meta name="twitter:image" content="${imageUrl(origin, lang)}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt(lang)}" />`,
  ].join(`\n${indent}`);
}

module.exports = {
  WIDTH,
  HEIGHT,
  imagePath,
  imageAlt,
  imageUrl,
  ogImageTags,
  twitterImageTags,
};
