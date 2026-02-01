import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = 'nodejs';

// PUT /api/diet/food-logs/[id] - atualiza um log
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json() as any;

    const updated = await db.foodLog.update({
      where: { id },
      data: {
        name: body.name,
        mealCategory: body.mealCategory,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
        fiber: body.fiber,
        sugar: body.sugar,
        vitaminA: body.vitaminA,
        vitaminC: body.vitaminC,
        calcium: body.calcium,
        iron: body.iron,
        date: body.date,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      mealCategory: updated.mealCategory,
      calories: updated.calories,
      protein: updated.protein,
      carbs: updated.carbs,
      fats: updated.fats,
      fiber: updated.fiber,
      sugar: updated.sugar,
      vitaminA: updated.vitaminA,
      vitaminC: updated.vitaminC,
      calcium: updated.calcium,
      iron: updated.iron,
      date: updated.date,
      timestamp: updated.timestamp.toISOString(),
    });
  } catch (error) {
    console.error("Error updating food log:", error);
    return NextResponse.json({ error: "Failed to update log" }, { status: 500 });
  }
}

// DELETE /api/diet/food-logs/[id] - deleta um log
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await db.foodLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting food log:", error);
    return NextResponse.json({ error: "Failed to delete log" }, { status: 500 });
  }
}
