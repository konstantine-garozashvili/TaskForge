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
- build (Vite pour le frontend)

Une PR ne doit être mergée que si la CI est verte.

## Base de données

Le schéma (`database/schema.sql`, issu du MPD Merise — voir `documentation/`) est chargé
automatiquement au premier démarrage de `docker compose up -d`. Pour repartir d'une base
vide : `docker compose down -v && docker compose up -d`.
