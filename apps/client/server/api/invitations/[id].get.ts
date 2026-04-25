import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const invitationId = getRouterParam(event, 'id')
    
    if (!invitationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID приглашения не указан'
      })
    }

    // Получаем приглашение
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        purchase: {
          include: {
            package: true
          }
        }
      }
    })

    if (!invitation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Приглашение не найдено'
      })
    }

    if (!invitation.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Приглашение неактивно'
      })
    }

    // Проверяем, не истек ли пакет
    const purchase = invitation.purchase
    if (purchase.expiresAt && purchase.expiresAt < new Date()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Срок действия приглашения истек'
      })
    }

    // Увеличиваем счетчик просмотров
    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        viewCount: invitation.viewCount + 1
      }
    })

    return {
      success: true,
      invitation: {
        id: invitation.id,
        title: invitation.title,
        groomName: invitation.groomName,
        brideName: invitation.brideName,
        eventDate: invitation.eventDate,
        location: invitation.location,
        description: invitation.description,
        theme: invitation.theme,
        customCss: invitation.customCss,
        musicUrl: invitation.musicUrl,
        viewCount: invitation.viewCount + 1,
        rsvpCount: invitation.rsvpCount,
        createdAt: invitation.createdAt
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