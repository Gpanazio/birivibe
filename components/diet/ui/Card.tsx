import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  emoji?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, emoji }) => {
  return (
    <div className={`bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden shadow-xl ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center gap-2 bg-zinc-900/50">
          {emoji && <span className="text-xl">{emoji}</span>}
          <h3 className="text-lg font-bold text-zinc-100 font-display tracking-wide">{title}</h3>
        </div>
      )}
      <div className="p-5 md:p-6">
        {children}
      </div>
    </div>
  );
};