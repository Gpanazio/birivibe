import { GeminiParsedFood } from "@/lib/diet-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ""

export const hasApiKey = () => {
  return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY
}

export const parseFoodLog = async (
  text: string
): Promise<GeminiParsedFood[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/analyze-food`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`)
    }

    const data: { foods?: GeminiParsedFood[] } = await response.json()
    return data.foods || []
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error parsing food log:", error)
    }
    throw error
  }
}

interface DietGoals {
  calories?: number
  protein?: number
  objectives?: string[]
  intolerances?: string[]
  conditions?: string[]
}

interface DietTipResponse {
  tip: string
  tipIndex: number
  totalTips: number
  cached: boolean
}

export const generateDietTip = async (
  logs: unknown[],
  goals?: DietGoals
): Promise<DietTipResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/daily-tips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs, goals }),
    })

    if (!response.ok) {
      return {
        tip: "O oráculo da dieta está dormindo agora.",
        tipIndex: 0,
        totalTips: 1,
        cached: false,
      }
    }

    const data: Partial<DietTipResponse> = await response.json()
    return {
      tip: data.tip || "Coma alguma coisa para eu te julgar!",
      tipIndex: data.tipIndex || 0,
      totalTips: data.totalTips || 1,
      cached: data.cached || false,
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error generating insight:", error)
    }
    return {
      tip: "O oráculo da dieta está dormindo agora.",
      tipIndex: 0,
      totalTips: 1,
      cached: false,
    }
  }
}

interface NextTipResponse {
  tip: string
  tipIndex: number
  totalTips: number
  needsGeneration?: boolean
}

export const getNextTip = async (
  currentIndex: number
): Promise<NextTipResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/diet/daily-tips/next?current=${currentIndex}`
    )

    if (!response.ok) {
      return null
    }

    const data: Partial<NextTipResponse> = await response.json()
    if (data.needsGeneration) {
      return null
    }

    return {
      tip: data.tip || "",
      tipIndex: data.tipIndex || 0,
      totalTips: data.totalTips || 0,
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting next tip:", error)
    }
    return null
  }
}

interface WeeklyAnalysisGoals {
  calories?: number
  protein?: number
  objectives?: string[]
  intolerances?: string[]
  conditions?: string[]
}

export const generateWeeklyAnalysis = async (
  logs: { [date: string]: unknown[] },
  goals?: WeeklyAnalysisGoals
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diet/weekly-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs, goals }),
    })

    if (!response.ok) {
      return "A Birianálise está indisponível no momento."
    }

    const data: { analysis?: string } = await response.json()
    return data.analysis || "Não foi possível gerar a análise."
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error generating weekly analysis:", error)
    }
    return "A Birianálise está indisponível no momento."
  }
}
