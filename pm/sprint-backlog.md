# Sprint Backlog — TaskForge

Hackathon ForgeWorks — 2 semaines (31 juillet → 13 août 2026)
Équipe : Konstantine (lead / DevOps / auth), Pelagie (tickets), Yanis (dashboard / stats)

Estimations en **story points** (suite de Fibonacci : 1, 2, 3, 5, 8).

---

## Sprint 1 — Semaine 1 (31 juil. → 6 août)

> **Sprint goal** : poser des fondations solides — squelette, base de données, auth backend,
> chaîne DevOps complète (CI/CD, Docker, monitoring) — pour que la semaine 2 soit 100 % features.

| #   | Ticket                                              | Assigné     | Points | Statut |
| --- | --------------------------------------------------- | ----------- | ------ | ------ |
| 13  | Squelette projet — Express + React                  | Konstantine | 3      | ✅     |
| 15  | Conception BDD — MCD / MLD / MPD (Merise)           | Konstantine | 3      | ✅     |
| 17  | PostgreSQL dockerisé + schéma MPD                   | Konstantine | 3      | ✅     |
| 1   | Auth backend — JWT login/register                   | Konstantine | 5      | ✅     |
| 2   | Auth backend — RBAC (3 rôles)                       | Konstantine | 3      | ✅     |
| 3   | Auth backend — CRUD utilisateurs (admin)            | Konstantine | 3      | ✅     |
| 12  | Backend — /health, /metrics, logs JSON              | Konstantine | 3      | ✅     |
| 20  | CI GitHub Actions + ESLint/Prettier + pre-commit    | Konstantine | 3      | ✅     |
| 25  | Documentation API — Swagger /api-docs               | Konstantine | 2      | ✅     |
| 28  | CD — déploiement Vercel sur tag                     | Konstantine | 3      | ✅     |
| 30  | Déploiement Railway (API + PostgreSQL managé)       | Konstantine | 3      | ✅     |
| 33  | Docker avancé — Traefik, load balancing, stack prod | Konstantine | 5      | ✅     |
| 35  | Logs centralisés, tests unitaires, Makefile         | Konstantine | 3      | ✅     |
| 39  | Bonus — monitoring Prometheus + Grafana             | Konstantine | 3      | ✅     |

**Vélocité semaine 1 : 42 points livrés / 42 engagés**

---

## Sprint 2 — Semaine 2 (7 août → 13 août)

> **Sprint goal** : livrer le MVP fonctionnel complet — cycle de vie des tickets de bout en bout,
> dashboard, et tous les livrables jury (docs + PM) prêts pour la soutenance.

### Features produit

| #   | Ticket                                                    | Assigné     | Points | Statut |
| --- | --------------------------------------------------------- | ----------- | ------ | ------ |
| 5   | Auth frontend — protection des routes                     | Konstantine | 3      | To Do  |
| 4   | Auth frontend — gestion utilisateurs & profil             | Konstantine | 3      | To Do  |
| 6   | Tickets backend — CRUD                                    | Pelagie     | 5      | To Do  |
| 7   | Tickets backend — assignation & réassignation             | Pelagie     | 3      | To Do  |
| 8   | Tickets backend — statuts, recherche, filtres, tri        | Pelagie     | 5      | To Do  |
| 10  | Tickets frontend — liste, création, détails, modification | Pelagie     | 5      | To Do  |
| 9   | Tickets frontend — recherche, filtres, assignation        | Pelagie     | 3      | To Do  |
| 11  | Dashboard backend — stats & temps moyen de résolution     | Yanis       | 3      | To Do  |
| 41  | Dashboard frontend — statistiques & graphiques            | Yanis       | 3      | To Do  |

### Livrables jury (docs + PM)

| #   | Ticket                                   | Assigné     | Points | Statut      |
| --- | ---------------------------------------- | ----------- | ------ | ----------- |
| 45  | Sprint backlog avec estimations          | Konstantine | 1      | In Progress |
| 46  | Daily stand-up logs (min 8 entrées)      | Konstantine | 2      | In Progress |
| 42  | Schéma d'architecture + ADR              | Konstantine | 2      | To Do       |
| 43  | Support de soutenance (presentation.pdf) | Konstantine | 3      | To Do       |
| 44  | Screencast de démo (3-5 min)             | Konstantine | 2      | To Do       |
| 47  | Burn-down chart                          | Konstantine | 2      | To Do       |
| 48  | Rétrospective Keep/Drop/Try              | Konstantine | 2      | To Do       |

### Bonus (si le goal est atteint)

| #   | Ticket                                   | Assigné     | Points | Statut  |
| --- | ---------------------------------------- | ----------- | ------ | ------- |
| 49  | Notifications temps réel (WebSocket/SSE) | Konstantine | 5      | Backlog |
| 50  | Commentaires sur les tickets             | Pelagie     | 5      | Backlog |
| 51  | Export CSV/PDF + rapport hebdomadaire    | Yanis       | 3      | Backlog |

**Engagé semaine 2 : 47 points (34 features + 13 livrables) — bonus : 13 points non engagés**

---

## Notes

- La dépendance clé : #5 (protection des routes) débloque tous les fronts — à faire en premier.
- #11 doit livrer avant #41 (le frontend consomme ses endpoints).
- Les tickets bonus ne sont tirés que si le sprint goal est sécurisé.
