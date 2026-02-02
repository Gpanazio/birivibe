import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db as prisma } from "@/lib/db"
import { getDashboardData } from "@/lib/api/dashboard"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { dateRangeParams } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ActivityList } from "@/components/activity/activity-list"

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: "BiriSims Cockpit",
  description: "Your life simulator.",
}

function NeedsBar({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <span className="terminal-font text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{label}</span>
        <span className="terminal-font text-[10px] text-zinc-600">{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div
          className={`h-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}

export default async function Dashboard({ searchParams }: { searchParams: { from: string; to: string } }) {
  // Busca ou cria usuário padrão
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Gabriel",
        email: "gabriel@birivibe.com",
        timezone: "America/Sao_Paulo",
      }
    });
    console.log("✅ Usuário Gabriel criado automaticamente no dashboard");
  }

  const dateRange = dateRangeParams(searchParams)
  const data = await getDashboardData(user.id, dateRange)

  const safeActivities = data.userActivities.map((a: any) => ({
    ...a,
    colorCode: a.color || "#8b5cf6",
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* HEADER SIMS STYLE */}
      <div className="flex justify-between items-start border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white italic">BIRI_SIMS<span className="text-purple-500">.V1</span></h1>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 bg-green-900/30 text-green-500 text-[9px] font-bold rounded border border-green-800/50 uppercase">● Sistema_Estável</span>
            <span className="px-2 py-0.5 bg-purple-900/30 text-purple-500 text-[9px] font-bold rounded border border-purple-800/50 uppercase">● Douglas_Online</span>
          </div>
        </div>
        <div className="text-right">
          <p className="terminal-font text-xs text-zinc-500 uppercase">Status do Jogador</p>
          <p className="text-xl font-black text-white uppercase">{user.name.split(' ')[0]}</p>
        </div>
      </div>

      {/* AS BARRAS DE NECESSIDADE (NEEDS) */}
      <div className="grid gap-6 md:grid-cols-2 bg-zinc-950/50 border border-zinc-900 p-6 rounded-xl shadow-2xl">
        <div className="space-y-4">
          <NeedsBar label="Energia (Sono)" value={data.needs.energy} colorClass="bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          <NeedsBar label="Físico (Treino)" value={data.needs.fitness} colorClass="bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <NeedsBar label="Mente (Humor)" value={data.needs.mind} colorClass="bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
        <div className="space-y-4">
          <NeedsBar label="Capital (Grana)" value={data.needs.capital} colorClass="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <NeedsBar label="Social (Consistência)" value={data.needs.overall} colorClass="bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <div className="pt-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded border border-zinc-800">
              <span className="animate-pulse text-purple-500">✦</span>
              <p className="text-[10px] text-zinc-400 font-medium italic truncate">
                {`"O jogador parece focado, mas a barra de capital está sofrendo."`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE ATIVIDADES & LOGS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 border border-zinc-900 bg-zinc-950/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-900 bg-zinc-900/30">
            <h3 className="terminal-font text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Rotina Diária</h3>
          </div>
          <ScrollArea className="h-[350px]">
            <ActivityList activities={safeActivities} />
          </ScrollArea>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="border border-zinc-900 bg-zinc-950/50 rounded-xl p-6">
            <h3 className="terminal-font text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4">Buffs Ativos (Logs de Hoje)</h3>
            <div className="flex flex-wrap gap-2">
              {data.logs.slice(0, 8).map((log: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-zinc-900 text-zinc-300 text-[10px] font-bold rounded-full border border-zinc-800">
                  +{log.habit?.name || "Registro"}
                </span>
              ))}
              {data.logs.length === 0 && <span className="text-zinc-700 text-[10px] italic underline">Nenhum buff ativo. Vá trabalhar.</span>}
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950/50 rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:border-purple-500 transition-colors">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="text-[40px]">⌨️</span>
            </div>
            <h3 className="terminal-font text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Console de Comando</h3>
            <p className="text-lg font-bold text-white mb-4">Daily Dump</p>
            <a href="/biri" className="inline-block px-4 py-2 bg-purple-600 text-white text-[10px] font-black rounded uppercase hover:bg-purple-500">Abrir_Terminal</a>
          </div>
        </div>
      </div>
    </div>
  )
}
