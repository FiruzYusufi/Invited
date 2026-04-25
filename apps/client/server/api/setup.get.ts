import { prisma } from '@invited/database'
import { hashPassword } from '@invited/shared'

export default defineEventHandler(async (event) => {
  try {
    const adminEmail = 'admin@invited.com'
    const managerEmail = 'manager@invited.com'
    const clientEmail = 'client@invited.com'
    const password = 'password123'
    
    const hashedPwd = await hashPassword(password)

    // Create Admin
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN', password: hashedPwd },
      create: {
        email: adminEmail,
        password: hashedPwd,
        name: 'Администратор',
        role: 'ADMIN'
      }
    })

    // Create Manager
    const manager = await prisma.user.upsert({
      where: { email: managerEmail },
      update: { role: 'MANAGER', password: hashedPwd },
      create: {
        email: managerEmail,
        password: hashedPwd,
        name: 'Менеджер',
        role: 'MANAGER'
      }
    })

    // Create Client
    const client = await prisma.user.upsert({
      where: { email: clientEmail },
      update: { role: 'CLIENT', password: hashedPwd },
      create: {
        email: clientEmail,
        password: hashedPwd,
        name: 'Клиент',
        role: 'CLIENT'
      }
    })

    // Create some default packages
    await prisma.package.upsert({
      where: { id: 'free-package' },
      update: {},
      create: {
        id: 'free-package',
        name: 'Бесплатный',
        description: 'Попробуйте все возможности бесплатно',
        price: 0,
        inviteLimit: 1,
        features: JSON.stringify(['1 приглашение', 'Стандартные темы', 'Базовая аналитика']),
        isActive: true
      }
    })

    await prisma.package.upsert({
      where: { id: 'pro-package' },
      update: {},
      create: {
        id: 'pro-package',
        name: 'Профессиональный',
        description: 'Для больших мероприятий',
        price: 1500,
        inviteLimit: 50,
        features: JSON.stringify(['50 приглашений', 'Все темы', 'Расширенная аналитика', 'Поддержка']),
        isActive: true
      }
    })

    return {
      success: true,
      message: 'База данных успешно инициализирована',
      users: {
        admin: adminEmail,
        manager: managerEmail,
        client: clientEmail
      },
      password: password
    }
  } catch (error: any) {
    console.error('Setup error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка инициализации: ' + error.message
    })
  }
})
