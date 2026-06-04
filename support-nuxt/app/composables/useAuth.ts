export function useAuth() {
  const token = useCookie('nuxt_auth_token')
  const isPending = ref(false)
  const error = ref<string | null>(null)

  async function login(email: string, password: string) {
    isPending.value = true
    error.value = null
    try {
      const api = useApi()
      const response = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      token.value = response.token
      await navigateTo('/dashboard/issues')
    } catch (err: any) {
      error.value = err?.data?.message ?? 'Login failed'
    } finally {
      isPending.value = false
    }
  }

  async function logout() {
    const api = useApi()
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      token.value = null
      await navigateTo('/auth/login')
    }
  }

  return { login, logout, isPending, error }
}
