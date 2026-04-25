export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('client-token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }

  try {
    const response = await $fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!response.success) {
      token.value = null
      return navigateTo('/auth/login')
    }

    // Client app allows USER, CLIENT, MANAGER, ADMIN
    const allowedRoles = ['USER', 'CLIENT', 'MANAGER', 'ADMIN']
    if (!allowedRoles.includes(response.user.role)) {
      token.value = null
      return navigateTo('/auth/login')
    }
  } catch (error) {
    token.value = null
    return navigateTo('/auth/login')
  }
})
