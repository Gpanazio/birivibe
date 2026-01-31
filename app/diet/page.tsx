"use client";

import { useState, useEffect, useMemo } from "react";
import { Utensils, Plus, Scale, TrendingUp, Target } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  mealCategory?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  date: string;
  timestamp: string;
}

interface Goals {
  calories: number;
  protein: number;
}

// Helper: data efetiva (refeições entre 0h-3h contam como dia anterior)
function getEffectiveDate(): string {
  const now = new Date();
  if (now.getHours() < 3) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }
  return now.toISOString().split("T")[0];
}

function MacroBar({ label, value, target, color, emoji }: {
  label: string;
  value: number;
  target?: number;
  color: string;
  emoji: string;
}) {
  const percentage = target ? Math.min((value / target) * 100, 100) : 0;
  const isGoalMet = target && value >= target;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 border ${isGoalMet ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="text-xs font-bold text-zinc-500 uppercase">{label}</span>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${isGoalMet ? 'text-yellow-400' : 'text-white'}`}>
            {Math.round(value)}
          </span>
          {target && (
            <span className="text-xs text-zinc-600 ml-1">/ {target}</span>
          )}
        </div>
      </div>
      {target && (
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isGoalMet ? 'bg-yellow-400' : color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function DietPage() {
  const [logs, setLogs] = useState<{ [date: string]: FoodItem[] }>({});
  const [goals, setGoals] = useState<Goals>({ calories: 2000, protein: 150 });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = getEffectiveDate();
  const todayItems = useMemo(() => logs[today] || [], [logs, today]);

  const totals = useMemo(() => {
    return todayItems.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fats: acc.fats + (item.fats || 0),
        fiber: acc.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );
  }, [todayItems]);

  // Fetch inicial
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [goalsRes, logsRes] = await Promise.all([
          fetch("/api/diet/goals"),
          fetch("/api/diet/food-logs"),
        ]);

        if (goalsRes.ok) {
          const goalsData = await goalsRes.json();
          setGoals(goalsData);
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          const grouped: { [date: string]: FoodItem[] } = {};
          logsData.forEach((item: FoodItem) => {
            if (item.date) {
              if (!grouped[item.date]) grouped[item.date] = [];
              grouped[item.date].push(item);
            }
          });
          setLogs(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      // Analisa com IA
      const analyzeRes = await fetch("/api/diet/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!analyzeRes.ok) throw new Error("Failed to analyze");

      const analyzed = await analyzeRes.json();

      // Salva no banco
      const saveRes = await fetch("/api/diet/food-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyzed),
      });

      if (!saveRes.ok) throw new Error("Failed to save");

      const saved = await saveRes.json();

      // Atualiza estado local
      setLogs((prev) => {
        const dateKey = saved[0]?.date || today;
        return {
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), ...saved],
        };
      });

      setInput("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-500 animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              BIRI<span className="text-lime-400">DIET</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Módulo Nutrição • {today}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800">
              <Scale className="w-5 h-5 text-zinc-400" />
            </button>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800">
              <TrendingUp className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MacroBar
            label="Calorias"
            value={totals.calories}
            target={goals.calories}
            color="bg-orange-500"
            emoji="🔥"
          />
          <MacroBar
            label="Proteína"
            value={totals.protein}
            target={goals.protein}
            color="bg-red-500"
            emoji="🥩"
          />
          <MacroBar
            label="Carboidratos"
            value={totals.carbs}
            color="bg-yellow-500"
            emoji="🍞"
          />
          <MacroBar
            label="Gorduras"
            value={totals.fats}
            color="bg-purple-500"
            emoji="🥑"
          />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="O que você comeu? Ex: 2 ovos, pão integral, café"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-lime-500 text-black rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Lista do dia */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Refeições de Hoje ({todayItems.length})
          </h2>

          {todayItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-700">
              <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma refeição registrada hoje</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    {item.mealCategory && (
                      <span className="text-[10px] text-zinc-500 uppercase">
                        {item.mealCategory}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-400">
                      {item.calories} kcal
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      P:{item.protein}g C:{item.carbs}g G:{item.fats}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
