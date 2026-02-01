import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) return NextResponse.json([], { status: 200 });

    const contexts = await db.context.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(contexts);
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

    const context = await db.context.create({
      data: {
        userId: user.id,
        name: body.name,
        icon: body.icon,
        color: body.color,
        type: body.type || "location",
      },
    });

    return NextResponse.json(context);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
