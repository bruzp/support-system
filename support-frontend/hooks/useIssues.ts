'use client';
import type { DateInput } from '@formkit/tempo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { User } from './useUsers';

export type IssueStatus = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory =
  | 'bug'
  | 'feature_request'
  | 'infrastructure'
  | 'security'
  | 'billing'
  | 'general';

export interface Summary {
  id: number;
  issue_id: number;
  summary: string;
  suggested_action: string;
}

export interface Issue {
  id: number;
  user_id: number;
  title: string;
  description: string;
  priority: IssuePriority;
  category: IssueCategory;
  status: IssueStatus;
  is_escalated: boolean;
  escalated_at: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
  summary?: Summary | null;
  user?: User | null;
}

export interface IssueFilters {
  page?: number;
  status?: IssueStatus | null;
  priority?: IssuePriority | null;
  category?: IssueCategory | null;
}

export interface IssueStorePayload {
  user_id: number;
  title: string;
  description: string;
  priority: IssuePriority;
  category: IssueCategory;
  status: IssueStatus;
}

export interface IssueUpdatePayload {
  title: string;
  description: string;
  priority: IssuePriority;
  category: IssueCategory;
  status: IssueStatus;
  is_escalated?: boolean;
  escalated_at?: DateInput | null;
  acknowledged_at?: DateInput | null;
  resolved_at?: DateInput | null;
  due_at?: DateInput | null;
  summary?: string | null;
  suggested_action?: string | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
  page?: number | null;
}

interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links: PaginationLink[];
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export const issueKeys = {
  all: ['issues'] as const,
  list: (filters: IssueFilters) => ['issues', 'list', filters] as const,
  detail: (id: number) => ['issues', id] as const,
};

export function useIssues(filters: IssueFilters = {}) {
  return useQuery({
    queryKey: issueKeys.list(filters),

    queryFn: async () => {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null));

      const response = await api.get<PaginatedResponse<Issue>>('/issues', { params });

      return response.data;
    },
  });
}

export function useIssue(id: number) {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => api.get<Issue>(`/issues/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssueStorePayload) =>
      api.post<Issue>('/issues', payload).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
  });
}

export function useUpdateIssue(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssueUpdatePayload) =>
      api.put<Issue>(`/issues/${id}`, payload).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(id) });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/issues/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
  });
}
