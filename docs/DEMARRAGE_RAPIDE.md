# Démarrer le projet GED RH

Guide pas à pas pour lancer le **backend** (API NestJS) et le **frontend** (Next.js).

---

## Prérequis

- **Node.js** 20 ou plus ([télécharger](https://nodejs.org/))
- **npm** (fourni avec Node.js)
- **Git** (pour cloner le dépôt)

Optionnel (pour tout lancer en un clic) :
- **Docker** et **Docker Compose**

---

## Option A : Lancer avec Docker (le plus simple)

Une seule commande démarre l’API, PostgreSQL et MinIO.

```bash
# À la racine du projet GED_RH
docker-compose up -d
```

- **API** : http://localhost:3000  
- **PostgreSQL** : port 5432  
- **MinIO** (fichiers) : API 9000, console http://localhost:9001  

Ensuite, pour le frontend : voir [Option C – Frontend](#option-c--lancer-le-frontend-nextjs) (dossier **frontend/**).

---

## Option B : Lancer le backend (API) à la main

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd GED_RH
```

### 2. Fichier `.env` pour le backend

Créez un fichier `.env` dans le dossier **backend/** (copiez depuis `backend/.env.example`) :

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gedpro
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=gedpro
```

> Vous devez avoir **PostgreSQL** et **MinIO** qui tournent (en local ou via Docker).  
> Sinon, utilisez **Option A** avec `docker-compose up -d` pour les démarrer.

### 3. Base de données (Prisma)

```bash
npx prisma generate
npx prisma migrate dev
```

(Si aucun modèle n’existe encore dans `schema.prisma`, la migration peut être vide ; `prisma generate` suffit.)

### 4. Démarrer l’API

```bash
npm run start:dev
```

L’API est disponible sur **http://localhost:3000**.

---

## Option C : Lancer le frontend (Next.js)

Le frontend appelle l’API backend. Lancez d’abord le backend (Option A ou B), puis :

### 1. Aller dans le dossier frontend

```bash
cd frontend
```

### 2. Copier le fichier d’exemple d’environnement

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

### 3. Vérifier le fichier `.env`

Ouvrez `frontend/.env` et assurez-vous que l’URL de l’API pointe vers le backend :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si votre API tourne sur un autre port (par ex. 3001), mettez par exemple :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Installer les dépendances et lancer

```bash
npm install
npm run dev
```

Le site est accessible sur **http://localhost:3000** (ou **http://localhost:3001** si vous avez choisi le port 3001).

> Si le port 3000 est déjà pris par l’API backend, lancez le frontend sur un autre port :  
> `npm run dev -- -p 3001`

---

## Récap : tout lancer (backend + frontend)

**Terminal 1 – Backend** :

```bash
cd GED_RH
# Si vous utilisez Docker (à la racine) :
docker-compose up -d

# OU sans Docker (depuis backend/) :
cd backend
npm install
# Créer .env (copier depuis backend/.env.example)
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**Terminal 2 – Frontend** :

```bash
cd GED_RH/frontend
copy .env.example .env   # ou cp .env.example .env
npm install
npm run dev
```

Puis ouvrir **http://localhost:3000** (frontend) dans le navigateur.  
Si le frontend tourne sur 3001 : **http://localhost:3001**.

---

## En cas de problème

| Problème | À vérifier |
|----------|------------|
| L’API ne démarre pas | `.env` dans **backend/**, PostgreSQL et MinIO accessibles, `npm install` et `npx prisma generate` faits. |
| Le frontend n’affiche rien / erreur réseau | `NEXT_PUBLIC_API_URL` dans `frontend/.env` pointe vers l’URL du backend (ex. `http://localhost:3000`). |
| Port déjà utilisé | Changer `PORT` dans **backend/.env** ou lancer le frontend avec `npm run dev -- -p 3001`. |
| Erreur Prisma | Dans **backend/** : `npx prisma generate` puis `npx prisma migrate dev`. |

---

## Liens utiles

- [README principal](../README.md) – Vue d’ensemble du projet
- [Architecture frontend](FRONTEND_ARCHITECTURE.md) – Détails techniques du frontend
