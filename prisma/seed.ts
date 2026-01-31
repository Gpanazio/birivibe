import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'gabriel@birilife.ai' },
    update: {},
    create: {
      email: 'gabriel@birilife.ai',
      name: 'Gabriel Panazio',
      image: 'https://avatars.githubusercontent.com/u/123456?v=4',
    },
  })

  console.log({ user })

  // Create Default Habits (Activities)
  const habits = [
    { name: 'Workout', description: 'Gym, Running, Cardio', colorCode: '#ef4444' }, // Red
    { name: 'Deep Work', description: 'Coding, Writing, Strategy', colorCode: '#3b82f6' }, // Blue
    { name: 'Meds & Supps', description: 'Venvanse, Creatina, Vitamins', colorCode: '#10b981' }, // Emerald
    { name: 'Arbitrage Check', description: 'Review bots and PnL', colorCode: '#f59e0b' }, // Amber
    { name: 'Reading', description: 'Books, Articles, Papers', colorCode: '#8b5cf6' }, // Violet
  ]

  for (const habit of habits) {
    await prisma.activity.create({
      data: {
        userId: user.id,
        name: habit.name,
        description: habit.description,
        colorCode: habit.colorCode,
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
