"use client";

import { useState, useEffect } from "react";
import { Settings, Tag, Zap, Plus, Trash2, ChevronRight, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface Context {
  id: string;
  name: string;
  icon?: string;
  color: string;
  type: string;
}

interface Automation {
  id: string;
  name: string;
  description?: string;
  triggerType: string;
  actionType: string;
  active: boolean;
}

const CONTEXT_TYPES = [
  { id: "location", label: "Local", examples: ["@casa", "@trabalho", "@rua"] },
  { id: "energy", label: "Energia", examples: ["@alta-energia", "@baixa-energia"] },
  { id: "time", label: "Tempo", examples: ["@5min", "@30min", "@1h"] },
  { id: "device", label: "Dispositivo", examples: ["@computador", "@celular"] },
];

const TRIGGER_TYPES = [
  { id: "habit_completed", label: "Hábito completado" },
  { id: "time", label: "Horário específico" },
  { id: "streak_reached", label: "Streak atingido" },
  { id: "routine_completed", label: "Rotina completada" },
];

const ACTION_TYPES = [
  { id: "show_habit", label: "Mostrar hábito" },
  { id: "start_routine", label: "Iniciar rotina" },
  { id: "send_notification", label: "Enviar notificação" },
  { id: "add_xp", label: "Adicionar XP" },
];

export default function SettingsPage() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"contexts" | "automations">("contexts");

  const [showAddContext, setShowAddContext] = useState(false);
  const [newContext, setNewContext] = useState({ name: "", icon: "📍", color: "#6b7280", type: "location" });

  const [showAddAutomation, setShowAddAutomation] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    triggerType: "habit_completed",
    actionType: "send_notification",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ctxRes, autoRes] = await Promise.all([
          fetch("/api/contexts"),
          fetch("/api/automations"),
        ]);
        if (ctxRes.ok) setContexts(await ctxRes.json() as any);
        if (autoRes.ok) setAutomations(await autoRes.json() as any);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddContext = async () => {
    if (!newContext.name.trim()) return;
    try {
      const res = await fetch("/api/contexts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContext),
      });
      if (res.ok) {
        const ctx = await res.json() as any;
        setContexts(prev => [...prev, ctx]);
        setNewContext({ name: "", icon: "📍", color: "#6b7280", type: "location" });
        setShowAddContext(false);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  const handleAddAutomation = async () => {
    if (!newAutomation.name.trim()) return;
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAutomation),
      });
      if (res.ok) {
        const auto = await res.json() as any;
        setAutomations(prev => [...prev, auto]);
        setShowAddAutomation(false);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
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
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>

          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-400" />
              CONFIGURAÇÕES
            </h1>
          </div>

          <Link href="/" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <Home className="w-5 h-5 text-zinc-400" />
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("contexts")}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${activeTab === "contexts" ? "bg-purple-500 text-white" : "bg-zinc-900 text-zinc-400"
              }`}
          >
            <Tag className="w-4 h-4" />
            Contextos
          </button>
          <button
            onClick={() => setActiveTab("automations")}
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${activeTab === "automations" ? "bg-purple-500 text-white" : "bg-zinc-900 text-zinc-400"
              }`}
          >
            <Zap className="w-4 h-4" />
            Automações
          </button>
        </div>

        {/* Contexts Tab */}
        {activeTab === "contexts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Tags para filtrar hábitos e tarefas por contexto</p>
              <button
                onClick={() => setShowAddContext(true)}
                className="p-2 bg-purple-500 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {contexts.length === 0 ? (
              <div className="text-center py-8 text-zinc-600">
                <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum contexto criado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {contexts.map(ctx => (
                  <div key={ctx.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <span className="text-xl">{ctx.icon || "📍"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-white">{ctx.name}</p>
                      <p className="text-xs text-zinc-500">{CONTEXT_TYPES.find(t => t.id === ctx.type)?.label}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ctx.color }} />
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Sugestões</p>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_TYPES.flatMap(type =>
                  type.examples.map(ex => (
                    <button
                      key={ex}
                      onClick={() => {
                        setNewContext({ name: ex, icon: "📍", color: "#6b7280", type: type.id });
                        setShowAddContext(true);
                      }}
                      className="px-3 py-1.5 bg-zinc-900 text-zinc-400 text-sm rounded-lg hover:bg-zinc-800"
                    >
                      {ex}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Automations Tab */}
        {activeTab === "automations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Regras automáticas: SE X ENTÃO Y</p>
              <button
                onClick={() => setShowAddAutomation(true)}
                className="p-2 bg-purple-500 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {automations.length === 0 ? (
              <div className="text-center py-8 text-zinc-600">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma automação criada</p>
              </div>
            ) : (
              <div className="space-y-2">
                {automations.map(auto => (
                  <div key={auto.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white">{auto.name}</p>
                      <div className={`w-2 h-2 rounded-full ${auto.active ? "bg-green-400" : "bg-zinc-600"}`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="px-2 py-1 bg-zinc-800 rounded">
                        SE {TRIGGER_TYPES.find(t => t.id === auto.triggerType)?.label}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                      <span className="px-2 py-1 bg-zinc-800 rounded">
                        {ACTION_TYPES.find(a => a.id === auto.actionType)?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Examples */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Exemplos de Automações</p>
              <div className="space-y-2">
                {[
                  { name: "Pós-Treino", trigger: "habit_completed", action: "show_habit", desc: "Completou Treino → Mostrar 'Tomar Whey'" },
                  { name: "Streak 7 dias", trigger: "streak_reached", action: "send_notification", desc: "Streak 7 → Notificação de parabéns" },
                  { name: "Rotina Noite", trigger: "time", action: "start_routine", desc: "22:00 → Iniciar 'Rotina Noite'" },
                ].map(ex => (
                  <button
                    key={ex.name}
                    onClick={() => {
                      setNewAutomation({ name: ex.name, description: ex.desc, triggerType: ex.trigger, actionType: ex.action });
                      setShowAddAutomation(true);
                    }}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-700"
                  >
                    <p className="font-medium text-white text-sm">{ex.name}</p>
                    <p className="text-xs text-zinc-500">{ex.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="pt-6 space-y-2">
          <Link href="/dashboard" className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700">
            <span className="text-white">Dashboard</span>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </Link>
          <Link href="/habits" className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700">
            <span className="text-white">Hábitos</span>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </Link>
          <Link href="/routines" className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700">
            <span className="text-white">Rotinas</span>
            <ChevronRight className="w-5 h-5 text-zinc-500" />
          </Link>
        </div>
      </main>

      {/* Add Context Modal */}
      {showAddContext && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold">Novo Contexto</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newContext.icon}
                onChange={(e) => setNewContext(prev => ({ ...prev, icon: e.target.value }))}
                className="w-14 bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-white text-xl text-center"
                maxLength={2}
              />
              <input
                type="text"
                value={newContext.name}
                onChange={(e) => setNewContext(prev => ({ ...prev, name: e.target.value }))}
                placeholder="@nome"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <select
              value={newContext.type}
              onChange={(e) => setNewContext(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            >
              {CONTEXT_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowAddContext(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">Cancelar</button>
              <button onClick={handleAddContext} className="flex-1 py-3 bg-purple-500 text-white font-bold rounded-xl">Criar</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Automation Modal */}
      {showAddAutomation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold">Nova Automação</h3>
            <input
              type="text"
              value={newAutomation.name}
              onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            />
            <div>
              <label className="text-xs text-zinc-500 block mb-1">SE (Trigger)</label>
              <select
                value={newAutomation.triggerType}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, triggerType: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">ENTÃO (Ação)</label>
              <select
                value={newAutomation.actionType}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, actionType: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              >
                {ACTION_TYPES.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddAutomation(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">Cancelar</button>
              <button onClick={handleAddAutomation} className="flex-1 py-3 bg-purple-500 text-white font-bold rounded-xl">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
