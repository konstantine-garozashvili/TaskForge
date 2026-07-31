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

Le serveur de dev Vite proxifie automatiquement les appels `/api` vers le backend (`http://localhost:5000`).

### Scripts disponibles

| Projet   | Commande        | Description                        |
| -------- | --------------- | ---------------------------------- |
| backend  | `npm run dev`   | Serveur dev avec watch             |
| backend  | `npm start`     | Démarrage production               |
| backend  | `npm run build` | (aucun build requis)               |
| frontend | `npm run dev`   | Serveur de dev Vite (port 5173)    |
| frontend | `npm run build` | Build de production dans `dist/`   |
| frontend | `npm run preview` | Prévisualisation du build        |

## 🗺️ Roadmap (Sprints)

- **Sprint 1 (31 Jul - 07 Aug)** : Auth JWT + CRUD Users, CRUD Tickets + Assignation, Setup Docker/CI + Dashboard basique.
- **Sprint 2 (08 Aug - 14 Aug)** : Filtres/recherche/tri, stats dashboard, tests, CI/CD, Docker prod, documentation, soutenance.

Voir les [issues](https://github.com/konstantine-garozashvili/TaskForge/issues) et le [Sprint Board](https://github.com/users/konstantine-garozashvili/projects/20) pour le détail.
