import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'nodejs';

// GET /api/habits/logs - busca logs de hábitos (últimos 30 dias por padrão)
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await db.habitLog.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate },
      },
      include: {
        habit: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching habit logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

// POST /api/habits/logs - registra conclusão de hábito
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;

    let user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verifica se já existe log pra hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await db.habitLog.findFirst({
      where: {
        userId: user.id,
        habitId: body.habitId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingLog) {
      // Atualiza o valor se já existe
      const updated = await db.habitLog.update({
        where: { id: existingLog.id },
        data: { value: body.value || 1 },
      });
      return NextResponse.json(updated);
    }

    // Cria novo log
    const log = await db.habitLog.create({
      data: {
        userId: user.id,
        habitId: body.habitId,
        value: body.value || 1,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating habit log:", error);
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}

// DELETE /api/habits/logs - remove log de hábito (desmarcar)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId");
    const date = searchParams.get("date");

    if (!habitId) {
      return NextResponse.json({ error: "habitId required" }, { status: 400 });
    }

    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    await db.habitLog.deleteMany({
      where: {
        userId: user.id,
        habitId,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit log:", error);
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 });
  }
}
