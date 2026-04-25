import { prisma } from '@invited/database'
import { requireAuth } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    // Проверяем авторизацию
    const user = await requireAuth(event)

    const body = await readBody(event)
    const { packageId, paymentMethod } = body

    if (!packageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID пакета не указан'
      })
    }

    // Получаем пакет
    const packageData = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!packageData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Пакет не найден'
      })
    }

    if (!packageData.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Пакет недоступен для покупки'
      })
    }

    // Для бесплатного пакета создаем покупку сразу
    if (packageData.price === 0) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: user.sub,
          packageId: packageData.id,
          status: 'COMPLETED',
          invitesUsed: 0,
          invitesLimit: packageData.inviteLimit,
          expiresAt: null // Бесплатный пакет не истекает
        }
      })

      return {
        success: true,
        message: 'Бесплатный пакет активирован!',
        purchase: {
          id: purchase.id,
          packageName: packageData.name,
          invitesLimit: purchase.invitesLimit,
          invitesUsed: purchase.invitesUsed,
          status: purchase.status
        }
      }
    }

    // Для платных пакетов создаем pending покупку
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.sub,
        packageId: packageData.id,
        status: 'PENDING',
        invitesUsed: 0,
        invitesLimit: packageData.inviteLimit,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 год
      }
    })

    // Здесь должна быть интеграция с платежной системой (Stripe, YooKassa и т.д.)
    // Для демонстрации просто возвращаем ссылку на оплату
    const paymentUrl = `/payment/${purchase.id}?amount=${packageData.price}&package=${packageData.name}`

    return {
      success: true,
      message: 'Покупка создана. Перейдите к оплате.',
      purchase: {
        id: purchase.id,
        packageName: packageData.name,
        amount: packageData.price,
        status: purchase.status
      },
      paymentUrl,
      contactInfo: {
        email: 'support@invited.com',
        phone: '+7 (999) 123-45-67',
        telegram: '@invited_support'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error purchasing package:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Внутренняя ошибка сервера'
    })
  }
})