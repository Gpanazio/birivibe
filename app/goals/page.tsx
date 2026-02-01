import { db } from '@/lib/db';
import { Goal } from '@prisma/client';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

// Type for Goal with its children relation
type GoalWithChildren = Goal & { children?: Goal[] };

async function getGoals(): Promise<GoalWithChildren[]> {
  return db.goal.findMany({
    where: { userId: 'current-user-id' },
    orderBy: { updatedAt: 'desc' },
    include: { children: true }
  }) as Promise<GoalWithChildren[]>;
}

function GoalProgressBar({ progress }: { progress: number }) {
  const barWidth = `${progress}%`;
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
        style={{ width: barWidth }}
      />
    </div>
  );
}

function GoalCard({ goal }: { goal: GoalWithChildren }) {
  const isCompleted = goal.status === 'completed';
  const progress = isCompleted ? 100 : Math.min(goal.progress, 99);

  return (
    <div className="bg-gray-850/20 border border-gray-700 rounded-xl p-4 mb-3 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">{goal.name}</h3>
          {goal.description && (
            <p className="text-gray-400 text-xs mt-1 max-w-[250px] line-clamp-2">
              {goal.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <GoalProgressBar progress={progress} />
          <span className="text-xs text-gray-400">
            {isCompleted ? 'Concluído' : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {goal.area && (
          <span className={`text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded-full`}>
            {goal.area}
          </span>
        )}
        {isCompleted ? (
          <CheckCircle2 className="h-3 w-3 text-green-400" />
        ) : (
          <XCircle className="h-3 w-3 text-red-400" />
        )}
      </div>

      {goal.children && goal.children.length > 0 && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <p className="text-xs text-gray-500 mb-1">Sub-metas ({goal.children.length})</p>
          <div className="flex gap-1">
            {goal.children.slice(0, 3).map((child) => (
              <span
                key={child.id}
                className={`text-xs px-2 py-0.5 rounded-full ${child.status === 'completed'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-gray-700/50 text-gray-300'
                  }`}
              >
                {child.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <Suspense fallback={<div className="text-center text-gray-400">Carregando...</div>}>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-850 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Link>

          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>Você ainda não tem metas cadastradas.</p>
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Criar Meta
                </button>
              </div>
            ) : (
              goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Dicas para TDAH</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Use metas específicas e mensuráveis (ex: &quot;Ler 10 páginas por dia&quot;)</li>
              <li>• Divida metas grandes em sub-metas menores</li>
              <li>• Estableça prazos curtos para evitar procrastinação</li>
            </ul>
          </div>
        </div>
      </main>
    </Suspense>
  );
}