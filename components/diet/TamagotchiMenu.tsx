import React, { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

import { FoodItem } from "@/lib/diet-types"
import { getEffectiveDateString, getLocalDateString } from "@/lib/utils/date"

interface TamagotchiMenuProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  allLogs: { [date: string]: FoodItem[] }
  goals?: { calories?: number; protein?: number }
}

// Estados do Tamagotchi baseados na performance do usuário
type TamagotchiMood = "thriving" | "happy" | "hungry" | "starving" | "sleeping"

// Sprite sheet configuration
// Row 0: Idle/Happy (happy)
// Row 1: Eating (unused state for now)
// Row 2: Exercising (thriving - monstro!)
// Row 3: Sleeping/Weak (starving/sleeping/hungry)
const MOOD_TO_ROW: Record<TamagotchiMood, number> = {
  thriving: 2, // Row 2: Exercising/Flexing - MONSTRO!
  happy: 0, // Row 0: Content/Idle
  hungry: 3, // Row 3: Weak/Sad - Needs food (Changed from 1 which was Eating)
  starving: 3, // Row 3: Weak/Sad - Dying
  sleeping: 3, // Row 3: Sleeping at night
}

const MAX_FRAMES = 4 // 4 columns in the sprite sheet

// Thresholds for hunger states (in hours since last meal)
const HUNGER_LEVELS = {
  THRIVING: 3, // Fed within 3 hours = thriving
  HAPPY: 6, // Fed within 6 hours = happy
  HUNGRY: 12, // Fed within 12 hours = hungry
  // Beyond 12 hours = starving
}

export const TamagotchiMenu: React.FC<TamagotchiMenuProps> = ({
  isOpen,
  onClose,
  userName = "Você",
  allLogs = {},
  goals,
}) => {
  const [animFrame, setAnimFrame] = useState(0)

  // Determine mood based on logs and performance
  const { mood, lastMealDateStr, todayStats, statusLabel } = useMemo(() => {
    const today = getEffectiveDateString()
    const todayItems = allLogs[today] || []
    const hour = new Date().getHours()

    // Calculate today's totals
    const todayTotals = todayItems.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
      }),
      { calories: 0, protein: 0 }
    )

    // Get all dates with logs
    const logDates = Object.keys(allLogs).filter(
      (date) => allLogs[date]?.length > 0
    )
    const sortedDates = logDates.sort((a, b) => b.localeCompare(a))
    const lastLogDate = sortedDates[0] || null

    // Calculate hours since last meal
    let hoursSinceLastMeal = Infinity
    if (todayItems.length > 0) {
      // If we have items today, consider the most recent based on meal category order
      // For simplicity, assume the last item added is recent
      hoursSinceLastMeal = 0 // They logged something today
    } else if (lastLogDate) {
      // Calculate time since last log date (consider end of that day)
      const lastDate = new Date(lastLogDate + "T20:00:00") // Assume dinner time
      const now = new Date()
      hoursSinceLastMeal =
        (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60)
    }

    // Override for sleeping time (23h - 6h)
    if (hour >= 23 || hour < 6) {
      return {
        mood: "sleeping" as TamagotchiMood,
        lastMealDateStr: lastLogDate,
        todayStats: todayTotals,
        statusLabel: "ZZZ...",
      }
    }

    // Determine mood based on hours and performance
    let computedMood: TamagotchiMood = "starving"
    let statusLabel = "CATABOLIC"

    // Check if user hit their goals today
    const calorieGoalMet =
      goals?.calories && todayTotals.calories >= goals.calories * 0.8
    const proteinGoalMet =
      goals?.protein && todayTotals.protein >= goals.protein * 0.8

    if (todayItems.length > 0) {
      // Fed today
      if (calorieGoalMet && proteinGoalMet) {
        computedMood = "thriving"
        statusLabel = "MONSTRO!"
      } else if (todayTotals.calories > 500 || todayTotals.protein > 30) {
        computedMood = "happy"
        statusLabel = "ANABOLIC"
      } else {
        // Ate something but not much
        computedMood = "hungry"
        statusLabel = "COM FOME"
      }
    } else if (hoursSinceLastMeal <= HUNGER_LEVELS.HUNGRY) {
      computedMood = "hungry"
      statusLabel = "COM FOME"
    } else {
      computedMood = "starving"
      statusLabel = "FAMINTO!"
    }

    return {
      mood: computedMood,
      lastMealDateStr: lastLogDate,
      todayStats: todayTotals,
      statusLabel,
    }
  }, [allLogs, goals]) // Recalc when logs or goals change

  // Animation loop
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setAnimFrame((prev) => (prev + 1) % MAX_FRAMES)
    }, 500)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const row = MOOD_TO_ROW[mood]
  const bgX = (animFrame / (MAX_FRAMES - 1)) * 100
  const bgY = (row / 3) * 100

  // Formatting "Last meal" text
  const getLastMealText = () => {
    if (!lastMealDateStr) return "Faminto (Sem registros)"

    const today = getEffectiveDateString()

    if (lastMealDateStr === today) {
      const itemsToday = allLogs[today] || []
      // Count unique meal categories to distinguish "meals" from "items"
      const uniqueMeals = new Set(
        itemsToday.map((item) => item.mealCategory || "Snack")
      ).size
      return `Hoje: ${uniqueMeals} ${uniqueMeals === 1 ? "refeição" : "refeições"}`
    }

    // Calculate days ago
    const lastDate = new Date(lastMealDateStr + "T12:00:00")
    const now = new Date()
    const diffTime = now.getTime() - lastDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Última refeição: ontem"
    return `Última refeição: há ${diffDays} dias`
  }

  // Determine mood message based on state and time
  const getMoodMessage = () => {
    const hour = new Date().getHours()

    switch (mood) {
      case "thriving":
        return "BRABÍSSIMO! Você tá comendo certinho e batendo as metas. O shape agradece!"

      case "happy":
        return "A fábrica de monstros tá a todo vapor! Continue assim que o shape vem!"

      case "hungry":
        if (hour >= 11 && hour < 14)
          return "Tá na hora do rango, bora! Esse músculo não cresce sozinho."
        if (hour >= 18 && hour < 21)
          return "Janta chamando! Manda aquela proteína pra dentro."
        return "Tô com fome aqui, hein! Registra alguma coisa aí pra eu ficar feliz."

      case "starving":
        if (!lastMealDateStr)
          return "SOCORRO! Você nunca me alimentou! Registra uma refeição urgente!"
        return "Tô definhando aqui! Faz quanto tempo que você não come? Vai virar caveira assim!"

      case "sleeping":
        return "Hora de descansar, monstro. O sono anabólico é sagrado. Zzz..."

      default:
        return "Tá de bobeira? Vai puxar ferro ou comer alguma coisa!"
    }
  }

  return createPortal(
    <div className="animate-fade-in font-display fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Unified Card Container - Liquid Glass */}
      <div className="glass animate-pop-in relative flex w-full max-w-sm flex-col items-center gap-8 overflow-hidden rounded-[3rem] border border-white/10 p-8 shadow-2xl">
        {/* Shine effect for liquid feel */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 rounded-full border border-white/5 bg-white/5 p-2 text-zinc-400 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        {/* THE EGG - NEON & GLOSS EDITION */}
        <div className="pointer-events-none relative isolate z-10 flex h-[380px] w-[300px] shrink-0 select-none flex-col items-center overflow-hidden rounded-[50%_50%_45%_45%] border border-white/5 bg-gradient-to-br from-[#18181b] via-[#09090b] to-[#000000] pb-12 pt-16 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8),inset_0_-10px_30px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(255,255,255,0.15),0_0_0_2px_#18181b,0_0_15px_rgba(168,85,247,0.3),0_0_40px_-10px_rgba(132,204,22,0.2)]">
          {/* Neon Rim Lights (Simulated via Gradients) */}
          <div className="pointer-events-none absolute inset-0 rounded-[50%_50%_45%_45%] bg-gradient-to-tl from-lime-500/20 via-transparent to-purple-500/20 opacity-50 mix-blend-screen"></div>

          {/* High Gloss "Clear Coat" */}
          <div className="pointer-events-none absolute inset-0 rounded-[50%_50%_45%_45%] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40"></div>

          {/* Texture Overlay (Noise) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Specular Highlights - Enhanced for Wet Look */}
          <div className="pointer-events-none absolute left-[15%] top-[8%] h-[18%] w-[35%] -rotate-12 transform rounded-full bg-gradient-to-br from-white to-transparent opacity-70 mix-blend-overlay blur-md"></div>
          <div className="pointer-events-none absolute left-[15%] top-[8%] h-[10%] w-[20%] -rotate-12 transform rounded-full bg-white opacity-20 blur-xl"></div>

          <div className="pointer-events-none absolute right-[20%] top-[5%] h-[6%] w-[12%] rounded-full bg-white/10 mix-blend-screen blur-md"></div>

          {/* Seam Line (The Parting Line) */}
          <div className="pointer-events-none absolute inset-[2px] rounded-[50%_50%_45%_45%] border border-white/5"></div>

          {/* Keychain Hole & Chain */}
          <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center">
            {/* The Loop on the device */}
            <div className="relative top-2 z-0 h-6 w-10 rounded-t-full border-[5px] border-[#3f3f46] shadow-md"></div>
            {/* The Chain Links (Simulated) */}
            <div className="-mt-1 h-8 w-1 origin-top animate-[swing_3s_ease-in-out_infinite] bg-gradient-to-b from-[#52525b] to-[#27272a] shadow-sm"></div>
          </div>

          {/* Brand Text */}
          <div className="z-20 mb-5 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/20 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            BiriDiet 2000
          </div>

          {/* The Screen Area */}
          <div className="mask-scanlines relative z-20 flex h-[200px] w-[200px] flex-col items-center justify-between overflow-hidden rounded-[30px] border-8 border-black/30 bg-[#9ea792] p-5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.05)]">
            {/* Holographic/Glass reflection on screen */}
            <div className="pointer-events-none absolute -inset-full rotate-45 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
            <div className="pointer-events-none absolute right-2 top-2 h-full w-full bg-gradient-to-bl from-purple-500/10 to-transparent mix-blend-overlay"></div>

            {/* LCD Grid/Pixel Effect Overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(25,10,0,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:4px_4px] opacity-30"></div>

            {/* Top Bar (Stats) */}
            <div className="z-20 flex w-full items-center justify-between font-mono text-[9px] font-bold uppercase leading-none tracking-wider text-[#2d302a] opacity-80 mix-blend-multiply">
              <span>{userName}</span>
              <span>{statusLabel}</span>
            </div>

            {/* Character Container */}
            <div className="image-pixelated relative z-20 h-28 w-28 opacity-90 mix-blend-multiply">
              <div
                className="h-full w-full bg-no-repeat"
                style={{
                  backgroundImage: "url('/tamagotchi-sprites.png')",
                  backgroundSize: "400% 400%",
                  backgroundPosition: `${bgX}% ${bgY}%`,
                }}
              />
            </div>

            {/* Action Icons (Bottom of screen) */}
            <div className="z-20 flex w-full justify-center px-2 opacity-70">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-tight text-[#2d302a] mix-blend-multiply">
                {getLastMealText()}
              </span>
            </div>
          </div>

          {/* Physical Buttons */}
          <div className="z-20 mb-2 mt-auto flex w-full justify-center gap-6">
            {/* Button A (Select) */}
            <div className="flex h-10 w-10 translate-y-2 transform items-center justify-center rounded-full border-b-[3px] border-zinc-950 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
              <div className="h-8 w-8 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>

            {/* Button B (Confirm) - Slightly Lower/Larger */}
            <div className="flex h-11 w-11 translate-y-4 items-center justify-center rounded-full border-b-[3px] border-zinc-950 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_3px_5px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
              <div className="h-9 w-9 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>

            {/* Button C (Cancel) */}
            <div className="flex h-10 w-10 translate-y-2 transform items-center justify-center rounded-full border-b-[3px] border-zinc-950 bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
              <div className="h-8 w-8 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>
          </div>

          {/* Speaker Holes (Decorative) */}
          <div className="absolute right-4 top-[50%] flex flex-col gap-1 opacity-40 mix-blend-overlay">
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
          </div>
          <div className="absolute left-4 top-[50%] flex flex-col gap-1 opacity-40 mix-blend-overlay">
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="h-1 w-1 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
          </div>
        </div>

        {/* "Gym Bro" Speech Bubble - Liquid Glass Variant */}
        <div className="relative z-10 w-full">
          <div className="group relative w-full">
            {/* Bubble Content */}
            <div className="relative rounded-2xl border border-white/5 bg-zinc-900/60 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_-5px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded border border-lime-500/20 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-lime-400 shadow-lg backdrop-blur">
                Insight do Coach
              </div>
              <p className="text-center text-sm font-medium leading-relaxed text-zinc-200 drop-shadow-sm">
                {getMoodMessage()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
