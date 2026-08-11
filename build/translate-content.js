#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { LOCALES } = require('./build-i18n');

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = (DEEPL_API_KEY || '').endsWith(':fx') 
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const I18N_DIR = path.join(__dirname, 'content', 'i18n');
if (!fs.existsSync(I18N_DIR)) {
  fs.mkdirSync(I18N_DIR, { recursive: true });
}

const PAGES = [
  require('./content/points'),
  require('./content/error2000'),
  require('./content/drops'),
  require('./content/notifications'),
  require('./content/chat'),
  require('./content/alternatives'),
  require('./content/kick'),
  require('./content/error3000'),
  require('./content/extensionTwitch'),
  require('./content/extensionKick'),
  require('./content/dashboard')
];

const DEEPL_LANGS = {
  'en': 'EN-US', 'es': 'ES', 'pt-BR': 'PT-BR', 'de': 'DE', 'it': 'IT', 
  'pl': 'PL', 'tr': 'TR', 'ru': 'RU', 'ja': 'JA', 'ko': 'KO', 
  'id': 'ID', 'nl': 'NL', 'sv': 'SV', 'cs': 'CS'
};

function extractStrings(obj, strings = [], paths = [], currentPath = '') {
  if (typeof obj === 'string') {
    strings.push(obj);
    paths.push(currentPath);
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => extractStrings(item, strings, paths, `${currentPath}[${index}]`));
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (key !== 'id' && key !== 'key') {
        const nextPath = currentPath ? `${currentPath}.${key}` : key;
        extractStrings(obj[key], strings, paths, nextPath);
      }
    }
  }
  return { strings, paths };
}

function setStringAtPath(obj, pathStr, value) {
  const parts = pathStr.replace(/\]/g, '').split(/[.\[]/);
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = parts[i+1].match(/^\d+$/) ? [] : {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function translateBatch(strings, targetLang, retries = 3) {
  if (strings.length === 0) return [];
  const deeplCode = DEEPL_LANGS[targetLang];
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: strings,
        target_lang: deeplCode,
        tag_handling: 'xml'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.translations.map(t => t.text);
    }

    const err = await response.text();
    console.error(`[ERROR] DeepL API (${targetLang}) Attempt ${attempt}: HTTP ${response.status} ${response.statusText}`, err);
    
    if (response.status === 429) {
      if (attempt < retries) {
        console.log(`[RETRY] Trop de requêtes (429). Pause de ${attempt * 5}s avant relance...`);
        await sleep(attempt * 5000);
        continue;
      } else {
        console.error("[FATAL] Quota de requêtes dépassé (429) après plusieurs tentatives. Arrêt.");
        process.exit(1);
      }
    } else if (response.status === 456) {
       console.error("[FATAL] Quota de mots/caractères DeepL dépassé (456). Arrêt du script.");
       process.exit(1);
    } else {
       return null;
    }
  }
  return null;
}

async function main() {
  if (!DEEPL_API_KEY) {
    console.error("ERREUR : Variable d'environnement DEEPL_API_KEY requise.");
    process.exit(1);
  }

  const langsToProcess = Object.keys(LOCALES).filter(l => l !== 'fr' && l !== 'en');

  for (const page of PAGES) {
    console.log(`\n=== Traitement de la page : ${page.key} ===`);
    const i18nPath = path.join(I18N_DIR, `${page.key}.json`);
    let translations = fs.existsSync(i18nPath) ? JSON.parse(fs.readFileSync(i18nPath, 'utf8')) : {};

    const frSource = {
      slug: page.slug?.fr,
      linkLabel: page.linkLabel?.fr,
      title: page.title?.fr,
      h1: page.h1?.fr,
      description: page.description?.fr,
      intro: page.intro?.fr,
      howToSteps: page.howToSteps?.fr,
      sections: page.sections?.fr,
      faq: page.faq?.fr
    };
    
    // Clean undefined keys
    Object.keys(frSource).forEach(key => frSource[key] === undefined && delete frSource[key]);

    const { strings, paths } = extractStrings(frSource);

    for (const lang of langsToProcess) {
      if (translations[lang]) {
        console.log(`[SKIP] ${lang} déjà traduit.`);
        continue;
      }
      if (!DEEPL_LANGS[lang]) {
        console.log(`[SKIP] ${lang} (Non supporté par DeepL)`);
        continue;
      }

      console.log(`[TRANSLATE] Traduction de ${strings.length} chaînes en ${lang}...`);
      
      try {
        const translatedStrings = await translateBatch(strings, lang);
        
        if (translatedStrings && translatedStrings.length === strings.length) {
          const translatedObj = JSON.parse(JSON.stringify(frSource)); // Clone structure
          for (let i = 0; i < paths.length; i++) {
            setStringAtPath(translatedObj, paths[i], translatedStrings[i]);
          }
          translations[lang] = translatedObj;
          fs.writeFileSync(i18nPath, JSON.stringify(translations, null, 2), 'utf8');
          console.log(`[OK] ${lang} sauvegardé.`);
        }
      } catch (err) {
        console.error(`[FATAL] Erreur lors de la traduction en ${lang}:`, err);
      }
      await sleep(2000); // Delai de 2s entre les langues
    }
  }
  console.log("\nTraduction terminée.");
}

main();
