export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('admin-token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }

  try {
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!response.success || response.user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Доступ запрещен. Требуются права администратора.'
      })
    }
  } catch (error) {
    return navigateTo('/auth/login')
  }
})
