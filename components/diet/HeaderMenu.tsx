import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, User, Activity, RefreshCw, X, Gamepad2, Flame, Crown } from 'lucide-react';
import { TamagotchiMenu } from '@/components/diet/TamagotchiMenu';
import { StreakMenu } from '@/components/diet/StreakMenu';
import { RankingMenu } from '@/components/diet/RankingMenu';
import { FoodItem } from '@/lib/diet-types';

interface HeaderMenuProps {
    onNavigateToWeight: () => void;
    allLogs: { [date: string]: FoodItem[] };
    goals?: { calories?: number; protein?: number };
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ onNavigateToWeight, allLogs, goals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTamagotchiOpen, setIsTamagotchiOpen] = useState(false);
    const [isStreakOpen, setIsStreakOpen] = useState(false);
    const [isRankingOpen, setIsRankingOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is inside the toggle button (menuRef) OR the dropdown content (dropdownRef)
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
                <MoreVertical className="w-6 h-6" />
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* Backdrop for Mobile - Closes menu when clicked */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in pointer-events-auto"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Container */}
                    <div
                        ref={dropdownRef}
                        className="pointer-events-auto
                        fixed inset-x-0 bottom-0 z-[101] bg-zinc-900 border-t border-zinc-800 rounded-t-[2rem] p-4 flex flex-col gap-2 shadow-2xl animate-slide-up-mobile max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]
                        md:absolute md:inset-auto md:right-4 md:top-20 md:bottom-auto md:w-64 md:rounded-2xl md:border md:animate-pop-in md:max-h-none md:overflow-visible md:pb-4
                        md:!fixed md:z-[101] md:!bg-zinc-900 md:!border-zinc-800
                    ">
                        {/* Note: Desktop positioning with Portal needs fixed coordinates or a library like floating-ui. 
                            For simplicity, we place it fixed top-right for desktop since it's a Portal now. 
                        */}

                        {/* Mobile Handle & Close */}
                        <div className="flex items-center justify-center relative mb-4 md:hidden">
                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-zinc-800/50 rounded-full text-zinc-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-2 pb-4 border-b border-zinc-800 md:bg-zinc-950/50 md:-mx-4 md:px-4 md:pt-4 md:mb-2 md:rounded-t-2xl">
                            <div className="flex items-center gap-4 md:gap-3">
                                <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg text-lg md:text-base">
                                    F
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg md:text-sm leading-tight">Fran</p>
                                    <p className="text-zinc-500 text-sm md:text-xs">Perfil Pessoal</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => { onNavigateToWeight(); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-200 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium bg-zinc-800/30 md:bg-transparent"
                            >
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <Activity className="w-5 h-5 text-lime-400" />
                                </div>
                                Peso & Bioimpedância
                            </button>
                            <button
                                onClick={() => { setIsTamagotchiOpen(true); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-200 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium bg-zinc-800/30 md:bg-transparent"
                            >
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                                </div>
                                Tamagochi
                            </button>
                            <button
                                onClick={() => { setIsStreakOpen(true); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-200 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium bg-zinc-800/30 md:bg-transparent"
                            >
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                </div>
                                Troféus
                            </button>
                            <button
                                onClick={() => { setIsRankingOpen(true); setIsOpen(false); }}
                                className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-200 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium bg-zinc-800/30 md:bg-transparent"
                            >
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <Crown className="w-5 h-5 text-yellow-400" />
                                </div>
                                Ranking Top 5
                            </button>
                            <button className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-500 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium opacity-50 cursor-not-allowed bg-zinc-800/30 md:bg-transparent">
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <User className="w-5 h-5 text-blue-400" />
                                </div>
                                Editar Perfil
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex items-center gap-4 px-4 py-4 md:py-2.5 text-zinc-200 hover:bg-zinc-800 rounded-2xl md:rounded-lg transition-colors text-base md:text-sm font-bold md:font-medium bg-zinc-800/30 md:bg-transparent"
                            >
                                <div className="p-2 bg-zinc-800 rounded-full md:bg-transparent md:p-0">
                                    <RefreshCw className="w-5 h-5 text-zinc-400" />
                                </div>
                                Atualizar App
                            </button>
                        </div>

                        {/* Mobile Cancel Button - Explicitly visible */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-2 w-full bg-zinc-950 text-zinc-400 font-bold py-4 rounded-2xl md:hidden active:scale-95 transition-transform"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>,
                document.body
            )}

            <TamagotchiMenu
                isOpen={isTamagotchiOpen}
                onClose={() => setIsTamagotchiOpen(false)}
                userName="Fran"
                allLogs={allLogs}
                goals={goals}
            />

            <StreakMenu
                isOpen={isStreakOpen}
                onClose={() => setIsStreakOpen(false)}
            />

            <RankingMenu
                isOpen={isRankingOpen}
                onClose={() => setIsRankingOpen(false)}
            />
        </div>
    );
};
