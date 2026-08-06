#!/usr/bin/env bash
# vps-deploy.sh — déploiement TaskForge sur le VPS (appelé par GitHub Actions,
# utilisable aussi à la main : bash scripts/vps-deploy.sh <tag>).
# Idempotent : checkout du tag, .env régénéré, rebuild, vérifs de santé.
set -euo pipefail

REF="${1:-}"
APP_DIR="/opt/taskforge"

if [ -z "$REF" ]; then
  echo "usage: bash scripts/vps-deploy.sh <tag|branche>" >&2
  exit 1
fi

if [ -z "${POSTGRES_PASSWORD:-}" ] || [ -z "${JWT_SECRET:-}" ]; then
  echo "POSTGRES_PASSWORD et JWT_SECRET doivent être dans l'environnement" >&2
  exit 1
fi

cd "$APP_DIR"
git fetch origin --tags --quiet
git checkout --quiet "$REF"
# Si REF est une branche, suivre origin (sinon un tag est figé par définition)
if git show-ref --verify --quiet "refs/remotes/origin/$REF"; then
  git reset --hard --quiet "origin/$REF"
fi

# .env régénéré à chaque déploiement (jamais dans le repo)
cat > .env <<EOF
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
CLIENT_URL=${CLIENT_URL:-https://taskforge.konstantine.fr}
GRAFANA_ADMIN_USER=${GRAFANA_ADMIN_USER:-admin}
GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD:?GRAFANA_ADMIN_PASSWORD manquant}
EOF

docker compose -f docker-compose.vps.yml up -d --build

# Recharge la config Prometheus sans redémarrage (lifecycle activé)
curl -fsS -X POST http://127.0.0.1:9090/-/reload > /dev/null 2>&1 || true

# Vérifications
sleep 8
curl -fsS http://127.0.0.1:8080/healthz > /dev/null
curl -fsS http://127.0.0.1:5001/health > /dev/null
echo "deploy ok: $(git rev-parse --short HEAD)"
