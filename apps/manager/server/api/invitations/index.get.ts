import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['MANAGER', 'ADMIN'])

    const invitations = await prisma.invitation.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      invitations: invitations.map(inv => ({
        id: inv.id,
        title: inv.title,
        groomName: inv.groomName,
        brideName: inv.brideName,
        eventDate: inv.eventDate,
        location: inv.location,
        theme: inv.theme,
        viewCount: inv.viewCount,
        rsvpCount: inv.rsvpCount,
        isActive: inv.isActive,
        createdAt: inv.createdAt,
        clientName: inv.user.name || inv.user.email,
        clientToken: inv.clientToken
      }))
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
