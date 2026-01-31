import React, { useMemo, useState } from 'react';
import { FoodItem } from '@/lib/diet-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Card } from '@/components/diet/ui/Card';
import { Button } from '@/components/diet/ui/Button';

interface ReportsProps {
  allLogs: { [date: string]: FoodItem[] };
}

export const Reports: React.FC<ReportsProps> = ({ allLogs }) => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const chartData = useMemo(() => {
    const dates = Object.keys(allLogs).sort();
    const dataPoints = dates.map(date => {
      const dayItems = allLogs[date];
      const totals = dayItems.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
        }),
        { calories: 0, protein: 0 }
      );

      // Format date DD/MM
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}`;

      return {
        date: formattedDate,
        fullDate: date,
        ...totals
      };
    });

    if (view === 'weekly') {
      return dataPoints.slice(-7);
    }
    return dataPoints.slice(-30);
  }, [allLogs, view]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0] && payload[1]) {
      // Safe access checking
      const value0 = payload[0].value || 0;
      const value1 = payload[1].value || 0;

      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-lime-400 text-sm">
              Proteína: {Math.round(value0)}g
            </p>
            <p className="text-orange-400 text-sm">
              Calorias: {Math.round(value1)}kcal
            </p>
          </div>
        </div>
      );
    }
    // Fallback for line chart or single bar scenarios
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {Math.round(entry.value)}
              {entry.name === 'Proteína' ? 'g' : 'kcal'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-zinc-100">Relatórios</h2>
        <div className="flex gap-2">
          <Button
            variant={view === 'weekly' ? 'primary' : 'secondary'}
            onClick={() => setView('weekly')}
            className="text-xs"
          >
            Semanal
          </Button>
          <Button
            variant={view === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setView('monthly')}
            className="text-xs"
          >
            Mensal
          </Button>
        </div>
      </div>

      {/* Main Chart */}
      <Card title={`Evolução (${view === 'weekly' ? '7 dias' : '30 dias'})`}>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}g`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
              <Bar yAxisId="left" dataKey="protein" name="Proteína" fill="#84cc16" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar yAxisId="right" dataKey="calories" name="Calorias" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={50} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Média Diária">
          <div className="flex items-center justify-around h-full py-4">
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-1">Calorias</p>
              <p className="text-3xl font-bold text-orange-500">
                {Math.round(chartData.reduce((acc, curr) => acc + curr.calories, 0) / (chartData.length || 1))}
              </p>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-1">Proteínas</p>
              <p className="text-3xl font-bold text-lime-500">
                {Math.round(chartData.reduce((acc, curr) => acc + curr.protein, 0) / (chartData.length || 1))}g
              </p>
            </div>
          </div>
        </Card>

        <Card title="Calorias Trend">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} dot={false} />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};