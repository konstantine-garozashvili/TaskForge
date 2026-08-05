# Contribuer à TaskForge

Guide de contribution pour l'équipe ForgeWorks. Merci de le lire avant votre première PR.

## Git flow

- `main` — branche stable, protégée (review requise). Mise à jour en fin de sprint via PR depuis `develop`.
- `develop` — branche d'intégration, protégée (review requise). **Toutes les PR de features visent `develop`.**
- `feature/<numero>-<nom>` — une branche par ticket, créée depuis `develop`.

```bash
git checkout develop && git pull
git checkout -b feature/6-crud-tickets
# ... travail, commits ...
git push -u origin feature/6-crud-tickets
gh pr create --base develop
```

Convention de commits : `type(scope): description` — ex. `feat(tickets): ajout du endpoint POST /api/tickets`.
Types : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Mise en route

```bash
# Base de données (PostgreSQL dockerisé)
docker compose up -d

# Backend (http://localhost:5000)
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev

# Hooks pre-commit (lint-staged) — obligatoire, à la racine
npm install
```

## Qualité de code (CDC §7)

Le projet utilise **ESLint** (analyse statique) et **Prettier** (formatage), configurés
dans `backend/` et `frontend/`.

```bash
# Depuis la racine — vérifier les deux projets
npm run lint            # ESLint
npm run format:check    # Prettier (vérification)
npm run format          # Prettier (correction automatique)

# Depuis backend/ ou frontend/ — mêmes commandes par projet
```

### Hook pre-commit

Un hook `pre-commit` (husky + lint-staged) s'exécute automatiquement à chaque `git commit`
et **bloque le commit** si les fichiers modifiés ne passent pas ESLint + Prettier.
Il s'installe via `npm install` à la racine (script `prepare`). Ne pas le contourner
(`--no-verify`) sauf urgence documentée dans la PR.

### CI GitHub Actions

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque push et PR vers `main` et `develop` :

- installation des dépendances (`npm ci`)
- lint ESLint (backend + frontend)
- vérification du formatage Prettier
- **tests unitaires** du backend (`npm test` — node:test, voir `backend/tests/`)
- build (Vite pour le frontend)

Une PR ne doit être mergée que si la CI est verte.

### Tests unitaires (CDC §7)

Suite `node --test` dans `backend/tests/` couvrant la logique métier critique :
transitions de statut des tickets et temps moyen de résolution (`src/utils/ticketRules.js`,
partagé avec le futur CRUD tickets), hiérarchie RBAC, middleware JWT, registre de métriques.

```bash
make test          # ou : cd backend && npm test
```

## Base de données

Le schéma (`database/schema.sql`, issu du MPD Merise — voir `documentation/`) est chargé
automatiquement au premier démarrage de `docker compose up -d`. Pour repartir d'une base
vide : `docker compose down -v && docker compose up -d`.

## Release (déploiement)

Les deux plateformes ont des déclencheurs différents — à connaître avant de release :

| Composant         | Déclencheur            | Source déployée             |
| ----------------- | ---------------------- | --------------------------- |
| Frontend (Vercel) | push d'un **tag `v*`** | le commit pointé par le tag |
| Backend (Railway) | **push sur `main`**    | la branche `main` (auto)    |

### Procédure de release

```bash
# 1. Merger develop dans main → Railway redéploie le backend immédiatement
git checkout main && git pull
git merge develop && git push origin main

# 2. Taguer le HEAD de main → la CD déploie le frontend sur Vercel
git tag -a v0.x.y -m "message de release"
git push origin v0.x.y
```

### Règles

- **Toujours taguer depuis `main`**, juste après le merge — jamais depuis `develop`.
  Le workflow CD build le commit tagué, quelle que soit la branche : un tag sur
  `develop` déploierait du code non validé en production.
- Tagger le HEAD de `main` garantit que frontend et backend livrent le même code.
- Vérifier que le run CD est vert (`gh run list --workflow=cd.yml`) puis que
  https://taskforge-helpdesk.vercel.app répond avant d'annoncer la release.
