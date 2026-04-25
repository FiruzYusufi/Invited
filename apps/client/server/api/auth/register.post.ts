import { prisma } from '@invited/database'
import { hashPassword, validateEmail, validatePassword, signToken } from '@invited/shared'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, name } = body

    // Валидация
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

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Пользователь с таким email уже существует'
      })
    }

    // Создаем пользователя
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'CLIENT'
      }
    })

    // Генерируем токен
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
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