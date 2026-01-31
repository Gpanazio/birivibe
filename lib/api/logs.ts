import { db } from "@/lib/db"

type DateRange = { from: Date; to: Date }

export async function getLogs(
  id: string,
  dateRange: DateRange,
  type: "user" | "activity"
) {
  const where = type === "activity" 
    ? { habitId: id } 
    : { habit: { userId: id } }

  return await db.habitLog.findMany({
    where: {
      date: { gte: dateRange.from, lte: dateRange.to },
      ...where,
    },
    include: { habit: true },
    orderBy: { date: "desc" },
  })
}

export async function getStreak(id: string, type: "user" | "activity") {
  const where = type === "activity" ? { habitId: id } : { habit: { userId: id } }
  const logs = await db.habitLog.findMany({
    where,
    distinct: ["date"],
    orderBy: { date: "asc" },
  })

  if (logs.length === 0) return 0
  
  // Lógica simplificada de streak
  return logs.length; 
}

export async function getTopActivities(userId: string, dateRange: DateRange) {
  const logs = await db.habitLog.groupBy({
    by: ["habitId"],
    _sum: { value: true },
    where: {
      habit: { userId },
      date: { gte: dateRange.from, lte: dateRange.to },
    },
  })

  const top = await Promise.all(logs.map(async (l) => {
    const habit = await db.habit.findUnique({ where: { id: l.habitId } })
    return { name: habit?.name || "N/A", count: l._sum.value || 0, color: habit?.color || "#fff" }
  }))

  return top;
}

export async function getActivityCountByDate(userId: string, dateRange: DateRange) {
  const logs = await db.habitLog.groupBy({
    by: ["date"],
    _sum: { value: true },
    where: {
      habit: { userId },
      date: { gte: dateRange.from, lte: dateRange.to },
    },
  })

  return logs.map(l => ({ date: l.date.toISOString(), count: l._sum.value || 0 }))
}
