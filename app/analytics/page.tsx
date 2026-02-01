import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-black/80 text-white p-3 rounded-md z-50">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-xs">Energia Vital: {payload[0].value.toFixed(1)}</p>
        <p className="text-xs">Qualidade do Sono: {payload[1].value}</p>
        <p className="text-xs">Humor: {payload[2].value}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Energia Vital</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-black/10 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={energyData}
                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                className="h-full"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tickFormatter={(value) => value.slice(6)} />
                <YAxis domain={[0, 10]} tickCount={5} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#8b5cf6"
                  fill="#8b5cf620"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="sleepQuality"
                  stroke="#10b981"
                  fill="#10b98120"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#f59e0b"
                  fill="#f59e0b20"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}