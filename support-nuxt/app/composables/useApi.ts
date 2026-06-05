export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie('nuxt_auth_token')

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        useCookie('nuxt_auth_token').value = null
        navigateTo('/auth/login')
      }
    }
  })
}
