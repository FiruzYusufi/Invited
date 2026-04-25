import { prisma } from '@invited/database'
import { requireAuth } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    // Проверяем авторизацию
    const user = await requireAuth(event)

    const body = await readBody(event)
    const { title, groomName, brideName, eventDate, location, description, theme } = body

    // Валидация
    if (!groomName || !brideName || !eventDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Обязательные поля: имена молодоженов и дата мероприятия'
      })
    }

    // Проверяем активную покупку пользователя (ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТА)
    let activePurchase = await prisma.purchase.findFirst({
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

    if (!activePurchase) {
      // Создаем тестовую покупку, если ее нет
      const testPackage = await prisma.package.findFirst() || await prisma.package.create({
        data: {
          id: 'test-package',
          name: 'Тестовый пакет',
          price: 0,
          inviteLimit: 999,
          isActive: true
        }
      })

      activePurchase = await prisma.purchase.create({
        data: {
          userId: user.sub,
          packageId: testPackage.id,
          status: 'COMPLETED',
          invitesUsed: 0,
          invitesLimit: 999
        },
        include: {
          package: true
        }
      })
    }

    // Создаем приглашение
    const invitation = await prisma.invitation.create({
      data: {
        userId: user.sub,
        purchaseId: activePurchase.id,
        title: title || `Свадьба ${groomName} и ${brideName}`,
        groomName,
        brideName,
        eventDate: new Date(eventDate),
        location: location || '',
        description: description || '',
        theme: theme || 'champagne'
      }
    })

    // Увеличиваем счетчик использованных приглашений
    await prisma.purchase.update({
      where: { id: activePurchase.id },
      data: {
        invitesUsed: activePurchase.invitesUsed + 1
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
        theme: invitation.theme,
        url: `/invitation/${invitation.id}`
      },
      remainingInvites: activePurchase.invitesLimit - (activePurchase.invitesUsed + 1),
      message: activePurchase.invitesLimit - (activePurchase.invitesUsed + 1) <= 3 
        ? `Внимание! У вас осталось ${activePurchase.invitesLimit - (activePurchase.invitesUsed + 1)} приглашений. Рекомендуем приобрести дополнительный пакет.`
        : undefined
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error creating invitation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})