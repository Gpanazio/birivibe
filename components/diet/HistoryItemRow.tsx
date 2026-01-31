import React from 'react';
import { FoodItem } from '@/lib/diet-types';

interface HistoryItemRowProps {
    item: FoodItem;
    isUncategorized?: boolean;
    onClick: (item: FoodItem) => void;
}

export const HistoryItemRow: React.FC<HistoryItemRowProps> = ({
    item,
    isUncategorized = false,
    onClick
}) => {
    return (
        <div className="flex gap-3 relative group">
            <div className={`
        mt-1.5 w-2 h-2 rounded-full ring-4 ring-zinc-950 shrink-0 transition-colors
        ${isUncategorized
                    ? 'bg-amber-600/50 group-hover:bg-amber-500'
                    : 'bg-zinc-700 group-hover:bg-lime-500'
                }
      `}></div>

            <div
                onClick={() => onClick(item)}
                className={`
          rounded-xl p-3 flex-1 flex justify-between items-start active:scale-[0.98] transition-all touch-manipulation cursor-pointer
          ${isUncategorized
                        ? 'bg-zinc-900/40 border-2 border-amber-500/20 hover:border-amber-500/40 hover:bg-zinc-800/40'
                        : 'bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40'
                    }
        `}
            >
                <div className="pr-2 flex-1">
                    <p className="text-zinc-200 text-sm font-medium">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        {item.carbs > 0 && <span>C: {Math.round(item.carbs)}g • </span>}
                        {item.fats > 0 && <span>G: {Math.round(item.fats)}g</span>}
                    </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className="text-zinc-100 text-xs font-bold">{Math.round(item.calories)} kcal</span>
                    <span className="text-lime-500/80 text-[10px] font-bold">P: {Math.round(item.protein)}g</span>
                </div>
            </div>
        </div>
    );
};
