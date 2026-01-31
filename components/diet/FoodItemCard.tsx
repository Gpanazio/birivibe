import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { FoodItem } from '@/lib/diet-types';
import { getFoodEmoji } from '@/lib/utils/emojiUtils';

interface FoodItemCardProps {
    item: FoodItem;
    index: number;
    isUncategorized?: boolean;
    onClick: (item: FoodItem) => void;
    onDelete: (id: string) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
    item,
    index,
    isUncategorized = false,
    onClick,
    onDelete
}) => {
    return (
        <div
            onClick={() => onClick(item)}
            className={`
        ${isUncategorized
                    ? 'glass-thin border-amber-500/30 hover:bg-amber-500/10'
                    : 'glass-thin hover:bg-white/5'
                }
        rounded-[20px] p-4 flex justify-between items-center shadow-lg active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden animate-pop-in
      `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4 relative z-10 w-[70%]">
                <div className={`
          bg-black/40 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform backdrop-blur-md border border-white/5
          ${isUncategorized ? 'border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]' : ''}
        `}>
                    <span className="filter grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-md">
                        {isUncategorized ? '⚠️' : getFoodEmoji(item.name)}
                    </span>
                </div>
                <div className="overflow-hidden">
                    <p className="font-bold text-zinc-100 group-hover:text-white truncate text-base tracking-tight">{item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1 flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded ${item.protein > 20 ? "bg-lime-500/10 text-lime-400" : "bg-white/5 text-zinc-400"}`}>P: {Math.round(item.protein)}g</span>
                        <span className={`px-1.5 py-0.5 rounded ${item.carbs > 40 ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-zinc-400"}`}>C: {Math.round(item.carbs)}g</span>
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 relative z-10 shrink-0">
                <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors backdrop-blur-md">
                    <span className="text-white font-black text-sm tracking-tight">{Math.round(item.calories)}</span>
                    <span className="text-zinc-500 text-[10px] ml-1 font-bold">kcal</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pl-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className={`
              w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-500 transition-colors
              ${isUncategorized ? 'hover:bg-red-500/20 hover:text-red-400' : 'hover:bg-red-500/20 hover:text-red-400'}
            `}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`
            w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center transition-colors
            ${isUncategorized
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 animate-pulse'
                            : 'text-zinc-500 hover:bg-lime-500/20 hover:text-lime-400'
                        }
          `}>
                        <Edit2 className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </div>
    );
};
