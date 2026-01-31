"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, Plus, Flame, Target, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  icon?: string;
  targetValue: number;
  unit?: string;
}

interface HabitLog {
  id: string;
  habitId: string;
  value: number;
  date: string;
}

// Gera array de datas para os últimos N dias
function getDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  
  return dates;
}

function HabitRow({ 
  habit, 
  logs, 
  dates, 
  onToggle 
}: { 
  habit: Habit; 
  logs: HabitLog[]; 
  dates: string[];
  onToggle: (habitId: string, date: string, isCompleted: boolean) => void;
}) {
  const completedDates = useMemo(() => {
    return new Set(
      logs
        .filter(l => l.habitId === habit.id)
        .map(l => l.date.split("T")[0])
    );
  }, [logs, habit.id]);

  // Calcula streak atual
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date().toISOString().split("T")[0];
    const sortedDates = [...dates].reverse();
    
    for (const date of sortedDates) {
      if (completedDates.has(date)) {
        count++;
      } else if (date !== today) {
        break;
      }
    }
    
    return count;
  }, [completedDates, dates]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${habit.color}20` }}
          >
            {habit.icon || "✓"}
          </div>
          <div>
            <h3 className="font-bold text-white">{habit.name}</h3>
            {habit.category && (
              <span className="text-[10px] text-zinc-500 uppercase">{habit.category}</span>
            )}
          </div>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-lg">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400">{streak}</span>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="flex gap-1">
        {dates.map((date) => {
          const isCompleted = completedDates.has(date);
          const isToday = date === new Date().toISOString().split("T")[0];
          
          return (
            <button
              key={date}
              onClick={() => onToggle(habit.id, date, isCompleted)}
              className={`flex-1 aspect-square rounded-lg transition-all ${
                isCompleted 
                  ? "scale-100" 
                  : "bg-zinc-800 hover:bg-zinc-700"
              } ${isToday ? "ring-2 ring-white/30" : ""}`}
              style={{
                backgroundColor: isCompleted ? habit.color : undefined,
              }}
              title={date}
            >
              {isCompleted && (
                <Check className="w-3 h-3 mx-auto text-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", category: "", color: "#8b5cf6" });

  const dates = useMemo(() => getDateRange(14), []); // Últimos 14 dias

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsRes, logsRes] = await Promise.all([
          fetch("/api/habits"),
          fetch("/api/habits/logs?days=30"),
        ]);

        if (habitsRes.ok) {
          const data = await habitsRes.json();
          setHabits(data);
        }

        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async (habitId: string, date: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        // Remove
        await fetch(`/api/habits/logs?habitId=${habitId}&date=${date}`, {
          method: "DELETE",
        });
        setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date.startsWith(date))));
      } else {
        // Adiciona
        const res = await fetch("/api/habits/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habitId, date }),
        });
        
        if (res.ok) {
          const newLog = await res.json();
          setLogs(prev => [...prev, { ...newLog, date: date }]);
        }
      }
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return;

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit),
      });

      if (res.ok) {
        const habit = await res.json();
        setHabits(prev => [...prev, habit]);
        setNewHabit({ name: "", category: "", color: "#8b5cf6" });
        setShowAdd(false);
      }
    } catch (error) {
      console.error("Failed to add habit:", error);
    }
  };

  // Stats
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter(l => l.date.startsWith(todayStr));
  const completedToday = todayLogs.length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              BIRI<span className="text-purple-400">ROTINA</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Módulo Hábitos • {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
          
          <button
            onClick={() => setShowAdd(true)}
            className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold">Novo Hábito</h3>
            
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do hábito"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              autoFocus
            />
            
            <input
              type="text"
              value={newHabit.category}
              onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Categoria (ex: Saúde, Mente)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            />
            
            <div>
              <label className="text-xs text-zinc-500 block mb-2">Cor</label>
              <div className="flex gap-2">
                {["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHabit(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg transition-all ${newHabit.color === color ? "ring-2 ring-white scale-110" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddHabit}
                className="flex-1 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Today Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
            <Target className="w-5 h-5 mx-auto text-purple-400 mb-1" />
            <p className="text-2xl font-black text-white">{completedToday}/{totalHabits}</p>
            <p className="text-[10px] text-zinc-500 uppercase">Hoje</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-2xl font-black text-white">{completionRate}%</p>
            <p className="text-[10px] text-zinc-500 uppercase">Taxa</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
            <Flame className="w-5 h-5 mx-auto text-orange-400 mb-1" />
            <p className="text-2xl font-black text-white">
              {Math.max(...habits.map(h => {
                let streak = 0;
                const completed = new Set(logs.filter(l => l.habitId === h.id).map(l => l.date.split("T")[0]));
                for (const date of [...dates].reverse()) {
                  if (completed.has(date)) streak++;
                  else if (date !== todayStr) break;
                }
                return streak;
              }), 0)}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase">Melhor Streak</p>
          </div>
        </div>

        {/* Date Labels */}
        <div className="flex gap-1 px-4">
          {dates.slice(-14).map((date, i) => {
            const d = new Date(date + "T12:00:00");
            const isToday = date === todayStr;
            return (
              <div key={date} className="flex-1 text-center">
                <span className={`text-[9px] ${isToday ? "text-white font-bold" : "text-zinc-600"}`}>
                  {d.toLocaleDateString("pt-BR", { weekday: "narrow" })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-lg font-bold text-white mb-2">Nenhum hábito ainda</h3>
              <p className="text-zinc-500 text-sm mb-4">Comece criando seu primeiro hábito</p>
              <button
                onClick={() => setShowAdd(true)}
                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400"
              >
                Criar Hábito
              </button>
            </div>
          ) : (
            habits.map(habit => (
              <HabitRow
                key={habit.id}
                habit={habit}
                logs={logs}
                dates={dates.slice(-14)}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
