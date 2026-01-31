# BetPromo

Plateforme d'affiliation de paris sportifs avec dashboard d'administration complet.

## Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| Frontend | React + Vite | React 19.2 / Vite 7.2 |
| Routing | React Router DOM | 7.12 |
| Backend | PocketBase (SQLite embarque) | 0.25.5 |
| SDK Backend | PocketBase JS SDK | 0.26.8 |
| Charts | Recharts | 3.6 |
| Icones | Lucide React | 0.562 |
| Export PDF | jsPDF + jspdf-autotable | 4.0 / 5.0 |
| Export Excel | SheetJS (xlsx) | 0.18 |
| Email | EmailJS | 4.4 |
| CSS | CSS Modules + Variables CSS | - |

## Architecture

```
                  Navigateur (Client)
                        |
            +-----------+-----------+
            |                       |
     Pages publiques          Panel Admin
     /  /bookmakers           /admin/*
     /bonus  /contact         (ProtectedRoute)
            |                       |
            +-----------+-----------+
                        |
                  React Contexts
            AuthContext + DataContext
                        |
                  Service Layer
              (src/services/pocketbase.js)
                        |
                   HTTP REST API
                        |
               PocketBase (port 8090)
                   SQLite (data.db)
```

## Structure du projet

```
betpromo/
├── public/                     # Assets statiques
├── pocketbase/
│   ├── pocketbase              # Binaire PocketBase (Linux x64)
│   ├── pb_data/                # Base de donnees SQLite
│   ├── pb_migrations/          # Migrations de schema
│   └── pb_schema.json          # Definition du schema
├── src/
│   ├── main.jsx                # Point d'entree React
│   ├── App.jsx                 # Routes principales
│   ├── index.css               # Theme global (variables CSS)
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentification admin (_superusers)
│   │   └── DataContext.jsx      # Gestion globale des donnees
│   ├── services/
│   │   └── pocketbase.js       # Client PB + services CRUD
│   ├── components/
│   │   ├── admin/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── BookmakerList.jsx
│   │   │   ├── BookmakerCard.jsx
│   │   │   ├── Features.jsx
│   │   │   └── CTA.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── AdminSidebar.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Bookmakers.jsx
│       ├── BookmakerDetail.jsx
│       ├── Bonus.jsx
│       ├── Contact.jsx
│       └── admin/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── BookmakersAdmin.jsx
│           ├── Analytics.jsx
│           ├── Reports.jsx
│           ├── Users.jsx
│           ├── Messages.jsx
│           ├── Notifications.jsx
│           └── Settings.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Routes

### Pages publiques

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil avec hero, liste bookmakers, features |
| `/bookmakers` | Bookmakers | Catalogue complet des bookmakers |
| `/bookmaker/:id` | BookmakerDetail | Fiche detaillee d'un bookmaker |
| `/bonus` | Bonus | Comparatif des bonus disponibles |
| `/contact` | Contact | Formulaire de contact |

### Panel d'administration (protege)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | Login | Connexion administrateur |
| `/admin` | Dashboard | Vue d'ensemble (stats, graphiques, activite) |
| `/admin/bookmakers` | BookmakersAdmin | CRUD bookmakers |
| `/admin/analytics` | Analytics | Graphiques detailles (revenus, clics, conversions, trafic) |
| `/admin/reports` | Reports | Rapports avec export PDF/Excel |
| `/admin/users` | Users | Gestion des utilisateurs admin |
| `/admin/messages` | Messages | Messages recus via le formulaire de contact |
| `/admin/notifications` | Notifications | Centre de notifications |
| `/admin/settings` | Settings | Profil, Notifications, Site, Securite |

## Collections PocketBase

| Collection | Type | Description |
|-----------|------|-------------|
| `bookmakers` | base | Bookmakers affilies (nom, bonus, lien, clicks, conversions) |
| `stats` | base | Statistiques globales (1 enregistrement) |
| `analytics` | base | Donnees analytiques par jour de la semaine (7 enregistrements) |
| `activities` | base | Journal d'activite (50 dernieres actions) |
| `admin_users` | base | Utilisateurs du panel admin |
| `notifications` | base | Notifications systeme |
| `settings` | base | Configuration du site (1 enregistrement JSON) |
| `contact_messages` | base | Messages du formulaire de contact |
| `_superusers` | auth | Comptes super-administrateurs (PocketBase natif) |

## Configuration des parametres

Les parametres du site (onglet **Parametres > Site** dans le dashboard) controlent dynamiquement :

**Informations de contact** (affichees sur `/contact` et dans le footer) :
- Email de contact
- Telephone
- Adresse
- Horaires de disponibilite

**Reseaux sociaux** (footer) :
- Facebook, Twitter/X, Instagram, YouTube

**Liens bookmakers** (footer) :
- Jusqu'a 6 liens configurables avec nom et URL

**Profil admin** (sidebar) :
- Nom affiche dans la sidebar du dashboard
- Email, telephone

## Installation locale

### Prerequis

- Node.js >= 18
- npm >= 9

### Demarrage

```bash
# Cloner le projet
git clone <repo-url>
cd betpromo

# Installer les dependances
npm install

# Lancer en developpement (PocketBase + Vite)
npm run dev
```

Le frontend demarre sur `http://localhost:5173` et PocketBase sur `http://127.0.0.1:8090`.

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance PocketBase + Vite en parallele |
| `npm run vite` | Lance uniquement le frontend |
| `npm run pocketbase` | Lance uniquement PocketBase |
| `npm run build` | Build de production (dossier `dist/`) |
| `npm run preview` | Preview du build de production |
| `npm run lint` | Verification ESLint |

### Identifiants admin par defaut

```
Email:    admin@betpromo.com
Password: admin123
```

Dashboard PocketBase : `http://127.0.0.1:8090/_/`

## Theme et design

Le theme est defini dans `src/index.css` via des variables CSS :

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--primary` | `#10B981` | Couleur principale (vert) |
| `--background` | `#0F172A` | Fond de page (bleu tres sombre) |
| `--surface` | `#1E293B` | Fond des cartes |
| `--text` | `#F8FAFC` | Texte principal |
| `--text-muted` | `#94A3B8` | Texte secondaire |
| `--success` | `#10B981` | Succes |
| `--warning` | `#F59E0B` | Avertissement |
| `--error` | `#EF4444` | Erreur |

Police : **Inter** (Google Fonts), graisses 300 a 900.

---

# Guide de deploiement - VPS avec betpromo.pro

## Prerequis VPS

- Ubuntu 22.04+ (ou Debian 12+)
- 1 Go RAM minimum (2 Go recommande)
- Acces root ou sudo
- Nom de domaine `betpromo.pro` pointe vers l'IP du VPS (enregistrement DNS A)

## Etape 1 : Configurer le DNS

Chez votre registrar de domaine, creer les enregistrements DNS suivants :

```
Type    Nom     Valeur              TTL
A       @       <IP_DU_VPS>         3600
A       www     <IP_DU_VPS>         3600
```

Attendre la propagation DNS (quelques minutes a 24h).

## Etape 2 : Preparer le serveur

```bash
# Se connecter au VPS
ssh root@<IP_DU_VPS>

# Mettre a jour le systeme
apt update && apt upgrade -y

# Installer les outils necessaires
apt install -y curl git unzip nginx certbot python3-certbot-nginx

# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verifier les installations
node -v    # v20.x.x
npm -v     # 10.x.x
nginx -v   # nginx/1.x.x
```

## Etape 3 : Deployer l'application

```bash
# Creer le repertoire de l'application
mkdir -p /var/www/betpromo
cd /var/www/betpromo

# Cloner le projet (remplacer par votre URL de repo)
git clone <VOTRE_REPO_URL> .

# Installer les dependances
npm install

# Build de production du frontend
npm run build
```

## Etape 4 : Configurer PocketBase en tant que service

```bash
# Rendre le binaire executable
chmod +x /var/www/betpromo/pocketbase/pocketbase

# Creer le service systemd
cat > /etc/systemd/system/pocketbase.service << 'EOF'
[Unit]
Description=PocketBase Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/betpromo/pocketbase
ExecStart=/var/www/betpromo/pocketbase/pocketbase serve --http=127.0.0.1:8090
Restart=always
RestartSec=5
StandardOutput=append:/var/log/pocketbase.log
StandardError=append:/var/log/pocketbase-error.log

[Install]
WantedBy=multi-user.target
EOF

# Donner les droits a www-data
chown -R www-data:www-data /var/www/betpromo/pocketbase

# Activer et demarrer le service
systemctl daemon-reload
systemctl enable pocketbase
systemctl start pocketbase

# Verifier que ca tourne
systemctl status pocketbase
curl -s http://127.0.0.1:8090/api/health
# Doit afficher: {"message":"API is healthy.","code":200,"data":{}}
```

## Etape 5 : Configurer Nginx

```bash
cat > /etc/nginx/sites-available/betpromo << 'EOF'
server {
    listen 80;
    server_name betpromo.pro www.betpromo.pro;

    # Frontend React (fichiers statiques)
    root /var/www/betpromo/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;

    # Cache des assets statiques
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy vers PocketBase API
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy vers le dashboard PocketBase (optionnel, restreindre en production)
    location /_/ {
        proxy_pass http://127.0.0.1:8090/_/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback - toutes les routes non-fichier vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/betpromo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et recharger Nginx
nginx -t
systemctl reload nginx
```

## Etape 6 : Configurer l'URL PocketBase pour la production

Avant le build, modifier l'URL de PocketBase pour pointer vers le domaine (via le proxy Nginx) :

```bash
# Editer le fichier de service PocketBase
nano /var/www/betpromo/src/services/pocketbase.js
```

Changer la ligne :
```javascript
const pb = new PocketBase('http://127.0.0.1:8090');
```
En :
```javascript
const pb = new PocketBase(
  import.meta.env.VITE_PB_URL || 'https://betpromo.pro'
);
```

Puis rebuilder :
```bash
cd /var/www/betpromo
npm run build
systemctl reload nginx
```

## Etape 7 : Certificat SSL (HTTPS)

```bash
# Obtenir le certificat Let's Encrypt
certbot --nginx -d betpromo.pro -d www.betpromo.pro

# Suivre les instructions (entrer un email, accepter les conditions)
# Certbot modifie automatiquement la config Nginx pour HTTPS

# Verifier le renouvellement automatique
certbot renew --dry-run
```

## Etape 8 : Creer le compte admin de production

```bash
# Creer/modifier le super-administrateur
/var/www/betpromo/pocketbase/pocketbase superuser upsert admin@betpromo.com VOTRE_MOT_DE_PASSE_SECURISE --dir=/var/www/betpromo/pocketbase/pb_data
```

## Etape 9 : Verification

```bash
# Verifier les services
systemctl status pocketbase   # active (running)
systemctl status nginx         # active (running)

# Tester l'API
curl -s https://betpromo.pro/api/health
# {"message":"API is healthy.","code":200,"data":{}}

# Tester le frontend
curl -s -o /dev/null -w "%{http_code}" https://betpromo.pro
# 200
```

Ouvrir dans le navigateur :
- `https://betpromo.pro` - Site public
- `https://betpromo.pro/admin/login` - Panel admin
- `https://betpromo.pro/_/` - Dashboard PocketBase (restreindre en production)

## Mise a jour de l'application

```bash
cd /var/www/betpromo

# Recuperer les changements
git pull origin main

# Reinstaller les dependances si besoin
npm install

# Rebuilder le frontend
npm run build

# Redemarrer PocketBase si le schema a change
systemctl restart pocketbase

# Recharger Nginx
systemctl reload nginx
```

## Sauvegarde

```bash
# Sauvegarder la base de donnees
cp /var/www/betpromo/pocketbase/pb_data/data.db /root/backups/betpromo-$(date +%Y%m%d).db

# Cron automatique (tous les jours a 3h)
echo "0 3 * * * cp /var/www/betpromo/pocketbase/pb_data/data.db /root/backups/betpromo-\$(date +\%Y\%m\%d).db" | crontab -
mkdir -p /root/backups
```

## Securite en production

1. **Firewall** : n'ouvrir que les ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   ```bash
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw enable
   ```

2. **Dashboard PocketBase** : restreindre l'acces `/_/` par IP dans Nginx
   ```nginx
   location /_/ {
       allow VOTRE_IP;
       deny all;
       proxy_pass http://127.0.0.1:8090/_/;
       # ... reste de la config
   }
   ```

3. **Changer le mot de passe admin** par defaut immediatement

4. **Regles d'acces PocketBase** : configurer les API Rules dans le dashboard PocketBase pour restreindre les operations d'ecriture aux admins authentifies

## Depannage

| Probleme | Solution |
|----------|----------|
| PocketBase ne demarre pas | `journalctl -u pocketbase -f` pour voir les logs |
| Erreur 502 Bad Gateway | Verifier que PocketBase tourne : `curl http://127.0.0.1:8090/api/health` |
| Page blanche sur /admin | Verifier que `dist/index.html` existe et que Nginx pointe dessus |
| Certificat SSL expire | `certbot renew` (normalement automatique via cron) |
| Donnees non affichees | Verifier la connexion PB : ouvrir la console du navigateur |
