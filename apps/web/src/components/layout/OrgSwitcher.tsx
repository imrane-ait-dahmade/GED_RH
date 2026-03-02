'use client';

import { useTenantStore } from '@/stores/tenant-store';

export function OrgSwitcher() {
  const { organizations, currentOrganizationId, setCurrentOrganization } =
    useTenantStore();

  if (organizations.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-surface-600 dark:text-surface-400">
        Organisation
      </label>
      <select
        value={currentOrganizationId ?? ''}
        onChange={(e) => setCurrentOrganization(e.target.value || null)}
        className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-200"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}
