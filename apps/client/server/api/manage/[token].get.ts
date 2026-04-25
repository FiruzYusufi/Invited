import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const token = getRouterParam(event, 'token')

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Токен обязателен'
      })
    }

    const invitation = await prisma.invitation.findUnique({
      where: { clientToken: token },
      include: {
        rsvps: {
          orderBy: { createdAt: 'desc' }
        },
        guests: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!invitation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Приглашение не найдено'
      })
    }

    // Рассчитываем статистику
    const stats = {
      totalGuestsCount: invitation.guests.length,
      smsSentCount: invitation.guests.filter(g => g.smsSent).length,
      totalRsvps: invitation.rsvps.length,
      attending: invitation.rsvps.filter(r => r.status === 'ATTENDING').length,
      notAttending: invitation.rsvps.filter(r => r.status === 'NOT_ATTENDING').length,
      totalGuests: invitation.rsvps
        .filter(r => r.status === 'ATTENDING')
        .reduce((sum, r) => sum + (r.guests || 1), 0)
    }

    return {
      success: true,
      invitation: {
        id: invitation.id,
        title: invitation.title,
        groomName: invitation.groomName,
        brideName: invitation.brideName,
        eventDate: invitation.eventDate,
        viewCount: invitation.viewCount,
        clientToken: invitation.clientToken
      },
      rsvps: invitation.rsvps,
      guests: invitation.guests,
      stats
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Manage API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
