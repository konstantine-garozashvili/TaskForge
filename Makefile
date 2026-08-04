# TaskForge — raccourcis d'équipe (CDC §7 : lancement des tests via Makefile)
# `make` ou `make help` liste les commandes.

.DEFAULT_GOAL := help

.PHONY: help db backend frontend test lint format docker-prod docker-down

db: ## Lance PostgreSQL de dev (Docker)
	docker compose up -d

backend: ## Lance le backend en dev (port 5000)
	cd backend && npm run dev

frontend: ## Lance le frontend en dev (port 5173)
	cd frontend && npm run dev

test: ## Lance les tests unitaires du backend
	cd backend && npm test

lint: ## Vérifie ESLint (backend + frontend)
	npm run lint

format: ## Corrige le formatage Prettier (backend + frontend)
	npm run format

docker-prod: ## Lance la stack prod Traefik (3 réplicas backend)
	docker compose -f docker-compose.prod.yml up -d --build --scale backend=3

docker-down: ## Arrête la stack prod
	docker compose -f docker-compose.prod.yml down

help: ## Liste les commandes disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-12s %s\n", $$1, $$2}'
