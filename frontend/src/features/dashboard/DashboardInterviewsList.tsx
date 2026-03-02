'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useInterviews } from './hooks';
import type { Interview } from './api';

const statusVariant: Record<Interview['status'], 'default' | 'secondary' | 'success' | 'warning'> = {
  planned: 'warning',
  done: 'success',
  cancelled: 'secondary',
};

const statusLabel: Record<Interview['status'], string> = {
  planned: 'Prévu',
  done: 'Terminé',
  cancelled: 'Annulé',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function InterviewsListInner() {
  const { data, isPending, isError } = useInterviews(5);

  if (isPending || isError) {
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

  const list = data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochains entretiens
          </CardTitle>
          <CardDescription>Derniers entretiens planifiés</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/entretiens">Voir tout</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-500">
            Aucun entretien à afficher.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Offre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.candidateName}</TableCell>
                  <TableCell>{row.offerTitle}</TableCell>
                  <TableCell className="text-surface-500">
                    {formatDate(row.scheduledAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[row.status]}>
                      {statusLabel[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/entretiens/${row.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardInterviewsList = memo(InterviewsListInner);
