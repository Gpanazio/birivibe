import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'nodejs';

// PUT /api/routines/logs/[logId] - atualiza log de execução
export async function PUT(
  req: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const body = await req.json() as any;

    const log = await db.routineLog.update({
      where: { id: params.logId },
      data: {
        stepsCompleted: body.stepsCompleted ? JSON.stringify(body.stepsCompleted) : undefined,
        completedAt: body.completed ? new Date() : undefined,
        duration: body.duration,
        notes: body.notes,
        rating: body.rating,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error updating routine log:", error);
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 });
  }
}

// GET /api/routines/logs/[logId] - busca log específico
export async function GET(
  req: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const log = await db.routineLog.findUnique({
      where: { id: params.logId },
      include: {
        routine: {
          include: {
            steps: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error fetching routine log:", error);
    return NextResponse.json({ error: "Failed to fetch log" }, { status: 500 });
  }
}
