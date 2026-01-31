const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Limpar tudo
  await prisma.exerciseLog.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.habitLog.deleteMany({});
  await prisma.habit.deleteMany({});
  await prisma.sleepLog.deleteMany({});
  await prisma.moodLog.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.bodyMetric.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Criar Usuário
  const user = await prisma.user.create({
    data: {
      name: 'Gabriel Panazio',
      email: 'gabriel@birivibe.com',
    }
  });

  const userId = user.id;

  // 3. Criar Hábitos
  const habits = await Promise.all([
    prisma.habit.create({ data: { userId, name: 'Remédios', color: '#ff0000', frequency: 'daily' } }),
    prisma.habit.create({ data: { userId, name: 'Água', color: '#00ffff', frequency: 'daily', targetValue: 2000, unit: 'ml' } }),
    prisma.habit.create({ data: { userId, name: 'Leitura', color: '#00ff00', frequency: 'daily', targetValue: 30, unit: 'pag' } }),
    prisma.habit.create({ data: { userId, name: 'Arbitragem', color: '#ffff00', frequency: 'daily' } }),
  ]);

  // 4. Preencher 7 dias de dados
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Logs de Hábitos (algumas falhas para realismo)
    for (const habit of habits) {
      if (Math.random() > 0.2) {
        await prisma.habitLog.create({
          data: { habitId: habit.id, value: habit.targetValue || 1, date }
        });
      }
    }

    // Sono e Humor
    const hours = 6 + Math.random() * 3;
    await prisma.sleepLog.create({
      data: {
        userId,
        bedTime: new Date(date.getTime() - (hours + 1) * 60 * 60 * 1000),
        wakeTime: date,
        quality: Math.floor(hours + (Math.random() * 2)),
      }
    });

    await prisma.moodLog.create({
      data: {
        userId,
        score: Math.floor(6 + Math.random() * 4),
        energy: Math.floor(5 + Math.random() * 5),
        stress: Math.floor(Math.random() * 5),
        date
      }
    });

    // Finanças
    await prisma.transaction.create({
      data: {
        userId,
        type: 'expense',
        amount: 30 + Math.random() * 100,
        category: 'Alimentação',
        description: 'Refeição diária',
        date
      }
    });
  }

  // 5. Criar Treinos
  const workoutNames = ['Peito e Tríceps', 'Costas e Bíceps', 'Pernas Completo', 'Ombros e Trapézio'];
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 2));
    await prisma.workout.create({
      data: {
        userId,
        name: workoutNames[i],
        date,
        exercises: {
          create: [
            { name: 'Exercício Base', weight: 40 + (i * 5), sets: 3, reps: 10 },
            { name: 'Exercício Auxiliar', weight: 15 + i, sets: 4, reps: 12 }
          ]
        }
      }
    });
  }

  // 6. Métricas Corporais
  await prisma.bodyMetric.create({
    data: { userId, weight: 85.5, bodyFat: 18, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });
  await prisma.bodyMetric.create({
    data: { userId, weight: 84.2, bodyFat: 17.5, date: new Date() }
  });

  console.log('Seed de Elite finalizado para o usuário Gabriel Panazio.');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
