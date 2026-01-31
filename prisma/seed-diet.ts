import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cria usuário
  const user = await prisma.user.upsert({
    where: { email: "gabriel@birivibe.com" },
    update: {},
    create: {
      name: "Gabriel Panazio",
      email: "gabriel@birivibe.com",
      timezone: "America/Sao_Paulo",
    },
  });

  console.log("✓ User created:", user.name);

  // Metas nutricionais
  await prisma.nutritionGoal.create({
    data: {
      userId: user.id,
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70,
      fiber: 25,
      water: 2500,
      active: true,
    },
  });

  console.log("✓ Nutrition goals created");

  // Hábitos básicos
  const habits = [
    { name: "Tomar remédios", category: "Saúde", color: "#ef4444" },
    { name: "Treinar", category: "Corpo", color: "#22c55e" },
    { name: "Ler", category: "Mente", color: "#8b5cf6" },
    { name: "Meditar", category: "Mente", color: "#06b6d4" },
    { name: "Beber 2L água", category: "Saúde", color: "#3b82f6", unit: "ml", targetValue: 2000 },
  ];

  for (const habit of habits) {
    await prisma.habit.create({
      data: {
        userId: user.id,
        name: habit.name,
        category: habit.category,
        color: habit.color,
        unit: habit.unit,
        targetValue: habit.targetValue || 1,
      },
    });
  }

  console.log("✓ Habits created:", habits.length);

  console.log("\n🚀 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
