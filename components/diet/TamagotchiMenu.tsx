import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { FoodItem } from '@/lib/diet-types';
import { getLocalDateString, getEffectiveDateString } from '@/lib/utils/dateUtils';

interface TamagotchiMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  allLogs: { [date: string]: FoodItem[] };
  goals?: { calories?: number; protein?: number };
}

// Estados do Tamagotchi baseados na performance do usuário
type TamagotchiMood = 'thriving' | 'happy' | 'hungry' | 'starving' | 'sleeping';

// Sprite sheet configuration
// Row 0: Idle/Happy (happy)
// Row 1: Eating (unused state for now)
// Row 2: Exercising (thriving - monstro!)
// Row 3: Sleeping/Weak (starving/sleeping/hungry)
const MOOD_TO_ROW: Record<TamagotchiMood, number> = {
  thriving: 2,   // Row 2: Exercising/Flexing - MONSTRO!
  happy: 0,      // Row 0: Content/Idle
  hungry: 3,     // Row 3: Weak/Sad - Needs food (Changed from 1 which was Eating)
  starving: 3,   // Row 3: Weak/Sad - Dying
  sleeping: 3,   // Row 3: Sleeping at night
};

const MAX_FRAMES = 4; // 4 columns in the sprite sheet

// Thresholds for hunger states (in hours since last meal)
const HUNGER_LEVELS = {
  THRIVING: 3,    // Fed within 3 hours = thriving
  HAPPY: 6,       // Fed within 6 hours = happy
  HUNGRY: 12,     // Fed within 12 hours = hungry
  // Beyond 12 hours = starving
};

export const TamagotchiMenu: React.FC<TamagotchiMenuProps> = ({
  isOpen,
  onClose,
  userName = 'Você',
  allLogs = {},
  goals
}) => {
  const [animFrame, setAnimFrame] = useState(0);

  // Determine mood based on logs and performance
  const { mood, lastMealDateStr, todayStats, statusLabel } = useMemo(() => {
    const today = getEffectiveDateString();
    const todayItems = allLogs[today] || [];
    const hour = new Date().getHours();

    // Calculate today's totals
    const todayTotals = todayItems.reduce((acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
    }), { calories: 0, protein: 0 });

    // Get all dates with logs
    const logDates = Object.keys(allLogs).filter(date => allLogs[date]?.length > 0);
    const sortedDates = logDates.sort((a, b) => b.localeCompare(a));
    const lastLogDate = sortedDates[0] || null;

    // Calculate hours since last meal
    let hoursSinceLastMeal = Infinity;
    if (todayItems.length > 0) {
      // If we have items today, consider the most recent based on meal category order
      // For simplicity, assume the last item added is recent
      hoursSinceLastMeal = 0; // They logged something today
    } else if (lastLogDate) {
      // Calculate time since last log date (consider end of that day)
      const lastDate = new Date(lastLogDate + 'T20:00:00'); // Assume dinner time
      const now = new Date();
      hoursSinceLastMeal = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
    }

    // Override for sleeping time (23h - 6h)
    if (hour >= 23 || hour < 6) {
      return {
        mood: 'sleeping' as TamagotchiMood,
        lastMealDateStr: lastLogDate,
        todayStats: todayTotals,
        statusLabel: 'ZZZ...'
      };
    }

    // Determine mood based on hours and performance
    let computedMood: TamagotchiMood = 'starving';
    let statusLabel = 'CATABOLIC';

    // Check if user hit their goals today
    const calorieGoalMet = goals?.calories && todayTotals.calories >= goals.calories * 0.8;
    const proteinGoalMet = goals?.protein && todayTotals.protein >= goals.protein * 0.8;

    if (todayItems.length > 0) {
      // Fed today
      if (calorieGoalMet && proteinGoalMet) {
        computedMood = 'thriving';
        statusLabel = 'MONSTRO!';
      } else if (todayTotals.calories > 500 || todayTotals.protein > 30) {
        computedMood = 'happy';
        statusLabel = 'ANABOLIC';
      } else {
        // Ate something but not much
        computedMood = 'hungry';
        statusLabel = 'COM FOME';
      }
    } else if (hoursSinceLastMeal <= HUNGER_LEVELS.HUNGRY) {
      computedMood = 'hungry';
      statusLabel = 'COM FOME';
    } else {
      computedMood = 'starving';
      statusLabel = 'FAMINTO!';
    }

    return {
      mood: computedMood,
      lastMealDateStr: lastLogDate,
      todayStats: todayTotals,
      statusLabel
    };
  }, [allLogs, goals, isOpen]); // Recalc when opening or logs change

  // Animation loop
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setAnimFrame(prev => (prev + 1) % MAX_FRAMES);
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const row = MOOD_TO_ROW[mood];
  const bgX = (animFrame / (MAX_FRAMES - 1)) * 100;
  const bgY = (row / 3) * 100;

  // Formatting "Last meal" text
  const getLastMealText = () => {
    if (!lastMealDateStr) return "Faminto (Sem registros)";

    const today = getEffectiveDateString();

    if (lastMealDateStr === today) {
      const itemsToday = allLogs[today] || [];
      // Count unique meal categories to distinguish "meals" from "items"
      const uniqueMeals = new Set(itemsToday.map(item => item.mealCategory || 'Snack')).size;
      return `Hoje: ${uniqueMeals} ${uniqueMeals === 1 ? 'refeição' : 'refeições'}`;
    }

    // Calculate days ago
    const lastDate = new Date(lastMealDateStr + 'T12:00:00');
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Última refeição: ontem";
    return `Última refeição: há ${diffDays} dias`;
  };

  // Determine mood message based on state and time
  const getMoodMessage = () => {
    const hour = new Date().getHours();

    switch (mood) {
      case 'thriving':
        return "BRABÍSSIMO! Você tá comendo certinho e batendo as metas. O shape agradece!";

      case 'happy':
        return "A fábrica de monstros tá a todo vapor! Continue assim que o shape vem!";

      case 'hungry':
        if (hour >= 11 && hour < 14) return "Tá na hora do rango, bora! Esse músculo não cresce sozinho.";
        if (hour >= 18 && hour < 21) return "Janta chamando! Manda aquela proteína pra dentro.";
        return "Tô com fome aqui, hein! Registra alguma coisa aí pra eu ficar feliz.";

      case 'starving':
        if (!lastMealDateStr) return "SOCORRO! Você nunca me alimentou! Registra uma refeição urgente!";
        return "Tô definhando aqui! Faz quanto tempo que você não come? Vai virar caveira assim!";

      case 'sleeping':
        return "Hora de descansar, monstro. O sono anabólico é sagrado. Zzz...";

      default:
        return "Tá de bobeira? Vai puxar ferro ou comer alguma coisa!";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in font-display">
      {/* Backdrop */}
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      {/* Unified Card Container - Liquid Glass */}
      <div className="relative glass border border-white/10 p-8 rounded-[3rem] flex flex-col items-center gap-8 max-w-sm w-full animate-pop-in overflow-hidden shadow-2xl">

        {/* Shine effect for liquid feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full p-2 text-zinc-400 hover:text-white transition-all border border-white/5 z-50 hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* THE EGG - NEON & GLOSS EDITION */}
        <div className="relative w-[300px] h-[380px] bg-gradient-to-br from-[#18181b] via-[#09090b] to-[#000000] rounded-[50%_50%_45%_45%] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8),inset_0_-10px_30px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(255,255,255,0.15),0_0_0_2px_#18181b,0_0_15px_rgba(168,85,247,0.3),0_0_40px_-10px_rgba(132,204,22,0.2)] flex flex-col items-center pt-16 pb-12 select-none shrink-0 pointer-events-none z-10 overflow-hidden isolate border border-white/5">

          {/* Neon Rim Lights (Simulated via Gradients) */}
          <div className="absolute inset-0 rounded-[50%_50%_45%_45%] bg-gradient-to-tl from-lime-500/20 via-transparent to-purple-500/20 opacity-50 mix-blend-screen pointer-events-none"></div>

          {/* High Gloss "Clear Coat" */}
          <div className="absolute inset-0 rounded-[50%_50%_45%_45%] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>

          {/* Texture Overlay (Noise) */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Specular Highlights - Enhanced for Wet Look */}
          <div className="absolute top-[8%] left-[15%] w-[35%] h-[18%] bg-gradient-to-br from-white to-transparent rounded-full blur-md transform -rotate-12 pointer-events-none mix-blend-overlay opacity-70"></div>
          <div className="absolute top-[8%] left-[15%] w-[20%] h-[10%] bg-white rounded-full blur-xl transform -rotate-12 pointer-events-none opacity-20"></div>

          <div className="absolute top-[5%] right-[20%] w-[12%] h-[6%] bg-white/10 rounded-full blur-md pointer-events-none mix-blend-screen"></div>

          {/* Seam Line (The Parting Line) */}
          <div className="absolute inset-[2px] rounded-[50%_50%_45%_45%] border border-white/5 pointer-events-none"></div>

          {/* Keychain Hole & Chain */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* The Loop on the device */}
            <div className="w-10 h-6 border-[5px] border-[#3f3f46] rounded-t-full shadow-md z-0 relative top-2"></div>
            {/* The Chain Links (Simulated) */}
            <div className="w-1 h-8 bg-gradient-to-b from-[#52525b] to-[#27272a] -mt-1 shadow-sm origin-top animate-[swing_3s_ease-in-out_infinite]"></div>
          </div>

          {/* Brand Text */}
          <div className="text-white/20 font-black tracking-[0.2em] text-[10px] mb-5 uppercase font-mono drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] z-20">BiriDiet 2000</div>

          {/* The Screen Area */}
          <div className="relative w-[200px] h-[200px] bg-[#9ea792] border-8 border-black/30 rounded-[30px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center justify-between p-5 overflow-hidden mask-scanlines z-20">

            {/* Holographic/Glass reflection on screen */}
            <div className="absolute -inset-full bg-gradient-to-br from-transparent via-white/20 to-transparent rotate-45 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-full h-full bg-gradient-to-bl from-purple-500/10 to-transparent mix-blend-overlay pointer-events-none"></div>

            {/* LCD Grid/Pixel Effect Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(25,10,0,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:4px_4px] pointer-events-none z-10 opacity-30"></div>

            {/* Top Bar (Stats) */}
            <div className="w-full flex justify-between items-center text-[#2d302a] z-20 font-mono text-[9px] leading-none opacity-80 uppercase tracking-wider font-bold mix-blend-multiply">
              <span>{userName}</span>
              <span>{statusLabel}</span>
            </div>

            {/* Character Container */}
            <div className="relative w-28 h-28 image-pixelated z-20 opacity-90 mix-blend-multiply">
              <div
                className="w-full h-full bg-no-repeat"
                style={{
                  backgroundImage: "url('/tamagotchi-sprites.png')",
                  backgroundSize: '400% 400%',
                  backgroundPosition: `${bgX}% ${bgY}%`
                }}
              />
            </div>

            {/* Action Icons (Bottom of screen) */}
            <div className="w-full flex justify-center px-2 opacity-70 z-20">
              <span className="text-[9px] font-mono text-[#2d302a] whitespace-nowrap overflow-hidden text-ellipsis font-bold uppercase tracking-tight mix-blend-multiply">
                {getLastMealText()}
              </span>
            </div>
          </div>

          {/* Physical Buttons */}
          <div className="w-full flex justify-center gap-6 mt-auto mb-2 z-20">
            {/* Button A (Select) */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] border-b-[3px] border-zinc-950 flex items-center justify-center transform translate-y-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>

            {/* Button B (Confirm) - Slightly Lower/Larger */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_3px_5px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] border-b-[3px] border-zinc-950 flex items-center justify-center translate-y-4">
              <div className="w-9 h-9 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>

            {/* Button C (Cancel) */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] border-b-[3px] border-zinc-950 flex items-center justify-center transform translate-y-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800/50 shadow-inner"></div>
            </div>
          </div>

          {/* Speaker Holes (Decorative) */}
          <div className="absolute top-[50%] right-4 flex flex-col gap-1 opacity-40 mix-blend-overlay">
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
          </div>
          <div className="absolute top-[50%] left-4 flex flex-col gap-1 opacity-40 mix-blend-overlay">
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
            <div className="w-1 h-1 bg-black rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
          </div>

        </div>

        {/* "Gym Bro" Speech Bubble - Liquid Glass Variant */}
        <div className="w-full relative z-10">
          <div className="relative w-full group">
            {/* Bubble Content */}
            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_-5px_rgba(0,0,0,0.3)] relative transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-wider text-lime-400 bg-zinc-950/80 backdrop-blur px-2 py-0.5 uppercase border border-lime-500/20 rounded shadow-lg">
                Insight do Coach
              </div>
              <p className="text-zinc-200 text-sm font-medium leading-relaxed drop-shadow-sm text-center">
                {getMoodMessage()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
