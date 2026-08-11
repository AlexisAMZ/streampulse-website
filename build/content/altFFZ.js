'use strict';

module.exports = {
  key: 'altFFZ',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT5M',
  slug: {
    fr: 'alternatives/frankerfacez',
  },
  linkLabel: {
    fr: 'Alternative FrankerFaceZ',
  },
  title: {
    fr: 'StreamPulse vs FrankerFaceZ (FFZ) : Quelle extension choisir ?',
  },
  h1: {
    fr: 'StreamPulse vs FrankerFaceZ (FFZ) : Quelle extension choisir ?',
  },
  description: {
    fr: "Comparatif entre FrankerFaceZ (FFZ) et StreamPulse. Comprenez pourquoi ces extensions Twitch sont totalement complémentaires.",
  },
  intro: {
    fr: "FrankerFaceZ (FFZ) est une extension historique qui permet de personnaliser l'apparence de Twitch dans les moindres détails. Faut-il la remplacer par StreamPulse ? La réponse courte est non. Ces deux extensions sont complémentaires et conçues pour des besoins totalement différents.",
  },
  sections: {
    fr: [
      {
        id: 'comparatif',
        h2: 'Le comparatif rapide',
        table: {
          head: ['Fonctionnalité', 'FrankerFaceZ', 'StreamPulse'],
          rows: [
            ['Emotes personnalisées', 'Oui', 'Non'],
            ['Personnalisation extrême de l\'interface (CSS)', 'Oui', 'Non'],
            ['Points de chaîne automatiques', 'Non', 'Oui'],
            ['Twitch Drops automatiques', 'Non', 'Oui'],
            ['Notifications de live (Bureau)', 'Non', 'Oui'],
            ['Compatibilité Kick', 'Non', 'Oui']
          ]
        }
      },
      {
        id: 'ffz',
        h2: 'La force de FrankerFaceZ : la Personnalisation',
        body: [
          "Le grand point fort de FFZ est la modification de l'interface utilisateur. Vous pouvez changer les couleurs, déplacer le chat, masquer les badges, ou encore utiliser un lecteur vidéo allégé. Elle permet aussi de voir des emotes tierces."
        ]
      },
      {
        id: 'streampulse',
        h2: 'La force de StreamPulse : l\'Automatisation',
        body: [
          "Contrairement à FFZ qui ne gère aucune automatisation, StreamPulse s'occupe de réclamer vos points de chaîne, vos Twitch Drops, et surveille les chaînes pour vous envoyer des notifications de live. Elle gère également Kick.com, ce que FFZ ne fait pas."
        ]
      },
      {
        id: 'ensemble',
        h2: 'Peut-on les utiliser ensemble ?',
        answer: "Oui, sans aucun problème. Les deux extensions ont un périmètre d'action distinct.",
        body: [
          "Utilisez FrankerFaceZ pour rendre votre Twitch unique visuellement, et ajoutez StreamPulse pour la partie automatisation et alertes. Elles cohabitent parfaitement dans le même navigateur."
        ]
      }
    ]
  },
  faq: {
    fr: []
  }
};
