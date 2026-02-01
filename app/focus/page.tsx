'use client';

import { FocusSession, Project, Task } from '@prisma/client';
import { useState, useEffect, useCallback } from 'react';

export default function FocusPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [duration, setDuration] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // TODO: Replace with fetch() to API route
    console.log('fetchData called - needs API implementation');
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentSessionId) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [isRunning, currentSessionId]);

  const endSession = useCallback(async () => {
    if (!currentSessionId || !isRunning) return;
    // TODO: Replace with fetch() to API route
    console.log('endSession called - needs API implementation');
    setIsRunning(false);
    setCurrentSessionId(null);
  }, [currentSessionId, isRunning]);

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      endSession();
    }
  }, [timeLeft, isRunning, endSession]);

  const startSession = async () => {
    // TODO: Replace with fetch() to API route POST /api/focus-sessions
    if (!sessionName.trim()) return;
    console.log('startSession called - needs API implementation');

    // Simulate session creation
    const fakeId = `session-${Date.now()}`;
    setCurrentSessionId(fakeId);
    setIsRunning(true);
    setTimeLeft(duration * 60);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    if (!e.target.value) {
      setSelectedTask(null);
    }
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTask(e.target.value);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Modo Hiperfoco</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Session Form */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Nova Sessão de Foco</h2>
            <form onSubmit={(e) => { e.preventDefault(); startSession(); }}>
              <div className="mb-4">
                <label htmlFor="session-name" className="block text-sm font-medium mb-1">
                  Nome da Sessão
                </label>
                <input
                  type="text"
                  id="session-name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Ex: Revisão de código, Escrita criativa"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Duração (min)
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={90}>90 (Pomodoro Estendido)</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="project" className="block text-sm font-medium mb-1">
                  Projeto
                </label>
                <select
                  id="project"
                  value={selectedProject || ''}
                  onChange={handleProjectChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Nenhum</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="mb-4">
                  <label htmlFor="task" className="block text-sm font-medium mb-1">
                    Tarefa
                  </label>
                  <select
                    id="task"
                    value={selectedTask || ''}
                    onChange={handleTaskChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Nenhuma</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={!sessionName.trim() || isRunning}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 ${!sessionName.trim() || isRunning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isRunning ? 'Sessão em Andamento...' : 'Iniciar Sessão'}
              </button>
            </form>
          </div>

          {/* Timer Display */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Tempo Restante</h2>
            <div className="flex justify-center items-center h-32">
              <div className="relative w-full max-w-xs">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={isRunning ? '#8b5cf6' : '#374151'}
                    strokeWidth="2"
                    strokeDasharray="300"
                    strokeDashoffset={300 - (timeLeft / (duration * 60) * 300)}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-2xl font-bold">
                {Math.floor(timeLeft / 60)}:
                {('0' + Math.floor(timeLeft % 60)).slice(-2)}
              </span>
            </div>

            {!isRunning && currentSessionId ? (
              <button
                onClick={endSession}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded mt-4 transition-colors duration-200"
              >
                Finalizar Sessão
              </button>
            ) : null}
          </div>

          {/* Session History */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Histórico de Sessões</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-400">Nenhuma sessão registrada ainda.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-800 rounded p-2 border border-gray-700 flex items-center justify-between"
                  >
                    <span className="font-medium">{session.name}</span>
                    <div className="text-sm text-gray-400">
                      {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      -{' '}
                      {session.duration ? `${Math.floor(session.duration / 60)} min` : 'Em andamento'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 border-t border-gray-800 text-sm text-gray-400">
        <p>Modo Hiperfoco - Focado em produtividade e bem-estar</p>
      </footer>
    </div>
  );
}