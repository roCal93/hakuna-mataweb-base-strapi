# Déploiement Strapi sur Railway

## 📋 Prérequis

- Compte GitHub
- Compte Railway (gratuit)
- Code poussé sur GitHub
- Node 20.x (`nvm use` lit le `.nvmrc`)

## 🚀 Étapes de déploiement

### 1. Créer un projet Railway

1. Allez sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Sélectionnez votre repository `hakuna-mataweb-base-strapi`

### 2. Ajouter PostgreSQL

1. Dans votre projet : **New** → **Database** → **Add PostgreSQL**
2. Railway créera automatiquement `DATABASE_URL`

### 3. Configurer les variables d'environnement

Dans Railway → Settings → Variables, ajoutez :

```env
NODE_ENV=production
DATABASE_CLIENT=postgres

# Générez ces secrets avec : openssl rand -base64 32
APP_KEYS=secret1,secret2
API_TOKEN_SALT=votre-secret
ADMIN_JWT_SECRET=votre-secret
TRANSFER_TOKEN_SALT=votre-secret
JWT_SECRET=votre-secret

# CORS - Domaines autorisés (séparés par des virgules)
ALLOWED_ORIGINS=https://votre-frontend.com,https://www.votre-frontend.com
```

Astuce (si erreur SWC lors du build) :

- Ajoutez aussi `NIXPACKS_NODE_VERSION=20` dans les variables Railway
- Assurez-vous que les dépendances optionnelles NPM ne sont pas omises (SWC)
	- Option 1 : ajoutez `NPM_CONFIG_OPTIONAL=true` dans Railway
	- Option 2 : gardez `optional=true` dans `.npmrc` (déjà configuré dans ce template)
- Ou commitez un fichier `.nvmrc` avec `20` (déjà présent dans ce template)
- Relancez un déploiement en vidant le cache (`Redeploy → Clear build cache`)

### 4. Déploiement automatique

Railway va :
1. ✅ Installer les dépendances (`npm install`)
2. ✅ Build Strapi (`npm run build`)
3. ✅ Démarrer (`npm start`)

### 5. Accéder à Strapi

URL fournie par Railway : `https://votre-projet.up.railway.app`

Admin : `https://votre-projet.up.railway.app/admin`

## 🔐 Sécurité

- ⚠️ Changez **tous** les secrets par défaut
- ✅ Activez SSL sur la base de données en production
- ✅ CORS configuré dans [config/middlewares.ts](config/middlewares.ts) - Ajoutez `ALLOWED_ORIGINS` dans Railway

## 📦 Scripts disponibles

```bash
npm run dev       # Développement local
npm run build     # Build pour production
npm run start     # Démarrer en production
```

## 🔄 Mises à jour

Railway redéploie automatiquement à chaque push sur la branche `main`.

## 💡 Conseils

- Railway offre **5$/mois gratuit**
- PostgreSQL inclus gratuitement
- Utilisez des variables d'environnement pour tous les secrets
- Testez en local avec PostgreSQL avant de déployer

## 🆘 Dépannage

**Erreur de build** : Vérifiez que `DATABASE_CLIENT=postgres` est défini

**Erreur de connexion** : Railway injecte automatiquement `DATABASE_URL`

**Admin inaccessible** : Vérifiez que `NODE_ENV=production` est défini
