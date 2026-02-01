import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/routines - lista rotinas do usuário
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const routines = await db.routine.findMany({
      where: { userId: user.id, active: true },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: { habit: true },
        },
        _count: { select: { logs: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error("Error fetching routines:", error);
    return NextResponse.json({ error: "Failed to fetch routines" }, { status: 500 });
  }
}

// POST /api/routines - cria nova rotina
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;

    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: { name: "Gabriel", email: "gabriel@birivibe.com" },
      });
    }

    const routine = await db.routine.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description,
        icon: body.icon,
        color: body.color || "#8b5cf6",
        type: body.type || "custom",
        daysOfWeek: body.daysOfWeek ? JSON.stringify(body.daysOfWeek) : null,
        startTime: body.startTime,
        steps: body.steps ? {
          create: body.steps.map((step: any, index: number) => ({
            name: step.name,
            description: step.description,
            duration: step.duration,
            order: index,
            type: step.type || "task",
            isOptional: step.isOptional || false,
            habitId: step.habitId,
            icon: step.icon,
          })),
        } : undefined,
      },
      include: {
        steps: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error("Error creating routine:", error);
    return NextResponse.json({ error: "Failed to create routine" }, { status: 500 });
  }
}
