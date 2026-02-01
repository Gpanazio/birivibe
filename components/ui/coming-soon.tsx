'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Construction } from 'lucide-react';

interface ComingSoonPageProps {
    title: string;
    emoji?: string;
    description?: string;
}

export function ComingSoonPage({ title, emoji = '🚧', description }: ComingSoonPageProps) {
    return (
        <div className="min-h-screen bg-black text-white">
            <PageHeader title={title} emoji={emoji} />

            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                <div className="text-6xl mb-6 animate-bounce">🚧</div>

                <h2 className="text-2xl font-black text-white mb-2">Em Breve</h2>

                <p className="text-zinc-500 text-sm max-w-xs">
                    {description || `O módulo ${title} está sendo construído. Volte em breve!`}
                </p>

                <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full">
                    <Construction className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-zinc-400">Em desenvolvimento</span>
                </div>
            </div>
        </div>
    );
}
