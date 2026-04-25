import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['ADMIN'])

    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        groomName: true,
        brideName: true,
        viewCount: true,
        rsvpCount: true,
        isActive: true,
        createdAt: true
      }
    })

    return {
      success: true,
      invitations
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
