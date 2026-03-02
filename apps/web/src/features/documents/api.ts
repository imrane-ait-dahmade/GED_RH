import { apiClient, getAuthHeaders } from '@/lib/api/client';
import env from '@/config/env';

export interface Document {
  id: string;
  name: string;
  status?: 'pending' | 'ocr_done' | 'failed';
  skills?: string[];
  createdAt: string;
}

export async function getDocuments(): Promise<Document[]> {
  return apiClient<Document[]>('/documents');
}

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  const raw = await getAuthHeaders();
  const headers = { ...(raw as Record<string, string>) };
  delete headers['Content-Type'];
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/documents/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'Upload failed');
  }
  return res.json();
}
