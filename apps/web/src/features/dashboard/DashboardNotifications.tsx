'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from './hooks';
import type { Notification } from './api';

function formatNotificationDate(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

function NotificationsInner() {
  const { data, isPending, isError } = useNotifications(5);

  if (isPending || isError) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-52" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const list = data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Dernières notifications</CardDescription>
        </div>
        {list.length > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard#notifications">Voir tout</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-500">
            Aucune notification.
          </p>
        ) : (
          <ul className="space-y-2">
            {list.slice(0, 5).map((n) => (
              <li
                key={n.id}
                className={`rounded-lg border p-3 transition-colors ${
                  n.read
                    ? 'border-transparent bg-transparent'
                    : 'border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/30'
                }`}
              >
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {n.title}
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  {n.message}
                </p>
                <p className="mt-1 text-xs text-surface-400">
                  {formatNotificationDate(n.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardNotifications = memo(NotificationsInner);
