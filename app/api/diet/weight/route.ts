import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/diet/weight - busca histórico de peso
export async function GET(req: NextRequest) {
  try {
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const logs = await db.weightLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 100, // últimos 100 registros
    });

    const formatted = logs.map((log) => ({
      id: log.id,
      weight: log.weight,
      notes: log.notes,
      date: log.date.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching weight logs:", error);
    return NextResponse.json({ error: "Failed to fetch weight" }, { status: 500 });
  }
}

// POST /api/diet/weight - adiciona novo peso
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: { name: "Gabriel", email: "gabriel@birivibe.com" },
      });
    }

    const log = await db.weightLog.create({
      data: {
        userId: user.id,
        weight: body.weight,
        notes: body.notes,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json({
      id: log.id,
      weight: log.weight,
      notes: log.notes,
      date: log.date.toISOString(),
    });
  } catch (error) {
    console.error("Error creating weight log:", error);
    return NextResponse.json({ error: "Failed to create weight log" }, { status: 500 });
  }
}
