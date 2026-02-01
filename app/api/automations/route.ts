import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) return NextResponse.json([], { status: 200 });

    const automations = await db.automation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(automations);
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

    const automation = await db.automation.create({
      data: {
        userId: user.id,
        name: body.name,
        description: body.description,
        triggerType: body.triggerType,
        triggerData: JSON.stringify(body.triggerData || {}),
        actionType: body.actionType,
        actionData: JSON.stringify(body.actionData || {}),
      },
    });

    return NextResponse.json(automation);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
