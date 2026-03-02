# Architecture Frontend GED RH — Next.js App Router

Document d’architecture frontend pour la plateforme **GED RH** (Gestion Électronique des Documents — Ressources Humaines). Niveau production, aligné avec le backend NestJS existant.

---

## 1. Stack technique recommandée

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Framework** | Next.js 15+ (App Router) | SSR/SSG natif, RSC, API routes si besoin, écosystème mature. |
| **Langage** | TypeScript (strict) | Typage strict pour réduire les bugs et faciliter la maintenance. |
| **Requêtes serveur / cache** | TanStack Query (React Query) v5 | Cache dédié aux données serveur, invalidation, retry, SSR-friendly (`prefetchQuery`). |
| **State client global** | Zustand | Léger, sans boilerplate, bon pour auth, tenant, UI (sidebar, modals). Évite le mélange avec les données serveur. |
| **Formulaires** | React Hook Form + Zod | Performant (peu de re-renders), validation côté client/serveur partagée avec Zod. |
| **UI / Design** | Composants sur mesure + Tailwind CSS | Contrôle total, pas de surcharge. Radix UI ou Headless UI pour accessibilité si besoin. |
| **HTTP client** | fetch natif + couche `api/` | Pas de dépendance lourde ; intercepteurs gérés dans une couche dédiée (auth, tenant). |
| **Temps réel** | Socket.io-client ou SSE | Aligné avec ce que le backend NestJS peut exposer (WebSockets ou Server-Sent Events). |
| **Tests** | Jest + React Testing Library | Standard, intégration Next.js, bon pour composants et hooks. |
| **E2E** | Playwright (recommandé) ou Cypress | Plus adapté à Next.js et multi-navigateurs que Cypress pour certains cas. |
| **Lint / Format** | ESLint (Next/core) + Prettier | Cohérence du code. |
| **CI/CD** | GitHub Actions + Docker | Build, tests, image Docker du frontend pour déploiement. |

---

## 2. Gestion du state — stratégie et justification

### Principe : séparation nette des responsabilités

- **Données serveur (API)** → **TanStack Query (React Query)**  
  - Liste candidats, documents, offres, entretiens, formulaires, etc.  
  - Cache, refetch, invalidation, état loading/error.  
  - SSR : `prefetchQuery` dans les Server Components / `loaders`.

- **State client global (auth, tenant, UI)** → **Zustand**  
  - Utilisateur connecté, token, rôle, organisation courante.  
  - Préférences UI (sidebar pliée, thème), modals globaux.  
  - Pas de duplication avec React Query : Zustand = “qui est connecté” et “dans quelle org”, React Query = “les données de l’API”.

- **Context React** → **Usage limité**  
  - Uniquement pour fournir des dépendances “injectables” (thème, tenant, auth) aux composants sans prop drilling, en lecture.  
  - Le “state” réel (token, user, org) peut vivre dans Zustand ; le Context ne fait qu’exposer des sélecteurs ou le store Zustand.  
  - Éviter d’utiliser Context pour des données listables (listes, pagination) → React Query.

**Résumé**

- **React Query** : source de vérité pour tout ce qui vient de l’API (CRUD, listes, détails).  
- **Zustand** : source de vérité pour session (JWT, user, rôle), organisation courante (multi-tenant), état UI global.  
- **Context** : injection de ces stores ou de config (theme, tenant) en lecture seule.

---

## 3. Structure des dossiers (frontend)

À la racine du repo, le frontend peut vivre dans `apps/web` (monorepo) ou à la racine d’un repo dédié. Exemple avec `apps/web` :

```
apps/web/
├── public/
├── src/
│   ├── app/                          # App Router
│   │   ├── (auth)/                   # Groupe : pages non authentifiées
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Groupe : zone authentifiée
│   │   │   ├── layout.tsx            # Layout avec sidebar, vérif auth + tenant
│   │   │   ├── page.tsx              # Dashboard RH
│   │   │   ├── offres/
│   │   │   │   ├── page.tsx          # Liste (SSR)
│   │   │   │   └── [id]/page.tsx     # Détail (SSR)
│   │   │   ├── candidats/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── entretiens/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── formulaires/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx     # Formulaire dynamique (SSR)
│   │   │   └── parametres/
│   │   │       └── page.tsx
│   │   ├── api/                      # Route handlers si besoin (proxy, webhooks)
│   │   │   └── ...
│   │   ├── layout.tsx                # Root layout (providers)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # Composants réutilisables purs
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── OrgSwitcher.tsx
│   │   └── shared/
│   │       ├── DataTable.tsx
│   │       ├── FileUpload.tsx
│   │       └── ...
│   │
│   ├── features/                     # Modules métier (feature-based)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   ├── documents/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── candidats/
│   │   ├── entretiens/
│   │   ├── formulaires/
│   │   └── notifications/
│   │
│   ├── lib/
│   │   ├── api/                      # Client HTTP, intercepteurs
│   │   │   ├── client.ts
│   │   │   ├── auth-interceptor.ts
│   │   │   └── tenant-interceptor.ts
│   │   ├── auth/                     # JWT, vérification rôles
│   │   │   ├── jwt.ts
│   │   │   └── permissions.ts
│   │   ├── tenant/
│   │   │   └── organization.ts
│   │   └── utils.ts
│   │
│   ├── stores/                       # Zustand
│   │   ├── auth-store.ts
│   │   ├── tenant-store.ts
│   │   └── ui-store.ts
│   │
│   ├── types/                        # Types globaux, DTOs partagés
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── models.ts
│   │
│   └── config/
│       ├── env.ts                    # Variables d’environnement typées
│       └── constants.ts
│
├── tests/
│   ├── setup.ts
│   ├── mocks/
│   └── e2e/
│
├── .github/workflows/                # CI/CD (voir section dédiée)
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Organisation des modules (features)

Chaque **feature** (`auth`, `documents`, `candidats`, etc.) est autonome :

- **components/** : composants spécifiques au domaine.  
- **hooks/** : `useDocuments`, `useCandidates`, etc. (wrapper autour de React Query + appels API).  
- **api.ts** : fonctions qui appellent l’API (`getDocuments`, `uploadDocument`, …).  
- **types.ts** : types et DTOs du domaine.

Les **pages** dans `app/` importent depuis `features/*` et `components/ui` ; elles restent fines et délèguent la logique aux hooks et aux composants de feature.

---

## 5. Stratégie SSR détaillée

### Quand utiliser quoi

| Type de contenu | Stratégie | Raison |
|-----------------|-----------|--------|
| **Offres d’emploi** (liste + détail) | SSR | SEO, partage, premier affichage rapide. |
| **Formulaires dynamiques** (définition + rendu) | SSR | Définition du formulaire connue au premier chargement, cohérence. |
| **Dashboard RH** | SSR optionnel (données agrégées) ou CSR après shell SSR | Données sensibles, pas besoin SEO ; shell en SSR, données en client. |
| **Documents, Candidats, Entretiens** | Préférence CSR avec prefetch en SSR si possible | Données souvent protégées et contextuelles (tenant). |
| **Login / Auth** | CSR | Pas de contenu à indexer. |

### Implémentation technique

- **Server Components** par défaut pour les pages listées en SSR.  
- **`prefetchQuery`** (TanStack Query) dans un Server Component ou dans un “loader” (pattern avec `queryClient.prefetchQuery` dans la page ou un layout) pour remplir le cache côté serveur ; hydratation sans flash.  
- **Cookie HTTP-only** pour le token (si le backend le supporte) permet d’envoyer le token depuis le serveur Next.js vers l’API (fetch depuis `getServerSession` ou équivalent). Sinon, **JWT en mémoire + cookie non HTTP-only** pour “savoir si connecté” en SSR (à utiliser avec précaution côté serveur).  
- Pour les **formulaires dynamiques** : la définition (champs, règles) est chargée en SSR ; le rendu peut être Server Component qui passe la config à un Client Component pour les interactions.

Exemple conceptuel (offre d’emploi) :

```ts
// app/(dashboard)/offres/[id]/page.tsx
import { getQueryClient } from '@/lib/api/query-client';
import { fetchOffer } from '@/features/offres/api';
import { OfferView } from '@/features/offres/components/OfferView';

export default async function OfferPage({ params }: { params: { id: string } }) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey: ['offer', params.id], queryFn: () => fetchOffer(params.id) });
  return <OfferView id={params.id} />;
}
```

`OfferView` est un Client Component qui fait `useQuery(['offer', id])` et reçoit les données déjà en cache.

---

## 6. Stratégie de protection des routes

### Rôles

- **Admin RH** : accès complet (paramètres, gestion org, utilisateurs).  
- **RH** : dashboard, documents, candidats, entretiens, formulaires.  
- **Manager** : lecture/écriture limitée à son périmètre (ex. candidats de ses offres, entretiens associés).

### Mécanismes

1. **Middleware Next.js** (`middleware.ts` à la racine)  
   - Vérifier la présence du token (cookie ou header).  
   - Rediriger `/login` si non authentifié.  
   - Ne pas gérer les rôles dans le middleware (pas d’accès au store Zustand ou à l’API) : uniquement “authentifié oui/non”.

2. **Layout dashboard** (`(dashboard)/layout.tsx`)  
   - Côté serveur : si possible, valider le token (JWT) et récupérer user/role (via cookie ou session).  
   - Côté client : lecture du store auth (Zustand) pour rôle et organisation.  
   - Afficher une **403** ou rediriger si le rôle n’a pas accès à la section (ex. Manager sur une page “Paramètres org”).

3. **Composant `RequireRole`**  
   - Utilisé dans les pages ou sous-layouts : `RequireRole roles={['ADMIN_RH', 'RH']}`.  
   - Lit le store auth (ou un Context dérivé) et rend soit les enfants, soit un message d’interdiction.

4. **API**  
   - Chaque requête envoie le JWT (Bearer). Le backend NestJS fait la vérification de rôle et de tenant ; le frontend ne fait que cacher les UI non autorisées et respecter les 403.

Résumé : **Middleware = authentification (oui/non)** ; **Layout + RequireRole = autorisation (rôles)** ; **Backend = source de vérité**.

---

## 7. Stratégie multi-tenant (multi-organisation)

### Principe

- L’utilisateur peut appartenir à plusieurs organisations ; **une organisation est “courante”** par session (ou par onglet).  
- Toutes les requêtes API (candidats, documents, offres, etc.) sont **scopées** par l’organisation courante.

### Implémentation

- **Store Zustand `tenant-store`** : `currentOrganizationId: string | null`.  
- **Sélecteur d’organisation** dans le layout (Header/Sidebar) : `OrgSwitcher` met à jour ce store.  
- **Intercepteur API** (dans `lib/api/`) : ajoute systématiquement un header (ex. `X-Organization-Id`) ou un query param à chaque requête vers l’API, à partir de `currentOrganizationId`.  
- **Persistance** : `currentOrganizationId` en `localStorage` ou cookie pour conserver le choix entre rechargements.  
- **Routes** : pas de segment d’URL obligatoire du type `/[orgId]/...` pour simplifier ; l’org est en state + header. Si besoin de deep-links par org, on peut ajouter un segment optionnel ou un query param.

---

## 8. Auth (JWT) — flux et stockage

- **Login** : `POST /auth/login` → backend renvoie `{ accessToken, user, expiresIn }`.  
- **Stockage** :  
  - **Option A** : token en mémoire (Zustand) + refresh token en cookie HTTP-only (si le backend le gère).  
  - **Option B** : token dans `localStorage` (plus simple, moins sécurisé) ; à éviter en production si possible, privilégier cookie HTTP-only pour le refresh.  
- **Envoi** : intercepteur ajoute `Authorization: Bearer <token>`.  
- **Refresh** : si le backend expose `POST /auth/refresh`, l’intercepteur détecte un 401, appelle refresh, réessaie la requête ; si refresh échoue → déconnexion et redirection `/login`.  
- **Déconnexion** : suppression du token et du state auth, redirection vers `/login`.

---

## 9. Librairies recommandées (résumé)

| Domaine | Librairie | Justification |
|---------|-----------|---------------|
| Requêtes / cache | TanStack Query v5 | Standard pour données serveur, cache, SSR, DevTools. |
| State client | Zustand | Simple, performant, pas de Provider imbriqué. |
| Formulaires | React Hook Form + Zod | Performances, schémas réutilisables (client + serveur). |
| Styles | Tailwind CSS | Rapidité, cohérence, pas de CSS-in-JS runtime. |
| Composants accessibles | Radix UI (optionnel) | Primitives accessibles sans imposer un design. |
| Dates | date-fns | Léger, immuable, typé. |
| Temps réel | socket.io-client ou EventSource | Selon ce que le backend expose. |
| Tests | Jest, RTL, MSW | Jest + RTL pour composants/hooks ; MSW pour mocker l’API. |
| E2E | Playwright | Bonne intégration Next.js, multi-navigateurs. |

---

## 10. Plan de sprints réaliste (ordre suggéré)

- **Sprint 0 (1–2 j)** : Init Next.js (App Router), TypeScript strict, Tailwind, structure dossiers, ESLint/Prettier, CI (lint + build).  
- **Sprint 1 (3–5 j)** : Auth (login, JWT, store Zustand, middleware protection routes, RequireRole).  
- **Sprint 2 (2–3 j)** : Multi-tenant (store org, OrgSwitcher, intercepteur `X-Organization-Id`).  
- **Sprint 3 (3–4 j)** : Dashboard RH (layout, sidebar, première page dashboard avec données préfetch/SSR optionnel).  
- **Sprint 4 (4–5 j)** : Offres d’emploi (liste + détail en SSR, CRUD si besoin).  
- **Sprint 5 (4–5 j)** : Documents (upload, liste, statut OCR, skills).  
- **Sprint 6 (3–4 j)** : Candidats (liste, fiche, lien avec offres/documents).  
- **Sprint 7 (3–4 j)** : Entretiens (liste, détail, planification).  
- **Sprint 8 (4–5 j)** : Formulaires dynamiques (définition en SSR, rendu, soumission).  
- **Sprint 9 (2–3 j)** : Notifications temps réel (WebSocket ou SSE, badge, liste).  
- **Sprint 10 (2–3 j)** : Tests (Jest/RTL sur hooks et composants critiques, MSW pour API).  
- **Sprint 11 (1–2 j)** : CI/CD (GitHub Actions : lint, test, build, Docker, déploiement).

Total indicatif : **~10–12 semaines** pour une équipe de 1–2 devs frontend, en fonction du détail des écrans et des intégrations backend.

---

## 11. CI/CD et Docker

- **GitHub Actions** :  
  - Sur push/PR : `npm ci`, `npm run lint`, `npm run test`, `npm run build`.  
  - Build d’une image Docker du frontend (Next.js standalone).  
- **Dockerfile** : multi-stage (build Node, run avec `node server.js`), exposition du port 3000.  
- Variables d’environnement (API URL, etc.) injectées au runtime ; pas de secrets dans l’image.

---

## 12. Optimisation performance

- **React Query** : `staleTime` / `gcTime` adaptés par type de donnée (ex. liste candidats 1 min, paramètres org 5 min).  
- **Next.js** : `dynamic` pour les gros composants client (ex. éditeur riche, graphiques).  
- **Images** : `next/image` avec domaine configuré pour les assets externes.  
- **Bundle** : analyse avec `@next/bundle-analyzer` ; lazy load des routes lourdes.  
- **SSR** : limiter les données préfetch au strict nécessaire pour le premier écran.

---

Ce document sert de référence pour l’équipe et peut être complété par des ADR (Architecture Decision Records) pour les choix importants (auth, multi-tenant, choix de librairies).
