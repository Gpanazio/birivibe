import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const goal = await db.goal.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        progress: body.progress,
        currentValue: body.currentValue,
        status: body.status,
        color: body.color,
      },
    });
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.goal.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
