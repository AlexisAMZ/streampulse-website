'use strict';

/**
 * pages/alternatives.js — comparatif extensions Twitch.
 *
 * Intention commerciale haute ("betterttv alternative", "frankerfacez vs").
 * Parti pris rédactionnel : le comparatif reste factuel et reconnaît
 * explicitement les cas où un concurrent est plus adapté. Un comparatif
 * malhonnête se fait déclasser et détruit la confiance.
 */

module.exports = {
  key: 'alternatives',
  type: 'article',
  published: '2026-08-09',
  modified: '2026-08-09',
  slug: {
    fr: 'meilleures-extensions-twitch',
    en: 'best-twitch-extensions',
  },
  linkLabel: {
    fr: 'Comparatif des extensions Twitch',
    en: 'Twitch extensions compared',
  },
  title: {
    fr: 'Meilleures extensions Twitch 2026 | StreamPulse',
    en: 'Best Twitch Extensions in 2026: Compared | StreamPulse',
  },
  h1: {
    fr: 'Meilleures extensions Twitch en 2026 : à quoi sert chacune',
    en: 'Best Twitch extensions in 2026: what each one is for',
  },
  description: {
    fr: 'Comparatif honnête de BetterTTV, FrankerFaceZ, 7TV et StreamPulse : ce que chaque extension fait réellement, et laquelle choisir selon votre usage.',
    en: 'An honest comparison of BetterTTV, FrankerFaceZ, 7TV and StreamPulse: what each extension actually does, and which to pick for your use case.',
  },
  intro: {
    fr: "Les extensions Twitch les plus connues ne répondent pas au même besoin. BetterTTV, FrankerFaceZ et 7TV se concentrent sur les emotes et le chat ; StreamPulse traite l'automatisation et le suivi des lives. Elles sont complémentaires plus que concurrentes, et il est courant d'en utiliser deux ensemble.",
    en: 'The best-known Twitch extensions do not solve the same problem. BetterTTV, FrankerFaceZ and 7TV focus on emotes and chat; StreamPulse handles automation and live tracking. They are complementary rather than competing, and running two together is common.',
  },
  sections: {
    fr: [
      {
        id: 'comparatif',
        h2: 'Quelle extension Twitch choisir ?',
        answer:
          "Pour les emotes et la personnalisation du chat, BetterTTV, FrankerFaceZ et 7TV sont les références. Pour les notifications de live, la récupération automatique des points de chaîne et des Drops, StreamPulse couvre un besoin que ces trois extensions ne traitent pas.",
        table: {
          head: ['Besoin', 'Extension adaptée'],
          rows: [
            ['Emotes personnalisées', 'BetterTTV, 7TV, FrankerFaceZ'],
            ['Personnalisation du chat', 'BetterTTV, FrankerFaceZ'],
            ['Notifications de live fiables', 'StreamPulse'],
            ['Points de chaîne automatiques', 'StreamPulse'],
            ['Twitch Drops automatiques', 'StreamPulse'],
            ['Suivi Twitch + Kick', 'StreamPulse'],
            ['Rechargement auto du lecteur', 'StreamPulse'],
          ],
        },
      },
      {
        id: 'betterttv',
        h2: 'BetterTTV : à qui s’adresse-t-il ?',
        answer:
          "BetterTTV est l'extension la plus installée de l'écosystème Twitch. Elle ajoute des emotes communautaires, des outils de chat et des options d'interface. C'est le meilleur choix si votre priorité est le chat et les emotes.",
        body: [
          "Elle ne gère en revanche ni la récupération automatique des points de chaîne, ni les Drops, ni le suivi multi-plateforme.",
        ],
      },
      {
        id: 'frankerfacez',
        h2: 'FrankerFaceZ : quelles spécificités ?',
        answer:
          "FrankerFaceZ mise sur la personnalisation poussée de l'interface et propose des réglages très granulaires. Elle convient aux utilisateurs qui veulent contrôler finement l'apparence de Twitch.",
        body: [
          "Son périmètre reste centré sur l'affichage et le chat, sans automatisation des récompenses.",
        ],
      },
      {
        id: 'seventv',
        h2: '7TV : quel intérêt ?',
        answer:
          "7TV est la plus récente des trois et met l'accent sur des emotes animées de meilleure qualité et une interface moderne. C'est une alternative directe à BetterTTV sur le terrain des emotes.",
      },
      {
        id: 'streampulse',
        h2: 'Où se situe StreamPulse ?',
        answer:
          "StreamPulse traite l'automatisation plutôt que l'apparence : notifications de live rapides, points de chaîne et Drops réclamés en arrière-plan, rechargement du lecteur sur erreur, et suivi conjoint de Twitch et Kick.",
        body: [
          "Si vous cherchez des emotes, StreamPulse n'est pas le bon outil et une des trois extensions ci-dessus répondra mieux à votre besoin.",
          "Si vous perdez des points de chaîne, ratez des débuts de live ou rechargez le lecteur plusieurs fois par soirée, c'est précisément le périmètre couvert.",
        ],
      },
      {
        id: 'cumul',
        h2: 'Peut-on installer plusieurs extensions Twitch ?',
        answer:
          "Oui, et c'est l'usage le plus courant : une extension d'emotes combinée à StreamPulse pour l'automatisation. Cumuler plusieurs extensions qui modifient le lecteur peut en revanche provoquer des erreurs de lecture.",
      },
    ],
    en: [
      {
        id: 'comparison',
        h2: 'Which Twitch extension should you choose?',
        answer:
          'For emotes and chat customisation, BetterTTV, FrankerFaceZ and 7TV are the references. For live notifications, automatic channel points and Drops claiming, StreamPulse covers a need those three do not address.',
        table: {
          head: ['Need', 'Best fit'],
          rows: [
            ['Custom emotes', 'BetterTTV, 7TV, FrankerFaceZ'],
            ['Chat customisation', 'BetterTTV, FrankerFaceZ'],
            ['Reliable live notifications', 'StreamPulse'],
            ['Automatic channel points', 'StreamPulse'],
            ['Automatic Twitch Drops', 'StreamPulse'],
            ['Twitch + Kick tracking', 'StreamPulse'],
            ['Auto player reload', 'StreamPulse'],
          ],
        },
      },
      {
        id: 'betterttv',
        h2: 'BetterTTV: who is it for?',
        answer:
          'BetterTTV is the most installed extension in the Twitch ecosystem. It adds community emotes, chat tools and interface options. It is the best pick if chat and emotes are your priority.',
        body: [
          'It does not, however, handle automatic channel points collection, Drops, or multi-platform tracking.',
        ],
      },
      {
        id: 'frankerfacez',
        h2: 'FrankerFaceZ: what makes it different?',
        answer:
          'FrankerFaceZ focuses on deep interface customisation with very granular settings. It suits users who want fine-grained control over how Twitch looks.',
        body: [
          'Its scope stays centred on display and chat, without reward automation.',
        ],
      },
      {
        id: 'seventv',
        h2: '7TV: what is the appeal?',
        answer:
          '7TV is the newest of the three and emphasises higher-quality animated emotes and a modern interface. It is a direct alternative to BetterTTV on emotes.',
      },
      {
        id: 'streampulse',
        h2: 'Where does StreamPulse fit?',
        answer:
          'StreamPulse handles automation rather than appearance: fast live notifications, channel points and Drops claimed in the background, player reloading on error, and joint Twitch and Kick tracking.',
        body: [
          'If you are looking for emotes, StreamPulse is the wrong tool and one of the three extensions above will serve you better.',
          'If you lose channel points, miss the start of streams, or reload the player several times an evening, that is exactly the scope it covers.',
        ],
      },
      {
        id: 'stacking',
        h2: 'Can you install several Twitch extensions?',
        answer:
          'Yes, and it is the most common setup: an emote extension alongside StreamPulse for automation. Stacking multiple extensions that modify the player can however cause playback errors.',
      },
    ],
  },
  faq: {
    fr: [
      {
        q: 'StreamPulse remplace-t-il BetterTTV ?',
        a: "Non, les deux répondent à des besoins différents et fonctionnent ensemble.",
      },
      {
        q: 'Ces extensions sont-elles gratuites ?',
        a: 'BetterTTV, FrankerFaceZ, 7TV et StreamPulse sont gratuites.',
      },
      {
        q: 'Trop d’extensions ralentissent-elles Twitch ?',
        a: "Oui, chacune consomme des ressources. Mieux vaut ne garder que celles réellement utilisées.",
      },
    ],
    en: [
      {
        q: 'Does StreamPulse replace BetterTTV?',
        a: 'No, the two address different needs and work together.',
      },
      {
        q: 'Are these extensions free?',
        a: 'BetterTTV, FrankerFaceZ, 7TV and StreamPulse are all free.',
      },
      {
        q: 'Do too many extensions slow Twitch down?',
        a: 'Yes, each consumes resources. Keep only the ones you actually use.',
      },
    ],
  },
  related: ['points', 'chat', 'kick'],
};
