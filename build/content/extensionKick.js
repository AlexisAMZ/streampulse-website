'use strict';

module.exports = {
  key: 'extensionKick',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT3M',
  slug: {
    fr: 'extension-kick',
    en: 'kick-extension',
  },
  linkLabel: {
    fr: 'Extension Kick pour spectateurs',
    en: 'Kick extension for viewers',
  },
  title: {
    fr: 'Extension Kick pour spectateurs | StreamPulse',
    en: 'Kick extension for viewers | StreamPulse',
  },
  h1: {
    fr: 'Extension Kick pour spectateurs',
    en: 'Kick extension for viewers',
  },
  description: {
    fr: "StreamPulse : extension Kick pour spectateurs. Notifications live, suivi des streamers, filtres de chat et outils de visionnage pour Kick.com.",
    en: 'StreamPulse: Kick extension for viewers. Live notifications, streamer tracking, chat filters, and viewing tools for Kick.com.',
  },
  intro: {
    fr: "StreamPulse est l'une des rares extensions de navigateur qui prend en charge Kick en plus de Twitch. Notifications live, récompenses automatiques, filtres de chat et suivi de vos streamers Kick favoris dans un tableau de bord unifié.",
    en: 'StreamPulse is one of the few browser extensions that supports Kick in addition to Twitch. Live notifications, automatic rewards, chat filters, and tracking for your favorite Kick streamers in a unified dashboard.',
  },
  sections: {
    fr: [
      {
        id: 'fonctionnalites',
        h2: 'Fonctionnalités Kick',
        answer:
          "StreamPulse prend en charge les fonctionnalités clés de Kick : notifications live, récompenses de chaîne, filtres de chat et suivi du temps de visionnage. Le dashboard de StreamPulse affiche les chaînes Twitch et Kick dans une interface unifiée.",
        list: [
          '<strong>Notifications live Kick.</strong> Alertes desktop en temps réel dès qu\'un streamer suivi passe en direct sur Kick.',
          '<strong>Récompenses de chaîne.</strong> Récupération automatique des récompenses de chaîne Kick lorsqu\'elles sont disponibles.',
          '<strong>Filtres de chat Kick.</strong> Masquez les spams et mots-clés indésirables dans le chat Kick.',
          '<strong>Suivi du temps de visionnage.</strong> Compteur précis du temps passé sur chaque chaîne Kick suivie.',
        ],
      },
      {
        id: 'difference',
        h2: 'Différences avec le support Twitch',
        answer:
          "Le support Kick de StreamPulse couvre les notifications, les récompenses, les filtres et le suivi. Les fonctionnalités spécifiques à Twitch (Drops, aperçus au survol, correction des erreurs de lecteur) ne sont pas disponibles sur Kick car l'API de Kick ne les permet pas actuellement.",
      },
      {
        id: 'installation',
        h2: 'Installation',
        answer:
          "StreamPulse s'installe depuis le Chrome Web Store et fonctionne sur tous les navigateurs basés sur Chromium. Le support Kick est activé par défaut, aucune configuration supplémentaire n'est nécessaire.",
      }
    ],
    en: [
      {
        id: 'features',
        h2: 'Kick features',
        answer:
          "StreamPulse supports key Kick features: live notifications, channel rewards, chat filters, and watch time tracking. The StreamPulse dashboard displays Twitch and Kick channels in a unified interface.",
        list: [
          '<strong>Kick live notifications.</strong> Real-time desktop alerts as soon as a followed streamer goes live on Kick.',
          '<strong>Channel rewards.</strong> Automatic collection of Kick channel rewards when they are available.',
          '<strong>Kick chat filters.</strong> Hide spam and unwanted keywords in Kick chat.',
          '<strong>Watch time tracking.</strong> Precise counter of the time spent on each followed Kick channel.',
        ],
      },
      {
        id: 'difference',
        h2: 'Differences with Twitch support',
        answer:
          "StreamPulse's Kick support covers notifications, rewards, filters, and tracking. Twitch-specific features (Drops, hover previews, player error fixing) are not available on Kick because the Kick API does not currently allow them.",
      },
      {
        id: 'installation',
        h2: 'Installation',
        answer:
          "StreamPulse installs from the Chrome Web Store and works on all Chromium-based browsers. Kick support is enabled by default, no extra configuration is needed.",
      }
    ]
  },
  faq: {
    fr: [
      {
        q: 'StreamPulse fonctionne-t-il avec Kick ?',
        a: "Oui. StreamPulse prend en charge Kick avec les notifications live, le suivi des streamers, les filtres de chat et le suivi du temps de visionnage.",
      },
      {
        q: 'StreamPulse envoie-t-il des notifications Kick ?',
        a: "Oui. Dès qu'un streamer suivi passe en direct sur Kick, StreamPulse envoie une notification desktop en temps réel.",
      },
      {
        q: 'StreamPulse récupère-t-il les récompenses Kick ?',
        a: "Oui. StreamPulse détecte et réclame automatiquement les récompenses de chaîne Kick lorsqu'elles sont disponibles.",
      }
    ],
    en: [
      {
        q: 'Does StreamPulse work with Kick?',
        a: "Yes. StreamPulse supports Kick with live notifications, streamer tracking, chat filters, and watch time tracking.",
      },
      {
        q: 'Does StreamPulse send Kick notifications?',
        a: "Yes. As soon as a followed streamer goes live on Kick, StreamPulse sends a real-time desktop notification.",
      },
      {
        q: 'Does StreamPulse auto-claim Kick rewards?',
        a: "Yes. StreamPulse detects and automatically claims Kick channel rewards when they are available.",
      }
    ],
  },
  related: ['extensionTwitch', 'kick', 'dashboard'],
};
