import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const invitationId = getRouterParam(event, 'invitationId')
    const body = await readBody(event)
    
    const { 
      name, guestName, 
      status, attending, 
      guests, guestCount, 
      message 
    } = body

    const finalName = name || guestName
    const finalStatus = status || (attending === true ? 'ATTENDING' : (attending === false ? 'NOT_ATTENDING' : 'ATTENDING'))
    const finalGuests = parseInt(guests || guestCount) || 1

    if (!invitationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID приглашения не указан'
      })
    }

    if (!finalName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Имя обязательно'
      })
    }

    // Проверяем существование приглашения
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
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
        statusMessage: 'Срок действия приглашения истек. Свяжитесь с организаторами для получения нового приглашения.'
      })
    }

    // Проверяем, не отвечал ли уже этот гость
    const existingRsvp = await prisma.rsvp.findFirst({
      where: {
        invitationId,
        name: finalName
      }
    })

    if (existingRsvp) {
      // Обновляем существующий ответ
      const updatedRsvp = await prisma.rsvp.update({
        where: { id: existingRsvp.id },
        data: {
          name: finalName,
          status: finalStatus,
          guests: finalGuests,
          message
        }
      })

      // Обновляем счетчик RSVP в приглашении
      const totalRsvps = await prisma.rsvp.count({
        where: { invitationId }
      })

      await prisma.invitation.update({
        where: { id: invitationId },
        data: { rsvpCount: totalRsvps }
      })

      return {
        success: true,
        message: 'Ваш ответ обновлен',
        rsvp: {
          id: updatedRsvp.id,
          status: updatedRsvp.status,
          guests: updatedRsvp.guests
        }
      }
    }

    // Создаем новый RSVP
    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId,
        name: finalName,
        status: finalStatus,
        guests: finalGuests,
        message
      }
    })

    // Обновляем счетчик RSVP в приглашении
    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        rsvpCount: invitation.rsvpCount + 1
      }
    })

    return {
      success: true,
      message: finalStatus === 'ATTENDING' ? 'Спасибо за подтверждение! Ждем вас на мероприятии.' : 'Спасибо за ответ. Жаль, что не сможете присутствовать.',
      rsvp: {
        id: rsvp.id,
        status: rsvp.status,
        guests: rsvp.guests
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