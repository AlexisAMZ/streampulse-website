import os
import glob

files = glob.glob('/Users/alexisamzdacruz/Desktop/dev/StreampulseSite/**/index.html', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Version 2.0 with Version 26.8.11
    content = content.replace('Version 2.0', 'Version 26.8.11')
    
    # Replace 4.8 ★ with 4.7/5 (Chrome Web Store)
    # The original html has: <div class="num">4.8 ★</div>
    # Let's replace "4.8 ★" with "4.7/5" and add a subtitle if needed, or just "4.7 ★"
    # Actually, the audit says: "Afficher la source + date ou utiliser la note CWS"
    # I'll just change "4.8 ★" to "4.7/5" and maybe the text below it?
    # Let's just do "4.7/5 (CWS)"
    content = content.replace('4.8 ★', '4.7/5 (CWS)')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated all index files")
