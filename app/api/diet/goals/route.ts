import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/diet/goals - busca metas do usuário
export async function GET(req: NextRequest) {
  try {
    // Por enquanto, pega o primeiro usuário (depois implementar auth)
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ calories: 2000, protein: 150 }, { status: 200 });
    }

    const goal = await db.nutritionGoal.findFirst({
      where: { userId: user.id, active: true },
    });

    if (!goal) {
      return NextResponse.json({ calories: 2000, protein: 150 }, { status: 200 });
    }

    return NextResponse.json({
      calories: goal.calories || 2000,
      protein: goal.protein || 150,
      carbs: goal.carbs,
      fat: goal.fat,
      fiber: goal.fiber,
      water: goal.water,
      height: goal.height,
      objectives: goal.objectives ? JSON.parse(goal.objectives) : [],
      intolerances: goal.intolerances ? JSON.parse(goal.intolerances) : [],
      conditions: goal.conditions ? JSON.parse(goal.conditions) : [],
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// PUT /api/diet/goals - atualiza metas
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as any;
    
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: { name: "Gabriel", email: "gabriel@birivibe.com" },
      });
    }

    // Desativa metas anteriores
    await db.nutritionGoal.updateMany({
      where: { userId: user.id, active: true },
      data: { active: false },
    });

    // Cria nova meta
    const goal = await db.nutritionGoal.create({
      data: {
        userId: user.id,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fat: body.fat,
        fiber: body.fiber,
        water: body.water,
        height: body.height,
        objectives: body.objectives ? JSON.stringify(body.objectives) : null,
        intolerances: body.intolerances ? JSON.stringify(body.intolerances) : null,
        conditions: body.conditions ? JSON.stringify(body.conditions) : null,
        active: true,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json({ error: "Failed to update goals" }, { status: 500 });
  }
}
