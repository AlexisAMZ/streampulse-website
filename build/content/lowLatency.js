'use strict';

module.exports = {
  key: 'lowLatency',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT5M',
  slug: {
    fr: 'twitch-low-latency',
  },
  linkLabel: {
    fr: 'Latence Twitch',
  },
  title: {
    fr: 'Réduire le décalage sur Twitch (Latence) | StreamPulse',
  },
  h1: {
    fr: 'Comment réduire la latence sur Twitch et éviter le décalage',
  },
  description: {
    fr: "Découvrez comment réduire le décalage sur Twitch et pourquoi la latence augmente avec le temps. La solution pour rester synchronisé avec le chat.",
  },
  intro: {
    fr: "Vous avez l'impression d'avoir un décalage entre l'action du streamer et les réactions du chat ? Vous avez probablement un problème de latence sur Twitch. Voici pourquoi ce décalage apparaît et comment le résoudre pour de bon.",
  },
  sections: {
    fr: [
      {
        id: 'activer-low-latency',
        h2: 'Comment activer le mode Faible Latence sur Twitch',
        answer: "Pour activer le Low Latency, cliquez sur l'engrenage du lecteur vidéo, sélectionnez \"Avancé\", puis cochez l'option \"Mode Faible Latence\". La latence passera de ~12 secondes à 2 ou 3 secondes.",
        body: ["Le mode \"Low Latency\" (Faible Latence) de Twitch est une option qui permet aux spectateurs de voir le stream presque en temps réel. Sans cette option, il y a souvent un délai de 10 à 15 secondes entre ce que le streamer fait et ce que vous voyez, ce qui rend les interactions dans le chat difficiles."]
      },
      {
        id: 'pourquoi-decalage',
        h2: 'Pourquoi un décalage s\'installe-t-il progressivement ?',
        answer: "Même si vous avez activé le mode Faible Latence, vous remarquerez peut-être que le décalage s'agrandit au fil du temps (passant de 2 secondes à 10, 20 voire 30 secondes). Cela est souvent dû à :",
        list: [
          "<strong>Changement d'onglet :</strong> Les navigateurs comme Chrome et Edge ralentissent volontairement les vidéos qui ne sont pas affichées pour économiser de la RAM et de la batterie.",
          "<strong>Instabilités réseau :</strong> Une petite perte de connexion va mettre la vidéo en mémoire tampon (buffering). Le lecteur vidéo ne va pas sauter en avant pour rattraper son retard, créant un décalage permanent."
        ]
      },
      {
        id: 'solution-streampulse',
        h2: 'La solution : l\'Anti-Pause avec StreamPulse',
        answer: "StreamPulse intègre une fonctionnalité d'Anti-Pause et de synchronisation du lecteur. Elle empêche le navigateur de ralentir la vidéo lorsque vous changez d'onglet.",
        body: [
          "Si vous utilisez les meilleures extensions Twitch, vous savez que StreamPulse est reconnu pour son optimisation du lecteur. L'extension force le maintien de la faible latence, même lorsque le stream tourne en arrière-plan pendant que vous naviguez sur une autre page.",
          "Cela vous assure d'être toujours synchronisé avec le chat et le streamer, sans devoir recharger la page manuellement."
        ]
      }
    ]
  },
  faq: {
    fr: [
      {
        q: "Qu'est-ce que le mode faible latence sur Twitch ?",
        a: "Le mode faible latence réduit le décalage entre l'action en direct et ce que vous voyez à l'écran, passant d'environ 10 secondes à 2 ou 3 secondes."
      },
      {
        q: "Comment activer la faible latence ?",
        a: "Cliquez sur l'icône des paramètres (engrenage) du lecteur Twitch, allez dans \"Options avancées\" et cochez \"Mode Faible Latence\"."
      },
      {
        q: "Pourquoi ma latence augmente-t-elle quand je change d'onglet ?",
        a: "Les navigateurs mettent souvent en pause ou ralentissent les vidéos en arrière-plan pour économiser des ressources. Utilisez StreamPulse pour empêcher cela grâce à sa fonction Anti-Pause."
      }
    ]
  }
};
