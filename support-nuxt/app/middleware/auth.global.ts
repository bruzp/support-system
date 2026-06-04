const PUBLIC_ROUTES = ['/auth/login']

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('nuxt_auth_token')
  const isPublic = PUBLIC_ROUTES.some(r => to.path.startsWith(r))

  if (isPublic && token.value) {
    return navigateTo('/dashboard/issues')
  }

  if (!isPublic && !token.value) {
    return navigateTo('/auth/login')
  }
})
