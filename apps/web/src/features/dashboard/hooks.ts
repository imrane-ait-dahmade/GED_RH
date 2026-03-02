import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getInterviews,
  getNotifications,
} from './api';
import type { DashboardStats, Interview, Notification } from './api';

const STALE_STATS = 60 * 1000;
const STALE_LIST = 30 * 1000;

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    staleTime: STALE_STATS,
  });
}

export function useInterviews(limit = 5) {
  return useQuery<Interview[]>({
    queryKey: ['dashboard', 'interviews', limit],
    queryFn: () => getInterviews(limit),
    staleTime: STALE_LIST,
  });
}

export function useNotifications(limit = 10) {
  return useQuery<Notification[]>({
    queryKey: ['dashboard', 'notifications', limit],
    queryFn: () => getNotifications(limit),
    staleTime: 20 * 1000,
  });
}
