import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes
  await prisma.foodLog.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.moodLog.deleteMany();
  await prisma.sleepLog.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.nutritionGoal.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.healthCondition.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Database cleaned");

  // Cria usuário
  const user = await prisma.user.create({
    data: {
      name: "Gabriel Panazio",
      email: "gabriel@birivibe.com",
      timezone: "America/Sao_Paulo",
    },
  });
  console.log("✓ User created:", user.name);

  // Condições de saúde
  const tdah = await prisma.healthCondition.create({
    data: {
      userId: user.id,
      name: "TDAH",
      severity: "moderado",
      notes: "Diagnosticado em 2020",
    },
  });
  console.log("✓ Health conditions created");

  // Medicações
  await prisma.medication.create({
    data: {
      userId: user.id,
      conditionId: tdah.id,
      name: "Venvanse",
      dosage: "50mg",
      frequency: "1x dia",
      timeOfDay: "manhã",
    },
  });
  console.log("✓ Medications created");

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

  // Hábitos
  const habits = await Promise.all([
    prisma.habit.create({ data: { userId: user.id, name: "Tomar remédios", category: "Saúde", color: "#ef4444" } }),
    prisma.habit.create({ data: { userId: user.id, name: "Treinar", category: "Corpo", color: "#22c55e" } }),
    prisma.habit.create({ data: { userId: user.id, name: "Ler", category: "Mente", color: "#8b5cf6", unit: "páginas", targetValue: 20 } }),
    prisma.habit.create({ data: { userId: user.id, name: "Meditar", category: "Mente", color: "#06b6d4", unit: "min", targetValue: 10 } }),
    prisma.habit.create({ data: { userId: user.id, name: "Beber água", category: "Saúde", color: "#3b82f6", unit: "ml", targetValue: 2000 } }),
  ]);
  console.log("✓ Habits created:", habits.length);

  // Logs de hábitos (últimos 7 dias)
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Remédios - todo dia
    await prisma.habitLog.create({
      data: { userId: user.id, habitId: habits[0].id, value: 1, date },
    });
    
    // Treino - dias alternados
    if (i % 2 === 0) {
      await prisma.habitLog.create({
        data: { userId: user.id, habitId: habits[1].id, value: 1, date },
      });
    }
    
    // Leitura - quase todo dia
    if (i !== 3) {
      await prisma.habitLog.create({
        data: { userId: user.id, habitId: habits[2].id, value: Math.floor(Math.random() * 30) + 10, date },
      });
    }
  }
  console.log("✓ Habit logs created");

  // Food logs (últimos 3 dias)
  const foods = [
    { name: "Ovos mexidos 3 unidades", mealCategory: "café da manhã", calories: 210, protein: 18, carbs: 2, fats: 15 },
    { name: "Pão integral 2 fatias", mealCategory: "café da manhã", calories: 140, protein: 6, carbs: 24, fats: 2 },
    { name: "Café com leite", mealCategory: "café da manhã", calories: 80, protein: 4, carbs: 8, fats: 3 },
    { name: "Arroz integral 150g", mealCategory: "almoço", calories: 170, protein: 4, carbs: 35, fats: 1 },
    { name: "Frango grelhado 200g", mealCategory: "almoço", calories: 330, protein: 62, carbs: 0, fats: 7 },
    { name: "Salada verde", mealCategory: "almoço", calories: 45, protein: 2, carbs: 8, fats: 1 },
    { name: "Whey protein 30g", mealCategory: "lanche", calories: 120, protein: 24, carbs: 3, fats: 1 },
    { name: "Banana", mealCategory: "lanche", calories: 105, protein: 1, carbs: 27, fats: 0 },
    { name: "Salmão grelhado 180g", mealCategory: "janta", calories: 370, protein: 40, carbs: 0, fats: 22 },
    { name: "Batata doce 200g", mealCategory: "janta", calories: 180, protein: 4, carbs: 41, fats: 0 },
  ];

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    for (const food of foods) {
      await prisma.foodLog.create({
        data: {
          userId: user.id,
          ...food,
          fiber: Math.floor(Math.random() * 5),
          sugar: Math.floor(Math.random() * 10),
          vitaminA: Math.floor(Math.random() * 100),
          vitaminC: Math.floor(Math.random() * 50),
          calcium: Math.floor(Math.random() * 200),
          iron: Math.floor(Math.random() * 5),
          date: dateStr,
        },
      });
    }
  }
  console.log("✓ Food logs created");

  // Sleep logs (últimos 7 dias)
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const bedTime = new Date(date);
    bedTime.setHours(23, Math.floor(Math.random() * 60), 0);
    const wakeTime = new Date(date);
    wakeTime.setDate(wakeTime.getDate() + 1);
    wakeTime.setHours(7, Math.floor(Math.random() * 60), 0);
    
    await prisma.sleepLog.create({
      data: {
        userId: user.id,
        bedTime,
        wakeTime,
        quality: Math.floor(Math.random() * 4) + 6, // 6-9
        date,
      },
    });
  }
  console.log("✓ Sleep logs created");

  // Mood logs (últimos 7 dias)
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.moodLog.create({
      data: {
        userId: user.id,
        mood: Math.floor(Math.random() * 3) + 6, // 6-8
        energy: Math.floor(Math.random() * 4) + 5, // 5-8
        stress: Math.floor(Math.random() * 4) + 2, // 2-5
        date,
      },
    });
  }
  console.log("✓ Mood logs created");

  // Weight logs (último mês)
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Peso variando de 82 a 80kg (progresso)
    const weight = 82 - (i * 0.07) + (Math.random() * 0.5 - 0.25);
    
    await prisma.weightLog.create({
      data: {
        userId: user.id,
        weight: parseFloat(weight.toFixed(1)),
        date,
      },
    });
  }
  console.log("✓ Weight logs created");

  // Workouts (últimos 7 dias, dias alternados)
  const workoutNames = ["Peito e Tríceps", "Costas e Bíceps", "Pernas", "Ombros e Core"];
  for (let i = 0; i < 7; i += 2) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.workout.create({
      data: {
        userId: user.id,
        name: workoutNames[Math.floor(i / 2) % workoutNames.length],
        duration: 45 + Math.floor(Math.random() * 30),
        date,
        exercises: {
          create: [
            { name: "Supino reto", sets: 4, reps: 10, weight: 60 },
            { name: "Supino inclinado", sets: 3, reps: 12, weight: 50 },
            { name: "Crucifixo", sets: 3, reps: 15, weight: 16 },
            { name: "Tríceps corda", sets: 3, reps: 12, weight: 25 },
          ],
        },
      },
    });
  }
  console.log("✓ Workouts created");

  console.log("\n🚀 Database populated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
