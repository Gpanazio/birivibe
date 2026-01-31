"use client";

import Link from "next/link";
import { 
  Utensils, CheckSquare, Calendar, Target, 
  RefreshCw, Settings, LayoutDashboard, Dumbbell,
  Moon, Brain
} from "lucide-react";

const MODULES = [
  { 
    href: "/dashboard", 
    name: "Dashboard", 
    desc: "Visão geral estilo Sims",
    icon: LayoutDashboard,
    color: "#8b5cf6",
    emoji: "🎮"
  },
  { 
    href: "/diet", 
    name: "Dieta", 
    desc: "Nutrição e macros",
    icon: Utensils,
    color: "#84cc16",
    emoji: "🥗"
  },
  { 
    href: "/habits", 
    name: "Hábitos", 
    desc: "Tracking diário",
    icon: CheckSquare,
    color: "#8b5cf6",
    emoji: "✓"
  },
  { 
    href: "/routines", 
    name: "Rotinas", 
    desc: "Sequências de passos",
    icon: Calendar,
    color: "#8b5cf6",
    emoji: "🌅"
  },
  { 
    href: "/goals", 
    name: "Objetivos", 
    desc: "Metas e progresso",
    icon: Target,
    color: "#eab308",
    emoji: "🎯"
  },
  { 
    href: "/rituals", 
    name: "Rituais", 
    desc: "Reviews periódicos",
    icon: RefreshCw,
    color: "#06b6d4",
    emoji: "🔄"
  },
  { 
    href: "/biri", 
    name: "Daily Dump", 
    desc: "Input via Douglas",
    icon: Brain,
    color: "#8b5cf6",
    emoji: "🧠"
  },
  { 
    href: "/settings", 
    name: "Configurações", 
    desc: "Contextos e automações",
    icon: Settings,
    color: "#6b7280",
    emoji: "⚙️"
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-2">
          BIRI<span className="text-purple-400">VIBE</span>
        </h1>
        <p className="text-zinc-500 text-sm uppercase tracking-widest">
          Life Operating System
        </p>
        
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">Douglas Online</span>
        </div>
      </div>

      {/* Modules Grid */}
      <main className="max-w-2xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderLeftColor: module.color, borderLeftWidth: 3 }}
            >
              <div className="text-3xl mb-3">{module.emoji}</div>
              <h3 className="font-bold text-white mb-1">{module.name}</h3>
              <p className="text-xs text-zinc-500">{module.desc}</p>
              
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ 
                  background: `linear-gradient(135deg, ${module.color}10 0%, transparent 50%)`
                }}
              />
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] text-zinc-500 uppercase">Streak</p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] text-zinc-500 uppercase">Hoje</p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] text-zinc-500 uppercase">XP</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-700">
            BiriVibe OS v0.1.0 • Brick × Douglas
          </p>
        </div>
      </main>
    </div>
  );
}
