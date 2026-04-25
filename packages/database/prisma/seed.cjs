const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Hash for 'password123'
const hashedPwd = '$2a$10$vI8AWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiG6reS3S/y.hS5yde'

async function main() {
  try {
    await prisma.user.deleteMany({})
  } catch (e) {
    console.log('No users to delete or table does not exist')
  }

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@invited.com',
        password: hashedPwd,
        name: 'Администратор',
        role: 'ADMIN'
      },
      {
        email: 'manager@invited.com',
        password: hashedPwd,
        name: 'Менеджер',
        role: 'MANAGER'
      },
      {
        email: 'client@invited.com',
        password: hashedPwd,
        name: 'Клиент',
        role: 'CLIENT'
      }
    ]
  })

  console.log('Seed completed successfully')
  console.log('All users password: password123')
  console.log('Admin: admin@invited.com')
  console.log('Manager: manager@invited.com')
  console.log('Client: client@invited.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
