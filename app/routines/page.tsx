"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Play, Sun, Moon, Briefcase, Dumbbell, 
  Clock, ChevronRight, MoreVertical, Trash2, Edit2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface RoutineStep {
  id: string;
  name: string;
  duration?: number;
  type: string;
  isOptional: boolean;
  icon?: string;
}

interface Routine {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  type: string;
  startTime?: string;
  daysOfWeek?: string;
  steps: RoutineStep[];
  _count?: { logs: number };
}

const TYPE_ICONS: Record<string, any> = {
  morning: Sun,
  evening: Moon,
  work: Briefcase,
  workout: Dumbbell,
  custom: Clock,
};

const TYPE_LABELS: Record<string, string> = {
  morning: "Manhã",
  evening: "Noite",
  work: "Trabalho",
  workout: "Treino",
  custom: "Personalizada",
};

function RoutineCard({ routine, onStart, onDelete }: { 
  routine: Routine; 
  onStart: () => void;
  onDelete: () => void;
}) {
  const Icon = TYPE_ICONS[routine.type] || Clock;
  const totalDuration = routine.steps.reduce((acc, step) => acc + (step.duration || 0), 0);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group"
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center gap-3"
        style={{ borderLeft: `4px solid ${routine.color}` }}
      >
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${routine.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: routine.color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{routine.name}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{routine.steps.length} passos</span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{totalDuration} min</span>
              </>
            )}
            {routine.startTime && (
              <>
                <span>•</span>
                <span>{routine.startTime}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStart}
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <Play className="w-5 h-5 text-white" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-10">
                <Link
                  href={`/routines/${routine.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Link>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Steps Preview */}
      <div className="px-4 pb-4">
        <div className="flex gap-1">
          {routine.steps.slice(0, 8).map((step, i) => (
            <div
              key={step.id}
              className="flex-1 h-1.5 rounded-full bg-zinc-800"
              title={step.name}
            />
          ))}
          {routine.steps.length > 8 && (
            <span className="text-[10px] text-zinc-600 ml-1">+{routine.steps.length - 8}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    type: "morning",
    color: "#8b5cf6",
    startTime: "06:30",
  });

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch("/api/routines");
        if (res.ok) {
          const data = await res.json() as any;
          setRoutines(data);
        }
      } catch (error) {
        console.error("Failed to fetch routines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleCreate = async () => {
    if (!newRoutine.name.trim()) return;

    try {
      const res = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoutine),
      });

      if (res.ok) {
        const routine = await res.json() as any;
        setRoutines(prev => [...prev, routine]);
        setNewRoutine({ name: "", type: "morning", color: "#8b5cf6", startTime: "06:30" });
        setShowCreate(false);
        // Redireciona para editar e adicionar passos
        window.location.href = `/routines/${routine.id}/edit`;
      }
    } catch (error) {
      console.error("Failed to create routine:", error);
    }
  };

  const handleStart = (routineId: string) => {
    window.location.href = `/routines/${routineId}/play`;
  };

  const handleDelete = async (routineId: string) => {
    if (!confirm("Excluir esta rotina?")) return;

    try {
      await fetch(`/api/routines/${routineId}`, { method: "DELETE" });
      setRoutines(prev => prev.filter(r => r.id !== routineId));
    } catch (error) {
      console.error("Failed to delete routine:", error);
    }
  };

  // Agrupa por tipo
  const groupedRoutines = routines.reduce((acc, routine) => {
    const type = routine.type || "custom";
    if (!acc[type]) acc[type] = [];
    acc[type].push(routine);
    return acc;
  }, {} as Record<string, Routine[]>);

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
              Rotinas & Rituais
            </p>
          </div>
          
          <button
            onClick={() => setShowCreate(true)}
            className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Nova Rotina</h3>
            
            <input
              type="text"
              value={newRoutine.name}
              onChange={(e) => setNewRoutine(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da rotina"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              autoFocus
            />

            <div>
              <label className="text-xs text-zinc-500 block mb-2">Tipo</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(TYPE_LABELS).map(([type, label]) => {
                  const Icon = TYPE_ICONS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setNewRoutine(prev => ({ ...prev, type }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        newRoutine.type === type
                          ? "bg-purple-500 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px]">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-2">Horário de início</label>
              <input
                type="time"
                value={newRoutine.startTime}
                onChange={(e) => setNewRoutine(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-2">Cor</label>
              <div className="flex gap-2">
                {["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewRoutine(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg transition-all ${newRoutine.color === color ? "ring-2 ring-white scale-110" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400"
              >
                Criar & Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {routines.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌅</div>
            <h3 className="text-lg font-bold text-white mb-2">Nenhuma rotina ainda</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Crie sua primeira rotina para organizar seu dia
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400"
            >
              Criar Rotina
            </button>
          </div>
        ) : (
          Object.entries(groupedRoutines).map(([type, typeRoutines]) => (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = TYPE_ICONS[type] || Clock;
                  return <Icon className="w-4 h-4 text-zinc-500" />;
                })()}
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                  {TYPE_LABELS[type] || type}
                </h2>
                <span className="text-xs text-zinc-600">({typeRoutines.length})</span>
              </div>

              <div className="space-y-3">
                {typeRoutines.map(routine => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onStart={() => handleStart(routine.id)}
                    onDelete={() => handleDelete(routine.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Quick Templates */}
        {routines.length === 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Templates Sugeridos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Manhã Produtiva", type: "morning", icon: "🌅", desc: "6 passos • 45min" },
                { name: "Noite de Descanso", type: "evening", icon: "🌙", desc: "5 passos • 30min" },
                { name: "Deep Work", type: "work", icon: "💻", desc: "4 blocos • 2h" },
                { name: "Pré-Treino", type: "workout", icon: "💪", desc: "4 passos • 15min" },
              ].map(template => (
                <button
                  key={template.name}
                  onClick={() => {
                    setNewRoutine(prev => ({ ...prev, name: template.name, type: template.type }));
                    setShowCreate(true);
                  }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-all"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <h3 className="font-bold text-white text-sm">{template.name}</h3>
                  <p className="text-[10px] text-zinc-500">{template.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
