import { db } from "@/lib/db"

export async function getUserActivities(userId: string) {
  const habits = await db.habit.findMany({
    where: { userId },
    include: {
      logs: {
        select: { value: true }
      }
    }
  });

  return habits.map(h => ({
    ...h,
    total_count: h.logs.reduce((sum, log) => sum + log.value, 0)
  }));
}

export async function verifyActivity(activityId: string, userId: string) {
  const count = await db.habit.count({
    where: { id: activityId, userId },
  });
  return count > 0;
}
