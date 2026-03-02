# Auth — SSR & client

## Côté client

- **useAuth()** : `login`, `logout`, `refresh`, `user`, `isAuthenticated`, `isLoading`, `error`
- **Store** : access token en mémoire uniquement (pas de `persist`), cookie posé pour le middleware
- **API** : 401 → tentative de refresh (cookie httpOnly envoyé) → retry ou redirection login

## Côté serveur (SSR)

```ts
import { getServerSession } from '@/lib/auth';

export default async function Page() {
  const { user, expired } = await getServerSession();
  if (!user) redirect('/login');
  return <div>Bonjour {user.name}</div>;
}
```

## Backend attendu

- `POST /auth/login` : body `{ email, password }` → `{ accessToken, user, expiresIn }` (+ optionnel `Set-Cookie` refresh httpOnly)
- `POST /auth/refresh` : cookie refresh envoyé → `{ accessToken, user?, expiresIn }`
- `POST /auth/logout` : invalidation session / refresh token
