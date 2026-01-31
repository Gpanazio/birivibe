import { GeminiParsedFood } from "@/lib/diet-types";

const API_BASE_URL = '';

export const hasApiKey = () => true;

export const parseFoodLog = async (text: string): Promise<GeminiParsedFood[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/analyze-food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as GeminiParsedFood[];
  } catch (error) {
    console.error("Error parsing food log:", error);
    throw error;
  }
};

export const generateDietTip = async (
  logs: any[],
  goals?: {
    calories?: number;
    protein?: number;
    objectives?: string[];
    intolerances?: string[];
    conditions?: string[]
  }
): Promise<{ tip: string; tipIndex: number; totalTips: number; cached: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/daily-tips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs, goals })
    });

    if (!response.ok) {
      return {
        tip: "O oráculo da dieta está dormindo agora.",
        tipIndex: 0,
        totalTips: 1,
        cached: false
      };
    }

    const data = await response.json();
    return {
      tip: data.tip || "Coma alguma coisa para eu te julgar!",
      tipIndex: data.tipIndex || 0,
      totalTips: data.totalTips || 1,
      cached: data.cached || false
    };
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      tip: "O oráculo da dieta está dormindo agora.",
      tipIndex: 0,
      totalTips: 1,
      cached: false
    };
  }
};

export const getNextTip = async (currentIndex: number): Promise<{ tip: string; tipIndex: number; totalTips: number } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/daily-tips/next?current=${currentIndex}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.needsGeneration) {
      return null;
    }

    return {
      tip: data.tip,
      tipIndex: data.tipIndex,
      totalTips: data.totalTips
    };
  } catch (error) {
    console.error("Error getting next tip:", error);
    return null;
  }
};

export const generateWeeklyAnalysis = async (
  logs: { [date: string]: any[] },
  goals?: { calories?: number; protein?: number; objectives?: string[]; intolerances?: string[]; conditions?: string[] }
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/weekly-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs, goals })
    });

    if (!response.ok) {
      return "A Birianálise está indisponível no momento.";
    }

    const data = await response.json();
    return data.analysis || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Error generating weekly analysis:", error);
    return "A Birianálise está indisponível no momento.";
  }
};
