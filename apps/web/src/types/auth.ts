import type { Role } from '@/config/constants';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}
