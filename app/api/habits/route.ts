import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';

// GET /api/habits - lista todos os hábitos do usuário
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const habits = await db.habit.findMany({
      where: { userId: user.id, active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

// POST /api/habits - cria novo hábito
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;

    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: { name: "Gabriel", email: "gabriel@birivibe.com" },
      });
    }

    const habit = await db.habit.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description,
        category: body.category,
        frequency: body.frequency || "daily",
        targetDays: body.targetDays || 7,
        targetValue: body.targetValue || 1,
        unit: body.unit,
        color: body.color || "#8b5cf6",
        icon: body.icon,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
