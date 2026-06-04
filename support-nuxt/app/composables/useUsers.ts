import type { User } from '~/types/issues'

export function useUsers() {
  const api = useApi()

  return useAsyncData('users', () =>
    api<User[]>('/users')
  )
}
