#!/usr/bin/env bash
# local-prod-sync.sh — synchronise la stack prod locale avec origin/develop.
# Appelé périodiquement par l'automatisation Kimi « local-prod-sync ».
# Sans-op si rien n'a changé ; refuse de toucher un arbre de travail sale
# ou un checkout sur une autre branche (travail en cours protégé).
set -euo pipefail
cd "$(dirname "$0")/.."

git fetch origin develop --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/develop)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "up-to-date $(git rev-parse --short HEAD)"
  exit 0
fi

BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "develop" ]; then
  echo "skip: on branch '$BRANCH', develop has new commits"
  exit 0
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "skip: working tree dirty, develop has new commits"
  exit 0
fi

git pull --ff-only --quiet
docker compose -f docker-compose.prod.yml up -d --build backend frontend
echo "updated to $(git rev-parse --short HEAD)"
