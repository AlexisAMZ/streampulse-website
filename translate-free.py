import os
import json
import time
import subprocess
from deep_translator import GoogleTranslator

LANGS = ['en', 'es', 'pt-BR', 'de', 'it', 'pl', 'tr', 'ru', 'ja', 'ko', 'id', 'nl', 'hi', 'sv', 'cs']
G_LANGS = { 'pt-BR': 'pt' }
for l in LANGS:
    if l not in G_LANGS:
        G_LANGS[l] = l

pages = ['lowLatency', 'autoRefresh', 'altBetterTTV', 'altFFZ', 'alt7TV']
i18n_dir = '/Users/alexisamzdacruz/Desktop/dev/StreampulseSite/build/content/i18n'
os.makedirs(i18n_dir, exist_ok=True)

def extract_strings(obj):
    strings = []
    paths = []
    if isinstance(obj, str):
        return [obj], ['']
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            s, p = extract_strings(item)
            strings.extend(s)
            paths.extend([f"[{i}]{x}" for x in p])
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if k in ('id', 'key', 'table'): continue # Don't translate IDs
            s, p = extract_strings(v)
            strings.extend(s)
            paths.extend([f".{k}{x}" if x else f".{k}" for x in p])
    return strings, paths

def set_string(obj, path, val):
    parts = [p.replace(']', '') for p in path.strip('.').replace('[', '.').split('.')]
    curr = obj
    for i in range(len(parts)-1):
        p_curr = int(parts[i]) if parts[i].isdigit() else parts[i]
        p_next = parts[i+1]
        if isinstance(curr, list):
            while len(curr) <= p_curr: curr.append(None)
            if curr[p_curr] is None:
                curr[p_curr] = [] if p_next.isdigit() else {}
            curr = curr[p_curr]
        else:
            if p_curr not in curr:
                curr[p_curr] = [] if p_next.isdigit() else {}
            curr = curr[p_curr]
            
    last = parts[-1]
    if last.isdigit():
        idx = int(last)
        while len(curr) <= idx: curr.append(None)
        curr[idx] = val
    else:
        curr[last] = val

# Dump JS to JSON using Node
node_script = """
const fs = require('fs');
const pages = ['lowLatency', 'autoRefresh', 'altBetterTTV', 'altFFZ', 'alt7TV'];
const data = {};
pages.forEach(p => {
    const raw = require('./build/content/' + p);
    const frSource = {
      slug: raw.slug?.fr,
      linkLabel: raw.linkLabel?.fr,
      title: raw.title?.fr,
      h1: raw.h1?.fr,
      description: raw.description?.fr,
      intro: raw.intro?.fr,
      howToSteps: raw.howToSteps?.fr,
      sections: raw.sections?.fr,
      faq: raw.faq?.fr
    };
    Object.keys(frSource).forEach(key => frSource[key] === undefined && delete frSource[key]);
    data[p] = frSource;
});
fs.writeFileSync('temp_dump.json', JSON.stringify(data));
"""
with open('temp_dump.js', 'w') as f:
    f.write(node_script)

subprocess.run(['node', 'temp_dump.js'])
with open('temp_dump.json', 'r') as f:
    source_data = json.load(f)

for page in pages:
    print(f"=== Processing {page} ===")
    fr_obj = source_data[page]
    strings, paths = extract_strings(fr_obj)
    
    i18n_path = os.path.join(i18n_dir, f"{page}.json")
    if os.path.exists(i18n_path):
        with open(i18n_path, 'r') as f:
            translations = json.load(f)
    else:
        translations = {}
        
    for lang in LANGS:
        if lang in translations:
            print(f"[SKIP] {lang} already translated.")
            continue
            
        print(f"[TRANSLATE] Translating {len(strings)} strings to {lang}...")
        g_lang = G_LANGS[lang]
        translator = GoogleTranslator(source='fr', target=g_lang)
        
        try:
            time.sleep(2)
            # Send the entire list in one go
            translated_strings = translator.translate_batch(strings)
            
            translated_obj = json.loads(json.dumps(fr_obj)) # clone
            for i, p in enumerate(paths):
                set_string(translated_obj, p, translated_strings[i])
                
            translations[lang] = translated_obj
            with open(i18n_path, 'w') as f:
                json.dump(translations, f, indent=2, ensure_ascii=False)
            print(f"[OK] {lang} saved.")
        except Exception as e:
            print(f"[ERROR] Failed to translate {lang}: {e}")

os.remove('temp_dump.js')
os.remove('temp_dump.json')
print("All done!")
