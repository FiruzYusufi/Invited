import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['ADMIN'])

    // Получаем популярные пакеты
    const purchasesByPackage = await prisma.purchase.groupBy({
      by: ['packageId'],
      _count: { packageId: true }
    })

    const packages = await prisma.package.findMany({
      where: {
        id: { in: purchasesByPackage.map(p => p.packageId) }
      }
    })

    const totalPurchases = purchasesByPackage.reduce((sum, p) => sum + p._count.packageId, 0)

    const popularPackages = purchasesByPackage.map(p => {
      const pkg = packages.find(pkg => pkg.id === p.packageId)
      return {
        name: pkg ? pkg.name : 'Unknown',
        count: p._count.packageId,
        percentage: totalPurchases > 0 ? Math.round((p._count.packageId / totalPurchases) * 100) : 0
      }
    }).sort((a, b) => b.count - a.count)

    return {
      success: true,
      analytics: {
        popularPackages,
        // Здесь можно добавить больше данных для графиков
        registrationsByDay: [],
        purchasesByDay: []
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
