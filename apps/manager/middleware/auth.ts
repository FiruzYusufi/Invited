export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('manager-token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }

  try {
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!response.success) {
      token.value = null
      return navigateTo('/auth/login')
    }

    const allowedRoles = ['MANAGER', 'ADMIN']
    if (!allowedRoles.includes(response.user.role)) {
      token.value = null
      return navigateTo('/auth/login')
    }
  } catch (error) {
    token.value = null
    return navigateTo('/auth/login')
  }
})
