import { db } from '@/lib/db';
import { User, Goal, Habit, Ritual, Transaction, SleepLog, MoodLog, JournalEntry, FocusSession, Project, Task, WeeklyGoal, Automation, Context, Routine, RitualLog, TimeBlock, NutritionGoal, WeightLog, BodyMetric, ProgressPhoto, Workout, ExerciseLog, TemplateExercise, WorkoutTemplate, Medication, MedicationLog, HealthCondition, Appointment, HealthProfessional } from '@prisma/client';

export default async function SkillsPage() {
  const [userId] = (await db.user.findMany({ select: { id: true }, take: 1 }))[0]?.id || '';

  // Físico
  const physicalSkills = await db.$transaction([
    db.goal.count({ where: { userId, area: 'saúde' } }),
    db.habit.count({ where: { userId, category: 'Corpo' } }),
    db.ritual.count({ where: { userId, frequency: { contains: 'weekly' }, name: { contains: 'treino' } } }),
    db.workout.count({ where: { userId } }),
    db.bodyMetric.count({ where: { userId } }),
    db.progressPhoto.count({ where: { userId } }),
    db.weightLog.count({ where: { userId } }),
  ]);

  // Mental
  const mentalSkills = await db.$transaction([
    db.goal.count({ where: { userId, area: 'mente' } }),
    db.habit.count({ where: { userId, category: 'Mente' } }),
    db.ritual.count({ where: { userId, frequency: { contains: 'weekly' }, name: { contains: 'meditação' } } }),
    db.moodLog.count({ where: { userId } }),
    db.journalEntry.count({ where: { userId } }),
    db.sleepLog.count({ where: { userId } }),
  ]);

  // Financeiro
  const financialSkills = await db.$transaction([
    db.goal.count({ where: { userId, area: 'finanças' } }),
    db.habit.count({ where: { userId, category: 'Financeiro' } }),
    db.transaction.count({ where: { userId } }),
    db.automation.count({ where: { userId, triggerType: 'goal_progress', actionType: 'add_xp' }, name: { contains: 'financeiro' } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Skill Tree</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Físico */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Físico</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Objetivos de Saúde</span>
              <span className="font-medium">{physicalSkills[0]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Hábitos Físicos</span>
              <span className="font-medium">{physicalSkills[1]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Rituais de Treino</span>
              <span className="font-medium">{physicalSkills[2]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Treinos Realizados</span>
              <span className="font-medium">{physicalSkills[3]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Métricas Corporais</span>
              <span className="font-medium">{physicalSkills[4]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Fotos de Progresso</span>
              <span className="font-medium">{physicalSkills[5]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Registros de Peso</span>
              <span className="font-medium">{physicalSkills[6]}</span>
            </div>
          </div>
        </div>

        {/* Mental */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mental</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Objetivos Mentais</span>
              <span className="font-medium">{mentalSkills[0]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Hábitos Mentais</span>
              <span className="font-medium">{mentalSkills[1]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Rituais de Meditação</span>
              <span className="font-medium">{mentalSkills[2]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Registros de Humor</span>
              <span className="font-medium">{mentalSkills[3]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Entradas no Diário</span>
              <span className="font-medium">{mentalSkills[4]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Registros de Sono</span>
              <span className="font-medium">{mentalSkills[5]}</span>
            </div>
          </div>
        </div>

        {/* Financeiro */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financeiro</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Objetivos Financeiros</span>
              <span className="font-medium">{financialSkills[0]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Hábitos Financeiros</span>
              <span className="font-medium">{financialSkills[1]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Transações Registradas</span>
              <span className="font-medium">{financialSkills[2]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Automações Financeiras</span>
              <span className="font-medium">{financialSkills[3]}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}