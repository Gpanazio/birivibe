'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface NeedBarProps {
  type: 'energy' | 'health' | 'mood' | 'hunger';
  value: number;
  maxValue?: number;
  color: string;
}

const NeedBar = ({ type, value, maxValue = 10, color }: NeedBarProps) => {
  const [progress, setProgress] = useState(value);
  const { data: session } = useSession();

  // Update progress based on value prop
  useEffect(() => {
    if (!session?.user?.id) return;
    // TODO: Replace with fetch() to API route to get real-time metric updates
    // For now, just use the initial value passed in
    setProgress(Math.min(maxValue, Math.max(0, value)));
  }, [session?.user?.id, value, maxValue]);

  const getLabel = () => {
    switch (type) {
      case 'energy':
        return progress < 3 ? '😴' : progress < 7 ? '⚡' : '🔥';
      case 'health':
        return progress < 4 ? '❤️' : progress < 8 ? '✅' : '💪';
      case 'mood':
        return progress < 3 ? '😢' : progress < 7 ? '😊' : '😃';
      default:
        return progress < 4 ? '🍽️' : progress < 8 ? '🍴' : '🍔';
    }
  };

  const getStatus = () => {
    if (progress <= 2) return 'Critical';
    if (progress <= 5) return 'Low';
    if (progress >= 8) return 'High';
    return 'Normal';
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-4/5 h-12 bg-gray-700 rounded-full overflow-hidden relative">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ease-in-out`}
          style={{
            width: `${(progress / maxValue) * 100}%`,
            background: color,
          }}
        />
      </div>
      <div className="flex items-center mt-2 text-sm">
        <span className={`mr-2 ${getStatus() === 'Critical' ? 'text-red-400' :
          getStatus() === 'Low' ? 'text-yellow-300' :
            getStatus() === 'High' ? 'text-blue-300' : ''}`}>
          {getLabel()}
        </span>
        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span className={`ml-auto px-2 py-px rounded text-xs ${getStatus() === 'Critical' ? 'bg-red-500 text-white' :
          getStatus() === 'Low' ? 'bg-yellow-400 text-black' :
            getStatus() === 'High' ? 'bg-blue-400 text-white' : 'bg-gray-600 text-gray-200'}`}>
          {getStatus()}
        </span>
      </div>
    </div>
  );
};

export default function NeedsBars() {
  const [needs, setNeeds] = useState({
    energy: 7,
    health: 8,
    mood: 6,
    hunger: 5,
  });

  const { data: session } = useSession();

  // Fetch initial data from API
  useEffect(() => {
    async function fetchInitialData() {
      if (!session?.user?.id) return;

      try {
        // TODO: Replace with fetch() to API route /api/needs-status
        // For now, use simulated data
        setNeeds({
          energy: Math.floor(Math.random() * 4) + 5,
          health: Math.floor(Math.random() * 3) + 6,
          mood: Math.floor(Math.random() * 4) + 4,
          hunger: Math.floor(Math.random() * 5) + 2,
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }

    fetchInitialData();
  }, [session?.user?.id]);

  return (
    <div className="space-y-3">
      <NeedBar type="energy" value={needs.energy} color="#f97316" />
      <NeedBar type="health" value={needs.health} color="#84cc16" />
      <NeedBar type="mood" value={needs.mood} color="#0ea5e9" />
      <NeedBar type="hunger" value={needs.hunger} color="#8b5cf6" />
    </div>
  );
}