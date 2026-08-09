'use strict';

/**
 * pages/notifications.js — notifications live Twitch + Kick.
 * Intention : requête produit multi-plateforme, avec un angle Kick
 * peu couvert par la concurrence.
 */

module.exports = {
  key: 'notifications',
  type: 'howto',
  published: '2026-08-09',
  modified: '2026-08-09',
  totalTime: 'PT2M',
  slug: {
    fr: 'notifications-live-twitch-kick',
    en: 'twitch-kick-live-notifications',
  },
  linkLabel: {
    fr: 'Notifications live Twitch et Kick',
    en: 'Twitch and Kick live notifications',
  },
  title: {
    fr: 'Notifications live Twitch et Kick | StreamPulse',
    en: 'Twitch and Kick Desktop Live Notifications | StreamPulse',
  },
  h1: {
    fr: 'Recevoir les notifications de live Twitch et Kick sur son bureau',
    en: 'Get Twitch and Kick live notifications on your desktop',
  },
  description: {
    fr: 'Pourquoi les notifications Twitch arrivent en retard, et comment recevoir une alerte bureau fiable pour Twitch et Kick dans une seule extension.',
    en: 'Why Twitch notifications arrive late, how to get reliable desktop alerts for both Twitch and Kick in a single extension, and how to tune the sound.',
  },
  intro: {
    fr: "Les notifications natives de Twitch arrivent parfois plusieurs minutes après le début du live, et Kick impose de surveiller un onglet séparé. Suivre des créateurs sur les deux plateformes suppose donc de jongler entre deux systèmes d'alerte inégaux. Cette page explique comment centraliser le suivi.",
    en: "Twitch's native notifications sometimes arrive several minutes after a stream starts, and Kick requires watching a separate tab. Following creators on both platforms therefore means juggling two uneven alert systems. This page explains how to centralise that.",
  },
  howToSteps: {
    fr: [
      {
        name: "Installer l'extension",
        text: "Ajoutez StreamPulse depuis le Chrome Web Store, sur Chrome, Brave, Edge ou Opera.",
      },
      {
        name: 'Importer vos chaînes',
        text: 'Synchronisez vos abonnements Twitch en un clic, puis ajoutez vos chaînes Kick manuellement.',
      },
      {
        name: 'Régler les alertes',
        text: "Choisissez le son, activez le badge sur l'icône et définissez les chaînes prioritaires.",
      },
    ],
    en: [
      {
        name: 'Install the extension',
        text: 'Add StreamPulse from the Chrome Web Store on Chrome, Brave, Edge or Opera.',
      },
      {
        name: 'Import your channels',
        text: 'Sync your Twitch subscriptions in one click, then add your Kick channels manually.',
      },
      {
        name: 'Tune the alerts',
        text: 'Pick the sound, enable the icon badge, and set which channels are priority.',
      },
    ],
  },
  sections: {
    fr: [
      {
        id: 'retard',
        h2: 'Pourquoi les notifications Twitch arrivent-elles en retard ?',
        answer:
          "Les notifications natives de Twitch passent par un système de diffusion mutualisé qui introduit un délai variable, parfois de plusieurs minutes. Une extension qui interroge directement le statut des chaînes suivies détecte le passage en live plus tôt.",
        body: [
          "Sur un live court ou un événement ponctuel, ce décalage suffit à faire manquer le début. C'est la principale raison pour laquelle beaucoup de spectateurs gardent un onglet ouvert en permanence.",
        ],
      },
      {
        id: 'twitch-kick',
        h2: 'Comment suivre Twitch et Kick au même endroit ?',
        answer:
          "StreamPulse interroge les API publiques des deux plateformes et affiche les chaînes en direct dans un tableau de bord unique. Une seule extension remplace la surveillance manuelle de deux sites.",
        list: [
          'Twitch : notifications, points de chaîne, Drops, prédictions.',
          'Kick : suivi du statut live et notifications bureau.',
          'Tableau de bord commun, trié par statut.',
        ],
      },
      {
        id: 'personnalisation',
        h2: 'Peut-on personnaliser les alertes ?',
        answer:
          "Oui. Le son est configurable, un badge peut s'afficher sur l'icône de l'extension, et chaque chaîne peut être réglée indépendamment pour éviter la saturation quand on suit beaucoup de créateurs.",
        list: [
          'Son personnalisable ou notification silencieuse.',
          'Badge de comptage sur l’icône du navigateur.',
          'Alertes activables chaîne par chaîne.',
          'Fenêtre de notification native du système.',
        ],
      },
      {
        id: 'onglet',
        h2: 'Faut-il garder un onglet ouvert ?',
        answer:
          "Non. La surveillance tourne dans le service worker de l'extension, sans onglet dédié. Le navigateur doit simplement être lancé.",
      },
    ],
    en: [
      {
        id: 'delay',
        h2: 'Why do Twitch notifications arrive late?',
        answer:
          'Twitch native notifications go through a shared delivery system that introduces a variable delay, sometimes several minutes. An extension that polls followed channels directly detects the switch to live sooner.',
        body: [
          'On a short stream or a one-off event, that gap is enough to miss the start. It is the main reason many viewers keep a tab permanently open.',
        ],
      },
      {
        id: 'twitch-kick',
        h2: 'How do you follow Twitch and Kick in one place?',
        answer:
          'StreamPulse queries the public APIs of both platforms and shows live channels in a single dashboard. One extension replaces manually watching two separate sites.',
        list: [
          'Twitch: notifications, channel points, Drops, predictions.',
          'Kick: live status tracking and desktop notifications.',
          'Shared dashboard, sorted by status.',
        ],
      },
      {
        id: 'customisation',
        h2: 'Can the alerts be customised?',
        answer:
          'Yes. The sound is configurable, a badge can appear on the extension icon, and each channel can be tuned independently to avoid overload when you follow many creators.',
        list: [
          'Custom sound or silent notification.',
          'Counter badge on the browser icon.',
          'Alerts toggled per channel.',
          'Native system notification window.',
        ],
      },
      {
        id: 'tab',
        h2: 'Do I need to keep a tab open?',
        answer:
          "No. Monitoring runs in the extension's service worker, with no dedicated tab. The browser simply needs to be running.",
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'Les notifications fonctionnent-elles si Chrome est réduit ?',
        a: 'Oui, tant que le navigateur tourne, y compris réduit ou en arrière-plan.',
      },
      {
        q: 'Combien de chaînes peut-on suivre ?',
        a: "Il n'y a pas de limite fixée par l'extension.",
      },
      {
        q: 'Faut-il un compte Twitch ?',
        a: "Non pour le suivi manuel. La connexion Twitch sert uniquement à importer automatiquement vos abonnements.",
      },
    ],
    en: [
      {
        q: 'Do notifications work if Chrome is minimised?',
        a: 'Yes, as long as the browser is running, including minimised or in the background.',
      },
      {
        q: 'How many channels can I follow?',
        a: 'The extension sets no fixed limit.',
      },
      {
        q: 'Do I need a Twitch account?',
        a: 'Not for manual tracking. Signing in to Twitch only serves to import your subscriptions automatically.',
      },
    ],
  },
  related: ['points', 'chat', 'drops'],
};
