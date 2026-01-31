import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEffectiveDateString } from "@/lib/utils/date";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Você é um nutricionista especializado em análise de alimentos.
Dado um texto descrevendo uma refeição ou alimento, extraia as informações nutricionais.

REGRAS:
1. Retorne APENAS um array JSON válido
2. Cada item deve ter: name, calories, protein, carbs, fats, fiber, sugar, vitaminA, vitaminC, calcium, iron
3. Valores numéricos apenas (sem unidades)
4. Se o usuário mencionar a categoria da refeição (café, almoço, lanche, janta), inclua em mealCategory
5. Se quantidade não especificada, assuma porção padrão
6. Seja preciso com calorias e macros

EXEMPLO DE SAÍDA:
[
  {
    "name": "Frango grelhado 150g",
    "mealCategory": "almoço",
    "calories": 248,
    "protein": 46,
    "carbs": 0,
    "fats": 5,
    "fiber": 0,
    "sugar": 0,
    "vitaminA": 0,
    "vitaminC": 0,
    "calcium": 15,
    "iron": 1.3
  }
]`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as any;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Analise: "${text}"` },
    ]);

    const response = result.response.text();
    
    // Extrai JSON da resposta
    let parsed;
    try {
      // Remove markdown code blocks se existirem
      const jsonStr = response.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Gemini response:", response);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Adiciona data se não existir
    const today = getEffectiveDateString();
    const items = Array.isArray(parsed) ? parsed : [parsed];
    const withDates = items.map((item: any) => ({
      ...item,
      date: item.date || today,
    }));

    return NextResponse.json(withDates);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return NextResponse.json(
      { error: "Failed to analyze food" },
      { status: 500 }
    );
  }
}
