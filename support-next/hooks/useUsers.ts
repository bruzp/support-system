import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export type User = {
  id: number;
  name: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/users');
      return response.data;
    },
  });
}
