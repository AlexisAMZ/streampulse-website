#!/usr/bin/env node
/**
 * build-og.js — génère les cartes de partage Open Graph (1200x630).
 *
 * Les aperçus de X, LinkedIn, Discord et iMessage attendent du 1.91:1. Le site
 * servait jusqu'ici une capture carrée (596x591) rognée de force, sans nom de
 * produit ni promesse lisibles à la taille d'une vignette de timeline.
 *
 * Le visuel est rendu en HTML puis capturé par Chrome en mode headless plutôt
 * que dessiné dans un éditeur : il reprend ainsi les tokens de la landing
 * (couleurs, Space Grotesk, atmosphère, cartes vitrées) et un changement de
 * charte se répercute en réexécutant ce script.
 *
 * Deux variantes seulement — voir build/lib/og.js pour le choix FR / EN.
 *
 * Le rendu se fait à 2x puis est redimensionné à 1200x630 : Chrome ne fait pas
 * d'antialiasing sous-pixel sur les dégradés de texte, un downscale corrige la
 * crénelure sur les grandes capitales du titre.
 *
 * Usage : node build/og/build-og.js
 *         CHROME=/chemin/vers/chrome node build/og/build-og.js
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const TEMPLATE = path.join(__dirname, 'template.html');

const WIDTH = 1200;
const HEIGHT = 630;

const CHROME =
  process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * Chaînes visibles de la carte, par variante. Volontairement séparées des
 * dictionnaires build/i18n : ce sont des accroches courtes calibrées pour la
 * largeur du visuel, pas les libellés de l'interface.
 *
 * SHOT désigne une capture réelle de l'extension, pas une maquette : chaque
 * variante montre l'interface dans sa propre langue. La variante FR réutilise
 * l'image du hero de la landing, une seule capture à remplacer à chaque
 * refonte de l'UI.
 */
const VARIANTS = {
  fr: {
    file: 'og-image.png',
    EYEBROW: 'Extension Chrome · Twitch &amp; Kick',
    H1_A: 'Ne ratez plus',
    H1_B: 'un seul live',
    H1_C: 'sur Twitch et Kick.',
    SUB: 'Notifications instantanées, points de chaîne et Drops récupérés automatiquement.',
    CTA: 'Ajouter à Chrome (Gratuit)',
    META_NUM: '100&nbsp;% gratuit',
    META_LBL: 'Pas de pub, pas de tracking',
    BROWSERS: 'Chrome · Edge · Brave · Opera',
    SHOT: 'image.png',
    // Le streamer de la notification doit être l'un de ceux visibles dans
    // SHOT, sinon la carte se contredit à la lecture.
    NOTIF_WHO: 'aminematue',
    NOTIF_GAME: 'Just Chatting',
    NOTIF: 'vient de lancer un live',
    NOTIF_TIME: "à l'instant",
  },
  en: {
    file: 'og-image-en.png',
    EYEBROW: 'Chrome extension · Twitch &amp; Kick',
    H1_A: 'Never miss',
    H1_B: 'a single live',
    H1_C: 'on Twitch and Kick.',
    SUB: 'Instant notifications, channel points and Drops claimed automatically.',
    CTA: 'Add to Chrome (Free)',
    META_NUM: '100&nbsp;% free',
    META_LBL: 'No ads, no tracking',
    BROWSERS: 'Chrome · Edge · Brave · Opera',
    SHOT: 'image-en.png',
    NOTIF_WHO: 'Anyme023',
    NOTIF_GAME: 'IRL',
    NOTIF: 'just went live',
    NOTIF_TIME: 'just now',
  },
};

/** Remplace les {{JETONS}} du gabarit et refuse d'en laisser passer un seul. */
function fill(template, values) {
  const filled = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) {
      throw new Error(`jeton sans valeur dans le gabarit : ${match}`);
    }
    return values[key];
  });

  const leftover = filled.match(/\{\{\w+\}\}/);
  if (leftover) {
    throw new Error(`jeton non substitué : ${leftover[0]}`);
  }
  return filled;
}

function render(variant, config, tmpDir) {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  // Chrome charge les avatars et le logo depuis le disque : chemins absolus.
  const values = { ...config, IMAGES: `file://${IMAGES_DIR}` };
  delete values.file;

  const page = path.join(tmpDir, `og-${variant}.html`);
  const raw = path.join(tmpDir, `og-${variant}-2x.png`);
  const out = path.join(IMAGES_DIR, config.file);

  fs.writeFileSync(page, fill(template, values));

  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=2',
    '--hide-scrollbars',
    // Les Google Fonts du gabarit doivent être arrivées avant la capture,
    // sinon le titre est rendu dans la police système de secours.
    '--virtual-time-budget=6000',
    `--window-size=${WIDTH},${HEIGHT}`,
    `--screenshot=${raw}`,
    page,
  ]);

  execFileSync('sips', [
    '-z', String(HEIGHT), String(WIDTH),
    '-s', 'format', 'png',
    raw, '--out', out,
  ]);

  return out;
}

function main() {
  if (!fs.existsSync(CHROME)) {
    console.error(
      `Chrome introuvable : ${CHROME}\n` +
        'Indiquez son chemin avec CHROME=/chemin/vers/chrome node build/og/build-og.js'
    );
    process.exit(1);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'streampulse-og-'));
  try {
    for (const [variant, config] of Object.entries(VARIANTS)) {
      const out = render(variant, config, tmpDir);
      const size = Math.round(fs.statSync(out).size / 1024);
      console.log(`${variant} -> images/${path.basename(out)} (${size} Ko)`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

if (require.main === module) {
  main();
}

module.exports = { VARIANTS, WIDTH, HEIGHT };
