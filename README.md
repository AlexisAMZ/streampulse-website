<div align="center">
  <img src="images/logo.png" alt="StreamPulse Logo" width="120" />
  <h1>StreamPulse Landing Page</h1>
  <p>The official landing page for the StreamPulse Chrome Extension.</p>
  <a href="https://streampulse.fr">Live Website</a> •
  <a href="https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh">Chrome Web Store</a>
</div>

## 📥 Download
[**Download StreamPulse on the Chrome Web Store**](https://chromewebstore.google.com/detail/streampulse-multi-streame/ipfhbfabadbpkjimhdcjadopnahdpddh)

## 📌 Overview
This repository contains the source code for the [StreamPulse](https://streampulse.fr) landing page. StreamPulse is a unified browser extension that helps users master Twitch and Kick by providing real-time notifications, automatic channel points farming, and a clean interface.

## ✨ Tech Stack
- **HTML5 & CSS3**: Pure, semantic HTML with a custom, modern CSS architecture.
- **Firebase Hosting**: Fast, secure deployment using Google Firebase.
- **Vanilla JavaScript**: Lightweight interactions (Language toggle, intersection observers).
- **SEO Optimized**: Fully integrated with Open Graph tags, Twitter Cards, and Schema.org JSON-LD.

## 🚀 Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/AlexisAMZ/streampulse-website.git
   ```
2. Open `index.html` in your favorite browser to preview the French homepage.

## 🔧 Build steps
The translated homepages, the support pages, the content guides, `sitemap.xml`
and `llms.txt` are generated. Never edit `<locale>/index.html`,
`<locale>/support.html`, `sitemap.xml` or `llms.txt` by hand: they are
overwritten on the next build.

```bash
node build/build-i18n.js     # 16 translated homepages, from build/i18n/<locale>.js
node build/build-support.js  # 16 support pages + contact form
node build/build-content.js  # content guides (FR + EN) + sitemap.xml
node build/build-llms.js     # llms.txt, for generative engines (GEO)
```

Run all four after touching `index.html`, a dictionary or a page in
`build/content/`. The order matters: the last three derive their locale list
from `build-i18n.js`.

There is deliberately no `package.json`. The project has zero npm dependencies,
and adding one made Vercel detect a build step, run `npm run build`, then fail
looking for a `public/` output directory. The generated HTML is committed, so
Vercel only serves static files and the `api/` function.

Adding a language means adding it to `LOCALES` in `build/build-i18n.js`,
creating `build/i18n/<locale>.js` with every key, and adding its entry to
`META` and `LANG_NAMES`. The build fails loudly if a key is missing, which
prevents untranslated French text from leaking into a translated page.

Note: `index.html` is the source for the French homepage and is never
rewritten by the build. Its `<title>`, meta tags and JSON-LD must be patched
by hand to stay aligned with `META.fr`.

## 📮 Support form
`/support` posts to `api/support.js`, a Vercel serverless function that relays
the message through Resend. The function exists so the Resend API key never
reaches the browser.

Set these in Vercel > Settings > Environment Variables:

| Variable | Required | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | none, the form returns 500 without it |
| `SUPPORT_TO` | no | `contact@alexisamz.fr` |
| `SUPPORT_FROM` | no | `StreamPulse <support@alexisamz.fr>` |

`SUPPORT_FROM` must sit on a domain verified in Resend. `SUPPORT_TO` has no
such constraint: any mailbox works, which is why a second verified domain is
not needed. Replies go straight to the user through `reply_to`.

The three locale rewrites in `vercel.json` are pinned to the real locale list.
A catch-all `/:locale/support` would swallow `/api/support` and the form would
silently never deliver.

## 📦 Deployment
Deployment is handled by Vercel on push to `main` (see `vercel.json`).

## 🤝 Related Repository
- [StreamPulse Extension](https://github.com/AlexisAMZ/StreamPulse) - The source code for the actual Chrome extension.

## 📄 License
© 2024-Present AlexisAMZ. All rights reserved.
