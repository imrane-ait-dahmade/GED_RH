import { apiClient } from '@/lib/api/client';

export interface DashboardStats {
  candidaturesEnAttente: number;
  entretiensCetteSemaine: number;
  offresActives: number;
  documentsEnAttente: number;
}

export interface Interview {
  id: string;
  candidateName: string;
  offerTitle: string;
  scheduledAt: string;
  status: 'planned' | 'done' | 'cancelled';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning';
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await apiClient<DashboardStats>('/dashboard/stats');
  } catch {
    return {
      candidaturesEnAttente: 0,
      entretiensCetteSemaine: 0,
      offresActives: 0,
      documentsEnAttente: 0,
    };
  }
}

export async function getInterviews(limit = 5): Promise<Interview[]> {
  try {
    const data = await apiClient<{ data: Interview[] } | Interview[]>(
      `/interviews?limit=${limit}`
    );
    return Array.isArray(data) ? data : (data as { data: Interview[] }).data ?? [];
  } catch {
    return [];
  }
}

export async function getNotifications(limit = 10): Promise<Notification[]> {
  try {
    const data = await apiClient<Notification[] | { data: Notification[] }>(
      `/notifications?limit=${limit}`
    );
    return Array.isArray(data) ? data : (data as { data: Notification[] }).data ?? [];
  } catch {
    return [];
  }
}
