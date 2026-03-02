'use client';

import { memo } from 'react';
import { Briefcase, Calendar, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from './hooks';
import type { DashboardStats } from './api';

const config: { key: keyof DashboardStats; label: string; Icon: typeof Users }[] = [
  { key: 'candidaturesEnAttente', label: 'Candidatures en attente', Icon: Users },
  { key: 'entretiensCetteSemaine', label: 'Entretiens cette semaine', Icon: Calendar },
  { key: 'offresActives', label: 'Offres actives', Icon: Briefcase },
  { key: 'documentsEnAttente', label: 'Documents en attente', Icon: FileText },
];

function StatsCardsInner() {
  const { data, isPending, isError } = useDashboardStats();

  if (isPending || isError) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = data ?? {
    candidaturesEnAttente: 0,
    entretiensCetteSemaine: 0,
    offresActives: 0,
    documentsEnAttente: 0,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {config.map(({ key, label, Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
              {label}
            </span>
            <Icon className="h-8 w-8 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const DashboardStatsCards = memo(StatsCardsInner);
