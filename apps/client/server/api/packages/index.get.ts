import { prisma } from '@invited/database'

export default defineEventHandler(async (event) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })

    return {
      success: true,
      packages: packages.map(pkg => ({
        ...pkg,
        features: pkg.features ? JSON.parse(pkg.features) : []
      }))
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении пакетов'
    })
  }
})