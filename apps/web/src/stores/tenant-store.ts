import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Organization {
  id: string;
  name: string;
}

interface TenantState {
  currentOrganizationId: string | null;
  organizations: Organization[];
  setCurrentOrganization: (id: string | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentOrganizationId: null,
      organizations: [],
      setCurrentOrganization: (id) => set({ currentOrganizationId: id }),
      setOrganizations: (orgs) => set({ organizations: orgs }),
    }),
    { name: 'ged-rh-tenant', partialize: (s) => ({ currentOrganizationId: s.currentOrganizationId }) }
  )
);
