import { db } from '@/lib/db';
import { format } from 'date-fns';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AnalyticsPage() {
  const userId = 'user-id-here'; // Replace with actual user ID logic

  const [sleepData, moodData] = await Promise.all([
    db.sleepLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 30,
    }),
    db.moodLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 30,
    }),
  ]);

  const energyData = sleepData.map((sleep, index) => {
    const mood = moodData[index] || { mood: 5 };
    return {
      date: format(sleep.date, 'yyyy-MM-dd'),
      energy: (mood.mood + (sleep.quality / 10)) / 2,
      sleepQuality: sleep.quality,
      moodScore: mood.mood,
    };
  });

  return <AnalyticsChart energyData={energyData} />;
}