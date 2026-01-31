import { db as prisma } from "@/lib/db"
import { getUserActivities } from "@/lib/api/activities"
import {
  getActivityCountByDate,
  getLogs,
  getStreak,
  getTopActivities,
} from "@/lib/api/logs"

type DateRangeType = {
  from: Date
  to: Date
}

export async function getDashboardData(
  userId: string,
  dateRange: DateRangeType
) {
  const [
    logs,
    streak,
    activityCountByDate,
    topActivities,
    userActivities,
    lastSleep,
    lastMood,
    todayExpenses,
    recentWorkouts
  ] = await Promise.all([
    getLogs(userId, dateRange, "user"),
    getStreak(userId, "user"),
    getActivityCountByDate(userId, dateRange),
    getTopActivities(userId, dateRange),
    getUserActivities(userId),
    
    prisma.sleepLog.findFirst({
        where: { userId },
        orderBy: { wakeTime: 'desc' }
    }),
    prisma.moodLog.findFirst({
        where: { userId },
        orderBy: { date: 'desc' }
    }),
    prisma.transaction.aggregate({
        where: { userId, type: 'expense', date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
        _sum: { amount: true }
    }),
    prisma.workout.findMany({
        where: { userId },
        take: 3,
        orderBy: { date: 'desc' }
    })
  ])

  // CÁLCULO DAS BARRAS TIPO THE SIMS (0-100)
  const needs = {
    energy: Math.min(((lastSleep?.quality || 5) * 10), 100),
    fitness: recentWorkouts.length > 0 ? 85 : 30, // Simplificado p/ demo
    mind: (lastMood?.score || 5) * 10,
    capital: Math.max(100 - ((todayExpenses._sum.amount || 0) / 5), 0), // Cai conforme gasta
    overall: Math.min((streak * 10), 100)
  }

  return {
    logs,
    streak,
    activityCountByDate,
    topActivities,
    userActivities,
    needs,
    stats: {
        sleep: lastSleep,
        mood: lastMood,
        todayExpenses: todayExpenses._sum.amount || 0,
        recentWorkouts
    }
  }
}
