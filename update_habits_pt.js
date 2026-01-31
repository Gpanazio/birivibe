const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return;

  const mapping = {
    'Workout': 'Treino',
    'Deep Work': 'Trabalho Focado',
    'Meds': 'Remédios',
    'Arb Check': 'Arbitragem',
    'Reading': 'Leitura'
  };

  const activities = await prisma.activity.findMany({ where: { userId: user.id } });

  for (const activity of activities) {
    const newName = mapping[activity.name];
    if (newName) {
      await prisma.activity.update({
        where: { id: activity.id },
        data: { name: newName }
      });
      console.log(`Atualizado: ${activity.name} -> ${newName}`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
