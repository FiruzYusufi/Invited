import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, name, phone } = body

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Токен обязателен'
      })
    }

    const invitation = await prisma.invitation.findUnique({
      where: { clientToken: token }
    })

    if (!invitation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Приглашение не найдено'
      })
    }

    const guest = await prisma.guest.create({
      data: {
        invitationId: invitation.id,
        name,
        phone
      }
    })

    return {
      success: true,
      guest
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Add guest error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
