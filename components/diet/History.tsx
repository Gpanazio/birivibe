import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FoodItem, GeminiParsedFood, MealCategory, MEAL_CATEGORIES, MEAL_CATEGORY_LABELS, UserGoals } from '@/lib/diet-types';
import { Calendar, X, Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { FoodLogger } from '@/components/diet/FoodLogger';
import { EditFoodModal } from '@/components/diet/EditFoodModal';
import { DailyDietDetails } from '@/components/diet/DailyDietDetails';
import { Z_INDEX } from '@/lib/constants/zIndex';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { generateWeeklyAnalysis } from '@/services/geminiService';

interface HistoryProps {
    allLogs: { [date: string]: FoodItem[] };
    onAddItems: (items: GeminiParsedFood[]) => void;
    onUpdateItem?: (item: FoodItem) => void;
    onDeleteItem?: (id: string) => void;
    goals?: UserGoals;
}

export const History: React.FC<HistoryProps> = ({ allLogs, onAddItems, onUpdateItem, onDeleteItem, goals }) => {
    const [selectedDateDetails, setSelectedDateDetails] = useState<{ date: string, items: FoodItem[] } | null>(null);
    const [expandedDates, setExpandedDates] = useState<{ [date: string]: boolean }>({});
    const [addingFoodForDate, setAddingFoodForDate] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

    // Birianálise state
    const [showBirianalise, setShowBirianalise] = useState(false);
    const [birianaliseLoading, setBirianaliseLoading] = useState(false);
    const [birianaliseContent, setBirianaliseContent] = useState<string | null>(null);

    const toggleDate = (date: string) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleSaveEdit = (item: FoodItem) => {
        if (onUpdateItem) {
            onUpdateItem(item);
        }
        setEditingItem(null);
    };

    const handleDeleteEdit = (id: string) => {
        if (onDeleteItem) {
            onDeleteItem(id);
        }
        setEditingItem(null);
    };

    // Birianálise handler
    const handleBirianalise = async () => {
        setShowBirianalise(true);
        setBirianaliseLoading(true);
        setBirianaliseContent(null);

        try {
            // Get last 7 days of logs (or whatever is available)
            const sortedDates = Object.keys(allLogs).sort((a, b) => b.localeCompare(a));
            const last7Days = sortedDates.slice(0, 7);
            const logsToAnalyze: { [date: string]: FoodItem[] } = {};

            last7Days.forEach(date => {
                logsToAnalyze[date] = allLogs[date];
            });

            const analysis = await generateWeeklyAnalysis(logsToAnalyze, goals);
            setBirianaliseContent(analysis);
        } catch (error) {
            setBirianaliseContent("Não foi possível gerar a análise. Tente novamente mais tarde.");
        } finally {
            setBirianaliseLoading(false);
        }
    };

    // Lock body scroll when any modal is open
    useBodyScrollLock(!!selectedDateDetails || !!addingFoodForDate || showBirianalise);

    // Generate all dates from earliest log to today (including empty days)
    const sortedDates = useMemo(() => {
        const logDates = Object.keys(allLogs);
        if (logDates.length === 0) return [];

        // Find the earliest date in logs
        const sortedLogDates = logDates.sort((a, b) => a.localeCompare(b));
        const earliestDate = new Date(sortedLogDates[0] + 'T12:00:00');

        // Today's date
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        // Generate all dates from earliest to today
        const allDates: string[] = [];
        const currentDate = new Date(earliestDate);

        while (currentDate <= today) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            allDates.push(`${year}-${month}-${day}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Sort descending (newest first)
        return allDates.sort((a, b) => b.localeCompare(a));
    }, [allLogs]);

    const getDailyTotals = (items: FoodItem[]) => {
        return items.reduce((acc, item) => ({
            calories: acc.calories + (item.calories || 0),
            protein: acc.protein + (item.protein || 0),
            carbs: acc.carbs + (item.carbs || 0),
            fats: acc.fats + (item.fats || 0),
            fiber: acc.fiber + (item.fiber || 0),
            sugar: acc.sugar + (item.sugar || 0),
            vitaminA: acc.vitaminA + (item.vitaminA || 0),
            vitaminC: acc.vitaminC + (item.vitaminC || 0),
            calcium: acc.calcium + (item.calcium || 0),
            iron: acc.iron + (item.iron || 0),
        }), {
            calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0,
            vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0
        });
    };

    const handleRetroactiveAdd = (items: GeminiParsedFood[]) => {
        if (!addingFoodForDate) return;

        // Inject the selected date into the items
        const datedItems = items.map(item => ({
            ...item,
            date: addingFoodForDate
        }));

        onAddItems(datedItems);
        setAddingFoodForDate(null);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-lime-500/10 p-3 rounded-2xl">
                        <Calendar className="w-8 h-8 text-lime-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display">Histórico</h2>
                        <p className="text-zinc-400 text-sm">Linha do tempo completa</p>
                    </div>
                </div>

                {/* Birianálise Button */}
                <button
                    onClick={handleBirianalise}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-white text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                    <Sparkles className="w-4 h-4" />
                    Birianálise
                </button>
            </div>

            <div className="space-y-8">
                {sortedDates.map(date => {
                    const items = allLogs[date] || []; // Default to empty array for days without logs
                    const totals = getDailyTotals(items);
                    const isEmpty = items.length === 0;

                    // Manual date formatting
                    const [y, m, d] = date.split('-');
                    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));

                    // Simplified date formatting
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                    const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                    const dateStr = `${weekday}, ${day} ${month}`;

                    const isExpanded = expandedDates[date] || false;

                    return (
                        <div key={date} className="relative">

                            {/* Clickable Header */}
                            {/* Clickable Header */}
                            <div
                                onClick={() => !isEmpty && toggleDate(date)}
                                className={`sticky top-20 z-20 glass py-3 mb-2 border-b-0 flex justify-between items-center px-4 group rounded-xl transition-all ${isEmpty ? 'opacity-60 border-dashed border-zinc-800' : 'cursor-pointer hover:bg-zinc-800/50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-bold capitalize text-lg transition-colors ${isEmpty ? 'text-zinc-500' : 'text-zinc-100 hover:text-lime-400'}`}>{dateStr}</h3>
                                    {isEmpty && (
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider bg-zinc-800/50 px-2 py-0.5 rounded">
                                            Sem registro
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAddingFoodForDate(date);
                                        }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all border ${isEmpty
                                            ? 'bg-lime-500 text-zinc-950 border-lime-400 animate-pulse shadow-lg shadow-lime-500/30'
                                            : 'bg-lime-500/10 text-lime-500 hover:bg-lime-500 hover:text-zinc-950 border-lime-500/30'}`}
                                        title="Adicionar alimento nesta data"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>

                                    {!isEmpty && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDateDetails({ date: dateStr, items });
                                                }}
                                                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-2 py-1 rounded-lg transition-colors border border-zinc-800 hover:border-zinc-600"
                                            >
                                                Detalhes
                                            </button>
                                            <div className="flex gap-3">
                                                <div className="text-center min-w-[40px]">
                                                    <span className="block text-[10px] text-zinc-500 font-bold uppercase">Cal</span>
                                                    <span className="text-xs font-black text-orange-400">{Math.round(totals.calories)}</span>
                                                </div>
                                                <div className="text-center min-w-[40px]">
                                                    <span className="block text-[10px] text-zinc-500 font-bold uppercase">Prot</span>
                                                    <span className="text-xs font-black text-lime-400">{Math.round(totals.protein)}g</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isExpanded && !isEmpty && (
                                <DailyDietDetails
                                    items={items}
                                    onEditItem={setEditingItem}
                                />
                            )}
                        </div>
                    )
                })}

                {sortedDates.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-zinc-500">Nenhum registro encontrado no histórico.</p>
                    </div>
                )}
            </div>

            {/* Detailed Modal */}
            {selectedDateDetails && createPortal((() => {
                const t = getDailyTotals(selectedDateDetails.items);
                return (
                    <div
                        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                        style={{ zIndex: Z_INDEX.MODAL }}
                        onClick={() => setSelectedDateDetails(null)}
                    >
                        <div
                            className="glass rounded-3xl w-full max-w-sm flex flex-col shadow-2xl animate-scale-in max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="shrink-0 glass border-b-0 p-6 flex justify-between items-center z-10 rounded-t-3xl border-t-0 border-x-0">
                                <div>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Resumo do Dia</p>
                                    <h3 className="text-xl font-bold text-white capitalize leading-none mt-1">{selectedDateDetails.date}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDateDetails(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto overscroll-contain pb-[calc(3rem+env(safe-area-inset-bottom))] md:pb-6 no-scrollbar flex-1 min-h-0">
                                {/* Macros Big */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-950 p-4 rounded-2xl text-center border border-zinc-800">
                                        <p className="text-3xl font-black text-orange-500">{Math.round(t.calories)}</p>
                                        <p className="text-xs font-bold text-zinc-500 uppercase">Calorias</p>
                                    </div>
                                    <div className="bg-zinc-950 p-4 rounded-2xl text-center border border-zinc-800">
                                        <p className="text-3xl font-black text-lime-500">{Math.round(t.protein)}g</p>
                                        <p className="text-xs font-bold text-zinc-500 uppercase">Proteína</p>
                                    </div>
                                </div>

                                {/* Macros Detailed Table */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                        Macronutrientes
                                    </h4>
                                    <div className="bg-zinc-950 rounded-xl overflow-hidden divide-y divide-zinc-900 border border-zinc-900">
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Carboidratos</span>
                                            <span className="font-bold text-blue-400">{Math.round(t.carbs)}g</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Gorduras</span>
                                            <span className="font-bold text-purple-400">{Math.round(t.fats)}g</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Fibras</span>
                                            <span className="font-bold text-emerald-400">{Math.round(t.fiber)}g</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Açúcar</span>
                                            <span className="font-bold text-pink-400">{Math.round(t.sugar)}g</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Micros Table */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                        Micronutrientes
                                    </h4>
                                    <div className="bg-zinc-950 rounded-xl overflow-hidden divide-y divide-zinc-900 border border-zinc-900">
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Vitamina A</span>
                                            <span className="font-bold text-zinc-200">{Math.round(t.vitaminA)}mcg</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Vitamina C</span>
                                            <span className="font-bold text-zinc-200">{Math.round(t.vitaminC)}mg</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Cálcio</span>
                                            <span className="font-bold text-zinc-200">{Math.round(t.calcium)}mg</span>
                                        </div>
                                        <div className="flex justify-between p-3 text-sm">
                                            <span className="text-zinc-400">Ferro</span>
                                            <span className="font-bold text-zinc-200">{Math.round(t.iron)}mg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })(), document.body)}

            {/* Retroactive Food Logger Modal */}
            {addingFoodForDate && createPortal(
                <div
                    className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                    style={{ zIndex: Z_INDEX.MODAL }}
                    onClick={() => setAddingFoodForDate(null)}
                >
                    <div
                        className="bg-zinc-900 border-t md:border border-zinc-800 rounded-t-[2.5rem] md:rounded-3xl w-full max-w-sm flex flex-col shadow-2xl animate-slide-up-mobile md:animate-scale-in max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="shrink-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 p-6 flex justify-between items-center z-10 rounded-t-[2.5rem] md:rounded-t-3xl">
                            <div>
                                <p className="text-xs text-lime-500 font-bold uppercase tracking-wider">Máquina do Tempo</p>
                                <h3 className="text-xl font-bold text-white capitalize leading-none mt-1">
                                    Adicionar em {new Date(addingFoodForDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                </h3>
                            </div>
                            <button
                                onClick={() => setAddingFoodForDate(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto no-scrollbar pb-[calc(2rem+env(safe-area-inset-bottom))]">
                            <FoodLogger compact onAddItems={handleRetroactiveAdd} />
                        </div>
                    </div>
                </div>,
                document.body)}

            {/* Birianálise Modal */}
            {showBirianalise && createPortal(
                <div
                    className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                    style={{ zIndex: Z_INDEX.MODAL }}
                    onClick={() => setShowBirianalise(false)}
                >
                    <div
                        className="bg-zinc-900 border-t md:border border-zinc-800 rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg flex flex-col shadow-2xl animate-slide-up-mobile md:animate-scale-in max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="shrink-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur border-b border-zinc-800 p-6 flex justify-between items-center z-10 rounded-t-[2.5rem] md:rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Birianálise</h3>
                                    <p className="text-xs text-zinc-400">Análise inteligente da sua dieta</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBirianalise(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto no-scrollbar pb-[calc(2rem+env(safe-area-inset-bottom))] flex-1 min-h-0">
                            {birianaliseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                                    <p className="text-zinc-400 text-sm">Analisando sua dieta...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {birianaliseContent?.split('\n').map((line, i) => {
                                        // Handle bold text with **
                                        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                        if (line.startsWith('🎯') || line.startsWith('✅') || line.startsWith('⚠️') || line.startsWith('💡') || line.startsWith('🔥')) {
                                            return (
                                                <h4
                                                    key={i}
                                                    className="text-base font-bold text-white mt-5 mb-2 first:mt-0"
                                                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                                                />
                                            );
                                        }
                                        if (line.trim() === '') return <br key={i} />;
                                        return (
                                            <p
                                                key={i}
                                                className="text-zinc-300 text-sm leading-relaxed mb-2"
                                                dangerouslySetInnerHTML={{ __html: formattedLine }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit Food Modal */}
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
