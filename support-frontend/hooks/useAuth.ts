'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

type LoginPayload = {
  email: string;
  password: string;
}

type AuthResponse = {
  token: string;
  user: { id: number; name: string };
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

    onSuccess: (data) => {
      document.cookie = `auth_token=${data.token}; path=/; SameSite=Lax`;
      router.push('/dashboard/issues');
    },
  });

  async function logout() {
    try {
      // Tell the API to revoke the Sanctum token
      await api.post('/auth/logout');
    } finally {
      // Always clear cookie + cache regardless of API response
      document.cookie = 'auth_token=; path=/; max-age=0';

      // Wipe every cached query — prevents the next user from
      // briefly seeing the previous user's data
      queryClient.clear();

      router.push('/auth/login');
    }
  }

  return {
    login: loginMutation.mutate,
    logout,
    isPending: loginMutation.isPending,
    error: loginMutation.error as Error | null,
  };
}
