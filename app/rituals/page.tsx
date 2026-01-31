"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, CheckCircle, ChevronRight } from "lucide-react";

interface RitualLog {
  id: string;
  startedAt: string;
  completedAt?: string;
}

interface Ritual {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  frequency: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  duration?: number;
  logs?: RitualLog[];
}

const FREQUENCIES = [
  { id: "weekly", label: "Semanal", icon: "📅" },
  { id: "biweekly", label: "Quinzenal", icon: "📆" },
  { id: "monthly", label: "Mensal", icon: "🗓️" },
  { id: "quarterly", label: "Trimestral", icon: "📊" },
  { id: "yearly", label: "Anual", icon: "🎉" },
];

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const TEMPLATES = [
  { name: "Weekly Review", icon: "📋", frequency: "weekly", dayOfWeek: 0, duration: 30, description: "Revisar a semana, planejar a próxima" },
  { name: "Monthly Planning", icon: "🎯", frequency: "monthly", dayOfMonth: 1, duration: 60, description: "Definir metas do mês" },
  { name: "Quarterly Goals", icon: "📊", frequency: "quarterly", duration: 90, description: "Revisar OKRs e ajustar estratégia" },
  { name: "Limpeza Digital", icon: "🧹", frequency: "monthly", duration: 45, description: "Organizar arquivos, emails, apps" },
];

function RitualCard({ ritual, onStart, onDelete }: {
  ritual: Ritual;
  onStart: () => void;
  onDelete: () => void;
}) {
  const lastLog = ritual.logs?.[0];
  const lastCompleted = lastLog?.completedAt ? new Date(lastLog.completedAt) : null;
  const freq = FREQUENCIES.find(f => f.id === ritual.frequency);

  const getNextDue = () => {
    if (!lastCompleted) return "Nunca feito";
    const next = new Date(lastCompleted);
    switch (ritual.frequency) {
      case "weekly": next.setDate(next.getDate() + 7); break;
      case "biweekly": next.setDate(next.getDate() + 14); break;
      case "monthly": next.setMonth(next.getMonth() + 1); break;
      case "quarterly": next.setMonth(next.getMonth() + 3); break;
      case "yearly": next.setFullYear(next.getFullYear() + 1); break;
    }
    const diff = Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Atrasado!";
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    return `Em ${diff} dias`;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 flex items-center gap-3" style={{ borderLeft: `4px solid ${ritual.color}` }}>
        <div className="text-3xl">{ritual.icon || "🔄"}</div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{ritual.name}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{freq?.label}</span>
            {ritual.dayOfWeek !== undefined && <span>• {DAYS[ritual.dayOfWeek]}</span>}
            {ritual.duration && <span>• {ritual.duration}min</span>}
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xs font-bold ${getNextDue() === "Atrasado!" ? "text-red-400" : getNextDue() === "Hoje" ? "text-yellow-400" : "text-zinc-400"}`}>
            {getNextDue()}
          </p>
          {lastCompleted && (
            <p className="text-[10px] text-zinc-600">
              Último: {lastCompleted.toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onStart}
          className="flex-1 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20"
        >
          Iniciar Ritual
        </button>
      </div>
    </div>
  );
}

export default function RitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRitual, setNewRitual] = useState({
    name: "",
    description: "",
    icon: "🔄",
    color: "#8b5cf6",
    frequency: "weekly",
    dayOfWeek: 0,
    duration: 30,
  });

  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const res = await fetch("/api/rituals");
        if (res.ok) setRituals(await res.json() as any);
      } catch (error) {
        console.error("Failed to fetch rituals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRituals();
  }, []);

  const handleCreate = async () => {
    if (!newRitual.name.trim()) return;
    try {
      const res = await fetch("/api/rituals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRitual),
      });
      if (res.ok) {
        const ritual = await res.json() as any;
        setRituals(prev => [...prev, ritual]);
        setShowCreate(false);
      }
    } catch (error) {
      console.error("Failed to create ritual:", error);
    }
  };

  const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
    setNewRitual({
      name: template.name,
      description: template.description || "",
      icon: template.icon,
      color: "#8b5cf6",
      frequency: template.frequency,
      dayOfWeek: template.dayOfWeek || 0,
      duration: template.duration,
    });
    setShowCreate(true);
  };

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
              <span className="text-cyan-400">🔄</span> RITUAIS
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Reviews & Planejamentos
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">Novo Ritual</h3>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={newRitual.icon}
                onChange={(e) => setNewRitual(prev => ({ ...prev, icon: e.target.value }))}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-white text-2xl text-center"
                maxLength={2}
              />
              <input
                type="text"
                value={newRitual.name}
                onChange={(e) => setNewRitual(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do ritual"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <textarea
              value={newRitual.description}
              onChange={(e) => setNewRitual(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white resize-none"
              rows={2}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Frequência</label>
                <select
                  value={newRitual.frequency}
                  onChange={(e) => setNewRitual(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  {FREQUENCIES.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Duração (min)</label>
                <input
                  type="number"
                  value={newRitual.duration}
                  onChange={(e) => setNewRitual(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            {newRitual.frequency === "weekly" && (
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Dia da semana</label>
                <div className="flex gap-1">
                  {DAYS.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setNewRitual(prev => ({ ...prev, dayOfWeek: i }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        newRitual.dayOfWeek === i ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">
                Cancelar
              </button>
              <button onClick={handleCreate} className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-xl">
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Rituals List */}
        {rituals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Meus Rituais ({rituals.length})
            </h2>
            {rituals.map(ritual => (
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                onStart={() => alert("Iniciar ritual: " + ritual.name)}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}

        {/* Templates */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
            Templates Sugeridos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(template => (
              <button
                key={template.name}
                onClick={() => handleUseTemplate(template)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-zinc-700 transition-all"
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <h3 className="font-bold text-white text-sm">{template.name}</h3>
                <p className="text-[10px] text-zinc-500">{FREQUENCIES.find(f => f.id === template.frequency)?.label} • {template.duration}min</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
