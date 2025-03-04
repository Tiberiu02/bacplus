# BacPlus website

Welcome to the bacplus.ro website!!

# Planning

- licee si scoli dupa localitate, in loc de judet. Majoritatea institutiilor au localitatea in SIIIR, in afara de ~100
- harta: sigle si nume licee, bara de cautare
- improve admin page
- teste EN + admin
- drizzle instead of prisma + disable static generation of institutions pages

# Hetzner setup

- connect with ssh
- map file system: https://sftptogo.com/blog/how-to-map-sftp-as-a-windows-10-drive/
- clone repo using private token `git clone https://[token]@github.com/Tiberiu02/bacplus` https://stackoverflow.com/questions/2505096/clone-a-private-repository-github
- install nodejs: curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - && sudo apt-get install -y nodejs
- install certbot (https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) and start server in ssl mode: npx serve@latest --ssl-cert /etc/letsencrypt/live/api.bacplus.ro/fullchain.pem --ssl-key /etc/letsencrypt/live/api.bacplus.ro/privkey.pem out

# TO DO Admin

User experience:

- pointer events when sigla is present
- url routes for lipsa/complet (annoying when refreshing)
- browser caches sigle so you can't see the new version (just hash or random code to file name)
- hide "fara sigla" when sigla is big enough
- download button for sigla
- logging + contribution tracking, statistics (done, left to do)
- adaugare/modificare site, adresa
- adaugare/modificare facebook, instagram, youtube, email, telefon (tiktok?, linkedin?, twitter?)
- adaugare istoric

Code (tech debt):

- database fix boolean fields (get rid of old "da" "nu" strings)
- fix paths for webpack
- clean up admin page code
- better state management for institution component
- url sigle
