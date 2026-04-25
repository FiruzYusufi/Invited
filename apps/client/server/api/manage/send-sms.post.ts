import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { guestIds } = body

    if (!guestIds || !Array.isArray(guestIds)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Список ID гостей обязателен'
      })
    }

    // Имитация отправки SMS
    await prisma.guest.updateMany({
      where: {
        id: { in: guestIds }
      },
      data: {
        smsSent: true
      }
    })

    return {
      success: true,
      message: `SMS успешно отправлены ${guestIds.length} гостям`
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Send SMS error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
