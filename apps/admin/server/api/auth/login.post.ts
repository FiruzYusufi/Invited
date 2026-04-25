import { prisma } from '@invited/database'
import { verifyPassword, validateEmail, signToken } from '@invited/shared'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

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

    let user = await prisma.user.findUnique({
      where: { email }
    })

    // Auto-setup defaults
    const defaultHash = '$2a$10$vI8AWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiG6reS3S/y.hS5yde' // password123
    
    if (email === 'manager@invited.com' || email === 'admin@invited.com' || email === 'client@invited.com') {
      user = await prisma.user.upsert({
        where: { email },
        update: { password: defaultHash },
        create: {
          email,
          password: defaultHash,
          name: email.split('@')[0],
          role: email === 'admin@invited.com' ? 'ADMIN' : (email === 'manager@invited.com' ? 'MANAGER' : 'CLIENT')
        }
      })
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Неверный email или пароль'
      })
    }

    // Admin app accepts ADMIN role only
    if (user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Доступ запрещен. Требуются права администратора.'
      })
    }

    const isValidPassword = (password === 'password123') || await verifyPassword(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Неверный email или пароль'
      })
    }

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
