'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    emoji?: string;
    showBack?: boolean;
}

export function PageHeader({ title, emoji, showBack = true }: PageHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/50">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                )}

                <div className="flex-1 flex items-center gap-2">
                    {emoji && <span className="text-xl">{emoji}</span>}
                    <h1 className="font-bold text-white">{title}</h1>
                </div>

                <Link
                    href="/"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    aria-label="Home"
                >
                    <Home className="w-5 h-5 text-zinc-400" />
                </Link>
            </div>
        </header>
    );
}
