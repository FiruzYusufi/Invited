import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['ADMIN'])

    const [
      totalUsers,
      totalInvitations,
      totalRsvps,
      totalPurchases,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.invitation.count(),
      prisma.rsvp.count(),
      prisma.purchase.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      })
    ])

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })

    return {
      success: true,
      stats: {
        totalUsers,
        totalInvitations,
        totalRsvps,
        totalPurchases,
        usersByRole: usersByRole.map(g => ({
          role: g.role,
          count: g._count.role
        })),
        recentUsers
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
