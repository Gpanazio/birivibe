"use client";

import { useState, useEffect } from "react";
import { Plus, Target, ChevronRight, Edit2, Trash2, Check } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  description?: string;
  area?: string;
  type: string;
  status: string;
  progress: number;
  targetDate?: string;
  color: string;
  icon?: string;
  children?: Goal[];
  parentId?: string;
}

const AREAS = [
  { id: "health", label: "Saúde", icon: "💪", color: "#22c55e" },
  { id: "career", label: "Carreira", icon: "💼", color: "#3b82f6" },
  { id: "finance", label: "Finanças", icon: "💰", color: "#eab308" },
  { id: "relationships", label: "Relacionamentos", icon: "❤️", color: "#ec4899" },
  { id: "personal", label: "Pessoal", icon: "🌟", color: "#8b5cf6" },
  { id: "learning", label: "Aprendizado", icon: "📚", color: "#06b6d4" },
];

const TYPES = [
  { id: "vision", label: "Visão (5+ anos)" },
  { id: "annual", label: "Anual" },
  { id: "quarterly", label: "Trimestral" },
  { id: "monthly", label: "Mensal" },
  { id: "project", label: "Projeto" },
];

function GoalCard({ goal, onEdit, onDelete, onUpdateProgress }: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateProgress: (progress: number) => void;
}) {
  const area = AREAS.find(a => a.id === goal.area);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${goal.color || area?.color || "#8b5cf6"}20` }}
          >
            {goal.icon || area?.icon || "🎯"}
          </div>
          <div>
            <h3 className="font-bold text-white">{goal.name}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {area && <span>{area.label}</span>}
              {goal.targetDate && (
                <>
                  <span>•</span>
                  <span>{new Date(goal.targetDate).toLocaleDateString("pt-BR")}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-2 text-zinc-600 hover:text-white">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-zinc-600 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-zinc-400">{goal.description}</p>
      )}

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Progresso</span>
          <span className="text-white font-bold">{Math.round(goal.progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all"
            style={{ 
              width: `${goal.progress}%`,
              backgroundColor: goal.color || area?.color || "#8b5cf6"
            }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={goal.progress}
          onChange={(e) => onUpdateProgress(parseInt(e.target.value))}
          className="w-full h-1 opacity-0 hover:opacity-100 cursor-pointer"
        />
      </div>

      {goal.status === "completed" && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          Concluído
        </div>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    area: "personal",
    type: "quarterly",
    targetDate: "",
    color: "#8b5cf6",
  });
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) setGoals(await res.json());
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleCreate = async () => {
    if (!newGoal.name.trim()) return;
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });
      if (res.ok) {
        const goal = await res.json();
        setGoals(prev => [...prev, goal]);
        setNewGoal({ name: "", description: "", area: "personal", type: "quarterly", targetDate: "", color: "#8b5cf6" });
        setShowCreate(false);
      }
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress, status: progress >= 100 ? "completed" : "active" }),
      });
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress, status: progress >= 100 ? "completed" : "active" } : g));
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm("Excluir este objetivo?")) return;
    try {
      await fetch(`/api/goals/${goalId}`, { method: "DELETE" });
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const filteredGoals = filterType ? goals.filter(g => g.type === filterType) : goals;
  const groupedByType = TYPES.reduce((acc, type) => {
    acc[type.id] = filteredGoals.filter(g => g.type === type.id);
    return acc;
  }, {} as Record<string, Goal[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-yellow-400">🎯</span> OBJETIVOS
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Visão → Metas → Projetos
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="p-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Novo Objetivo</h3>
            
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do objetivo"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              autoFocus
            />

            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição (opcional)"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white resize-none"
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Área</label>
                <select
                  value={newGoal.area}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  {AREAS.map(area => (
                    <option key={area.id} value={area.id}>{area.icon} {area.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Tipo</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  {TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">Data limite</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700">
                Cancelar
              </button>
              <button onClick={handleCreate} className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400">
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType(null)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              !filterType ? "bg-yellow-500 text-black font-bold" : "bg-zinc-900 text-zinc-400"
            }`}
          >
            Todos
          </button>
          {TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterType === type.id ? "bg-yellow-500 text-black font-bold" : "bg-zinc-900 text-zinc-400"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2">Nenhum objetivo ainda</h3>
            <p className="text-zinc-500 text-sm mb-4">Defina suas metas e acompanhe o progresso</p>
            <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl">
              Criar Objetivo
            </button>
          </div>
        ) : (
          Object.entries(groupedByType).map(([type, typeGoals]) => {
            if (typeGoals.length === 0) return null;
            const typeInfo = TYPES.find(t => t.id === type);
            return (
              <div key={type} className="space-y-3">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                  {typeInfo?.label} ({typeGoals.length})
                </h2>
                <div className="space-y-3">
                  {typeGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={() => {}}
                      onDelete={() => handleDelete(goal.id)}
                      onUpdateProgress={(p) => handleUpdateProgress(goal.id, p)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
