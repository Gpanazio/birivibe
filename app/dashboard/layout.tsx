import { getCurrentUser } from "@/lib/session"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black bg-grid">
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/50 backdrop-blur">
        <div className="container flex h-14 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="terminal-font text-xs font-bold text-purple-500 italic tracking-tighter">BIRIVIBE.OS</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest hidden md:block">{"// LIFE_ENGINE_V1"}</span>
          </div>
          <nav className="flex items-center gap-4">
             <a href="/biri" className="text-[10px] text-zinc-400 hover:text-purple-500 uppercase font-bold transition-colors">Neural_Input</a>
             <a href="/dashboard" className="text-[10px] text-white underline underline-offset-4 uppercase font-bold">Dashboard</a>
          </nav>
        </div>
      </header>
      <main className="container flex-1 py-6">{children}</main>
      <footer className="border-t border-zinc-900 py-4 text-center">
        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Maicon Douglas Systems © 2026</p>
      </footer>
    </div>
  )
}
