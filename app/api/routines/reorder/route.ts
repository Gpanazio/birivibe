import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';

// PUT /api/routines/reorder - atualiza ordem das rotinas
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { routineIds: string[] };
    const { routineIds } = body;

    if (!routineIds || !Array.isArray(routineIds)) {
      return NextResponse.json({ error: "routineIds array required" }, { status: 400 });
    }

    // Atualiza a ordem de cada rotina (atômico com transaction)
    await db.$transaction(
      routineIds.map((id, index) =>
        db.routine.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering routines:", error);
    return NextResponse.json({ error: "Failed to reorder routines" }, { status: 500 });
  }
}
