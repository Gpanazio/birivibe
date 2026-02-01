import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) return NextResponse.json([], { status: 200 });

    const goals = await db.goal.findMany({
      where: { userId: user.id },
      include: { children: true, parent: true },
      orderBy: [{ type: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
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

    const goal = await db.goal.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description,
        area: body.area,
        type: body.type || "quarterly",
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        metric: body.metric,
        targetValue: body.targetValue,
        parentId: body.parentId,
        color: body.color,
        icon: body.icon,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
