import { prisma } from '@invited/database'
import { hashPassword, validateEmail, validatePassword } from '@invited/shared'
import { requireRole } from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ['MANAGER', 'ADMIN'])

    const manager = event.context.user

    const body = await readBody(event)
    const { email, password, name, role = 'CLIENT' } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email и пароль обязательны'
      })
    }

    if (!validateEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Неверный формат email'
      })
    }

    if (!validatePassword(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Пароль должен содержать минимум 6 символов'
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Пользователь с таким email уже существует'
      })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'CLIENT',
        managedBy: manager.sub || manager.userId
      }
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
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
