'use strict';

/**
 * pages/kick.js — extension Kick.
 *
 * Intention : marché en croissance et très peu couvert en SEO.
 * L'écosystème d'extensions Kick est nettement moins mature que celui de
 * Twitch, ce qui laisse des requêtes accessibles à faible concurrence.
 */

module.exports = {
  key: 'kick',
  type: 'article',
  published: '2026-08-09',
  modified: '2026-08-09',
  slug: {
    fr: 'extension-kick-notifications',
    en: 'kick-extension-notifications',
  },
  linkLabel: {
    fr: 'Extension Kick : suivre ses streamers',
    en: 'Kick extension: track your streamers',
  },
  title: {
    fr: 'Extension Kick : notifications de live | StreamPulse',
    en: 'Kick Extension: Live Notifications | StreamPulse',
  },
  h1: {
    fr: 'Suivre ses streamers Kick avec une extension navigateur',
    en: 'Track your Kick streamers with a browser extension',
  },
  description: {
    fr: 'Comment recevoir des notifications de live Kick sur le bureau et suivre Kick et Twitch depuis une seule extension, sans garder d’onglet ouvert.',
    en: 'How to get Kick live notifications on your desktop and follow both Kick and Twitch from a single extension, without keeping a tab open.',
  },
  intro: {
    fr: "Kick a gagné une part notable de l'audience streaming, mais son écosystème d'outils reste bien plus limité que celui de Twitch. Beaucoup de spectateurs suivent des créateurs sur les deux plateformes et se retrouvent sans solution unifiée. Cette page explique ce qui est possible aujourd'hui.",
    en: 'Kick has taken a meaningful share of streaming audience, yet its tooling ecosystem remains far thinner than Twitch\'s. Many viewers follow creators on both platforms and end up without a unified solution. This page covers what is possible today.',
  },
  sections: {
    fr: [
      {
        id: 'notifications',
        h2: 'Comment recevoir des notifications de live Kick ?',
        answer:
          "StreamPulse interroge le statut des chaînes Kick que vous ajoutez et déclenche une notification bureau dès le passage en direct, sans nécessiter d'onglet Kick ouvert.",
        body: [
          "Le suivi s'ajoute manuellement en saisissant le nom de la chaîne, Kick ne proposant pas d'import automatique des abonnements comparable à celui de Twitch.",
        ],
      },
      {
        id: 'twitch-kick',
        h2: 'Peut-on suivre Kick et Twitch ensemble ?',
        answer:
          "Oui. Les deux plateformes apparaissent dans le même tableau de bord, ce qui évite de surveiller deux sites en parallèle. C'est l'intérêt principal de l'extension pour les spectateurs multi-plateformes.",
      },
      {
        id: 'limites',
        h2: 'Quelles fonctionnalités sont limitées sur Kick ?',
        answer:
          "Kick n'a ni système de points de chaîne, ni Drops, ni prédictions équivalents à ceux de Twitch. Les fonctions d'automatisation de StreamPulse liées à ces mécaniques ne s'appliquent donc qu'à Twitch.",
        table: {
          head: ['Fonctionnalité', 'Twitch', 'Kick'],
          rows: [
            ['Notifications de live', 'Oui', 'Oui'],
            ['Tableau de bord', 'Oui', 'Oui'],
            ['Points de chaîne auto', 'Oui', 'Non applicable'],
            ['Drops et Moments', 'Oui', 'Non applicable'],
            ['Overlay prédictions', 'Oui', 'Non applicable'],
            ['Import des abonnements', 'Oui', 'Ajout manuel'],
          ],
        },
      },
      {
        id: 'confidentialite',
        h2: 'Quelles données sont utilisées ?',
        answer:
          "Seuls les noms des chaînes suivies sont envoyés aux API publiques de Twitch et Kick pour vérifier leur statut. Aucune donnée personnelle n'est collectée et vos préférences restent stockées localement.",
      },
    ],
    en: [
      {
        id: 'notifications',
        h2: 'How do you get Kick live notifications?',
        answer:
          'StreamPulse polls the status of the Kick channels you add and fires a desktop notification as soon as they go live, without requiring an open Kick tab.',
        body: [
          'Channels are added manually by entering the channel name, since Kick offers no automatic subscription import comparable to Twitch.',
        ],
      },
      {
        id: 'twitch-kick',
        h2: 'Can you track Kick and Twitch together?',
        answer:
          'Yes. Both platforms appear in the same dashboard, which removes the need to monitor two sites in parallel. That is the main benefit for multi-platform viewers.',
      },
      {
        id: 'limits',
        h2: 'Which features are limited on Kick?',
        answer:
          'Kick has no channel points system, no Drops, and no predictions equivalent to Twitch. StreamPulse automation tied to those mechanics therefore applies to Twitch only.',
        table: {
          head: ['Feature', 'Twitch', 'Kick'],
          rows: [
            ['Live notifications', 'Yes', 'Yes'],
            ['Dashboard', 'Yes', 'Yes'],
            ['Auto channel points', 'Yes', 'Not applicable'],
            ['Drops and Moments', 'Yes', 'Not applicable'],
            ['Predictions overlay', 'Yes', 'Not applicable'],
            ['Subscription import', 'Yes', 'Manual add'],
          ],
        },
      },
      {
        id: 'privacy',
        h2: 'What data is used?',
        answer:
          'Only the names of followed channels are sent to the public Twitch and Kick APIs to check their status. No personal data is collected and your preferences stay stored locally.',
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'L’extension fonctionne-t-elle sans compte Kick ?',
        a: 'Oui, le suivi du statut live ne nécessite aucune connexion.',
      },
      {
        q: 'Kick aura-t-il les points de chaîne ?',
        a: "Aucun système équivalent n'existe à ce jour ; le support suivrait si la plateforme en introduisait un.",
      },
      {
        q: 'Quels navigateurs sont compatibles ?',
        a: 'Chrome, Brave, Edge, Opera et les navigateurs Chromium.',
      },
    ],
    en: [
      {
        q: 'Does the extension work without a Kick account?',
        a: 'Yes, live status tracking requires no sign-in.',
      },
      {
        q: 'Will Kick get channel points?',
        a: 'No equivalent system exists today; support would follow if the platform introduced one.',
      },
      {
        q: 'Which browsers are supported?',
        a: 'Chrome, Brave, Edge, Opera and Chromium-based browsers.',
      },
    ],
  },
  related: ['notifications', 'alternatives', 'points'],
};
