import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Save, AlertCircle } from 'lucide-react';
import { FoodItem, MealCategory, MEAL_CATEGORIES, MEAL_CATEGORY_LABELS } from '@/lib/diet-types';
import { Button } from '@/components/diet/ui/Button';

interface EditFoodModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
  onDelete: (id: string) => void;
}

import { Z_INDEX } from '@/lib/constants/zIndex';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

// ... imports remain the same

export const EditFoodModal: React.FC<EditFoodModalProps> = ({ item, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<FoodItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setIsDeleting(false); // Reset delete state when opening new item
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof FoodItem, value: any) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const modalContent = (
    <div className={`fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in`} style={{ zIndex: Z_INDEX.MODAL }} onClick={onClose}>
      <div
        className="glass-thick border-t md:border border-white/10 w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up-mobile flex flex-col max-h-[85vh] md:max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none rounded-[2.5rem] z-0" />
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-white/5 shrink-0 relative z-10">
          <h3 className="text-2xl font-display font-black text-white flex items-center gap-2">
            📝 Ajuste Fino
          </h3>
          <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">O que foi?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-lg font-bold text-white focus:border-lime-500 focus:ring-0 outline-none transition-colors mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Data</label>
              <input
                type="date"
                value={formData.date || formData.timestamp?.split('T')[0] || ''}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-lg font-bold text-white focus:border-lime-500 focus:ring-0 outline-none transition-colors mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Categoria</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {MEAL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleChange('mealCategory', category)}
                    className={`px-3 py-2 rounded-xl font-bold text-xs transition-all ${formData.mealCategory === category
                      ? 'bg-lime-500 text-zinc-950 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                      }`}
                  >
                    {MEAL_CATEGORY_LABELS[category]}
                  </button>
                ))}
              </div>
              {!formData.mealCategory && (
                <p className="text-xs text-zinc-500 mt-2">Item sem categoria. Selecione uma acima.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Calorias</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleChange('calories', Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-white font-mono font-bold focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-zinc-600">kcal</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Proteína</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => handleChange('protein', Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-white font-mono font-bold focus:border-lime-500 focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-zinc-600">g</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Carbos</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => handleChange('carbs', Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-white font-mono font-bold focus:border-yellow-500 focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-zinc-600">g</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Gorduras</label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => handleChange('fats', Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 text-white font-mono font-bold focus:border-purple-500 focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-zinc-600">g</span>
                </div>
              </div>
            </div>

            <details className="group bg-zinc-950/30 rounded-2xl border border-zinc-800/50">
              <summary className="cursor-pointer text-xs font-bold text-zinc-400 uppercase tracking-wider p-4 flex items-center justify-between select-none hover:text-zinc-200">
                <span>Detalhes Minuciosos (Micro)</span>
                <span className="group-open:rotate-180 transition-transform bg-zinc-800 rounded-full w-6 h-6 flex items-center justify-center">▼</span>
              </summary>
              <div className="grid grid-cols-2 gap-3 p-4 pt-0">
                {[
                  { k: 'fiber', l: 'Fibras (g)' },
                  { k: 'sugar', l: 'Açúcar (g)' },
                  { k: 'vitaminC', l: 'Vit. C (mg)' },
                  { k: 'iron', l: 'Ferro (mg)' }
                ].map(({ k, l }) => (
                  <div key={k}>
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">{l}</label>
                    <input
                      type="number"
                      value={(formData as any)[k] || 0}
                      onChange={(e) => handleChange(k as keyof FoodItem, Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-sm text-zinc-300 focus:border-zinc-600 outline-none text-center font-mono"
                    />
                  </div>
                ))}
              </div>
            </details>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-3 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-6 shrink-0">
          <Button
            onClick={handleSave}
            className="w-full text-lg py-4"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Tudo
          </Button>

          {!isDeleting ? (
            <button
              onClick={() => setIsDeleting(true)}
              className="w-full bg-transparent hover:bg-red-500/10 text-red-500/50 hover:text-red-500 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Deletar Item
            </button>
          ) : (
            <div className="flex items-center gap-3 animate-fade-in">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-2xl transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => onDelete(formData.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-red-500/20"
              >
                <AlertCircle className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};