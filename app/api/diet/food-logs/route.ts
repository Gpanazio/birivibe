import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/diet/food-logs - busca todos os logs
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const logs = await db.foodLog.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
    });

    // Formata pra compatibilidade com Biridiet
    const formatted = logs.map((log) => ({
      id: log.id,
      name: log.name,
      mealCategory: log.mealCategory,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fats: log.fats,
      fiber: log.fiber,
      sugar: log.sugar,
      vitaminA: log.vitaminA,
      vitaminC: log.vitaminC,
      calcium: log.calcium,
      iron: log.iron,
      date: log.date,
      timestamp: log.timestamp.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching food logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

// POST /api/diet/food-logs - adiciona novos logs
export async function POST(req: NextRequest) {
  try {
    const items = await req.json() as any;

    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: { name: "Gabriel", email: "gabriel@birivibe.com" },
      });
    }

    // Suporta array ou item único
    const itemsArray = Array.isArray(items) ? items : [items];

    const created = await Promise.all(
      itemsArray.map((item: any) =>
        db.foodLog.create({
          data: {
            userId: user!.id,
            name: item.name,
            mealCategory: item.mealCategory,
            calories: item.calories || 0,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fats: item.fats || 0,
            fiber: item.fiber || 0,
            sugar: item.sugar || 0,
            vitaminA: item.vitaminA || 0,
            vitaminC: item.vitaminC || 0,
            calcium: item.calcium || 0,
            iron: item.iron || 0,
            date: item.date || new Date().toISOString().split("T")[0],
          },
        })
      )
    );

    // Formata resposta
    const formatted = created.map((log) => ({
      id: log.id,
      name: log.name,
      mealCategory: log.mealCategory,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fats: log.fats,
      fiber: log.fiber,
      sugar: log.sugar,
      vitaminA: log.vitaminA,
      vitaminC: log.vitaminC,
      calcium: log.calcium,
      iron: log.iron,
      date: log.date,
      timestamp: log.timestamp.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error creating food logs:", error);
    return NextResponse.json({ error: "Failed to create logs" }, { status: 500 });
  }
}
