'use strict';

/**
 * pages/chat.js — filtrage du chat Twitch.
 * Intention : requête de modération côté spectateur, angle peu traité
 * (la plupart des ressources visent les modérateurs, pas les viewers).
 */

module.exports = {
  key: 'chat',
  type: 'howto',
  published: '2026-08-09',
  modified: '2026-08-09',
  totalTime: 'PT3M',
  slug: {
    fr: 'filtrer-chat-twitch',
    en: 'filter-twitch-chat',
  },
  linkLabel: {
    fr: 'Filtrer le chat Twitch',
    en: 'Filter Twitch chat',
  },
  title: {
    fr: 'Filtrer le chat Twitch : spam et mots-clés | StreamPulse',
    en: 'Filter Twitch Chat: Hide Spam and Keywords | StreamPulse',
  },
  h1: {
    fr: 'Filtrer le chat Twitch côté spectateur',
    en: 'Filter Twitch chat as a viewer',
  },
  description: {
    fr: 'Comment masquer les messages indésirables, les mots-clés et certains utilisateurs dans le chat Twitch, sans être modérateur de la chaîne.',
    en: 'How to hide unwanted messages, keywords and specific users in Twitch chat, without being a channel moderator.',
  },
  intro: {
    fr: "Sur les grosses chaînes, le chat défile trop vite pour rester lisible, et les outils de modération natifs sont réservés aux modérateurs. Un spectateur peut malgré tout filtrer son propre affichage. Cette page détaille les options disponibles et leurs limites.",
    en: 'On large channels, chat scrolls too fast to stay readable, and native moderation tools are reserved for moderators. A viewer can still filter their own view. This page covers the available options and their limits.',
  },
  howToSteps: {
    fr: [
      {
        name: 'Ouvrir les réglages de filtrage',
        text: "Depuis l'extension StreamPulse, ouvrez la section Filtrage du chat.",
      },
      {
        name: 'Ajouter des mots-clés',
        text: 'Saisissez les termes à masquer : les messages correspondants disparaissent de votre affichage.',
      },
      {
        name: 'Masquer des utilisateurs',
        text: 'Ajoutez les pseudonymes dont vous ne voulez plus voir les messages.',
      },
    ],
    en: [
      {
        name: 'Open the filtering settings',
        text: 'In the StreamPulse extension, open the Chat filtering section.',
      },
      {
        name: 'Add keywords',
        text: 'Enter the terms to hide: matching messages disappear from your view.',
      },
      {
        name: 'Hide users',
        text: 'Add the usernames whose messages you no longer want to see.',
      },
    ],
  },
  sections: {
    fr: [
      {
        id: 'principe',
        h2: 'Peut-on filtrer le chat Twitch sans être modérateur ?',
        answer:
          "Oui. Le filtrage côté spectateur agit uniquement sur votre propre affichage : les messages sont masqués chez vous, sans être supprimés pour les autres et sans aucune action de modération sur la chaîne.",
        body: [
          "C'est une distinction importante : vous ne bloquez pas l'auteur, vous cessez simplement de voir ses messages dans votre navigateur.",
        ],
      },
      {
        id: 'options',
        h2: 'Que peut-on masquer exactement ?',
        answer:
          "Les messages contenant des mots-clés définis, les messages de certains utilisateurs, ainsi que des éléments d'interface encombrants comme les recommandations ou les encarts promotionnels.",
        list: [
          '<strong>Mots-clés.</strong> Spoilers, insultes, spam récurrent.',
          '<strong>Utilisateurs.</strong> Bots et comptes indésirables.',
          '<strong>Éléments d’interface.</strong> Encarts et suggestions superflus.',
        ],
      },
      {
        id: 'limites',
        h2: 'Quelles sont les limites du filtrage spectateur ?',
        answer:
          "Le filtrage s'applique après réception du message par votre navigateur : il ne réduit donc pas le trafic reçu et n'empêche pas les autres spectateurs de voir le contenu. Les variantes orthographiques contournent aussi les filtres par mots-clés.",
        body: [
          "Pour les cas graves (harcèlement, contenu illégal), le signalement à Twitch reste la seule réponse appropriée, le filtrage ne faisant que masquer le problème de votre côté.",
        ],
      },
    ],
    en: [
      {
        id: 'principle',
        h2: 'Can you filter Twitch chat without being a moderator?',
        answer:
          'Yes. Viewer-side filtering only affects your own view: messages are hidden for you, without being deleted for anyone else and without any moderation action on the channel.',
        body: [
          'That distinction matters: you are not blocking the author, you are simply no longer seeing their messages in your browser.',
        ],
      },
      {
        id: 'options',
        h2: 'What exactly can be hidden?',
        answer:
          'Messages containing keywords you define, messages from specific users, plus cluttering interface elements such as recommendations and promotional panels.',
        list: [
          '<strong>Keywords.</strong> Spoilers, insults, recurring spam.',
          '<strong>Users.</strong> Bots and unwanted accounts.',
          '<strong>Interface elements.</strong> Superfluous panels and suggestions.',
        ],
      },
      {
        id: 'limits',
        h2: 'What are the limits of viewer-side filtering?',
        answer:
          'Filtering applies after your browser receives the message, so it does not reduce incoming traffic and does not stop other viewers seeing the content. Spelling variants also bypass keyword filters.',
        body: [
          'For serious cases such as harassment or illegal content, reporting to Twitch remains the only appropriate response, since filtering merely hides the problem on your side.',
        ],
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'Le filtrage prévient-il l’utilisateur masqué ?',
        a: "Non, l'opération est entièrement locale et invisible pour les autres.",
      },
      {
        q: 'Les filtres sont-ils synchronisés entre appareils ?',
        a: "Non. Les réglages sont stockés localement dans chaque navigateur.",
      },
      {
        q: 'Le filtrage fonctionne-t-il sur Kick ?',
        a: 'Le filtrage du chat cible actuellement Twitch.',
      },
    ],
    en: [
      {
        q: 'Does filtering notify the hidden user?',
        a: 'No, the operation is entirely local and invisible to others.',
      },
      {
        q: 'Are filters synced across devices?',
        a: 'No. Settings are stored locally in each browser.',
      },
      {
        q: 'Does filtering work on Kick?',
        a: 'Chat filtering currently targets Twitch.',
      },
    ],
  },
  related: ['notifications', 'points', 'alternatives'],
};
