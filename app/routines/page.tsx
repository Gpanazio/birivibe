"use client";

import { useState, useEffect } from "react";
import {
  Plus, Sun, Moon, Briefcase, Dumbbell,
  Clock, ChevronRight, ChevronDown, MoreVertical, Trash2, Edit2,
  CheckCircle2, ArrowLeft, Home, GripVertical
} from "lucide-react";
import Link from "next/link";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Templates completos de dia
interface TemplateStep {
  name: string;
  icon: string;
  duration: number;
  type: string;
  isOptional: boolean;
}

interface RoutineTemplate {
  name: string;
  description: string;
  type: string;
  color: string;
  icon: string;
  startTime: string;
  steps: TemplateStep[];
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    name: "Manhã Produtiva",
    description: "Comece o dia com energia, clareza mental e foco. Do despertar ao trabalho.",
    type: "morning",
    color: "#f97316",
    icon: "🌅",
    startTime: "06:00",
    steps: [
      { name: "Despertar gradual", icon: "☀️", duration: 5, type: "task", isOptional: false },
      { name: "Beber água", icon: "💧", duration: 2, type: "habit", isOptional: false },
      { name: "Alongamento leve", icon: "🤸", duration: 10, type: "task", isOptional: false },
      { name: "Meditação / Respiração", icon: "🧘", duration: 10, type: "habit", isOptional: true },
      { name: "Banho revigorante", icon: "🚿", duration: 15, type: "task", isOptional: false },
      { name: "Skincare manhã", icon: "🧴", duration: 5, type: "task", isOptional: true },
      { name: "Café da manhã nutritivo", icon: "🍳", duration: 20, type: "task", isOptional: false },
      { name: "Revisar agenda do dia", icon: "📅", duration: 10, type: "task", isOptional: false },
      { name: "Definir 3 prioridades", icon: "🎯", duration: 5, type: "task", isOptional: false },
      { name: "Preparar ambiente de trabalho", icon: "💻", duration: 5, type: "task", isOptional: false },
    ],
  },
  {
    name: "Noite de Descanso",
    description: "Desacelere para um sono reparador. Do jantar à cama.",
    type: "evening",
    color: "#8b5cf6",
    icon: "🌙",
    startTime: "20:00",
    steps: [
      { name: "Jantar leve", icon: "🥗", duration: 30, type: "task", isOptional: false },
      { name: "Caminhada leve / Digestão", icon: "🚶", duration: 15, type: "task", isOptional: true },
      { name: "Desligar telas", icon: "📵", duration: 1, type: "task", isOptional: false },
      { name: "Preparar roupa do dia seguinte", icon: "👔", duration: 5, type: "task", isOptional: true },
      { name: "Chá relaxante", icon: "🍵", duration: 10, type: "task", isOptional: true },
      { name: "Skincare noite", icon: "✨", duration: 10, type: "task", isOptional: false },
      { name: "Escovar dentes", icon: "🦷", duration: 3, type: "task", isOptional: false },
      { name: "Leitura relaxante", icon: "📖", duration: 20, type: "habit", isOptional: false },
      { name: "Gratidão / Journaling", icon: "📝", duration: 5, type: "habit", isOptional: true },
      { name: "Meditação para dormir", icon: "😴", duration: 10, type: "habit", isOptional: true },
      { name: "Apagar luzes", icon: "🌑", duration: 1, type: "task", isOptional: false },
    ],
  },
  {
    name: "Deep Work - Foco Total",
    description: "Blocos de trabalho profundo intercalados com pausas estratégicas.",
    type: "work",
    color: "#3b82f6",
    icon: "💻",
    startTime: "09:00",
    steps: [
      { name: "Revisar agenda e metas", icon: "📋", duration: 10, type: "task", isOptional: false },
      { name: "Limpar notificações", icon: "🔔", duration: 5, type: "task", isOptional: false },
      { name: "🔥 Deep Work Bloco 1", icon: "🎯", duration: 90, type: "timeblock", isOptional: false },
      { name: "Pausa ativa (alongar)", icon: "🧘", duration: 10, type: "break", isOptional: false },
      { name: "Hidratação + Snack", icon: "☕", duration: 10, type: "break", isOptional: false },
      { name: "🔥 Deep Work Bloco 2", icon: "🎯", duration: 90, type: "timeblock", isOptional: false },
      { name: "Almoço mindful", icon: "🍽️", duration: 45, type: "break", isOptional: false },
      { name: "Caminhada / Descanso", icon: "🚶", duration: 15, type: "break", isOptional: true },
      { name: "🔥 Deep Work Bloco 3", icon: "🎯", duration: 60, type: "timeblock", isOptional: true },
      { name: "Revisar progresso do dia", icon: "✅", duration: 10, type: "task", isOptional: false },
      { name: "Planejar amanhã", icon: "📅", duration: 10, type: "task", isOptional: false },
    ],
  },
  {
    name: "Treino Completo",
    description: "Do aquecimento ao recovery. Treino estruturado para resultados.",
    type: "workout",
    color: "#22c55e",
    icon: "💪",
    startTime: "07:00",
    steps: [
      { name: "Pré-treino (café/suplemento)", icon: "⚡", duration: 10, type: "task", isOptional: true },
      { name: "Vestir roupa de treino", icon: "👟", duration: 5, type: "task", isOptional: false },
      { name: "Aquecimento articular", icon: "🔄", duration: 5, type: "task", isOptional: false },
      { name: "Aquecimento cardio leve", icon: "🏃", duration: 5, type: "task", isOptional: false },
      { name: "Alongamento dinâmico", icon: "🤸", duration: 5, type: "task", isOptional: false },
      { name: "🔥 Treino Principal", icon: "💪", duration: 45, type: "task", isOptional: false },
      { name: "Cardio / HIIT", icon: "❤️‍🔥", duration: 15, type: "task", isOptional: true },
      { name: "Alongamento estático", icon: "🧘", duration: 10, type: "task", isOptional: false },
      { name: "Shake proteico", icon: "🥤", duration: 5, type: "task", isOptional: false },
      { name: "Banho pós-treino", icon: "🚿", duration: 15, type: "task", isOptional: false },
      { name: "Registrar treino", icon: "📝", duration: 5, type: "task", isOptional: true },
    ],
  },
  {
    name: "Domingo Regenerativo",
    description: "Um dia para descansar, refletir e se preparar para a semana.",
    type: "custom",
    color: "#ec4899",
    icon: "🌸",
    startTime: "09:00",
    steps: [
      { name: "Acordar sem alarme", icon: "😴", duration: 0, type: "task", isOptional: false },
      { name: "Café da manhã especial", icon: "🥐", duration: 30, type: "task", isOptional: false },
      { name: "Limpeza leve da casa", icon: "🧹", duration: 30, type: "task", isOptional: true },
      { name: "Autocuidado (banho longo)", icon: "🛁", duration: 30, type: "task", isOptional: false },
      { name: "Hobby / Lazer pessoal", icon: "🎨", duration: 60, type: "task", isOptional: false },
      { name: "Almoço especial", icon: "🍝", duration: 45, type: "task", isOptional: false },
      { name: "Descanso / Cochilo", icon: "😴", duration: 30, type: "break", isOptional: true },
      { name: "Natureza / Passeio", icon: "🌳", duration: 60, type: "task", isOptional: true },
      { name: "Revisar semana passada", icon: "📊", duration: 15, type: "task", isOptional: false },
      { name: "Planejar semana", icon: "📅", duration: 20, type: "task", isOptional: false },
      { name: "Preparar para segunda", icon: "👔", duration: 15, type: "task", isOptional: false },
    ],
  },
];

function RoutineCard({ routine, onDelete }: {
  routine: Routine;
  onDelete: () => void;
}) {
  const Icon = TYPE_ICONS[routine.type] || Clock;
  const totalDuration = routine.steps.reduce((acc, step) => acc + (step.duration || 0), 0);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group relative"
    >
      {/* Header - clicável para expandir */}
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        style={{ borderLeft: `4px solid ${routine.color}` }}
        onClick={() => setExpanded(!expanded)}
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
          <ChevronDown 
            className={`w-5 h-5 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowMenu(false)}
              />
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-[9999] min-w-[200px]">
                <div className="p-3 border-b border-zinc-700 text-center">
                  <span className="text-sm text-zinc-400">{routine.name}</span>
                </div>
                <Link
                  href={`/routines/${routine.id}/edit`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Link>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-700 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Steps - visível quando expandido */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {routine.steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-zinc-600 text-purple-500 focus:ring-purple-500"
                // TODO: lógica de toggle vem depois
              />
              <span className="text-2xl">{step.icon || '📝'}</span>
              <div className="flex-1">
                <span className="text-white">{step.name}</span>
                {step.isOptional && (
                  <span className="ml-2 text-xs text-zinc-500">(opcional)</span>
                )}
              </div>
              {step.duration && (
                <span className="text-xs text-zinc-500">{step.duration}min</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Wrapper sortable para drag & drop
function SortableRoutineCard({ routine, onDelete }: { routine: Routine; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: routine.id 
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      {/* Drag handle */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover/sortable:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-zinc-600" />
      </div>
      <RoutineCard routine={routine} onDelete={onDelete} />
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

  const handleDelete = async (routineId: string) => {
    if (!confirm("Excluir esta rotina?")) return;

    try {
      const res = await fetch(`/api/routines/${routineId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.text();
        alert(`Erro ao excluir: ${err}`);
        return;
      }
      setRoutines(prev => prev.filter(r => r.id !== routineId));
    } catch (error) {
      console.error("Failed to delete routine:", error);
      alert(`Erro ao excluir: ${error}`);
    }
  };

  // Drag & Drop handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = routines.findIndex(r => r.id === active.id);
    const newIndex = routines.findIndex(r => r.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    let reordered = arrayMove(routines, oldIndex, newIndex);

    // REGRA: Rotinas "morning" sempre ficam no topo
    reordered = reordered.sort((a, b) => {
      if (a.type === 'morning' && b.type !== 'morning') return -1;
      if (a.type !== 'morning' && b.type === 'morning') return 1;
      return 0;
    });

    setRoutines(reordered);

    // Salvar ordem na API
    try {
      await fetch('/api/routines/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineIds: reordered.map(r => r.id) }),
      });
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const handleCreateFromTemplate = async (template: RoutineTemplate) => {
    try {
      // Cria a rotina com todos os passos do template
      const res = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          type: template.type,
          color: template.color,
          startTime: template.startTime,
          steps: template.steps.map((step, index) => ({
            ...step,
            order: index,
          })),
        }),
      });

      if (res.ok) {
        const routine = await res.json() as any;
        // Redireciona para editar/personalizar
        window.location.href = `/routines/${routine.id}/edit`;
      } else {
        console.error("Failed to create routine from template");
      }
    } catch (error) {
      console.error("Failed to create routine from template:", error);
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
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>

          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight">
              🌅 ROTINAS
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Rotinas & Rituais
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

          <Link href="/" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <Home className="w-5 h-5 text-zinc-400" />
          </Link>
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
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${newRoutine.type === type
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={routines.map(r => r.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 pl-6">
                {routines.map(routine => (
                  <SortableRoutineCard
                    key={routine.id}
                    routine={routine}
                    onDelete={() => handleDelete(routine.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Quick Templates - Rotinas de Dia Completo */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
            📦 Templates Prontos
          </h2>
            <div className="grid grid-cols-1 gap-3">
              {ROUTINE_TEMPLATES.map(template => (
                <button
                  key={template.name}
                  onClick={() => handleCreateFromTemplate(template)}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}20` }}
                    >
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white">{template.name}</h3>
                      <p className="text-xs text-zinc-400 mb-2">{template.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>{template.steps.length} passos</span>
                        <span>•</span>
                        <span>{template.steps.reduce((acc, s) => acc + s.duration, 0)} min</span>
                        <span>•</span>
                        <span>{template.startTime}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.steps.slice(0, 5).map((step, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full"
                          >
                            {step.icon} {step.name}
                          </span>
                        ))}
                        {template.steps.length > 5 && (
                          <span className="text-[10px] text-zinc-500">
                            +{template.steps.length - 5} mais
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
