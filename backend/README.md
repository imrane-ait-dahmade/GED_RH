# GED RH — Backend (API)

API NestJS : authentification, utilisateurs, organisations, documents, candidats, formulaires, entretiens, notifications.

## Prérequis

- Node.js 20+
- PostgreSQL 16
- MinIO (stockage fichiers)

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env (DATABASE_URL, MINIO_*)
npx prisma generate
npx prisma migrate dev
```

## Lancer l'API

```bash
npm run start:dev
```

API : http://localhost:3000

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run start:dev` | Développement (watch) |
| `npm run build` | Build production |
| `npm run start:prod` | Démarrer en production |
| `npm run test` | Tests unitaires |
| `npm run lint` | ESLint |

## Variables d'environnement

Voir `.env.example` à la racine de `backend/`.
