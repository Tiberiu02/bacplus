# BacPlus website

Welcome to the bacplus.ro website!

# Planning

- backend + admin panel
- licee si scoli dupa localitate, in loc de judet. Majoritatea institutiilor au localitatea in SIIIR, in afara de ~100
- harta: sigle si nume licee, bara de cautare

# Hetzner setup

- connect with ssh
- map file system: https://sftptogo.com/blog/how-to-map-sftp-as-a-windows-10-drive/
- clone repo using private token `git clone https://[token]@github.com/Tiberiu02/bacplus` https://stackoverflow.com/questions/2505096/clone-a-private-repository-github
- install nodejs: curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - && sudo apt-get install -y nodejs
- install certbot (https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) and start server in ssl mode: npx serve@latest --ssl-cert /etc/letsencrypt/live/api.bacplus.ro/fullchain.pem --ssl-key /etc/letsencrypt/live/api.bacplus.ro/privkey.pem out
