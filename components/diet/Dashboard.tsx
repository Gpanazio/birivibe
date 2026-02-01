import React, { useMemo, useState, useEffect } from 'react';
import { FoodItem, UserGoals, MealCategory, MEAL_CATEGORIES, MEAL_CATEGORY_LABELS } from '@/lib/diet-types';
import { Card } from '@/components/diet/ui/Card';
import { Crown, Brain, Lightbulb, Flame } from 'lucide-react';
import { EditFoodModal } from '@/components/diet/EditFoodModal';
import { FoodItemCard } from '@/components/diet/FoodItemCard';
import { generateDietTip } from '@/services/geminiService';
import { API_BASE_URL } from '@/lib/config';

interface DashboardProps {
  todayItems: FoodItem[];
  recentLogs: FoodItem[]; // Flat array of last 3 days items
  goals: UserGoals;
  onUpdateItem: (item: FoodItem) => void;
  onDeleteItem: (id: string) => void;
}

interface MacroPillProps {
  label: string;
  value: number;
  target?: number;
  unit: string;
  colorClass: string;
  emoji: string;
}

const MacroPill: React.FC<MacroPillProps> = ({
  label,
  value,
  target,
  unit,
  colorClass,
  emoji
}) => {
  const [width, setWidth] = useState(0);
  const percentage = target ? Math.min((value / target) * 100, 100) : (value > 0 ? 100 : 5);
  const isGoalMet = target && value >= target;

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`relative overflow-hidden rounded-3xl p-4 md:p-5 border ${isGoalMet ? 'border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.15)] bg-zinc-900/80' : 'glass'} ${colorClass} transition-all duration-300 active:scale-95 md:hover:scale-[1.02] group`}>
      {/* Background Progress Bar Container */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
        {/* Animated Bar */}
        <div
          className={`h-full transition-all duration-1000 ease-out relative ${isGoalMet ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-[0_0_10px_rgba(253,224,71,0.5)]' : 'bg-current opacity-60'}`}
          style={{ width: `${width}%` }}
        >
          {/* Moving shine effect on the bar itself */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      {/* Full Card Shimmer when goal met */}
      {isGoalMet && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" style={{ animationDelay: '0.5s' }} />}

      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="relative inline-block">
            <span className={`text-3xl mb-1 block filter drop-shadow-md transition-transform duration-500 ${isGoalMet ? 'animate-[bounce_2s_infinite]' : 'group-hover:scale-110'}`}>{emoji}</span>
            {isGoalMet && (
              <Crown
                className="w-5 h-5 text-yellow-400 absolute -top-3 -right-2 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                fill="currentColor"
              />
            )}
          </div>
          <p className="font-display font-bold text-lg opacity-90 tracking-tight">{label}</p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <h3 className={`text-3xl font-black tracking-tighter transition-colors duration-300 ${isGoalMet ? 'text-yellow-400 scale-110' : ''}`}>
              {Math.round(value)}
            </h3>
            <span className="text-sm font-bold opacity-60">{unit}</span>
          </div>

          {target && (
            <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block transition-colors ${isGoalMet ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/5 text-zinc-500'}`}>
              {isGoalMet ? 'META BATIDA! 🚀' : `Meta: ${target}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ todayItems, recentLogs, goals, onUpdateItem, onDeleteItem }) => {
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [dietTip, setDietTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Fetch AI Tip - Only runs once when component mounts (tips are cached on server for the day)
  useEffect(() => {
    if (recentLogs.length === 0) return;

    const fetchTip = async () => {
      setLoadingTip(true);
      try {
        const result = await generateDietTip(recentLogs, goals);
        setDietTip(result.tip);
      } catch (err) {
        console.error("Failed to get tip", err);
      } finally {
        setLoadingTip(false);
      }
    };

    // Only fetch if we don't have a tip yet
    if (!dietTip) {
      fetchTip();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentLogs.length]); // dietTip, goals intentionally excluded to prevent infinite loops

  // Fetch current streak
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/streak`);
        if (res.ok) {
          const data = await res.json() as any;
          setCurrentStreak(data.currentStreak || 0);
        }
      } catch (err) {
        console.error("Failed to get streak", err);
      }
    };
    fetchStreak();
  }, [todayItems.length]); // Re-fetch when today's items change

  const totals = useMemo(() => {
    return todayItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
        fiber: (acc.fiber || 0) + (item.fiber || 0),
        sugar: (acc.sugar || 0) + (item.sugar || 0),
        vitaminA: (acc.vitaminA || 0) + (item.vitaminA || 0),
        vitaminC: (acc.vitaminC || 0) + (item.vitaminC || 0),
        calcium: (acc.calcium || 0) + (item.calcium || 0),
        iron: (acc.iron || 0) + (item.iron || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 }
    );
  }, [todayItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<MealCategory | 'sem-categoria', FoodItem[]> = {
      'café da manhã': [],
      'almoço': [],
      'lanche': [],
      'janta': [],
      'sem-categoria': []
    };

    todayItems.forEach(item => {
      if (item.mealCategory) {
        groups[item.mealCategory].push(item);
      } else {
        groups['sem-categoria'].push(item);
      }
    });

    return groups;
  }, [todayItems]);

  const handleSaveEdit = (item: FoodItem) => {
    onUpdateItem(item);
    setEditingItem(null);
  };

  const handleDeleteEdit = (id: string) => {
    onDeleteItem(id);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">

      {/* Streak Banner - Only show if streak > 0 */}
      {currentStreak > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 animate-fade-in">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
            <Flame className={`w-4 h-4 text-orange-400 ${currentStreak >= 7 ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-bold text-white">{currentStreak}</span>
            <span className="text-xs text-orange-400/80 font-medium">
              {currentStreak === 1 ? 'dia' : 'dias'} de streak
            </span>
            {currentStreak >= 7 && <span className="text-sm">🔥</span>}
          </div>
        </div>
      )}

      {/* AI Daily Insight Banner */}
      <div className="glass-thick rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

        <div className="flex gap-4 items-start relative z-10">
          <div className="bg-lime-500/10 p-3 rounded-2xl border border-lime-500/20 shrink-0">
            {loadingTip ? (
              <Brain className="w-6 h-6 text-lime-400 animate-pulse" />
            ) : (
              <Lightbulb className="w-6 h-6 text-lime-400" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-base text-lime-400 uppercase tracking-wider">
                Biridica
              </h3>
              {loadingTip && <span className="text-[10px] text-zinc-500 animate-pulse">Analisando...</span>}
            </div>

            <p className="text-zinc-300 text-sm font-medium leading-relaxed">
              {loadingTip ? "Analisando seus últimos 3 dias..." : (dietTip || "Continue registrando para receber dicas personalizadas!")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <MacroPill
          emoji="🔥"
          label="Calorias"
          value={totals.calories}
          target={goals.calories > 0 ? goals.calories : undefined}
          unit="kcal"
          colorClass="bg-gradient-to-br from-orange-500/10 to-orange-600/10 text-orange-400 border-orange-500/30"
        />
        <MacroPill
          emoji="🍗"
          label="Proteínas"
          value={totals.protein}
          target={goals.protein > 0 ? goals.protein : undefined}
          unit="g"
          colorClass="bg-gradient-to-br from-lime-500/10 to-lime-600/10 text-lime-400 border-lime-500/30"
        />
        <MacroPill
          emoji="🍞"
          label="Carbos"
          value={totals.carbs}
          target={undefined}
          unit="g"
          colorClass="bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-400 border-blue-500/30"
        />
        <MacroPill
          emoji="🥑"
          label="Gorduras"
          value={totals.fats}
          target={undefined}
          unit="g"
          colorClass="bg-gradient-to-br from-purple-500/10 to-purple-600/10 text-purple-400 border-purple-500/30"
        />
      </div>

      <h3 className="font-display font-bold text-xl text-white mt-8 mb-4 px-2 flex items-center gap-2">
        <span>Histórico do Dia</span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{todayItems.length}</span>
      </h3>

      {todayItems.length === 0 ? (
        <div className="text-center py-12 opacity-50 bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-800/50">
          <p className="text-4xl mb-3 grayscale opacity-60">🦗</p>
          <p className="font-medium text-zinc-500">O grilo tá cantando...</p>
          <p className="text-xs text-zinc-600 mt-1">Adicione sua primeira refeição!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Render categorized items */}
          {MEAL_CATEGORIES.map((category) => {
            const items = groupedItems[category];
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-2 flex items-center gap-2">
                  <span>{MEAL_CATEGORY_LABELS[category]}</span>
                  <span className="text-xs bg-zinc-800/50 text-zinc-500 px-2 py-0.5 rounded-full">{items.length}</span>
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <FoodItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={setEditingItem}
                      onDelete={onDeleteItem}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Render uncategorized items with warning */}
          {groupedItems['sem-categoria'].length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-500/80 uppercase tracking-wider px-2 flex items-center gap-2">
                <span>⚠️ Sem Categoria</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{groupedItems['sem-categoria'].length}</span>
              </h4>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3 mb-3">
                <p className="text-xs text-amber-400/80 font-medium">
                  Estes itens não têm categoria. Clique para editar e adicionar uma categoria (café, almoço, lanche ou janta).
                </p>
              </div>
              <div className="space-y-2">
                {groupedItems['sem-categoria'].map((item, index) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isUncategorized
                    onClick={setEditingItem}
                    onDelete={onDeleteItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Card title="Nutrientes Essenciais" emoji="🧪">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Fibras</p>
            <p className="text-xl font-black text-emerald-400">{Math.round(totals.fiber)}g</p>
            <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min((totals.fiber / 30) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Açúcar</p>
            <p className="text-xl font-black text-pink-400">{Math.round(totals.sugar)}g</p>
            <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500" style={{ width: `${Math.min((totals.sugar / 50) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Vit. C</p>
            <p className="text-xl font-black text-orange-400">{Math.round(totals.vitaminC)}mg</p>
          </div>
          <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Ferro</p>
            <p className="text-xl font-black text-red-400">{Math.round(totals.iron)}mg</p>
          </div>
        </div>
      </Card>

      <EditFoodModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteEdit}
      />
    </div>
  );
};