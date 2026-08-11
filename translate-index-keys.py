import os
import time
from deep_translator import GoogleTranslator

LANGS = ['en','es','pt-br','de','it','pl','tr','ru','ja','ko','id','nl','hi','sv','cs']
# Map to GoogleTranslator targets
G_LANGS = {
    'en': 'en', 'es': 'es', 'pt-br': 'pt', 'de': 'de', 'it': 'it', 
    'pl': 'pl', 'tr': 'tr', 'ru': 'ru', 'ja': 'ja', 'ko': 'ko', 
    'id': 'id', 'nl': 'nl', 'hi': 'hi', 'sv': 'sv', 'cs': 'cs'
}

keys = [
    "guides.bttv.title",
    "guides.bttv.desc",
    "guides.ffz.title",
    "guides.ffz.desc",
    "guides.7tv.title",
    "guides.7tv.desc",
    "guides.latency.title",
    "guides.latency.desc",
    "guides.refresh.title",
    "guides.refresh.desc"
]

fr_strings = [
    "BetterTTV vs StreamPulse",
    "Comparatif complet entre BetterTTV (BTTV) et StreamPulse.",
    "FrankerFaceZ vs StreamPulse",
    "Quelle extension choisir pour améliorer son expérience Twitch ?",
    "7TV vs StreamPulse",
    "Faut-il utiliser 7TV ou StreamPulse ? Avantages et différences.",
    "Faible latence Twitch",
    "Comment forcer le mode faible latence sans interruption.",
    "Auto-Refresh Twitch",
    "Recharger automatiquement le lecteur vidéo lors des plantages."
]

for lang in LANGS:
    filepath = f"build/i18n/{lang}.js"
    # Read the file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # If the first key is already in there, skip
    if f'"{keys[0]}"' in content or f"'{keys[0]}'" in content:
        print(f"[SKIP] {lang} already has the keys.")
        continue
        
    print(f"[TRANSLATE] Translating 10 strings to {lang}...")
    g_lang = G_LANGS[lang]
    translator = GoogleTranslator(source='fr', target=g_lang)
    
    success = False
    for attempt in range(3):
        try:
            translated = translator.translate_batch(fr_strings)
            success = True
            break
        except Exception as e:
            print(f"[ERROR] Attempt {attempt+1} failed to translate {lang}: {e}")
            time.sleep(5)
            
    if not success:
        print(f"[FATAL] Giving up on {lang}")
        continue
        
    # Append to the JS object before the last closing brace
    last_brace_idx = content.rfind('}')
    if last_brace_idx == -1:
        print(f"[ERROR] Cannot find closing brace in {lang}")
        continue
        
    injected_str = ",\n"
    for i, k in enumerate(keys):
        # escape quotes
        safe_val = translated[i].replace('"', '\\"')
        injected_str += f'  "{k}": "{safe_val}"'
        if i < len(keys) - 1:
            injected_str += ",\n"
        else:
            injected_str += "\n"
            
    new_content = content[:last_brace_idx] + injected_str + content[last_brace_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"[OK] {lang} saved.")
    time.sleep(2)
