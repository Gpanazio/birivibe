import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Busca o usuário existente
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error("❌ Nenhum usuário encontrado. Execute seed-full.ts primeiro.");
    process.exit(1);
  }

  console.log(`✓ Usuário encontrado: ${user.name}`);

  // Limpa rotinas existentes (em transação para atomicidade)
  await prisma.$transaction([
    prisma.routineLog.deleteMany(),
    prisma.routineStep.deleteMany(),
    prisma.routine.deleteMany(),
  ]);
  console.log("✓ Rotinas anteriores removidas");

  // Busca hábitos existentes para vincular (opcional)
  const habits = await prisma.habit.findMany({ where: { userId: user.id } });
  const habitByName = (name: string) => habits.find(h => h.name.toLowerCase() === name.toLowerCase());

  // 1. Rotina Matinal
  const rotinaManha = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Rotina Matinal",
      description: "Comece o dia com energia e foco",
      type: "morning",
      color: "#f97316", // orange
      startTime: "06:30",
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]), // Seg-Sex
      active: true,
      order: 1,
      steps: {
        create: [
          { name: "Acordar", icon: "☀️", duration: 5, type: "task", order: 0, isOptional: false },
          { name: "Beber água", icon: "💧", duration: 2, type: "habit", order: 1, isOptional: false, habitId: habitByName("Beber água")?.id },
          { name: "Tomar remédios", icon: "💊", duration: 2, type: "habit", order: 2, isOptional: false, habitId: habitByName("Tomar remédios")?.id },
          { name: "Skincare manhã", icon: "🧴", duration: 5, type: "task", order: 3, isOptional: true },
          { name: "Café da manhã", icon: "☕", duration: 15, type: "task", order: 4, isOptional: false },
        ],
      },
    },
  });
  console.log(`✓ Criada: ${rotinaManha.name} (5 passos)`);

  // 2. Rotina Noturna
  const rotinaNoite = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Rotina Noturna",
      description: "Desacelere para um sono reparador",
      type: "evening",
      color: "#8b5cf6", // purple
      startTime: "22:00",
      daysOfWeek: JSON.stringify([0, 1, 2, 3, 4, 5, 6]), // Todos os dias
      active: true,
      order: 2,
      steps: {
        create: [
          { name: "Desligar telas", icon: "📵", duration: 1, type: "task", order: 0, isOptional: false },
          { name: "Skincare noite", icon: "🌙", duration: 5, type: "task", order: 1, isOptional: false },
          { name: "Leitura", icon: "📖", duration: 20, type: "habit", order: 2, isOptional: false, habitId: habitByName("Ler")?.id },
          { name: "Meditação", icon: "🧘", duration: 10, type: "habit", order: 3, isOptional: true, habitId: habitByName("Meditar")?.id },
        ],
      },
    },
  });
  console.log(`✓ Criada: ${rotinaNoite.name}`);

  // 3. Rotina de Trabalho
  const rotinaTrabalho = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Rotina de Trabalho",
      description: "Maximize sua produtividade com blocos focados",
      type: "work",
      color: "#3b82f6", // blue
      startTime: "09:00",
      daysOfWeek: JSON.stringify([1, 2, 3, 4, 5]), // Seg-Sex
      active: true,
      order: 3,
      steps: {
        create: [
          { name: "Revisar agenda", icon: "📅", duration: 10, type: "task", order: 0, isOptional: false },
          { name: "Deep work", icon: "🎯", duration: 90, type: "timeblock", order: 1, isOptional: false },
          { name: "Pausa", icon: "☕", duration: 15, type: "break", order: 2, isOptional: false },
          { name: "Responder emails", icon: "📧", duration: 30, type: "task", order: 3, isOptional: true },
        ],
      },
    },
  });
  console.log(`✓ Criada: ${rotinaTrabalho.name}`);

  // 4. Rotina de Treino
  const rotinaTreino = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Rotina de Treino",
      description: "Do aquecimento ao shake, tudo organizado",
      type: "workout",
      color: "#22c55e", // green
      startTime: null, // Flexível
      daysOfWeek: JSON.stringify([1, 3, 5]), // Seg, Qua, Sex
      active: true,
      order: 4,
      steps: {
        create: [
          { name: "Aquecimento", icon: "🔥", duration: 10, type: "task", order: 0, isOptional: false },
          { name: "Treino principal", icon: "💪", duration: 45, type: "task", order: 1, isOptional: false },
          { name: "Alongamento", icon: "🤸", duration: 10, type: "task", order: 2, isOptional: false },
          { name: "Shake proteico", icon: "🥤", duration: 5, type: "task", order: 3, isOptional: true },
        ],
      },
    },
  });
  console.log(`✓ Criada: ${rotinaTreino.name}`);

  // Resumo
  const total = await prisma.routine.count({ where: { userId: user.id } });
  const totalSteps = await prisma.routineStep.count();

  console.log("\n🚀 Seed de rotinas concluído!");
  console.log(`   ${total} rotinas criadas`);
  console.log(`   ${totalSteps} passos no total`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
