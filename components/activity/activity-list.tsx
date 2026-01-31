"use client";

interface Activity {
  id: string;
  name: string;
  colorCode: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-600 text-sm">
        Nenhum hábito cadastrado
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 p-3 hover:bg-zinc-900/50 transition-colors"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activity.colorCode }}
          />
          <span className="text-sm text-zinc-300">{activity.name}</span>
        </div>
      ))}
    </div>
  );
}
