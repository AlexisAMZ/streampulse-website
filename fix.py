import glob
import re

files = glob.glob("build/i18n/*.js")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Fix the version 2.0 -> 26.8.11 specifically in hero.eyebrow
    # We replace "2.0" with "26.8.11"
    content = re.sub(r'("hero\.eyebrow"\s*:\s*".*?)2\.0(.*?")', r'\g<1>26.8.11\g<2>', content)
    
    # Also replace it if it's translated, e.g., Version 2.0, Versión 2.0
    # The above regex catches any "hero.eyebrow": "...2.0..."
    
    # Fix the syntax error (double commas in object literal)
    content = re.sub(r',\s*,', ',', content)
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
