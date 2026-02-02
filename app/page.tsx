import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Brain,
  Calendar,
  CheckSquare,
  Dumbbell,
  LayoutDashboard,
  Moon,
  RefreshCw,
  Settings,
  Target,
  Utensils,
} from "lucide-react"

const MODULES = [
  {
    href: "/dashboard",
    name: "Dashboard",
    desc: "Visão geral estilo Sims",
    icon: LayoutDashboard,
    color: "#8b5cf6",
    emoji: "🎮",
  },
  {
    href: "/diet",
    name: "Dieta",
    desc: "Nutrição e macros",
    icon: Utensils,
    color: "#84cc16",
    emoji: "🥗",
  },
  {
    href: "/habits",
    name: "Hábitos",
    desc: "Tracking diário",
    icon: CheckSquare,
    color: "#8b5cf6",
    emoji: "✓",
  },
  {
    href: "/routines",
    name: "Rotinas",
    desc: "Sequências de passos",
    icon: Calendar,
    color: "#8b5cf6",
    emoji: "🌅",
  },
  {
    href: "/goals",
    name: "Objetivos",
    desc: "Metas e progresso",
    icon: Target,
    color: "#eab308",
    emoji: "🎯",
  },
  {
    href: "/rituals",
    name: "Rituais",
    desc: "Reviews periódicos",
    icon: RefreshCw,
    color: "#06b6d4",
    emoji: "🔄",
  },
  {
    href: "/biri",
    name: "Daily Dump",
    desc: "Input via Douglas",
    icon: Brain,
    color: "#8b5cf6",
    emoji: "🧠",
  },
  {
    href: "/settings",
    name: "Configurações",
    desc: "Contextos e automações",
    icon: Settings,
    color: "#6b7280",
    emoji: "⚙️",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute top-6 right-6 z-10">
        <Link
          href="/signin"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-zinc-500 hover:text-white transition-colors"
          )}
        >
          Entrar
        </Link>
      </div>
      {/* Hero */}
      <div className="px-6 pb-12 pt-16 text-center">
        <h1 className="mb-2 text-5xl font-black tracking-tighter">
          BIRI<span className="text-purple-400">VIBE</span>
        </h1>
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Life Operating System
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="text-xs text-zinc-400">Douglas Online</span>
        </div>
      </div>

      {/* Modules Grid */}
      <main className="mx-auto max-w-2xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:scale-[1.02] hover:border-zinc-700 active:scale-[0.98]"
              style={{ borderLeftColor: module.color, borderLeftWidth: 3 }}
            >
              <div className="mb-3 text-3xl">{module.emoji}</div>
              <h3 className="mb-1 font-bold text-white">{module.name}</h3>
              <p className="text-xs text-zinc-500">{module.desc}</p>

              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${module.color}10 0%, transparent 50%)`,
                }}
              />
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] uppercase text-zinc-500">Streak</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] uppercase text-zinc-500">Hoje</p>
          </div>
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
            <p className="text-2xl font-black text-white">—</p>
            <p className="text-[10px] uppercase text-zinc-500">XP</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center flex flex-col items-center gap-3">
          <p className="text-xs text-zinc-700">
            BiriVibe OS v0.1.0 • Brick × Douglas
          </p>
          <Link
            href="/api/init"
            className="text-[10px] text-zinc-900 hover:text-zinc-700 transition-colors uppercase tracking-widest"
          >
            System Check
          </Link>
        </div>
      </main>
    </div>
  )
}
