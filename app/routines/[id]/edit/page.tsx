"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Plus, GripVertical, Trash2, Save,
  Clock, Check, Coffee, Dumbbell, Brain, Pill
} from "lucide-react";

interface RoutineStep {
  id?: string;
  name: string;
  description?: string;
  duration?: number;
  type: string;
  isOptional: boolean;
  icon?: string;
  habitId?: string;
}

interface Routine {
  id: string;
  name: string;
  description?: string;
  color: string;
  type: string;
  startTime?: string;
  steps: RoutineStep[];
}

interface Habit {
  id: string;
  name: string;
  color: string;
}

const STEP_ICONS = [
  { icon: "☀️", label: "Acordar" },
  { icon: "💊", label: "Remédio" },
  { icon: "🍳", label: "Refeição" },
  { icon: "🧘", label: "Meditar" },
  { icon: "📖", label: "Ler" },
  { icon: "💪", label: "Exercício" },
  { icon: "🚿", label: "Banho" },
  { icon: "☕", label: "Café" },
  { icon: "📝", label: "Journaling" },
  { icon: "💻", label: "Trabalho" },
  { icon: "📱", label: "Check" },
  { icon: "🎯", label: "Foco" },
];

function StepEditor({ 
  step, 
  index, 
  habits,
  onChange, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  step: RoutineStep;
  index: number;
  habits: Habit[];
  onChange: (step: RoutineStep) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(!step.name);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-800/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={isFirst}
            className={`text-zinc-600 hover:text-white ${isFirst ? "opacity-30" : ""}`}
          >
            ▲
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={isLast}
            className={`text-zinc-600 hover:text-white ${isLast ? "opacity-30" : ""}`}
          >
            ▼
          </button>
        </div>

        <span className="text-xl">{step.icon || "📌"}</span>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {step.name || "Novo passo"}
          </p>
          {step.duration && (
            <p className="text-xs text-zinc-500">{step.duration} min</p>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-zinc-600 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-zinc-800">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nome</label>
            <input
              type="text"
              value={step.name}
              onChange={(e) => onChange({ ...step, name: e.target.value })}
              placeholder="Nome do passo"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Duração (min)</label>
              <input
                type="number"
                value={step.duration || ""}
                onChange={(e) => onChange({ ...step, duration: parseInt(e.target.value) || undefined })}
                placeholder="5"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 block mb-1">Tipo</label>
              <select
                value={step.type}
                onChange={(e) => onChange({ ...step, type: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="task">Tarefa</option>
                <option value="habit">Hábito</option>
                <option value="break">Pausa</option>
                <option value="checkpoint">Checkpoint</option>
              </select>
            </div>
          </div>

          {step.type === "habit" && habits.length > 0 && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Vincular a hábito</label>
              <select
                value={step.habitId || ""}
                onChange={(e) => onChange({ ...step, habitId: e.target.value || undefined })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">Nenhum</option>
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>{habit.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-zinc-500 block mb-1">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {STEP_ICONS.map(({ icon, label }) => (
                <button
                  key={icon}
                  onClick={() => onChange({ ...step, icon })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                    step.icon === icon 
                      ? "bg-purple-500 scale-110" 
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                  title={label}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={step.isOptional}
              onChange={(e) => onChange({ ...step, isOptional: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-800 border-zinc-700"
            />
            <span className="text-sm text-zinc-400">Passo opcional</span>
          </label>
        </div>
      )}
    </div>
  );
}

export default function EditRoutinePage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routineRes, habitsRes] = await Promise.all([
          fetch(`/api/routines/${routineId}`),
          fetch("/api/habits"),
        ]);

        if (routineRes.ok) {
          const data = await routineRes.json() as any;
          setRoutine(data);
          setSteps(data.steps || []);
        }

        if (habitsRes.ok) {
          const data = await habitsRes.json() as any;
          setHabits(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [routineId]);

  const handleAddStep = () => {
    setSteps(prev => [...prev, {
      name: "",
      type: "task",
      isOptional: false,
      icon: "📌",
    }]);
  };

  const handleUpdateStep = (index: number, step: RoutineStep) => {
    setSteps(prev => prev.map((s, i) => i === index ? step : s));
  };

  const handleDeleteStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSave = async () => {
    if (!routine) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/routines/${routineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...routine,
          steps: steps.filter(s => s.name.trim()),
        }),
      });

      if (res.ok) {
        router.push("/routines");
      }
    } catch (error) {
      console.error("Failed to save routine:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Rotina não encontrada</div>
      </div>
    );
  }

  const totalDuration = steps.reduce((acc, step) => acc + (step.duration || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-white">{routine.name}</h1>
              <p className="text-xs text-zinc-500">
                {steps.length} passos • {totalDuration} min
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Routine Info */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
          <input
            type="text"
            value={routine.name}
            onChange={(e) => setRoutine(prev => prev ? { ...prev, name: e.target.value } : null)}
            className="w-full bg-transparent text-xl font-bold text-white focus:outline-none"
            placeholder="Nome da rotina"
          />
          <div className="flex gap-3">
            <input
              type="time"
              value={routine.startTime || ""}
              onChange={(e) => setRoutine(prev => prev ? { ...prev, startTime: e.target.value } : null)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
            <div className="flex gap-1">
              {["#ef4444", "#f97316", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"].map(color => (
                <button
                  key={color}
                  onClick={() => setRoutine(prev => prev ? { ...prev, color } : null)}
                  className={`w-8 h-8 rounded-lg transition-all ${routine.color === color ? "ring-2 ring-white" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Passos da Rotina
            </h2>
            <button
              onClick={handleAddStep}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-8 text-zinc-600">
              <p className="mb-2">Nenhum passo ainda</p>
              <button
                onClick={handleAddStep}
                className="text-purple-400 hover:text-purple-300"
              >
                Adicionar primeiro passo
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <StepEditor
                  key={index}
                  step={step}
                  index={index}
                  habits={habits}
                  onChange={(s) => handleUpdateStep(index, s)}
                  onDelete={() => handleDeleteStep(index)}
                  onMoveUp={() => handleMoveStep(index, "up")}
                  onMoveDown={() => handleMoveStep(index, "down")}
                  isFirst={index === 0}
                  isLast={index === steps.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Step Button */}
        <button
          onClick={handleAddStep}
          className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Passo
        </button>
      </main>
    </div>
  );
}
