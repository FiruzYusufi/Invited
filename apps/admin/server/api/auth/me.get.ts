import { requireAuth } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    return {
      success: true,
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
