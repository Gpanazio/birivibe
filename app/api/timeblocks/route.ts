import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) return NextResponse.json([], { status: 200 });

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    
    const startOfDay = date ? new Date(date) : new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const blocks = await db.timeBlock.findMany({
      where: {
        userId: user.id,
        startTime: { gte: startOfDay, lt: endOfDay },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({ data: { name: "Gabriel", email: "gabriel@birivibe.com" } });
    }

    const block = await db.timeBlock.create({
      data: {
        userId: user.id,
        name: body.name,
        type: body.type || "focus",
        color: body.color,
        duration: body.duration,
        startTime: new Date(body.startTime),
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        projectId: body.projectId,
        notes: body.notes,
      },
    });

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
