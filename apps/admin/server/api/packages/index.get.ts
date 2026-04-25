import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['ADMIN'])

    const packages = await prisma.package.findMany({
      orderBy: { price: 'asc' }
    })

    return {
      success: true,
      packages: packages.map(pkg => ({
        ...pkg,
        features: pkg.features ? JSON.parse(pkg.features) : []
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
