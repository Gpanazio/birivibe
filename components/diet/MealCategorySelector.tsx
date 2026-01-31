import React from 'react';
import { MealCategory, MEAL_CATEGORIES, MEAL_CATEGORY_LABELS } from '@/lib/diet-types';

interface MealCategorySelectorProps {
    selectedCategory: MealCategory;
    onSelect: (category: MealCategory) => void;
    compact?: boolean;
}

export const MealCategorySelector: React.FC<MealCategorySelectorProps> = ({
    selectedCategory,
    onSelect,
    compact = false
}) => {
    return (
        <div className={compact ? "grid grid-cols-4 gap-1.5" : "mb-3 grid grid-cols-4 gap-2"}>
            {MEAL_CATEGORIES.map((category) => (
                <button
                    key={category}
                    type="button"
                    onClick={() => onSelect(category)}
                    className={`
            ${compact ? 'py-2 rounded-lg font-bold text-[10px] flex justify-center items-center' : 'py-3 rounded-xl font-bold text-xs sm:text-sm flex justify-center items-center'}
            transition-all border border-transparent
            ${selectedCategory === category
                            ? `bg-lime-500 text-zinc-950 border-lime-400 ${!compact && 'shadow-[0_0_20px_rgba(163,230,53,0.3)]'}`
                            : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border-zinc-800'
                        }
          `}
                >
                    <span className="truncate">{MEAL_CATEGORY_LABELS[category]}</span>
                </button>
            ))}
        </div>
    );
};
