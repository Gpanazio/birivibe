import React, { useMemo } from 'react';
import { FoodItem, MealCategory, MEAL_CATEGORIES, MEAL_CATEGORY_LABELS } from '@/lib/diet-types';
import { HistoryItemRow } from '@/components/diet/HistoryItemRow';

interface DailyDietDetailsProps {
    items: FoodItem[];
    onEditItem: (item: FoodItem) => void;
}

export const DailyDietDetails: React.FC<DailyDietDetailsProps> = ({ items, onEditItem }) => {
    const groupedItems = useMemo(() => {
        const groups: Record<MealCategory | 'sem-categoria', FoodItem[]> = {
            'café da manhã': [],
            'almoço': [],
            'lanche': [],
            'janta': [],
            'sem-categoria': []
        };

        items.forEach(item => {
            if (item.mealCategory) {
                groups[item.mealCategory].push(item);
            } else {
                groups['sem-categoria'].push(item);
            }
        });
        return groups;
    }, [items]);

    return (
        <div className="space-y-4 pl-2 animate-slide-down">
            {/* Render categorized items */}
            {MEAL_CATEGORIES.map((category) => {
                const categoryItems = groupedItems[category];
                if (categoryItems.length === 0) return null;

                return (
                    <div key={category} className="space-y-2">
                        <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <span>{MEAL_CATEGORY_LABELS[category]}</span>
                            <span className="text-[10px] bg-zinc-800/30 text-zinc-600 px-1.5 py-0.5 rounded-full">{categoryItems.length}</span>
                        </h5>
                        {categoryItems.map((item, idx) => (
                            <HistoryItemRow
                                key={item.id || idx}
                                item={item}
                                onClick={onEditItem}
                            />
                        ))}
                    </div>
                );
            })}

            {/* Render uncategorized items */}
            {groupedItems['sem-categoria'].length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-bold text-amber-500/70 uppercase tracking-wider flex items-center gap-2">
                        <span>⚠️ Sem Categoria</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-500/70 px-1.5 py-0.5 rounded-full">{groupedItems['sem-categoria'].length}</span>
                    </h5>
                    {groupedItems['sem-categoria'].map((item, idx) => (
                        <HistoryItemRow
                            key={item.id || idx}
                            item={item}
                            isUncategorized
                            onClick={onEditItem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
