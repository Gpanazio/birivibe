import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';

// GET /api/routines/[id] - busca rotina específica
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routine = await db.routine.findUnique({
      where: { id: params.id },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: { habit: true },
        },
        logs: {
          orderBy: { startedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    return NextResponse.json(routine);
  } catch (error) {
    console.error("Error fetching routine:", error);
    return NextResponse.json({ error: "Failed to fetch routine" }, { status: 500 });
  }
}

// PUT /api/routines/[id] - atualiza rotina
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json() as any;

    // Atualiza a rotina
    const routine = await db.routine.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        icon: body.icon,
        color: body.color,
        type: body.type,
        daysOfWeek: body.daysOfWeek ? JSON.stringify(body.daysOfWeek) : undefined,
        startTime: body.startTime,
      },
    });

    // Se passos foram enviados, recria
    if (body.steps) {
      await db.routineStep.deleteMany({ where: { routineId: params.id } });
      for (let index = 0; index < body.steps.length; index++) {
        const step = body.steps[index];
        await db.routineStep.create({
          data: {
            routineId: params.id,
            name: step.name,
            description: step.description,
            duration: step.duration,
            order: index,
            type: step.type || "task",
            isOptional: step.isOptional || false,
            habitId: step.habitId,
            icon: step.icon,
          },
        });
      }
    }

    const updated = await db.routine.findUnique({
      where: { id: params.id },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating routine:", error);
    return NextResponse.json({ error: "Failed to update routine" }, { status: 500 });
  }
}

// DELETE /api/routines/[id] - desativa rotina
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.routine.update({
      where: { id: params.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting routine:", error);
    return NextResponse.json({ error: "Failed to delete routine" }, { status: 500 });
  }
}
