'use strict';

module.exports = {
  key: 'altBetterTTV',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT5M',
  slug: {
    fr: 'alternatives/betterttv',
  },
  linkLabel: {
    fr: 'Alternative BetterTTV',
  },
  title: {
    fr: 'StreamPulse vs BetterTTV : Quelle extension choisir ?',
  },
  h1: {
    fr: 'StreamPulse vs BetterTTV : Quelle extension choisir ?',
  },
  description: {
    fr: "Découvrez la différence entre BetterTTV (BTTV) et StreamPulse. Faut-il choisir l'une plutôt que l'autre ? Peut-on utiliser les deux ensemble ?",
  },
  intro: {
    fr: "BetterTTV (BTTV) est l'extension la plus populaire sur Twitch. Faut-il la remplacer par StreamPulse ? La réponse courte est non. Ces deux extensions sont conçues pour être utilisées ensemble, car elles ne font pas du tout la même chose.",
  },
  sections: {
    fr: [
      {
        id: 'comparatif',
        h2: 'Le comparatif rapide',
        table: {
          head: ['Fonctionnalité', 'BetterTTV', 'StreamPulse'],
          rows: [
            ['Emotes personnalisées', 'Oui (Kekw, MonkaS, etc.)', 'Non'],
            ['Personnalisation de l\'interface', 'Oui', 'Non'],
            ['Points de chaîne automatiques', 'Non (retiré récemment)', 'Oui'],
            ['Twitch Drops automatiques', 'Non', 'Oui'],
            ['Notifications de live (Bureau)', 'Non', 'Oui'],
            ['Compatibilité Kick', 'Non', 'Oui']
          ]
        }
      },
      {
        id: 'bttv',
        h2: 'La force de BetterTTV : les Emotes',
        body: [
          "Le cœur de BetterTTV, ce sont les emotes. L'extension permet d'afficher des images personnalisées dans le chat qui ne seraient normalement visibles que sous forme de texte. Elle permet également de cacher certains éléments de l'interface Twitch."
        ]
      },
      {
        id: 'streampulse',
        h2: 'La force de StreamPulse : l\'Automatisation',
        body: [
          "StreamPulse, de son côté, n'ajoute aucune emote. Son but est d'automatiser le visionnage : récupérer les points de chaîne et les Drops sans avoir à cliquer, vous alerter quand un streamer lance son live (via une notification bureau ou sonore) et corriger les plantages du lecteur (Erreur 2000)."
        ]
      },
      {
        id: 'ensemble',
        h2: 'Peut-on les utiliser ensemble ?',
        answer: "Absolument. C'est d'ailleurs la configuration recommandée par la plupart des utilisateurs expérimentés.",
        body: [
          "Gardez BetterTTV pour voir les emotes du chat, et installez StreamPulse pour gérer l'automatisation en arrière-plan. Les deux extensions sont légères et ne créent aucun conflit technique entre elles."
        ]
      }
    ]
  },
  faq: {
    fr: []
  }
};
