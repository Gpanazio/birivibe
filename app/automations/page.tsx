import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AutomationsPage() {
  const userId = 'user-id-here'; // Substitua pelo ID do usuário autenticado

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Automações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Criar Automação de Horário</h2>
          <form action="/automations" method="POST" className="space-y-4">
            <input type="hidden" name="userId" value={userId} />
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Horário de sono"
              />
            </div>
            <div>
              <label htmlFor="triggerType" className="block text-sm font-medium mb-1">Tipo de Trigger</label>
              <select
                id="triggerType"
                name="triggerType"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="time">Horário específico</option>
                <option value="daily_time_range">Faixa diária</option>
              </select>
            </div>
            <div id="time-trigger-fields">
              <label htmlFor="triggerTime" className="block text-sm font-medium mb-1">Horário (HH:MM)</label>
              <input
                type="text"
                id="triggerTime"
                name="triggerData"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 21:30 para horário de dormir"
              />
            </div>
            <div id="daily-time-range-fields" style={{ display: 'none' }}>
              <label htmlFor="startTime" className="block text-sm font-medium mb-1">Horário Inicial</label>
              <input
                type="text"
                id="startTime"
                name="triggerDataStart"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 21:00"
              />
              <label htmlFor="endTime" className="block text-sm font-medium mb-1 mt-2">Horário Final</label>
              <input
                type="text"
                id="endTime"
                name="triggerDataEnd"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 22:30"
              />
            </div>
            <div>
              <label htmlFor="actionType" className="block text-sm font-medium mb-1">Ação</label>
              <select
                id="actionType"
                name="actionType"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="show_habit">Mostrar Hábito</option>
                <option value="start_routine">Iniciar Rotina</option>
                <option value="send_notification">Enviar Notificação</option>
              </select>
            </div>
            <div id="action-data-fields">
              {/*
                Campos dinâmicos para diferentes tipos de ação
                Serão adicionados via JavaScript
              */}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Criar Automação
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Suas Automações</h2>
          {await getUserAutomations()}
        </div>
      </div>
    </div>
  );
}

async function getUserAutomations() {
  const userId = 'user-id-here'; // Substitua pelo ID do usuário autenticado
  const automations = await db.automation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (automations.length === 0) {
    return <p className="text-gray-500">Nenhuma automação criada ainda.</p>;
  }

  return (
    <div className="space-y-4">
      {automations.map(automation => (
        <div key={automation.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-indigo-600">{automation.name}</h3>
            {automations.indexOf(automation) === 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ativa</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {automation.triggerType === 'time' ? (
              `Trigger: ${JSON.parse(automation.triggerData).time}`
            ) : (
              `Trigger: ${JSON.parse(automation.triggerData).startTime} - ${JSON.parse(automation.triggerData).endTime}`
            )}
          </p>
          <div className="flex space-x-2">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Editar</button>
            <button className="text-sm text-red-500 hover:text-red-700">Desativar</button>
          </div>
        </div>
      ))}
    </div>
  );
}