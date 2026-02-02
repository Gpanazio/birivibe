"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Calendar,
  LayoutDashboard,
  PieChart,
  Scale,
  User,
} from "lucide-react"

import {
  AppView,
  FoodItem,
  GeminiParsedFood,
  UserGoals,
} from "@/lib/diet-types"
import { getEffectiveDateString } from "@/lib/utils/date"
import { AmbientBackground } from "@/components/diet/AmbientBackground"
import { Dashboard } from "@/components/diet/Dashboard"
import { FoodLogger } from "@/components/diet/FoodLogger"
import { HeaderMenu } from "@/components/diet/HeaderMenu"
import { History } from "@/components/diet/History"
import { Reports } from "@/components/diet/Reports"
import { Settings } from "@/components/diet/Settings"
import { WeightTracker } from "@/components/diet/WeightTracker"

const API_BASE_URL = ""

function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD)
  const [goals, setGoals] = useState<UserGoals>({
    calories: 2000,
    protein: 150,
  })
  const [logs, setLogs] = useState<{ [date: string]: FoodItem[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  const today = getEffectiveDateString()
  const todayItems = useMemo(() => logs[today] || [], [logs, today])

  const recentLogs = useMemo(() => {
    if (!logs) return []
    const sortedDates = Object.keys(logs).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
    const recentDates = sortedDates.slice(0, 3)
    return recentDates.flatMap((d) => logs[d])
  }, [logs])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const goalsRes = await fetch(`${API_BASE_URL}/api/diet/goals`)
        if (goalsRes.ok) {
          const goalsData = (await goalsRes.json()) as any
          setGoals(goalsData)
        }

        const logsRes = await fetch(`${API_BASE_URL}/api/diet/food-logs`)
        if (logsRes.ok) {
          const logsData = (await logsRes.json()) as any
          const groupedLogs: { [date: string]: FoodItem[] } = {}
          ;(logsData as FoodItem[]).forEach((item) => {
            if (item.date) {
              const dateKey = item.date
              if (!groupedLogs[dateKey]) groupedLogs[dateKey] = []
              groupedLogs[dateKey].push(item)
            }
          })
          setLogs(groupedLogs)
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleUpdateGoals = async (newGoals: UserGoals) => {
    setGoals(newGoals)
    try {
      await fetch(`${API_BASE_URL}/api/diet/goals`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoals),
      })
    } catch (e) {
      console.error("Failed to save goals", e)
    }
  }

  const handleAddItems = async (items: GeminiParsedFood[]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/diet/food-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })

      if (res.ok) {
        const newItems = (await res.json()) as any
        if (newItems && newItems.length > 0) {
          setLogs((prev) => {
            const dateKey = newItems[0].date
            if (!dateKey) return prev
            return {
              ...prev,
              [dateKey]: [...(prev[dateKey] || []), ...newItems],
            }
          })
        }
      }
    } catch (e) {
      console.error("Failed to add items", e)
    }
  }

  const handleUpdateItem = async (updatedItem: FoodItem) => {
    try {
      await fetch(`${API_BASE_URL}/api/diet/food-logs/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })

      setLogs((prev) => {
        const newLogs = { ...prev }
        for (const date in newLogs) {
          const itemIndex = newLogs[date].findIndex(
            (item) => item.id === updatedItem.id
          )
          if (itemIndex !== -1) {
            newLogs[date] = newLogs[date].map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
            break
          }
        }
        return newLogs
      })
    } catch (e) {
      console.error("Failed to update item", e)
    }
  }

  const handleDeleteItem = async (itemId: string, date?: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/diet/food-logs/${itemId}`, {
        method: "DELETE",
      })

      setLogs((prev) => {
        if (date && prev[date]) {
          const newDayLogs = prev[date].filter((item) => item.id !== itemId)
          return { ...prev, [date]: newDayLogs }
        }

        const newLogs = { ...prev }
        for (const d in newLogs) {
          const itemIndex = newLogs[d].findIndex((item) => item.id === itemId)
          if (itemIndex !== -1) {
            newLogs[d] = newLogs[d].filter((item) => item.id !== itemId)
            break
          }
        }
        return newLogs
      })
    } catch (e) {
      console.error("Failed to delete item", e)
    }
  }

  const MobileNav = ({
    v,
    icon: Icon,
    label,
  }: {
    v: AppView
    icon: any
    label: string
  }) => (
    <button
      onClick={() => setView(v)}
      className={`relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl transition-all duration-500 ${
        view === v
          ? "scale-110 bg-lime-400 text-zinc-950 shadow-[0_0_20px_-5px_rgba(163,230,53,0.5)]"
          : "text-zinc-500 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon
        className={`h-6 w-6 transition-transform duration-300 ${view === v ? "scale-110 fill-current" : ""}`}
      />
    </button>
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-lg text-lime-400">
          Carregando BiriDiet...
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden overscroll-none bg-black font-sans text-zinc-100 selection:bg-lime-500/30">
      <AmbientBackground />

      {/* Header */}
      <div className="pointer-events-none fixed top-0 z-40 h-[calc(4rem+env(safe-area-inset-top))] w-full border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl" />

      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 rotate-3 items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none tracking-tight text-white">
              BiriDiet 2000
            </h1>
            <span className="rounded bg-lime-500/10 px-1.5 text-[10px] font-bold uppercase tracking-widest text-lime-500">
              BETA
            </span>
          </div>
        </div>
        <HeaderMenu
          onNavigateToWeight={() => setView(AppView.WEIGHT)}
          allLogs={logs}
          goals={goals}
        />
      </header>

      {/* Floating Dock Navigation */}
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center rounded-[2.5rem] border border-white/10 bg-black/40 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/5 backdrop-blur-2xl">
          <div className="flex items-center gap-1 px-2">
            <MobileNav
              v={AppView.DASHBOARD}
              icon={LayoutDashboard}
              label="Hoje"
            />
            <MobileNav v={AppView.HISTORY} icon={Calendar} label="Diário" />
            <MobileNav v={AppView.REPORTS} icon={PieChart} label="Stats" />
            <MobileNav v={AppView.SETTINGS} icon={User} label="Perfil" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto min-h-screen max-w-2xl px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] md:px-0">
        <div className="animate-fade-in">
          {view === AppView.DASHBOARD && (
            <>
              <FoodLogger onAddItems={handleAddItems} />
              <Dashboard
                todayItems={todayItems}
                recentLogs={recentLogs}
                goals={goals}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            </>
          )}

          {view === AppView.REPORTS && <Reports allLogs={logs} />}

          {view === AppView.HISTORY && (
            <History
              allLogs={logs}
              onAddItems={handleAddItems}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              goals={goals}
            />
          )}

          {view === AppView.SETTINGS && (
            <Settings currentGoals={goals} onSave={handleUpdateGoals} />
          )}

          {view === AppView.WEIGHT && <WeightTracker />}

          {/* Footer */}
          <div className="mt-20 flex flex-col items-center justify-center pb-10">
            <img
              src="/logo.png"
              alt="BiriDiet 2000 Logo"
              className="mb-4 h-32 w-32 object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            />
            <p className="text-xs font-medium text-zinc-500">
              BiriDiet 2000 © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
