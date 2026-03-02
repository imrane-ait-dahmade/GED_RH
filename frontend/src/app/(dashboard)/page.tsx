'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStatsCards = dynamic(
  () =>
    import('@/features/dashboard/DashboardStatsCards').then((m) => m.DashboardStatsCards),
  {
    loading: () => <DashboardStatsSkeleton />,
    ssr: false,
  }
);

const DashboardInterviewsList = dynamic(
  () =>
    import('@/features/dashboard/DashboardInterviewsList').then(
      (m) => m.DashboardInterviewsList
    ),
  {
    loading: () => <InterviewsListSkeleton />,
    ssr: false,
  }
);

const DashboardNotifications = dynamic(
  () =>
    import('@/features/dashboard/DashboardNotifications').then(
      (m) => m.DashboardNotifications
    ),
  {
    loading: () => <NotificationsSkeleton />,
    ssr: false,
  }
);

function DashboardStatsSkeleton() {
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

function InterviewsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSkeleton() {
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Dashboard RH
        </h1>
        <p className="mt-1 text-surface-600 dark:text-surface-400">
          Vue d&apos;ensemble et activité récente.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStatsCards />
        </Suspense>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Suspense fallback={<InterviewsListSkeleton />}>
            <DashboardInterviewsList />
          </Suspense>
        </motion.div>
        <motion.div variants={item}>
          <Suspense fallback={<NotificationsSkeleton />}>
            <DashboardNotifications />
          </Suspense>
        </motion.div>
      </div>
    </motion.div>
  );
}
