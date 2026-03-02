# GED RH — Gestion Électronique des Documents (Ressources Humaines)

Application backend de **Gestion Électronique des Documents** pour le domaine **Ressources Humaines**. Elle permet de gérer des documents, candidats, entretiens, formulaires et notifications dans un contexte RH.

---

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **Node.js** | Environnement d’exécution JavaScript |
| **NestJS 11** | Framework backend (API REST) |
| **TypeScript** | Langage de développement |
| **Prisma 7** | ORM et accès base de données |
| **PostgreSQL 16** | Base de données relationnelle |
| **MinIO** | Stockage d’objets (fichiers / documents) |
| **Joi** | Validation des variables d’environnement |
| **Docker & Docker Compose** | Conteneurisation et déploiement |

### Stack résumée

- **API** : NestJS (Express)
- **Base de données** : PostgreSQL via Prisma
- **Stockage fichiers** : MinIO (compatible S3)
- **Config** : `@nestjs/config` + Joi pour `.env`

---

## Frontend (Next.js)

Un frontend Next.js 15 (App Router) + TypeScript strict est fourni dans **`apps/web/`**. Il inclut :

- Auth JWT, rôles (Admin RH, RH, Manager), protection des routes
- Multi-organisation (tenant) via store Zustand + header `X-Organization-Id`
- Structure modulaire (features), TanStack Query + Zustand, SSR pour offres et formulaires

**Documentation détaillée** : [Architecture frontend](docs/FRONTEND_ARCHITECTURE.md) (stratégie SSR, state, librairies, plan de sprints, CI/CD).

Pour lancer le frontend :

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

Le frontend écoute par défaut sur `http://localhost:3000`. Si l’API NestJS utilise déjà le port 3000, lancer le frontend sur un autre port : `npm run dev -- -p 3001` (ou définir `PORT=3001`).

---

## Structure du projet

```
GED_RH/
├── apps/web/              # Frontend Next.js (voir docs/FRONTEND_ARCHITECTURE.md)
├── docs/
│   └── FRONTEND_ARCHITECTURE.md
├── prisma/
│   └── schema.prisma      # Schéma BDD (PostgreSQL)
├── src/
│   ├── app.module.ts      # Module racine
│   ├── main.ts            # Point d’entrée
│   ├── auth/              # Authentification
│   ├── users/             # Utilisateurs
│   ├── organizations/     # Organisations
│   ├── documents/         # GED – documents
│   ├── candidates/        # Candidats
│   ├── forms/             # Formulaires
│   ├── interviews/        # Entretiens
│   ├── notifications/     # Notifications
│   └── prisma/            # Service Prisma
├── docker-compose.yml     # Postgres + MinIO + API
├── Dockerfile             # Image de l’API
└── package.json
```

---

## Fonctionnalités existantes

### En place et utilisables

| Module | État | Détail |
|--------|------|--------|
| **API de base** | ✅ | Route `GET /` (message de bienvenue). |
| **Configuration** | ✅ | Variables d’environnement validées (Joi) : `NODE_ENV`, `PORT`, `DATABASE_URL`, `MINIO_*`. |
| **Base de données** | ✅ | Connexion PostgreSQL via Prisma, hooks de fermeture propre. |
| **Infrastructure** | ✅ | Docker Compose : API, PostgreSQL, MinIO. |

### Modules présents (squelette)

Les routes et services existent mais sont encore **vides ou non implémentés** :

| Module | Route | État |
|--------|--------|------|
| **Utilisateurs** | `/users` | Service avec `create` et `findAll` → `NotImplementedException`. |
| **Authentification** | `/auth` | Contrôleur vide. |
| **Authentification (alt)** | `POST /authentification` | Contrôleur avec une méthode `Login` vide. |
| **Organisations** | `/organizations` | Contrôleur et service vides. |
| **Documents** | `/documents` | Contrôleur et service vides. |
| **Candidats** | `/candidates` | Contrôleur et service vides. |
| **Formulaires** | `/forms` | Contrôleur et service vides. |
| **Entretiens** | `/interviews` | Contrôleur et service vides. |
| **Notifications** | `/notifications` | Contrôleur et service vides. |

### Schéma et données

- **Prisma** : `schema.prisma` configuré pour PostgreSQL, sans modèles pour l’instant.
- **Users** : Présence d’un schéma Mongoose (`users/schemas/user.schema.ts`) pour un modèle `User` (name, email, password) ; le reste de l’app utilise Prisma/PostgreSQL.

---

## Prérequis

- Node.js 20+
- npm
- Docker et Docker Compose (pour l’environnement complet)
- PostgreSQL 16 (ou via Docker)
- MinIO (ou via Docker)

---

## Installation et lancement

### 1. Cloner et installer les dépendances

```bash
git clone <url-du-repo>
cd GED_RH
npm install
```

### 2. Variables d’environnement

Créer un fichier `.env` à la racine :

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gedpro
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=gedpro
```

### 3. Base de données (Prisma)

```bash
npx prisma generate
npx prisma migrate dev   # quand des modèles existent dans schema.prisma
```

### 4. Lancer l’API

```bash
# Mode développement (watch)
npm run start:dev

# Ou mode normal
npm run start
```

L’API écoute sur `http://localhost:3000` (ou le `PORT` défini).

### 5. Tout lancer avec Docker

```bash
docker-compose up -d
```

Cela démarre :

- **API** : port 3000  
- **PostgreSQL** : port 5432  
- **MinIO** : API 9000, console 9001  

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run start` | Démarrage standard |
| `npm run start:dev` | Démarrage en mode watch |
| `npm run start:prod` | Démarrage production (fichiers compilés) |
| `npm run build` | Compilation TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier sur `src` et `test` |
| `npm run test` | Tests unitaires (Jest) |
| `npm run test:e2e` | Tests E2E |
| `npm run test:cov` | Couverture de tests |

---

## Prochaines étapes possibles

1. **Prisma** : Définir les modèles (User, Organization, Document, Candidate, Form, Interview, Notification) dans `schema.prisma` et créer les migrations.
2. **Auth** : Implémenter login (JWT ou sessions) dans `AuthModule` ou `AuthentificationController`.
3. **Utilisateurs** : Implémenter `UsersService.create` et `findAll` avec Prisma (et aligner ou supprimer le schéma Mongoose si tout passe en Prisma).
4. **Documents** : Upload / téléchargement / liste des documents avec MinIO.
5. **Candidats, Formulaires, Entretiens, Notifications** : Implémenter les CRUD et la logique métier selon les besoins RH.

---

## Licence

Projet privé (UNLICENSED).
