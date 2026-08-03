# TaskForge

## Projet de fin d'année

### Introduction

Votre équipe participe à un hackathon interne organisé par ForgeWorks, un accélérateur de startups tech. L'objectif : livrer en 2 semaines un MVP complet d'une application de gestion de tickets d'incidents (helpdesk interne).

Le jury du hackathon évalue **AUTANT** le produit que la gestion du sprint. Un produit fonctionnel mal géré ou un sprint parfait sans produit = note moyenne.

Ce projet est l'intégrateur M1 : il consolide toutes les compétences vues depuis le début de l'année. Aucune nouvelle compétence n'est introduite.

---

## Cahier des charges

Fonctionnalités requises :

### 1. Gestion des tickets

- Créer, consulter, modifier et fermer des tickets d'incidents
- Champs : titre, description, priorité (basse/moyenne/haute/critique), statut (ouvert/en cours/résolu/fermé), date de création, date de résolution

### 2. Assignation

- Assigner des tickets à des membres de l'équipe
- Réassigner un ticket à un autre technicien

### 3. Filtrage et tri

- Filtrer par statut, priorité, technicien assigné
- Trier par date, priorité, statut
- Recherche textuelle (titre, description)

### 4. Système de rôles

- **Utilisateur standard** : crée des tickets, suit l'avancement
- **Technicien** : résout les tickets qui lui sont assignés
- **Admin** : gère tout (utilisateurs, tickets, configuration)

### 5. Dashboard

- Statistiques basiques : tickets ouverts, résolus, en cours
- Temps moyen de résolution
- Répartition par priorité / statut (graphique simple)

### 6. Monitoring / health

- Endpoint `/health` et readiness checks
  - Ajouter un endpoint `/health` (backend) et `/healthz` (frontend) qui retournent le statut de chaque composant (API up, BDD connectée, service prêt).
  - Configurer les health checks dans docker-compose pour que Docker redémarre automatiquement un service défaillant.
- Logging structuré centralisé
  - Configurer des logs JSON structurés sur le backend avec au minimum : timestamp, level, message, request_id, user_id.
  - Centraliser les logs avec un volume Docker partagé
- Métriques applicatives
  - Exposer un endpoint `/metrics` (format Prometheus) avec des métriques basiques : nombre de tickets créés, temps moyen de réponse API, nombre d'utilisateurs connectés. Pas besoin de Prometheus/Grafana complets, juste l'exposition des métriques.

### 7. Qualité & Tests

- Suite de tests automatisés. Ajouter des tests unitaires sur la logique métier critique :
  - Vérification des conflits de créneaux (si applicable)
  - Calcul du temps moyen de résolution
  - Validation des transitions de statut (ouvert → en cours → résolu)
  - Configurer le lancement des tests via un script ou un Makefile.
- Linter et formatting automatiques
  - Configurer un linter (ESLint, golangci-lint, ruff, clippy...) et un formatter (Prettier, gofmt, black...) avec un pre-commit hook qui bloque les commits non conformes. Documenter la configuration dans `CONTRIBUTING.md`.
- CI basique avec GitHub Actions. Créer un pipeline minimal qui s'exécute sur chaque push :
  - Build du projet
  - Lancement des tests (si présents)
  - Vérification du linter

### 8. Docker avancé

- Multi-stage builds. Optimiser les Dockerfiles avec des multi-stage builds :
  - Stage 1 : build (avec toutes les dépendances de développement)
  - Stage 2 : runtime (image minimale, binaire ou bundle uniquement)
- Comparer la taille des images avant/après. Documenter le gain.
- Séparation dev / prod. Créer deux configurations :
  - `docker-compose.yml` (dev) : hot-reload, volumes montés, debug activé
  - `docker-compose.prod.yml` : images buildées, pas de volumes source, variables d'environnement de production
  - Documenter les deux modes de lancement dans le README.
- Sécurité Docker. Appliquer les bonnes pratiques de sécurité :
  - Utilisateur non-root dans les conteneurs
  - `.dockerignore` configuré (`node_modules`, `.env`, `.git`)
  - Pas de secrets dans les images (scan avec `docker history`)
  - Images basées sur des tags versionnés (pas `:latest`)

---

## Travail attendu / Livrable

### Production technique

#### 1. Application complète fonctionnelle

- Interface utilisateur (au choix) :
  - Web : React, Vue, Angular, Svelte, HTMX, Blazor…
  - CLI riche : TUI avec bubbletea (Go), inquirer (Node), ratatui (Rust)...
  - Desktop : Tauri, Electron, JavaFX, Qt, WPF...
- API backend : langage et framework au choix
- Base de données : au choix, avec schéma documenté
- Authentification : système de rôles fonctionnel

#### 2. Conteneurisation Docker

- `docker-compose up` (ou équivalent) lance la stack complète : front + back + BDD
- README avec les instructions de lancement
- Variables d'environnement via `.env.example`

#### 3. Schéma d'architecture

- Diagramme de composants (services, flux de données)
- Justification des choix techniques (ADR ou section README)

#### 4. Screencast de démo (3-5 min)

- Backup en cas de problème technique le jour de la soutenance
- Montre le parcours utilisateur complet

### Artefacts PM obligatoires

#### 5. Kanban board (GitHub Projects, GitLab boards, Trello, Jira...)

- Colonnes : Backlog / To Do / In Progress / Review / Done
- Toutes les tâches visibles avec assignation

#### 6. Sprint backlog avec estimation

- Story points ou T-shirt sizing
- Sprint goal défini pour chaque semaine

#### 7. Daily stand-up logs

- Format identique chaque jour (5 bullet points max)
- Template : Fait hier / Prévu aujourd'hui / Blocages
- Minimum 8 entrées sur les 2 semaines

#### 8. Burn-down chart

- Idéal vs réel
- Mis à jour quotidiennement

#### 9. Rétrospective écrite (1-2 pages)

- Format Keep / Drop / Try
- Retour critique honnête sur la gestion du sprint
- Analyse de la rotation des rôles
- Vélocité mesurée

---

## Pour aller plus loin

Les éléments suivants ne sont pas requis mais seront valorisés lors de l'évaluation. En tant qu'intégrateur M1, ces bonus démontrent une maîtrise complète de la chaîne de développement logiciel.

### Monitoring & Observabilité

- Mise en place d'un Prometheus Grafana

### UX & Fonctionnalités

#### 10. Notifications temps réel

Implémenter des notifications en temps réel quand un ticket change de statut ou est assigné : WebSocket, Server-Sent Events (SSE), ou polling intelligent. Le technicien reçoit une notification quand on lui assigne un ticket. L'utilisateur est notifié quand son ticket est résolu.

#### 11. Système de commentaires sur les tickets

Permettre aux utilisateurs et techniciens d'ajouter des commentaires sur un ticket (fil de discussion). Chaque commentaire a un auteur, un timestamp, et un contenu. Cela transforme le helpdesk basique en outil de communication.

#### 12. Export et rapports

Ajouter un export CSV ou PDF des tickets (filtrés ou tous). Permettre de générer un rapport hebdomadaire automatique : tickets ouverts/fermés, temps moyen de résolution, répartition par technicien. Format simple (texte, CSV, ou HTML).

---

## Compétences visées

- Comparer et schématiser les architectures selon leurs caractéristiques et cas d'usage
- Synthétiser les données de veille en validant leur fiabilité et en faire une restitution compréhensible
- Comprendre les avantages et inconvénients de chaque architecture pour recommander la plus appropriée
- Coordonner la communication entre les parties prenantes
- Planifier le projet en décomposant les phases et en allouant les ressources
- Évaluer et organiser les fonctionnalités requises en les classant selon leur importance
- Analyser la problématique du client et formaliser une étude d'opportunité
- Constituer des solutions techniques et construire un CDC respectant RGPD et accessibilité PSH
- Rédiger une note de cadrage précisant la démarche, les objectifs et cadrant délais, budget, ressources et qualité
- Communication technique et non-technique
- Développer et intégrer des stratégies de mitigation des risques
- Modéliser les processus métier, prioriser les fonctionnalités en tenant compte des contraintes
- Recommander un environnement informatique éco-responsable en garantissant la cohérence du système
- Développer des applications métiers sécurisées en optimisant l'efficacité des développeurs
- Rédiger et exécuter les scénarios de tests pour détecter et corriger les erreurs
- Concevoir une architecture applicative en analysant les besoins fonctionnels et les exigences de sécurité
- Justifier l'utilisation de patterns pour garantir une architecture modulaire, réutilisable et maintenable
- Analyser l'existant et qualifier les demandes en réponse aux demandes internes ou externes
- Déployer et orchestrer des environnements conteneurisés
- Assurer la portabilité, la scalabilité et la résilience des applications en optimisant les ressources

---

## Rendu

Le projet est à rendre sur votre dépôt GitHub : `https://github.com/prenom-nom/TaskForge`

Structure attendue du dépôt :

```
TaskForge/
├── frontend/                   # Interface utilisateur
├── backend/                    # API backend
├── docker-compose.yml          # Orchestration de la stack
├── .env.example                # Variables d'environnement
├── docs/
│   ├── architecture.png        # Schéma de composants
│   ├── adr.md                  # Architecture Decision Record
│   ├── presentation.pdf        # Support de soutenance
│   └── screencast.mp4          # Screencast de démo (3-5 min)
├── pm/
│   ├── sprint-backlog.md       # Sprint backlog avec estimations
│   ├── daily-logs.md           # Daily stand-up logs
│   ├── burndown.png            # Burn-down chart
│   └── retrospective.md        # Rétrospective Keep/Drop/Try
└── README.md                   # Instructions de lancement
```

---

## Base de connaissances

**Fullstack :**

- ➔ React
- ➔ Vue
- ➔ Svelte
- ➔ HTMX
- ➔ Tauri

**Docker :**

- ➔ Docker Compose
- ➔ Docker Best Practices

**Sprint Management :**

- ➔ Scrum Guide
- ➔ Burn-down chart
- ➔ Rétrospective

**Architecture :**

- ➔ ADR
- ➔ C4 Model
- ➔ Refactoring Guru - Patterns

**Kanban :**

- ➔ GitHub Projects
