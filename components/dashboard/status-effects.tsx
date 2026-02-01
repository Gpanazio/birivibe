'use client';

import { useState, useEffect } from 'react';

// Placeholder component - statusEffect model needs to be added to Prisma schema
export default function StatusEffects() {
  const [effects] = useState<{ id: string; name: string; severity: string; active: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API route for fetching status effects when model is available
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="animate-pulse text-gray-500">Loading...</div>;

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3">Status Effects</h3>
      {effects.length === 0 ? (
        <p className="text-gray-400 text-sm">No active status effects</p>
      ) : (
        <div className="space-y-2">
          {effects.map((effect) => (
            <div key={effect.id} className={`flex items-center p-2 rounded-md transition-all duration-300 ${effect.severity === 'grave'
                ? 'bg-red-900/50 border border-red-700'
                : effect.severity === 'moderado'
                  ? 'bg-yellow-900/50 border border-yellow-700'
                  : 'bg-green-900/50 border border-green-700'
              }`}>
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              <span className="text-white text-sm flex-grow">{effect.name}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${effect.active ? 'bg-green-600' : 'bg-gray-700'
                  }`}
              >
                {effect.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}