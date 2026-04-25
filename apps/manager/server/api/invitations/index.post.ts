import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['MANAGER', 'ADMIN'])

    const body = await readBody(event)
    const { title, groomName, brideName, eventDate, location, description, theme, clientId } = body

    if (!groomName || !brideName || !eventDate || !clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Обязательные поля: имена молодоженов, дата и клиент'
      })
    }

    // Check client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Клиент не найден'
      })
    }

    // Find or create a purchase for the client
    let purchase = await prisma.purchase.findFirst({
      where: {
        userId: clientId,
        status: 'COMPLETED'
      }
    })

    if (!purchase) {
      // Create a default package if none exists
      const defaultPackage = await prisma.package.findFirst({
        where: { isActive: true, price: 0 }
      })

      if (!defaultPackage) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Нет доступного пакета для создания приглашения'
        })
      }

      purchase = await prisma.purchase.create({
        data: {
          userId: clientId,
          packageId: defaultPackage.id,
          status: 'COMPLETED',
          invitesUsed: 0,
          invitesLimit: defaultPackage.inviteLimit,
          expiresAt: null
        }
      })
    }

    const invitation = await prisma.invitation.create({
      data: {
        userId: clientId,
        purchaseId: purchase.id,
        title: title || `Свадьба ${groomName} и ${brideName}`,
        groomName,
        brideName,
        eventDate: new Date(eventDate),
        location: location || '',
        description: description || '',
        theme: theme || 'champagne'
      }
    })

    // Update purchase counter
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { invitesUsed: purchase.invitesUsed + 1 }
    })

    return {
      success: true,
      invitation: {
        id: invitation.id,
        title: invitation.title,
        url: `/invitation/${invitation.id}`,
        manageUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/manage/${invitation.clientToken}`
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
