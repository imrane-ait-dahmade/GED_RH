# GED RH — Gestion Électronique des Documents (Ressources Humaines)

Application backend de **Gestion Électronique des Documents** pour le domaine **Ressources Humaines**. Elle permet de gérer des documents, candidats, entretiens, formulaires et notifications dans un contexte RH.

---

## Démarrer le projet

**Documentation de démarrage** : **[docs/DEMARRAGE_RAPIDE.md](docs/DEMARRAGE_RAPIDE.md)** — étapes pour lancer le backend (API) et le frontend (Next.js), avec ou sans Docker.

En bref :
- **Backend** : `cd backend` → `.env` (voir `backend/.env.example`) + `npm install` + `npx prisma generate` + `npm run start:dev` (ou `docker-compose up -d` à la racine).
- **Frontend** : `cd frontend` → `cp .env.example .env` + `npm install` + `npm run dev`.

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

## Backend et Frontend (deux dossiers séparés)

Le dépôt est organisé en **deux projets distincts** :

| Dossier | Rôle |
|---------|------|
| **`backend/`** | API NestJS (Prisma, PostgreSQL, MinIO). Voir [backend/README.md](backend/README.md). |
| **`frontend/`** | Application Next.js (App Router, auth, dashboard, modules RH). Voir [frontend/README.md](frontend/README.md). |

### Frontend (Next.js)

Le frontend dans **`frontend/`** inclut : auth JWT, rôles (Admin RH, RH, Manager), multi-organisation (tenant), structure modulaire, TanStack Query + Zustand.

**Documentation détaillée** : [Architecture frontend](docs/FRONTEND_ARCHITECTURE.md).

Pour lancer le frontend :

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Le frontend écoute par défaut sur `http://localhost:3000`. Si l’API utilise déjà le port 3000 : `npm run dev -- -p 3001`.

---

## Structure du projet

```
GED_RH/
├── backend/               # API NestJS (voir backend/README.md)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/              # Application Next.js (voir frontend/README.md)
│   ├── src/
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── DEMARRAGE_RAPIDE.md
│   └── FRONTEND_ARCHITECTURE.md
├── .github/workflows/     # CI (frontend)
└── docker-compose.yml     # Postgres + MinIO + API (build: ./backend)
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

## Scripts

Les commandes s’exécutent **dans le dossier concerné** (`backend/` ou `frontend/`).

**Backend** (dans `backend/`) : `npm run start:dev`, `npm run build`, `npm run test`, etc.  
**Frontend** (dans `frontend/`) : `npm run dev`, `npm run build`, `npm run lint`, `npm run test`, etc.

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
