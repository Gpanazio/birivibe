"use client";

export const runtime = 'nodejs';

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Check, SkipForward, Pause, Play,
  Clock, X, ChevronRight
} from "lucide-react";

interface RoutineStep {
  id: string;
  name: string;
  duration?: number;
  type: string;
  isOptional: boolean;
  icon?: string;
}

interface Routine {
  id: string;
  name: string;
  color: string;
  steps: RoutineStep[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function PlayRoutinePage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [logId, setLogId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepTime, setStepTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch routine and start log
  useEffect(() => {
    const startRoutine = async () => {
      try {
        const routineRes = await fetch(`/api/routines/${routineId}`);
        if (routineRes.ok) {
          const data = await routineRes.json() as any;
          setRoutine(data);

          // Start log
          const logRes = await fetch(`/api/routines/${routineId}/start`, {
            method: "POST",
          });
          if (logRes.ok) {
            const log = await logRes.json() as any;
            setLogId(log.id);
          }
        }
      } catch (error) {
        console.error("Failed to start routine:", error);
      } finally {
        setIsLoading(false);
        setIsRunning(true);
      }
    };
    startRoutine();
  }, [routineId]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setStepTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  const currentStep = routine?.steps[currentStepIndex];
  const progress = routine ? (completedSteps.length / routine.steps.length) * 100 : 0;

  const handleCompleteStep = useCallback(async () => {
    if (!routine || !currentStep) return;

    const newCompleted = [...completedSteps, currentStep.id];
    setCompletedSteps(newCompleted);

    // Update log
    if (logId) {
      fetch(`/api/routines/logs/${logId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepsCompleted: newCompleted }),
      });
    }

    // Next step or complete
    if (currentStepIndex < routine.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepTime(0);
    } else {
      // Routine completed
      setIsCompleted(true);
      setIsRunning(false);

      if (logId) {
        await fetch(`/api/routines/logs/${logId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepsCompleted: newCompleted,
            completed: true,
            duration: Math.floor(elapsedTime / 60),
          }),
        });
      }
    }
  }, [routine, currentStep, completedSteps, currentStepIndex, logId, elapsedTime]);

  const handleSkipStep = () => {
    if (!routine) return;

    if (currentStepIndex < routine.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepTime(0);
    }
  };

  const handleExit = async () => {
    if (logId && completedSteps.length > 0) {
      await fetch(`/api/routines/logs/${logId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepsCompleted: completedSteps,
          duration: Math.floor(elapsedTime / 60),
        }),
      });
    }
    router.push("/routines");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 animate-pulse text-lg">Iniciando rotina...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Rotina não encontrada</div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce">🎉</div>
          <h1 className="text-3xl font-black text-white">Rotina Completa!</h1>
          <div className="space-y-2 text-zinc-400">
            <p>{completedSteps.length}/{routine.steps.length} passos completados</p>
            <p>Tempo total: {formatTime(elapsedTime)}</p>
          </div>
          <button
            onClick={() => router.push("/routines")}
            className="px-8 py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-400"
          >
            Voltar às Rotinas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: `${routine.color}10` }}
    >
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={handleExit}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">{routine.name}</p>
          <p className="text-2xl font-mono font-bold text-white">{formatTime(elapsedTime)}</p>
        </div>

        <button
          onClick={() => setIsRunning(prev => !prev)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: routine.color }}
          />
        </div>
        <p className="text-center text-xs text-zinc-500 mt-2">
          {completedSteps.length}/{routine.steps.length} passos
        </p>
      </div>

      {/* Current Step */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div
          className="text-8xl mb-6"
          style={{ filter: `drop-shadow(0 0 30px ${routine.color}50)` }}
        >
          {currentStep?.icon || "📌"}
        </div>

        <h2 className="text-3xl font-black text-white mb-2">
          {currentStep?.name}
        </h2>

        {currentStep?.duration && (
          <div className="flex items-center gap-2 text-zinc-400 mb-4">
            <Clock className="w-4 h-4" />
            <span>{currentStep.duration} min recomendado</span>
          </div>
        )}

        <p className="text-lg font-mono text-zinc-500">
          {formatTime(stepTime)} neste passo
        </p>

        {currentStep?.isOptional && (
          <span className="mt-4 px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
            Passo opcional
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={handleCompleteStep}
          className="w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          style={{ backgroundColor: routine.color }}
        >
          <Check className="w-6 h-6" />
          {currentStepIndex === routine.steps.length - 1 ? "Finalizar Rotina" : "Completar Passo"}
        </button>

        {currentStep?.isOptional && currentStepIndex < routine.steps.length - 1 && (
          <button
            onClick={handleSkipStep}
            className="w-full py-4 bg-zinc-900 text-zinc-400 rounded-2xl font-medium flex items-center justify-center gap-2"
          >
            <SkipForward className="w-5 h-5" />
            Pular
          </button>
        )}
      </div>

      {/* Steps Preview */}
      <div className="px-4 pb-6">
        <div className="flex gap-1 justify-center">
          {routine.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`w-8 h-1.5 rounded-full transition-all ${isCompleted
                    ? ""
                    : isCurrent
                      ? "bg-white"
                      : "bg-zinc-800"
                  }`}
                style={{
                  backgroundColor: isCompleted ? routine.color : undefined
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
