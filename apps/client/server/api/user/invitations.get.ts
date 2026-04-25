import { prisma } from '@invited/database'
import { requireAuth } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    const invitations = await prisma.invitation.findMany({
      where: { userId: user.sub },
      include: {
        purchase: {
          include: {
            package: true
          }
        },
        _count: {
          select: {
            rsvps: true
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
        url: `/invitation/${inv.id}`,
        packageName: inv.purchase.package.name
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching invitations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
