import { prisma } from '@invited/database'
import { requireAuth } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    // Получаем данные пользователя
    const userData = await prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!userData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Пользователь не найден'
      })
    }

    // Получаем активную покупку (ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТА)
    const activePurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.sub,
        status: 'COMPLETED'
      },
      include: {
        package: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Получаем статистику
    const invitationsCount = await prisma.invitation.count({
      where: { userId: user.sub }
    })

    const invitations = await prisma.invitation.findMany({
      where: { userId: user.sub },
      select: {
        viewCount: true,
        rsvpCount: true
      }
    })

    const totalViews = invitations.reduce((sum, inv) => sum + inv.viewCount, 0)
    const totalRSVPs = invitations.reduce((sum, inv) => sum + inv.rsvpCount, 0)

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt
      },
      subscription: activePurchase ? {
        packageName: activePurchase.package.name,
        invitesLimit: activePurchase.invitesLimit,
        invitesUsed: activePurchase.invitesUsed,
        invitesRemaining: activePurchase.invitesLimit - activePurchase.invitesUsed,
        expiresAt: activePurchase.expiresAt,
        status: activePurchase.status
      } : null,
      stats: {
        totalInvitations: invitationsCount,
        totalViews,
        totalRSVPs,
        remainingInvites: activePurchase ? activePurchase.invitesLimit - activePurchase.invitesUsed : 0
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching user profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})
