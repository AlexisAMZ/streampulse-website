import os
import glob
import re

site_dir = '/Users/alexisamzdacruz/Desktop/dev/StreampulseSite'
files = glob.glob(f'{site_dir}/*.html') + glob.glob(f'{site_dir}/alternatives/*.html')

if f'{site_dir}/index.html' in files:
    files.remove(f'{site_dir}/index.html')

new_dropdown = '''            <div class="nav-dropdown-content">
              <a href="/erreur-2000-twitch-solution">Erreur 2000 sur Twitch : comment la corriger</a>
              <a href="/erreur-3000-twitch-solution">Erreur 3000 sur Twitch : comment la corriger</a>
              <a href="/twitch-drops-automatique">Réclamer les Twitch Drops automatiquement</a>
              <a href="/points-de-chaine-automatiques-twitch">Points de chaîne automatiques sur Twitch</a>
              <a href="/twitch-low-latency">Comment réduire la latence Twitch</a>
              <a href="/twitch-auto-refresh">Rechargement auto du lecteur Twitch</a>
              <a href="/extension-kick">Extension Kick pour spectateurs</a>
              <a href="/extension-twitch">Extension Twitch pour spectateurs</a>
              <a href="/filtrer-chat-twitch">Filtrer le chat Twitch</a>
              <a href="/notifications-live-twitch-kick">Notifications live Twitch et Kick</a>
              <a href="/dashboard-twitch-kick">Dashboard Twitch et Kick unifié</a>
              <a href="/meilleures-extensions-twitch">Comparatif des extensions Twitch</a>
              <a href="/extension-kick-notifications">Extension Kick : suivre ses streamers</a>
            </div>'''

new_footer_links_1 = '''        <nav class="footer-links">
          <a href="/erreur-2000-twitch-solution">Erreur 2000 sur Twitch : comment la corriger</a>
          <a href="/erreur-3000-twitch-solution">Erreur 3000 sur Twitch : comment la corriger</a>
          <a href="/twitch-drops-automatique">Réclamer les Twitch Drops automatiquement</a>
          <a href="/points-de-chaine-automatiques-twitch">Points de chaîne automatiques sur Twitch</a>
          <a href="/twitch-low-latency">Comment réduire la latence Twitch</a>
          <a href="/twitch-auto-refresh">Rechargement auto du lecteur Twitch</a>
          <a href="/extension-kick">Extension Kick pour spectateurs</a>
          <a href="/extension-twitch">Extension Twitch pour spectateurs</a>
        </nav>'''

new_footer_links_2 = '''        <nav class="footer-links">
          <a href="/filtrer-chat-twitch">Filtrer le chat Twitch</a>
          <a href="/notifications-live-twitch-kick">Notifications live Twitch et Kick</a>
          <a href="/dashboard-twitch-kick">Dashboard Twitch et Kick unifié</a>
          <a href="/meilleures-extensions-twitch">Comparatif des extensions Twitch</a>
          <a href="/extension-kick-notifications">Extension Kick : suivre ses streamers</a>
        </nav>'''

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'<div class="nav-dropdown-content">.*?</div>', new_dropdown, content, flags=re.DOTALL)
    
    parts = re.split(r'(<nav class="footer-links">.*?</nav>)', content, flags=re.DOTALL)
    if len(parts) >= 5:
        parts[1] = new_footer_links_1
        parts[3] = new_footer_links_2
        content = "".join(parts)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Internal linking updated!")
