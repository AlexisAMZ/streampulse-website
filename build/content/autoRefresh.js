'use strict';

module.exports = {
  key: 'autoRefresh',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT5M',
  slug: {
    fr: 'twitch-auto-refresh',
  },
  linkLabel: {
    fr: 'Auto-Refresh Twitch',
  },
  title: {
    fr: 'Auto-Refresh Twitch : Relancer le lecteur automatiquement',
  },
  h1: {
    fr: 'Comment recharger automatiquement le lecteur Twitch après une erreur',
  },
  description: {
    fr: "Ne ratez plus aucun moment de vos streams favoris. Découvrez comment recharger le lecteur Twitch automatiquement après l'erreur 2000 ou un écran noir.",
  },
  intro: {
    fr: "Rien n'est plus frustrant que de laisser un stream Twitch en fond sonore et de s'apercevoir 30 minutes plus tard que le lecteur a crashé (Erreur 2000, 3000 ou écran noir). Voici comment automatiser le rechargement du lecteur vidéo pour ne plus jamais subir d'interruption.",
  },
  sections: {
    fr: [
      {
        id: 'probleme',
        h2: 'Pourquoi le lecteur s\'arrête-t-il ?',
        answer: "Vous laissez un stream en fond et soudainement, le son se coupe. En revenant sur l'onglet, vous voyez un écran noir avec un bouton \"Cliquez ici pour relancer\" ou un message \"Network Error (#2000)\". Ce comportement survient pour plusieurs raisons :",
        list: [
          "<strong>Changement de qualité :</strong> Twitch essaie d'adapter la résolution à votre connexion, ce qui provoque parfois un bug du lecteur HTML5.",
          "<strong>Micro-coupures WiFi :</strong> La perte du paquet réseau fige le flux en direct."
        ]
      },
      {
        id: 'fonctionnement',
        h2: 'Comment fonctionne l\'Auto-Refresh de StreamPulse',
        answer: "StreamPulse surveille le lecteur en permanence. Dès qu'un code d'erreur apparaît à l'écran, il injecte une commande pour réinitialiser le lecteur vidéo instantanément.",
        body: [
          "Le grand avantage de cette méthode par rapport à un rafraîchissement classique (F5), c'est que <strong>seul le flux vidéo est redémarré</strong>. Le chat reste actif, vous ne perdez pas votre historique de messages et vous n'avez pas à recharger tous les scripts lourds de la page.",
          "C'est un incontournable des meilleures extensions Twitch pour ceux qui gardent plusieurs streams ouverts en même temps."
        ]
      },
      {
        id: 'activer',
        h2: 'L\'activer depuis les options',
        answer: "Une fois StreamPulse installé :",
        list: [
          "Ouvrez le tableau de bord de l'extension (l'icône dans votre barre Chrome).",
          "Allez dans les <strong>Paramètres</strong> (icône d'engrenage).",
          "Cochez la case <strong>Anti-Pause & Auto-rechargement</strong>."
        ]
      }
    ]
  },
  faq: {
    fr: []
  }
};
