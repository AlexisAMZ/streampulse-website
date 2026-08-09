'use strict';

/**
 * pages/drops.js — "Twitch Drops automatiques".
 * Intention : requête informationnelle + transactionnelle sur une
 * fonctionnalité recherchée par les joueurs pendant les campagnes.
 */

module.exports = {
  key: 'drops',
  type: 'howto',
  published: '2026-08-09',
  modified: '2026-08-09',
  totalTime: 'PT2M',
  slug: {
    fr: 'twitch-drops-automatique',
    en: 'twitch-drops-auto-claim',
  },
  linkLabel: {
    fr: 'Réclamer les Twitch Drops automatiquement',
    en: 'Claim Twitch Drops automatically',
  },
  title: {
    fr: 'Twitch Drops automatiques | StreamPulse',
    en: 'Twitch Drops Auto-Claim | StreamPulse',
  },
  h1: {
    fr: 'Réclamer ses Twitch Drops automatiquement',
    en: 'Claim your Twitch Drops automatically',
  },
  description: {
    fr: 'Comment fonctionnent les Twitch Drops, pourquoi les récompenses expirent, et comment automatiser leur réclamation ainsi que celle des badges Moments.',
    en: 'How Twitch Drops work, why rewards expire unclaimed, and how to automate claiming them along with Moments badges.',
  },
  intro: {
    fr: "Les Twitch Drops récompensent le temps de visionnage sur un jeu par des objets in-game, mais la récompense n'est acquise qu'après une réclamation manuelle dans l'inventaire. Beaucoup de joueurs cumulent le temps requis puis oublient cette dernière étape. Voici comment le processus fonctionne et comment l'automatiser.",
    en: 'Twitch Drops reward watch time on a game with in-game items, but the reward is only granted after a manual claim in your inventory. Plenty of viewers accumulate the required time and then forget that final step. Here is how the process works and how to automate it.',
  },
  howToSteps: {
    fr: [
      {
        name: 'Lier son compte au jeu',
        text: "Depuis les paramètres Twitch, section Connexions, associez votre compte à l'éditeur du jeu concerné. Sans cette liaison, aucun Drop ne peut être attribué.",
      },
      {
        name: 'Regarder une chaîne éligible',
        text: 'Sélectionnez un live affichant la mention « Drops activés » sur la catégorie du jeu participant.',
      },
      {
        name: 'Activer la réclamation automatique',
        text: 'Installez StreamPulse et activez le module Drops : les récompenses disponibles seront réclamées sans intervention.',
      },
    ],
    en: [
      {
        name: 'Link your account to the game',
        text: 'In Twitch settings, under Connections, link your account to the relevant game publisher. Without that link no Drop can be granted.',
      },
      {
        name: 'Watch an eligible channel',
        text: 'Pick a stream showing the "Drops enabled" tag in the participating game category.',
      },
      {
        name: 'Enable automatic claiming',
        text: 'Install StreamPulse and turn on the Drops module: available rewards get claimed without your input.',
      },
    ],
  },
  sections: {
    fr: [
      {
        id: 'fonctionnement',
        h2: 'Comment fonctionnent les Twitch Drops ?',
        answer:
          "Un Drop s'obtient en cumulant un temps de visionnage défini sur une chaîne diffusant un jeu participant, compte Twitch lié à l'éditeur. La progression est automatique, mais la récompense doit ensuite être réclamée manuellement dans l'inventaire.",
        body: [
          "Cette étape finale explique la plupart des Drops perdus : le temps est validé, la récompense apparaît, puis la campagne se termine avant que le joueur ne pense à cliquer.",
        ],
      },
      {
        id: 'automatiser',
        h2: 'Comment automatiser la réclamation des Drops ?',
        answer:
          'StreamPulse détecte les campagnes actives et les récompenses disponibles, puis effectue la réclamation en arrière-plan. Un journal consultable dans l’extension recense ce qui a été récupéré et quand.',
        list: [
          'Réclamation des Drops dès que la progression atteint 100 %.',
          'Prise en charge des badges Moments sur le même principe.',
          'Historique horodaté pour vérifier ce qui a été récupéré.',
        ],
      },
      {
        id: 'liaison-compte',
        h2: 'Pourquoi mes Drops ne se débloquent-ils pas ?',
        answer:
          "La cause la plus fréquente est un compte non lié à l'éditeur du jeu. Vient ensuite le visionnage d'une chaîne sans la mention « Drops activés », puis une campagne déjà terminée.",
        list: [
          'Compte Twitch non lié à l’éditeur : aucune progression enregistrée.',
          'Chaîne sans Drops activés, même sur le bon jeu.',
          'Campagne expirée : la progression ne compte plus.',
          'Récompense obtenue mais jamais réclamée dans l’inventaire.',
        ],
      },
      {
        id: 'moments',
        h2: 'Qu’est-ce que les badges Moments ?',
        answer:
          "Les Moments sont des badges commémoratifs qu'un streamer déclenche pendant un live pour marquer un événement. Ils sont indépendants des Drops mais reposent aussi sur une réclamation manuelle limitée dans le temps.",
      },
    ],
    en: [
      {
        id: 'how-it-works',
        h2: 'How do Twitch Drops work?',
        answer:
          'A Drop is earned by accumulating a set amount of watch time on a channel streaming a participating game, with your Twitch account linked to the publisher. Progress is automatic, but the reward must then be claimed manually in your inventory.',
        body: [
          'That final step explains most lost Drops: the time is credited, the reward appears, then the campaign ends before the viewer remembers to click.',
        ],
      },
      {
        id: 'automate',
        h2: 'How do you automate Drop claiming?',
        answer:
          'StreamPulse detects active campaigns and available rewards, then performs the claim in the background. A log inside the extension records what was collected and when.',
        list: [
          'Claims Drops as soon as progress reaches 100%.',
          'Handles Moments badges on the same principle.',
          'Timestamped history so you can verify what was collected.',
        ],
      },
      {
        id: 'account-link',
        h2: 'Why are my Drops not unlocking?',
        answer:
          'The most frequent cause is an account not linked to the game publisher. Next comes watching a channel without the "Drops enabled" tag, then a campaign that has already ended.',
        list: [
          'Twitch account not linked to the publisher: no progress recorded.',
          'Channel without Drops enabled, even on the right game.',
          'Expired campaign: progress no longer counts.',
          'Reward earned but never claimed in the inventory.',
        ],
      },
      {
        id: 'moments',
        h2: 'What are Moments badges?',
        answer:
          'Moments are commemorative badges a streamer triggers during a live to mark an event. They are separate from Drops but also rely on a manual, time-limited claim.',
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'Les Drops fonctionnent-ils si le live est en muet ?',
        a: 'Oui, le temps de visionnage est comptabilisé indépendamment du volume audio.',
      },
      {
        q: 'Puis-je cumuler des Drops sur plusieurs chaînes ?',
        a: "En général la progression est liée à la campagne et non à une chaîne précise, mais chaque éditeur fixe ses propres règles.",
      },
      {
        q: 'Kick propose-t-il un équivalent des Drops ?',
        a: "Non, il n'existe pas de système comparable sur Kick à ce jour.",
      },
    ],
    en: [
      {
        q: 'Do Drops work if the stream is muted?',
        a: 'Yes, watch time is counted regardless of audio volume.',
      },
      {
        q: 'Can I accumulate Drops across several channels?',
        a: 'Progress is usually tied to the campaign rather than one specific channel, but each publisher sets its own rules.',
      },
      {
        q: 'Does Kick offer an equivalent to Drops?',
        a: 'No, there is no comparable system on Kick today.',
      },
    ],
  },
  related: ['points', 'notifications', 'error2000'],
};
