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
The translated homepages, the content guides, `sitemap.xml` and `llms.txt` are
generated. Never edit `<locale>/index.html`, `sitemap.xml` or `llms.txt` by
hand: they are overwritten on the next build.

```bash
node build/build-i18n.js     # 16 translated homepages, from build/i18n/<locale>.js
node build/build-content.js  # content guides (FR + EN) + sitemap.xml
node build/build-llms.js     # llms.txt, for generative engines (GEO)
```

Run all three after touching `index.html`, a dictionary or a page in
`build/content/`. The order matters: `build-content.js` and `build-llms.js`
both derive their locale list from `build-i18n.js`.

Adding a language means adding it to `LOCALES` in `build/build-i18n.js`,
creating `build/i18n/<locale>.js` with every key, and adding its entry to
`META` and `LANG_NAMES`. The build fails loudly if a key is missing, which
prevents untranslated French text from leaking into a translated page.

Note: `index.html` is the source for the French homepage and is never
rewritten by the build. Its `<title>`, meta tags and JSON-LD must be patched
by hand to stay aligned with `META.fr`.

## 📦 Deployment
Deployment is handled by the hosting provider on push to `main`
(see `vercel.json`; `firebase.json` is kept for the legacy setup).

## 🤝 Related Repository
- [StreamPulse Extension](https://github.com/AlexisAMZ/StreamPulse) - The source code for the actual Chrome extension.

## 📄 License
© 2024-Present AlexisAMZ. All rights reserved.
