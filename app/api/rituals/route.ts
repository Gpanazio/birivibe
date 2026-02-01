import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) return NextResponse.json([], { status: 200 });

    const rituals = await db.ritual.findMany({
      where: { userId: user.id, active: true },
      include: { logs: { take: 5, orderBy: { startedAt: "desc" } } },
    });

    return NextResponse.json(rituals);
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

    const ritual = await db.ritual.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description,
        icon: body.icon,
        color: body.color,
        frequency: body.frequency || "weekly",
        dayOfWeek: body.dayOfWeek,
        dayOfMonth: body.dayOfMonth,
        template: body.template ? JSON.stringify(body.template) : undefined,
        duration: body.duration,
      },
    });

    return NextResponse.json(ritual);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
