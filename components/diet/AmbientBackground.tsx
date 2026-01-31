import React from 'react';

export const AmbientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-950">
            {/* Primary Brand Orb (Lime/Green) - Top Right */}
            <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-lime-500/20 blur-[100px] animate-float-slow opacity-60 mix-blend-screen" />

            {/* Secondary Accent Orb (Purple/Blue) - Bottom Left */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[100px] animate-float-slower opacity-50 mix-blend-screen" />

            {/* Tertiary Highlight (Cyan/Blue) - Center/Variable */}
            <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[80px] animate-pulse-slow opacity-40 mix-blend-screen" />

            {/* Noise Texture Overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};
