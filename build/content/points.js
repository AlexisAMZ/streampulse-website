'use strict';

/**
 * pages/points.js — "points de chaîne automatiques".
 *
 * Intention ciblée : requête transactionnelle à fort volume
 * ("auto claim channel points", "points de chaine automatique twitch").
 * C'est la fonctionnalité la plus recherchée du produit.
 */

module.exports = {
  key: 'points',
  type: 'howto',
  published: '2026-08-09',
  modified: '2026-08-09',
  totalTime: 'PT2M',
  slug: {
    fr: 'points-de-chaine-automatiques-twitch',
    en: 'auto-claim-twitch-channel-points',
  },
  linkLabel: {
    fr: 'Points de chaîne automatiques sur Twitch',
    en: 'Auto-claim Twitch channel points',
  },
  title: {
    fr: 'Points de chaîne automatiques Twitch | StreamPulse',
    en: 'Auto-Claim Twitch Channel Points | StreamPulse',
  },
  h1: {
    fr: 'Récupérer ses points de chaîne Twitch automatiquement',
    en: 'How to auto-claim your Twitch channel points',
  },
  description: {
    fr: "Comment récupérer automatiquement vos points de chaîne Twitch, même onglet fermé : installation en 3 étapes, réglages et questions fréquentes.",
    en: 'How to automatically collect your Twitch channel points, even with the tab closed. Three-step setup, settings explained, and answers to common questions.',
  },
  intro: {
    fr: "Les points de chaîne Twitch se gagnent en regardant un live, mais le bonus toutes les 15 minutes exige un clic manuel sur un coffre qui disparaît au bout de quelques minutes. Cette page explique comment automatiser cette récupération avec StreamPulse, ce que l'extension fait exactement, et quelles sont les limites à connaître.",
    en: 'Twitch channel points accrue while you watch a live, but the bonus chest that appears every 15 minutes requires a manual click and vanishes after a few minutes. This page explains how to automate that with StreamPulse, what the extension actually does, and the limits worth knowing.',
  },
  howToSteps: {
    fr: [
      {
        name: "Installer l'extension",
        text: "Ouvrez la fiche StreamPulse sur le Chrome Web Store et cliquez sur « Ajouter à Chrome ». L'extension fonctionne sur Chrome, Brave, Edge et Opera.",
      },
      {
        name: 'Activer la récupération automatique',
        text: "Ouvrez StreamPulse depuis la barre d'outils, puis activez le module « Points de chaîne » dans les réglages. Il est actif par défaut.",
      },
      {
        name: 'Ajouter vos streamers',
        text: 'Connectez votre compte Twitch pour importer vos abonnements, ou ajoutez les chaînes manuellement. La collecte démarre immédiatement.',
      },
    ],
    en: [
      {
        name: 'Install the extension',
        text: 'Open the StreamPulse listing on the Chrome Web Store and click "Add to Chrome". It works on Chrome, Brave, Edge and Opera.',
      },
      {
        name: 'Enable automatic collection',
        text: 'Open StreamPulse from the toolbar, then enable the "Channel points" module in settings. It is on by default.',
      },
      {
        name: 'Add your streamers',
        text: 'Connect your Twitch account to import your subscriptions, or add channels manually. Collection starts right away.',
      },
    ],
  },
  sections: {
    fr: [
      {
        id: 'fonctionnement',
        h2: 'Comment fonctionne la récupération automatique des points ?',
        answer:
          "StreamPulse surveille en arrière-plan les chaînes que vous suivez et clique sur le coffre de points bonus dès qu'il apparaît, sans que vous ayez à garder un onglet Twitch ouvert. La collecte se poursuit tant que le navigateur est lancé.",
        body: [
          "Twitch attribue des points de chaîne passivement pendant le visionnage, plus un bonus ponctuel matérialisé par une icône de coffre. Ce bonus représente une part significative du total sur une session longue, mais il expire s'il n'est pas réclamé.",
          "L'extension détecte l'apparition de ce coffre et déclenche la réclamation. Le compteur intégré affiche le cumul récupéré, ce qui permet de vérifier que le module fonctionne réellement.",
        ],
      },
      {
        id: 'installation',
        h2: 'Comment activer les points automatiques en 3 étapes ?',
        answer:
          "L'installation prend environ deux minutes : ajoutez l'extension depuis le Chrome Web Store, vérifiez que le module « Points de chaîne » est activé, puis importez vos chaînes suivies.",
        steps: [
          {
            name: "Installez l'extension.",
            text: "Depuis le Chrome Web Store, en un clic. Aucun compte StreamPulse n'est requis.",
          },
          {
            name: 'Activez le module.',
            text: "Le module « Points de chaîne » est actif par défaut ; vous pouvez le désactiver chaîne par chaîne.",
          },
          {
            name: 'Importez vos streamers.',
            text: 'Synchronisation Twitch en un clic, ou ajout manuel pour Kick.',
          },
        ],
      },
      {
        id: 'onglet-ferme',
        h2: 'Les points sont-ils récupérés onglet fermé ?',
        answer:
          "Oui. StreamPulse fonctionne depuis le service worker de l'extension, indépendamment de vos onglets. Vous n'avez pas besoin de laisser un onglet Twitch ouvert, mais le navigateur doit rester lancé.",
        body: [
          "C'est la différence principale avec les scripts utilisateur classiques, qui nécessitent un onglet actif et cessent de fonctionner dès sa fermeture.",
        ],
      },
      {
        id: 'securite',
        h2: 'Est-ce risqué pour mon compte Twitch ?',
        answer:
          "StreamPulse reproduit une action que vous feriez manuellement : cliquer sur un bonus affiché à l'écran. L'extension ne demande jamais votre mot de passe et ne stocke aucune donnée sur un serveur externe.",
        body: [
          "Toutes vos préférences restent dans le stockage local du navigateur. Aucune donnée personnelle n'est transmise à des tiers, comme détaillé dans la politique de confidentialité.",
          "Cela dit, l'automatisation de l'interaction relève d'une zone grise vis-à-vis des conditions d'utilisation de Twitch. À notre connaissance aucune sanction n'a visé ce type d'usage, mais le risque n'est pas formellement nul et cette page ne constitue pas une garantie.",
        ],
      },
      {
        id: 'performances',
        h2: "L'extension consomme-t-elle beaucoup de ressources ?",
        answer:
          "Non. L'architecture repose sur un cache et du debouncing pour limiter les vérifications réseau. L'empreinte mémoire reste marginale comparée à un onglet Twitch laissé ouvert en permanence.",
        list: [
          'Aucune lecture vidéo maintenue en arrière-plan pour collecter les points.',
          'Vérifications espacées plutôt que sondage continu.',
          'Chaque module peut être désactivé individuellement.',
        ],
      },
    ],
    en: [
      {
        id: 'how-it-works',
        h2: 'How does automatic channel point collection work?',
        answer:
          'StreamPulse watches your followed channels in the background and clicks the bonus chest as soon as it appears, without requiring an open Twitch tab. Collection continues as long as your browser is running.',
        body: [
          'Twitch grants channel points passively while you watch, plus a periodic bonus shown as a chest icon. That bonus is a meaningful share of your total over a long session, but it expires if left unclaimed.',
          'The extension detects the chest and triggers the claim. A built-in counter shows how many points were collected, so you can confirm the module is genuinely working.',
        ],
      },
      {
        id: 'setup',
        h2: 'How do you enable auto-claim in three steps?',
        answer:
          'Setup takes about two minutes: add the extension from the Chrome Web Store, confirm the "Channel points" module is enabled, then import the channels you follow.',
        steps: [
          {
            name: 'Install the extension.',
            text: 'One click from the Chrome Web Store. No StreamPulse account required.',
          },
          {
            name: 'Enable the module.',
            text: 'The "Channel points" module is on by default; you can disable it per channel.',
          },
          {
            name: 'Import your streamers.',
            text: 'One-click Twitch sync, or add Kick channels manually.',
          },
        ],
      },
      {
        id: 'tab-closed',
        h2: 'Are points claimed with the tab closed?',
        answer:
          "Yes. StreamPulse runs from the extension's service worker, independently of your tabs. You don't need an open Twitch tab, though the browser itself must be running.",
        body: [
          'This is the main difference from classic userscripts, which require an active tab and stop working the moment it is closed.',
        ],
      },
      {
        id: 'safety',
        h2: 'Is it risky for my Twitch account?',
        answer:
          'StreamPulse reproduces an action you would perform yourself: clicking a bonus displayed on screen. The extension never asks for your password and stores nothing on an external server.',
        body: [
          'All preferences stay in your browser local storage. No personal data is shared with third parties, as detailed in the privacy policy.',
          "That said, automating the interaction sits in a grey area with respect to Twitch's terms of service. We are not aware of enforcement against this kind of usage, but the risk is not formally zero and this page is not a guarantee.",
        ],
      },
      {
        id: 'performance',
        h2: 'Is the extension resource-heavy?',
        answer:
          'No. The architecture relies on caching and debouncing to limit network checks. Its memory footprint stays marginal compared with keeping a Twitch tab permanently open.',
        list: [
          'No background video playback is kept alive to collect points.',
          'Spaced-out checks rather than continuous polling.',
          'Every module can be switched off individually.',
        ],
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'Faut-il laisser le navigateur ouvert ?',
        a: "Oui. L'extension s'exécute dans le navigateur : si celui-ci est complètement fermé, la collecte est suspendue puis reprend au redémarrage.",
      },
      {
        q: 'La récupération fonctionne-t-elle sur Kick ?',
        a: "Kick n'a pas de système de points de chaîne équivalent. StreamPulse y gère le suivi des lives et les notifications.",
      },
      {
        q: 'Puis-je exclure certaines chaînes ?',
        a: 'Oui, la collecte peut être activée ou désactivée chaîne par chaîne depuis le tableau de bord.',
      },
      {
        q: 'StreamPulse est-il payant ?',
        a: 'Non. Toutes les fonctionnalités sont gratuites, sans publicité ni abonnement.',
      },
    ],
    en: [
      {
        q: 'Do I need to keep the browser open?',
        a: 'Yes. The extension runs inside your browser: if it is fully closed, collection pauses and resumes on restart.',
      },
      {
        q: 'Does auto-claim work on Kick?',
        a: 'Kick has no equivalent channel points system. On Kick, StreamPulse handles live tracking and notifications.',
      },
      {
        q: 'Can I exclude specific channels?',
        a: 'Yes, collection can be toggled per channel from the dashboard.',
      },
      {
        q: 'Is StreamPulse paid?',
        a: 'No. Every feature is free, with no ads and no subscription.',
      },
    ],
  },
  related: ['drops', 'error2000', 'notifications'],
};
