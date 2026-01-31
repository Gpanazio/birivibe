import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/diet/ui/Button';
import { Card } from '@/components/diet/ui/Card';
import { parseFoodLog } from '@/services/geminiService';
import { GeminiParsedFood, MealCategory } from '@/lib/diet-types';
import { MealCategorySelector } from '@/components/diet/MealCategorySelector';
import { FoodInputForm } from '@/components/diet/FoodInputForm';

interface FoodLoggerProps {
  onAddItems: (items: GeminiParsedFood[]) => void;
  compact?: boolean;
}

const FUN_PLACEHOLDERS = [
  "Mandei ver num X-Tudo...",
  "Comi uma salada (mentira, foi pizza)...",
  "3 ovos e batata doce, tô monstro!",
  "Aquele cafezinho com pão de queijo...",
  "Um prato de pedreiro com arroz e feijão...",
  "Sushi até explodir..."
];

export const FoodLogger: React.FC<FoodLoggerProps> = ({ onAddItems, compact = false }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(FUN_PLACEHOLDERS[0]);
  const [mealCategory, setMealCategory] = useState<MealCategory>('almoço');

  useEffect(() => {
    setPlaceholder(FUN_PLACEHOLDERS[Math.floor(Math.random() * FUN_PLACEHOLDERS.length)]);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setIsSuccess(false);

    try {
      const items = await parseFoodLog(input);
      if (items.length > 0) {
        // Add meal category to each item
        const itemsWithCategory = items.map(item => ({
          ...item,
          mealCategory
        }));
        onAddItems(itemsWithCategory);
        setInput('');
        setIsSuccess(true);
      } else {
        setError("Ixi, não entendi nada. Fala que nem gente!");
      }
    } catch (err) {
      setError("O cérebro da IA deu tela azul. Tenta de novo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compact mode for modals
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Compact Title */}
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-lime-400 fill-lime-400" />
          <h3 className="text-lg font-bold text-white font-display">
            {isSuccess ? '✅ Boa! Anotado.' : 'Bora comer?'}
          </h3>
        </div>

        {/* Compact Category Selector */}
        <MealCategorySelector
          selectedCategory={mealCategory}
          onSelect={setMealCategory}
          compact
        />

        {/* Compact Form */}
        <FoodInputForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isAnalyzing={isAnalyzing}
          isSuccess={isSuccess}
          placeholder="Ex: 3 ovos e batata doce..."
          compact
        />

        {error && (
          <div className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-xs font-bold border border-red-500/20">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Full mode for main dashboard
  return (
    <div className="mb-8 relative overflow-hidden rounded-[2.5rem]">
      {/* Background Decoration */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <Card className={`relative border transition-colors duration-500 ${isSuccess ? 'border-lime-500/50 shadow-lime-500/20' : 'border-lime-500/20 shadow-lime-900/10'}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2 font-display">
              {isSuccess ? (
                <span className="text-lime-400 animate-pop-in flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Boa! Anotado.
                </span>
              ) : (
                <>
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  Bora comer?
                </>
              )}
            </h2>
            <p className="text-zinc-400 text-sm font-medium mt-1">
              {isSuccess ? 'Continue assim! 💪' : 'Conta pra IA o que você mandou pra dentro! 😋'}
            </p>
          </div>
          <div className={`bg-lime-500/10 p-2 rounded-2xl ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`}>
            <Sparkles className={`w-6 h-6 ${isSuccess ? 'text-lime-400' : 'text-lime-400'}`} />
          </div>
        </div>

        {/* Meal Category Selector */}
        <MealCategorySelector
          selectedCategory={mealCategory}
          onSelect={setMealCategory}
        />

        <FoodInputForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isAnalyzing={isAnalyzing}
          isSuccess={isSuccess}
          placeholder={placeholder}
        />

        {error && (
          <div className="mt-3 bg-red-500/10 text-red-400 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20 animate-bounce">
            🤬 {error}
          </div>
        )}
      </Card>
    </div>
  );
};