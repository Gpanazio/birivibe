import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';

// POST /api/routines/[id]/start - inicia execução de rotina
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const routine = await db.routine.findUnique({
      where: { id: params.id },
      include: { steps: true },
    });

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    const log = await db.routineLog.create({
      data: {
        routineId: params.id,
        userId: user.id,
        totalSteps: routine.steps.length,
        stepsCompleted: "[]",
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error starting routine:", error);
    return NextResponse.json({ error: "Failed to start routine" }, { status: 500 });
  }
}
