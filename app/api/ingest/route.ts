import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db as prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    if (!userId) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) userId = firstUser.id;
    }

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

    // Puxa hábitos e exercícios do usuário para contexto
    const userHabits = await prisma.habit.findMany({ where: { userId } });
    
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });

    const prompt = `
      Você é o Douglas, a IA do BiriVibe OS. Seu trabalho é processar o "Daily Dump" do usuário.
      Texto do usuário: "${text}"

      Hábitos cadastrados: ${userHabits.map(h => h.name).join(", ")}

      Instruções:
      1. Extraia dados estruturados para as seguintes categorias:
         - habits: { name: string, value: number } (Ex: "bebi 2L agua" -> {name: "Água", value: 2000})
         - workout: { name: string, exercises: [{ name: string, weight: number, sets: number, reps: number }] }
         - sleep: { hours: number, quality: number (1-10) }
         - mood: { score: number (1-10), energy: number (1-10) }
         - finance: { amount: number, category: string, description: string, type: "expense" | "income" }
      2. Mapeie nomes de hábitos de forma inteligente (ex: "gym" ou "treinei" -> "Treino").
      3. Se o usuário estiver mal ou bem, estime o mood/energy.
      4. Retorne APENAS um JSON com essas chaves e uma chave "commentary" com seu comentário sarcástico (em PT-BR).

      Exemplo de Retorno:
      {
        "habits": [{"name": "Leitura", "value": 20}],
        "workout": {"name": "Superior", "exercises": [{"name": "Supino", "weight": 50, "sets": 3, "reps": 10}]},
        "sleep": {"hours": 7, "quality": 8},
        "mood": {"score": 7, "energy": 9},
        "finance": {"amount": 45.50, "category": "Alimentação", "description": "Sushi", "type": "expense"},
        "commentary": "Comeu sushi e treinou? Pelo menos o shape não reclama hoje."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanJson = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    const savedData = [];

    // --- SALVANDO CADA CATEGORIA ---
    
    // 1. Hábitos
    if (data.habits) {
        for (const h of data.habits) {
            const habit = userHabits.find(uh => uh.name.toLowerCase() === h.name.toLowerCase());
            if (habit) {
                const log = await prisma.habitLog.create({
                    data: { userId, habitId: habit.id, value: h.value || 1 }
                });
                savedData.push({ type: 'habit', name: habit.name, value: h.value });
            }
        }
    }

    // 2. Treino (Workout)
    if (data.workout) {
        const workout = await prisma.workout.create({
            data: {
                userId,
                name: data.workout.name,
                exercises: {
                    create: data.workout.exercises.map((e: any) => ({
                        name: e.name,
                        weight: e.weight,
                        sets: e.sets,
                        reps: e.reps
                    }))
                }
            }
        });
        savedData.push({ type: 'workout', name: data.workout.name });
    }

    // 3. Sono (Sleep)
    if (data.sleep) {
        const sleep = await prisma.sleepLog.create({
            data: {
                userId,
                bedTime: new Date(Date.now() - (data.sleep.hours * 60 * 60 * 1000)), // Estimativa
                wakeTime: new Date(),
                quality: data.sleep.quality || 5,
                date: new Date()
            }
        });
        savedData.push({ type: 'sleep', hours: data.sleep.hours });
    }

    // 4. Humor (Mood)
    if (data.mood) {
        const moodLog = await prisma.moodLog.create({
            data: {
                userId,
                mood: data.mood.score || 5,
                energy: data.mood.energy || 5,
                stress: 5 // Default
            }
        });
        savedData.push({ type: 'mood', score: data.mood.score });
    }

    // 5. Finanças
    if (data.finance) {
        const trans = await prisma.transaction.create({
            data: {
                userId,
                amount: data.finance.amount,
                category: data.finance.category,
                description: data.finance.description,
                type: data.finance.type
            }
        });
        savedData.push({ type: 'finance', amount: data.finance.amount });
    }

    return NextResponse.json({ 
        success: true, 
        processed: savedData,
        commentary: data.commentary
    });

  } catch (error: any) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
