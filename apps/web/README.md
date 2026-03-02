# GED RH — Frontend

Next.js 15 (App Router) + TypeScript strict.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts

| Commande           | Description              |
|--------------------|--------------------------|
| `npm run dev`      | Serveur de développement |
| `npm run build`    | Build production         |
| `npm run start`    | Démarrer en production   |
| `npm run lint`     | ESLint                   |
| `npm run format`   | Prettier (écriture)       |
| `npm run format:check` | Prettier (vérification) |
| `npm run typecheck`| TypeScript (sans émission)|
| `npm run test`     | Jest                     |

## Structure

- `src/app` — App Router (layouts, pages)
- `src/components` — UI, layout, auth
- `src/config` — Constantes, env, auth, rôles
- `src/features` — Modules métier (auth, documents, …)
- `src/hooks` — Hooks (useRole, …)
- `src/lib` — API client, React Query
- `src/stores` — Zustand (auth, tenant, ui)
- `src/types` — Types globaux

## Variables d'environnement

- `NEXT_PUBLIC_API_URL` — URL de l’API backend (ex. `http://localhost:3000`)
