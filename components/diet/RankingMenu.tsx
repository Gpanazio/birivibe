import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Crown, Medal, Award } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface RankingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RankedFood {
  rank: number;
  name: string;
  count: number;
  avgCalories: number;
  avgProtein: number;
}

const RANK_COLORS = [
  'from-yellow-500/20 to-amber-600/20 border-yellow-500/40 text-yellow-400', // 1st
  'from-zinc-400/20 to-zinc-500/20 border-zinc-400/40 text-zinc-300',        // 2nd
  'from-orange-600/20 to-orange-700/20 border-orange-600/40 text-orange-400', // 3rd
  'from-zinc-700/20 to-zinc-800/20 border-zinc-700/30 text-zinc-400',        // 4th
  'from-zinc-700/20 to-zinc-800/20 border-zinc-700/30 text-zinc-400',        // 5th
];

const RANK_ICONS = [Crown, Medal, Award];

export const RankingMenu: React.FC<RankingMenuProps> = ({ isOpen, onClose }) => {
  const [foods, setFoods] = useState<RankedFood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRanking = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/ranking/foods?limit=5`);
        if (res.ok) {
          setFoods(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch ranking', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate total count for percentage bar
  const maxCount = foods.length > 0 ? foods[0].count : 1;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      {/* Main Container */}
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
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl border border-yellow-500/20">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Top 5 Alimentos</h2>
              <p className="text-xs text-zinc-500 font-medium">Os mais consumidos da sua dieta</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3 opacity-60">🍽️</p>
              <p className="text-zinc-500 font-medium">Nenhum alimento registrado ainda</p>
              <p className="text-xs text-zinc-600 mt-1">Comece a registrar suas refeicoes!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {foods.map((food, index) => {
                const RankIcon = RANK_ICONS[index] || null;
                const colorClass = RANK_COLORS[index] || RANK_COLORS[4];
                const percentage = (food.count / maxCount) * 100;

                return (
                  <div
                    key={food.name}
                    className={`relative bg-gradient-to-r ${colorClass} rounded-2xl p-4 border overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Progress bar background */}
                    <div
                      className="absolute inset-0 bg-white/5 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center gap-3">
                      {/* Rank Badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${index === 0 ? 'bg-yellow-500/30 text-yellow-300' :
                        index === 1 ? 'bg-zinc-400/30 text-zinc-200' :
                          index === 2 ? 'bg-orange-500/30 text-orange-300' :
                            'bg-zinc-700/30 text-zinc-400'
                        }`}>
                        {index < 3 && RankIcon ? (
                          <RankIcon className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <span>{food.rank}</span>
                        )}
                      </div>

                      {/* Food Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate capitalize text-sm">
                          {food.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium mt-0.5">
                          <span>{food.avgCalories} kcal</span>
                          <span className="opacity-40">|</span>
                          <span>{food.avgProtein}g prot</span>
                        </div>
                      </div>

                      {/* Count */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{food.count}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">vezes</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Fun fact */}
              {foods.length > 0 && (
                <div className="mt-6 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/30">
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    <span className="text-lime-400 font-bold">Curiosidade:</span> Voce ja comeu{' '}
                    <span className="text-white font-bold capitalize">{foods[0]?.name}</span>{' '}
                    {foods[0]?.count} vezes! Isso equivale a aproximadamente{' '}
                    <span className="text-white font-bold">
                      {Math.round(foods[0]?.avgCalories * foods[0]?.count).toLocaleString()}
                    </span>{' '}
                    kcal no total.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
