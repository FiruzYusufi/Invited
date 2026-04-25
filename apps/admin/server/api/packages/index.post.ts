import { prisma } from '@invited/database'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['ADMIN'])

    const body = await readBody(event)
    const { name, description, price, inviteLimit, features, isActive } = body

    if (!name || price === undefined || !inviteLimit) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, price, and invite limit are required'
      })
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        inviteLimit: parseInt(inviteLimit),
        features: features ? JSON.stringify(features) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return {
      success: true,
      package: {
        ...pkg,
        features: pkg.features ? JSON.parse(pkg.features) : []
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
