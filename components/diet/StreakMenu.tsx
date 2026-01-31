import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Trophy, Target, Calendar, Zap, Lock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface StreakMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  lastLogDate: string | null;
}

interface AchievementsData {
  achievements: Achievement[];
  stats: {
    totalItems: number;
    totalDays: number;
    totalCalories: number;
    totalProtein: number;
    calorieGoalDays: number;
    proteinGoalDays: number;
    currentStreak: number;
  };
}

export const StreakMenu: React.FC<StreakMenuProps> = ({ isOpen, onClose }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [streakRes, achievementsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/streak`),
          fetch(`${API_BASE_URL}/api/achievements`)
        ]);

        if (streakRes.ok) {
          setStreakData(await streakRes.json());
        }
        if (achievementsRes.ok) {
          setAchievementsData(await achievementsRes.json());
        }
      } catch (err) {
        console.error('Failed to fetch gamification data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = achievementsData?.achievements.filter(a => a.unlocked).length || 0;
  const totalAchievements = achievementsData?.achievements.length || 0;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] animate-fade-in"
        onClick={onClose}
      />

      {/* Main Container - Enhanced Glassmorphism */}
      <div className="relative glass border border-white/10 rounded-[2.5rem] flex flex-col max-w-sm w-full max-h-[85vh] animate-pop-in overflow-hidden shadow-2xl">

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full p-2 text-zinc-400 hover:text-white transition-all border border-white/5 z-50 hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Streak & Troféus</h2>
              <p className="text-xs text-zinc-500 font-medium">Sua jornada de consistencia</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Streak Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Streak - Hero Card */}
                <div className="col-span-2 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 rounded-3xl p-5 border border-orange-500/20 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-orange-400/80 font-bold uppercase tracking-wider mb-1">Streak Atual</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-white drop-shadow-md">{streakData?.currentStreak || 0}</span>
                          <span className="text-lg text-orange-400 font-bold">dias</span>
                        </div>
                      </div>
                      <div className="text-6xl opacity-80 filter drop-shadow-lg animate-[pulse_3s_infinite]">
                        {(streakData?.currentStreak || 0) >= 7 ? '🔥' : '💪'}
                      </div>
                    </div>

                    {/* Streak motivation */}
                    <p className="text-xs text-zinc-400 mt-3 font-medium">
                      {(() => {
                        const streak = streakData?.currentStreak || 0;
                        if (streak === 0) return "Registre suas refeicoes para iniciar um streak!";
                        if (streak < 7) return `Continue assim! Faltam ${7 - streak} dias para o proximo badge.`;
                        if (streak < 14) return "Voce e um guerreiro! Mantenha o ritmo!";
                        if (streak < 30) return "Incrivel! Consistencia e a chave do sucesso!";
                        return "LENDARIO! Voce e uma maquina!";
                      })()}
                    </p>
                  </div>
                </div>

                {/* Longest Streak */}
                <div className="glass-thin rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Recorde</p>
                  </div>
                  <p className="text-2xl font-black text-white">{streakData?.longestStreak || 0}</p>
                  <p className="text-xs text-zinc-500">dias seguidos</p>
                </div>

                {/* Total Days */}
                <div className="glass-thin rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-lime-400" />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total</p>
                  </div>
                  <p className="text-2xl font-black text-white">{streakData?.totalDaysLogged || 0}</p>
                  <p className="text-xs text-zinc-500">dias registrados</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex justify-around py-4 bg-zinc-800/20 rounded-2xl border border-zinc-700/20 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-lg font-black text-white">{achievementsData?.stats.totalItems || 0}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Refeicoes</p>
                </div>
                <div className="w-px bg-zinc-700/50" />
                <div className="text-center">
                  <p className="text-lg font-black text-white">{Math.round((achievementsData?.stats.totalProtein || 0) / 1000)}kg</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Proteina</p>
                </div>
                <div className="w-px bg-zinc-700/50" />
                <div className="text-center">
                  <p className="text-lg font-black text-white">{achievementsData?.stats.proteinGoalDays || 0}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Metas</p>
                </div>
              </div>

              {/* Achievements Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Troféus
                  </h3>
                  <span className="text-xs text-zinc-500 font-bold bg-zinc-800/50 px-2 py-1 rounded-full border border-white/5">
                    {unlockedCount}/{totalAchievements}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {achievementsData?.achievements.map((achievement) => (
                    <button
                      key={achievement.id}
                      onClick={() => setSelectedAchievement(achievement)}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 active:scale-95 group ${achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
                        : 'bg-zinc-800/30 border border-zinc-700/30'
                        } ${selectedAchievement?.id === achievement.id ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900 bg-zinc-800' : ''}`}
                      title={achievement.name}
                    >
                      <span className={`text-2xl transition-all duration-300 ${achievement.unlocked ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'grayscale opacity-30 group-hover:opacity-50'}`}>
                        {achievement.icon}
                      </span>
                      {!achievement.unlocked && (
                        <Lock className="w-3 h-3 text-zinc-600 absolute bottom-1 right-1" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Achievement Details Panel */}
                <div className="mt-4 min-h-[100px]">
                  {selectedAchievement ? (
                    <div className="glass-thin p-4 rounded-2xl border-l-4 border-l-orange-500 animate-slide-up-mobile">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-xl ${selectedAchievement.unlocked ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-zinc-800'}`}>
                          <span className={`text-2xl block ${!selectedAchievement.unlocked && 'grayscale opacity-50'}`}>
                            {selectedAchievement.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${selectedAchievement.unlocked ? 'text-white' : 'text-zinc-400'}`}>
                            {selectedAchievement.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                            {selectedAchievement.desc}
                          </p>
                          {selectedAchievement.unlocked ? (
                            <span className="inline-block mt-2 text-[10px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full">
                              CONQUISTADA
                            </span>
                          ) : (
                            <span className="inline-block mt-2 text-[10px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <Lock className="w-3 h-3" /> BLOQUEADA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Default view if nothing selected (show latest unlocked or intro)
                    <div className="bg-zinc-800/20 p-4 rounded-2xl border border-dashed border-zinc-700/50 flex items-center justify-center text-center">
                      <p className="text-xs text-zinc-500">
                        Clique em uma conquista para ver detalhes e requisitos para desbloquear.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
