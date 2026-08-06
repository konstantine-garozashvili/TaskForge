# TaskForge

TaskForge - Application de gestion de tickets d'incidents helpdesk (MVP hackathon interne ForgeWorks)

## 📁 Structure du projet

```
TaskForge/
├── backend/                  # API Express (Node.js, ES Modules)
│   ├── src/
│   │   ├── config/           # Configuration centralisée (variables d'env)
│   │   ├── controllers/      # Logique métier des endpoints
│   │   ├── middleware/       # Middlewares (gestion d'erreurs, 404...)
│   │   ├── models/           # Modèles de données (à venir - Sprint 1)
│   │   ├── routes/           # Définition des routes /api
│   │   ├── app.js            # Configuration de l'app Express
│   │   └── server.js         # Point d'entrée (démarrage du serveur)
│   ├── .env.example          # Template des variables d'environnement
│   └── package.json
│
└── frontend/                 # Application React (Vite)
    ├── src/
    │   ├── components/       # Composants réutilisables
    │   ├── pages/            # Pages de l'application
    │   ├── services/         # Client HTTP (appels API)
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js        # Config Vite (+ proxy /api vers le backend)
    └── package.json
```

## 🚀 Démarrage

### Prérequis

- Node.js >= 18

### Backend (http://localhost:5000)

```bash
cd backend
cp .env.example .env   # puis adapter les valeurs si besoin
npm install
npm run dev            # démarrage avec rechargement automatique (--watch)
```

Test rapide : `curl http://localhost:5000/api`

### Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

Le serveur de dev Vite proxifie automatiquement les appels `/api` vers la stack Docker locale via Traefik (`http://localhost`, port 80). Pour cibler un backend lancé à la main : `VITE_BACKEND_URL=http://localhost:5000 npm run dev`.

### Scripts disponibles

| Projet   | Commande          | Description                      |
| -------- | ----------------- | -------------------------------- |
| backend  | `npm run dev`     | Serveur dev avec watch           |
| backend  | `npm start`       | Démarrage production             |
| backend  | `npm test`        | Tests unitaires (node --test)    |
| backend  | `npm run build`   | (aucun build requis)             |
| frontend | `npm run dev`     | Serveur de dev Vite (port 5173)  |
| frontend | `npm run build`   | Build de production dans `dist/` |
| frontend | `npm run preview` | Prévisualisation du build        |

Un `Makefile` à la racine centralise les commandes courantes : `make help`.

## 🗺️ Roadmap (Sprints)

- **Sprint 1 (31 Jul - 07 Aug)** : Auth JWT + CRUD Users, CRUD Tickets + Assignation, Setup Docker/CI + Dashboard basique.
- **Sprint 2 (08 Aug - 14 Aug)** : Filtres/recherche/tri, stats dashboard, tests, CI/CD, Docker prod, documentation, soutenance.

Voir les [issues](https://github.com/konstantine-garozashvili/TaskForge/issues) et le [Sprint Board](https://github.com/users/konstantine-garozashvili/projects/20) pour le détail.

## 🌐 Déploiement

| Composant | Plateforme | URL                                                      |
| --------- | ---------- | -------------------------------------------------------- |
| Frontend  | Vercel     | https://taskforge-helpdesk.vercel.app                    |
| Backend   | Railway    | https://backend-production-d4bd5.up.railway.app          |
| API Docs  | Railway    | https://backend-production-d4bd5.up.railway.app/api-docs |

### Frontend (Vercel) & Backend (Railway)

Le workflow `.github/workflows/cd.yml` déploie **les deux** en production à chaque tag `v*` poussé sur le dépôt — frontend sur Vercel, backend sur Railway, depuis le même commit tagué :

```bash
git tag -a v0.x.y -m "message"
git push origin v0.x.y
```

L'URL de l'API est injectée au build frontend via la variable `VITE_API_URL` (configurée dans le projet Vercel).

### Backend (Railway)

Le service `backend` du projet Railway `taskforge` est déployé uniquement par le workflow CD (tag `v*`) — les pushes sur `main` ne déclenchent **pas** de déploiement, pour que la production ne serve que du code versionné. La base PostgreSQL managée vit dans le même projet ; le schéma `database/schema.sql` y a été appliqué.

Variables d'environnement du backend en production : `DATABASE_URL` (référence automatique), `JWT_SECRET`, `CLIENT_URL` (origines autorisées par CORS, séparées par des virgules), `NODE_ENV=production`.

### Compte de démonstration

- Email : `kost@taskforge.dev` — rôle `admin` (local et production)

## 🐳 Stack prod dockerisée (Traefik)

Stack de production locale avec **Traefik v3.6** en reverse proxy / load balancer,
indépendante de l'hébergement Vercel + Railway (démo jury, portabilité — CDC §8).

```bash
# Build + lancement avec 3 réplicas du backend
docker compose -f docker-compose.prod.yml up -d --build --scale backend=3

# Arrêt
docker compose -f docker-compose.prod.yml down        # ajouter -v pour purger la BDD
```

Accès : **http://localhost** — dashboard Traefik : http://localhost:8080 (démo locale uniquement).

### Routage

| Chemin                        | Destination                              |
| ----------------------------- | ---------------------------------------- |
| `/api`, `/health`, `/metrics` | backend (round-robin entre les réplicas) |
| `/`, `/healthz`               | frontend (nginx non-root)                |
| `:8080`                       | dashboard Traefik                        |

### Points validés

- **Load balancing** : `--scale backend=N` — Traefik découvre les réplicas via le socket Docker et répartit le trafic en round-robin.
- **Résilience** : un réplica tué ne coupe pas le service (healthchecks Docker + restart automatique).
- **Multi-stage builds** : backend **253 Mo** vs 308 Mo naïf (-18 %) ; frontend **76 Mo** vs 425 Mo naïf (-82 %).
- **Sécurité** : utilisateur non-root dans les deux images, tags versionnés (pas de `:latest`), `.dockerignore`, secrets injectés au runtime (scan `docker history` : aucun secret).
- **Logs centralisés** : les réplicas backend écrivent leurs logs JSON sur le volume partagé `logs_data` (`/app/logs/backend.log`) en plus de stdout (CDC §6).
- **Note** : Traefik **v3.6 minimum** avec Docker Engine 29 (le client Docker de v3.4 est incompatible).

### Monitoring — Prometheus + Grafana (bonus CDC)

La stack prod embarque un **Prometheus** qui scrape `/metrics` du backend (tous les réplicas via le DNS Docker) et les métriques propres à Traefik, plus un **Grafana** provisionné automatiquement (datasource + dashboard « TaskForge — Observabilité » : tickets créés, utilisateurs connectés, uptime, temps de réponse, débit HTTP, trafic Traefik).

| Service    | URL                   | Identifiants par défaut                 |
| ---------- | --------------------- | --------------------------------------- |
| Prometheus | http://localhost:9090 | —                                       |
| Grafana    | http://localhost:3001 | `admin` / `admin` (voir `.env.example`) |

Configuration : `monitoring/prometheus.yml`, provisioning Grafana dans `monitoring/grafana/`. Rétention Prometheus : 7 jours.
