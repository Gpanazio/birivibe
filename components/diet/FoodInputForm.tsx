import React from 'react';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/diet/ui/Button';

interface FoodInputFormProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAnalyzing: boolean;
    isSuccess: boolean;
    placeholder?: string;
    compact?: boolean;
}

export const FoodInputForm: React.FC<FoodInputFormProps> = ({
    input,
    setInput,
    onSubmit,
    isAnalyzing,
    isSuccess,
    placeholder = "Ex: 3 ovos e batata doce...",
    compact = false
}) => {
    return (
        <form onSubmit={onSubmit} className={compact ? "relative" : "mt-4 relative group"}>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={isAnalyzing}
                className={`
          w-full bg-zinc-950 border-2 rounded-xl p-4 pr-16 text-zinc-100 placeholder-zinc-600 focus:ring-0 transition-all resize-none
          ${compact
                        ? 'h-24 text-sm border-zinc-800'
                        : 'h-24 md:h-32 text-lg font-medium leading-relaxed bg-zinc-950/50 border-dashed border-zinc-700/50'
                    }
          ${isSuccess ? 'border-lime-500/50 focus:border-lime-500' : 'focus:border-lime-500'}
        `}
            />
            <div className="absolute bottom-3 right-3">
                {compact ? (
                    <button
                        type="submit"
                        disabled={!input.trim() || isAnalyzing}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isSuccess
                            ? 'bg-lime-500 scale-110'
                            : 'bg-lime-500 hover:bg-lime-400 active:scale-95'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isAnalyzing ? (
                            <Sparkles className="w-5 h-5 text-zinc-950 animate-spin" />
                        ) : isSuccess ? (
                            <CheckCircle2 className="w-5 h-5 text-zinc-950" />
                        ) : (
                            <Send className="w-5 h-5 text-zinc-950" />
                        )}
                    </button>
                ) : (
                    <Button
                        type="submit"
                        disabled={!input.trim() || isAnalyzing}
                        isLoading={isAnalyzing}
                        variant="primary"
                        className={`rounded-xl w-12 h-12 p-0 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all duration-300 ${isSuccess ? 'bg-lime-400 scale-110' : 'hover:scale-105 active:scale-95'}`}
                    >
                        {!isAnalyzing && (
                            isSuccess ? (
                                <CheckCircle2 className="w-6 h-6 text-zinc-950" />
                            ) : (
                                <div className="relative">
                                    <Send className="w-6 h-6 text-zinc-950" />
                                </div>
                            )
                        )}
                    </Button>
                )}
            </div>
        </form>
    );
};
