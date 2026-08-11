'use strict';

module.exports = {
  key: 'dashboard',
  type: 'howto',
  published: '2026-08-11',
  modified: '2026-08-11',
  totalTime: 'PT3M',
  slug: {
    fr: 'dashboard-twitch-kick',
    en: 'twitch-kick-dashboard',
  },
  linkLabel: {
    fr: 'Dashboard Twitch et Kick unifié',
    en: 'Unified Twitch and Kick dashboard',
  },
  title: {
    fr: 'Dashboard Twitch et Kick unifié | StreamPulse',
    en: 'Unified Twitch and Kick Dashboard | StreamPulse',
  },
  h1: {
    fr: 'Dashboard Twitch et Kick unifié',
    en: 'Unified Twitch and Kick dashboard',
  },
  description: {
    fr: "Le dashboard StreamPulse regroupe vos chaînes Twitch et Kick dans une seule interface. Statut en direct, notifications et suivi centralisé de vos streamers.",
    en: 'The StreamPulse dashboard brings your Twitch and Kick channels together in a single interface. Live status, notifications and centralized tracking for your streamers.',
  },
  intro: {
    fr: "Le pop-up StreamPulse centralise vos chaînes Twitch et Kick dans une seule interface. Voyez en un coup d'oeil qui est en direct, sur quelle plateforme et depuis combien de temps, sans ouvrir plusieurs onglets.",
    en: 'The StreamPulse pop-up centralizes your Twitch and Kick channels in a single interface. See at a glance who is live, on which platform, and for how long, without opening multiple tabs.',
  },
  sections: {
    fr: [
      {
        id: 'fonctionnement',
        h2: 'Comment fonctionne le dashboard ?',
        answer:
          "Le dashboard est le pop-up qui s'ouvre lorsque vous cliquez sur l'icône StreamPulse dans la barre d'extensions. Il interroge les API Twitch et Kick pour afficher le statut de toutes vos chaînes suivies en temps réel.",
        body: [
          "Aucune configuration n'est nécessaire : StreamPulse utilise directement vos sessions Twitch et Kick actives dans le navigateur. Dès l'installation, le dashboard affiche les chaînes que vous suivez.",
        ],
      },
      {
        id: 'informations',
        h2: 'Quelles informations sont affichées ?',
        answer:
          "Pour chaque chaîne en direct, le dashboard affiche le nom du streamer, la plateforme (Twitch ou Kick), le titre du stream, la catégorie, le nombre de spectateurs et la durée du live.",
        list: [
          '<strong>Nom et avatar du streamer</strong> avec un indicateur de plateforme (Twitch ou Kick).',
          '<strong>Titre du stream</strong> et catégorie en cours.',
          '<strong>Nombre de spectateurs</strong> en temps réel.',
          '<strong>Durée du live</strong> depuis le lancement.',
          '<strong>Accès en un clic</strong> pour ouvrir le stream dans un nouvel onglet.',
        ],
      },
      {
        id: 'twitch-kick',
        h2: 'Pourquoi un dashboard multi-plateforme ?',
        answer:
          "De plus en plus de streamers diffusent sur Twitch et Kick en parallèle. Avec le dashboard StreamPulse, vous n'avez plus besoin de vérifier chaque plateforme séparément : tout est centralisé dans une seule vue.",
      }
    ],
    en: [
      {
        id: 'how-it-works',
        h2: 'How does the dashboard work?',
        answer:
          "The dashboard is the pop-up that opens when you click the StreamPulse icon in the extension bar. It polls the Twitch and Kick APIs to display the real-time status of all your followed channels.",
        body: [
          "No configuration is required: StreamPulse directly uses your active Twitch and Kick sessions in the browser. Right after installation, the dashboard displays the channels you follow.",
        ],
      },
      {
        id: 'information',
        h2: 'What information is displayed?',
        answer:
          "For each live channel, the dashboard displays the streamer's name, the platform (Twitch or Kick), the stream title, the category, the viewer count, and the stream duration.",
        list: [
          '<strong>Streamer name and avatar</strong> with a platform indicator (Twitch or Kick).',
          '<strong>Stream title</strong> and current category.',
          '<strong>Viewer count</strong> in real-time.',
          '<strong>Live duration</strong> since the stream started.',
          '<strong>One-click access</strong> to open the stream in a new tab.',
        ],
      },
      {
        id: 'multi-platform',
        h2: 'Why a multi-platform dashboard?',
        answer:
          "More and more streamers are broadcasting on Twitch and Kick in parallel. With the StreamPulse dashboard, you no longer need to check each platform separately: everything is centralized in a single view.",
      }
    ]
  },
  faq: {
    fr: [
      {
        q: 'Le dashboard regroupe-t-il Twitch et Kick ?',
        a: "Oui. Le pop-up affiche toutes les chaînes suivies, Twitch et Kick confondues, avec leur statut en temps réel dans une seule interface.",
      },
      {
        q: 'Faut-il un compte pour utiliser le dashboard ?',
        a: "Non. StreamPulse utilise vos sessions Twitch et Kick actives dans le navigateur. Aucune création de compte StreamPulse n'est nécessaire.",
      }
    ],
    en: [
      {
        q: 'Does the dashboard combine Twitch and Kick?',
        a: "Yes. The pop-up displays all followed channels, both Twitch and Kick, with their real-time status in a single interface.",
      },
      {
        q: 'Do I need an account to use the dashboard?',
        a: "No. StreamPulse uses your active Twitch and Kick browser sessions. No StreamPulse account creation is required.",
      }
    ],
  },
  related: ['extensionTwitch', 'extensionKick', 'notifications'],
};
