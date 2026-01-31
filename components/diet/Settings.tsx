import React, { useState, useEffect } from 'react';
import { UserGoals } from '@/lib/diet-types';
import { Card } from '@/components/diet/ui/Card';
import { Button } from '@/components/diet/ui/Button';
import { Save, Scale, AlertCircle, Check, Activity, Flame, Dumbbell, User } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils/dateUtils';
import { API_BASE_URL } from '@/lib/config';

interface SettingsProps {
  currentGoals: UserGoals;
  onSave: (goals: UserGoals) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentGoals, onSave }) => {
  const [goals, setGoals] = useState<UserGoals>(currentGoals);
  const [saved, setSaved] = useState(false);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);

  useEffect(() => {
    // Update local state when props change (initial load)
    // Ensure arrays are initialized
    setGoals({
      ...currentGoals,
      objectives: currentGoals.objectives || [],
      intolerances: currentGoals.intolerances || [],
      conditions: currentGoals.conditions || []
    });
  }, [currentGoals]);

  useEffect(() => {
    // Fetch latest weight for display
    const fetchWeight = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/weights`);
        if (res.ok) {
          const data = await res.json();
          // Assuming API returns sorted by date DESC (newest first) based on server.js
          if (data && data.length > 0) {
            setLatestWeight(data[0].weight);
          }
        }
      } catch (error) {
        console.error("Failed to fetch weight for settings", error);
      }
    };
    fetchWeight();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goals);

    // Clear today's cached tip to force regeneration with new settings
    const today = getLocalDateString();
    localStorage.removeItem(`diet_tip_${today}`);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleArrayItem = (field: 'intolerances' | 'conditions' | 'objectives', value: string) => {
    setGoals(prev => {
      const currentArray = prev[field] || [];
      const exists = currentArray.includes(value);
      const newArray = exists
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const GoalCard = ({ type, icon: Icon, label, description }: { type: string, icon: any, label: string, description: string }) => {
    const isSelected = (goals.objectives || []).includes(type);
    return (
      <div
        onClick={() => toggleArrayItem('objectives', type)}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-2 group
          ${isSelected
            ? 'bg-lime-500/10 border-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.15)]'
            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
          }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 bg-lime-500 rounded-full p-0.5">
            <Check className="w-3 h-3 text-black" />
          </div>
        )}
        <Icon className={`w-8 h-8 ${isSelected ? 'text-lime-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{label}</span>
        <span className="text-[10px] text-zinc-500 leading-tight">{description}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-lime-500/10 p-3 rounded-2xl">
          <User className="w-8 h-8 text-lime-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Perfil & Metas</h2>
          <p className="text-zinc-400 text-sm">Personalize sua experiência</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Physical Stats Card */}
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
            Dados Corporais
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-2">Altura (cm)</label>
              <input
                type="number"
                value={goals.height || ''}
                onChange={(e) => setGoals({ ...goals, height: Number(e.target.value) })}
                placeholder="Ex: 175"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-2">Peso Atual (kg)</label>
              <div className="relative">
                <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-500 cursor-not-allowed">
                  {latestWeight ? `${latestWeight} kg` : '--'}
                </div>
                {latestWeight && <Scale className="absolute right-3 top-3 w-5 h-5 text-zinc-600" />}
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Sincronizado com o histórico de peso.</p>
            </div>
          </div>
        </Card>

        {/* Goal Selection */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 pl-1">Qual seu foco principal?</h3>
          <div className="grid grid-cols-3 gap-3">
            <GoalCard
              type="weight_loss"
              icon={Scale}
              label="Perder Peso"
              description="Foco em déficit calórico e saciedade."
            />
            <GoalCard
              type="muscle_gain"
              icon={Dumbbell}
              label="Ganhar Massa"
              description="Foco em proteína e superávit controlado."
            />
            <GoalCard
              type="fat_loss"
              icon={Flame}
              label="Secar"
              description="Manter músculos enquanto queima gordura."
            />
          </div>
        </div>

        {/* Nutritional Goals */}
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
            Metas Nutricionais Diárias
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Meta de Calorias (kcal)
              </label>
              <input
                type="number"
                value={goals.calories || ''}
                onChange={(e) => setGoals({ ...goals, calories: Number(e.target.value) })}
                placeholder="Ex: 2000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-1">Deixe em branco ou 0 para desativar.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Meta de Proteínas (g)
              </label>
              <input
                type="number"
                value={goals.protein || ''}
                onChange={(e) => setGoals({ ...goals, protein: Number(e.target.value) })}
                placeholder="Ex: 150"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-1">Essencial para construção muscular.</p>
            </div>
          </div>
        </Card>

        {/* Restrictions & Conditions */}
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
            Saúde e Restrições
          </h3>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-3">Intolerâncias Alimentares</label>
            <div className="flex flex-wrap gap-2">
              {['lactose', 'gluten'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleArrayItem('intolerances', item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2
                     ${(goals.intolerances || []).includes(item)
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                >
                  {(goals.intolerances || []).includes(item) && <Check className="w-3 h-3" />}
                  {item === 'lactose' ? 'Lactose' : 'Glúten'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-zinc-800/50">
            <label className="block text-xs font-bold text-zinc-400 mb-3">Condições Médicas</label>
            <button
              type="button"
              onClick={() => toggleArrayItem('conditions', 'lipedema')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 w-full md:w-auto
                 ${(goals.conditions || []).includes('lipedema')
                  ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
            >
              {(goals.conditions || []).includes('lipedema') && <Check className="w-3 h-3" />}
              <Activity className="w-4 h-4" />
              Lipedema
              <span className="text-[10px] opacity-60 ml-1 font-normal">(Foco anti-inflamatório)</span>
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <div className="w-5 h-5 text-blue-500 font-bold flex items-center justify-center">🔔</div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-300">Notificações</h3>
              <p className="text-[10px] text-zinc-500">Lembretes e alertas do seu parceiro de treino</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={async () => {
                const { requestNotificationPermission } = await import('@/services/notificationService');
                const granted = await requestNotificationPermission();
                if (granted) alert('Notificações ativadas! 🚀');
                else alert('Você precisa permitir notificações no navegador.');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              Ativar Permissão
            </Button>

            <Button
              type="button"
              onClick={async () => {
                const { sendLocalNotification } = await import('@/services/notificationService');
                sendLocalNotification('BiriDiet 2000', 'HORA DO RANGO MONSTRO! 💪🐓');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              Testar Notificação
            </Button>
          </div>
          <p className="text-[10px] text-zinc-600 italic">
            * No iPhone/iPad, funciona apenas se adicionado à Tela de Início.
          </p>
        </Card>

        <div className="sticky bottom-24 z-30">
          <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none"></div>
          {saved && (
            <div className="absolute -top-12 left-0 right-0 text-center animate-fade-in-up">
              <span className="bg-lime-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Alterações salvas!
              </span>
            </div>
          )}
          <Button type="submit" className="w-full shadow-xl shadow-lime-500/10">
            <Save className="w-4 h-4 mr-2" />
            Salvar Perfil
          </Button>
        </div>

      </form>

      <div className="mt-8 p-4 border border-zinc-800/50 rounded-lg bg-zinc-900/50 flex gap-3">
        <AlertCircle className="w-5 h-5 text-zinc-600 shrink-0" />
        <p className="text-zinc-500 text-xs leading-relaxed">
          A "Biridica" usará essas informações para personalizar as análises diárias.
          Sempre consulte um médico para orientações específicas sobre condições de saúde.
        </p>
      </div>
    </div>
  );
};