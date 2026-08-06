# TaskForge - Frontend

Application React (Vite) pour TaskForge.

## Démarrage

```bash
npm install
npm run dev
```

Le dev server (port 5173) proxifie `/api` vers la stack Docker locale via Traefik (`http://localhost`, port 80) — identique à la prod. Pour cibler un backend lancé à la main sur :5000 : `VITE_BACKEND_URL=http://localhost:5000 npm run dev`.
Voir le [README racine](../README.md) pour la structure complète du projet.
