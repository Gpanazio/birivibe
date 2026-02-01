// Templates de rotina pré-definidos

export interface TemplateStep {
  name: string;
  icon: string;
  duration: number;
  type: string;
  isOptional: boolean;
}

export interface RoutineTemplate {
  name: string;
  description: string;
  type: string;
  color: string;
  icon: string;
  startTime: string;
  steps: TemplateStep[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    name: "Manhã Produtiva",
    description: "Comece o dia com energia, clareza mental e foco. Do despertar ao trabalho.",
    type: "morning",
    color: "#f97316",
    icon: "🌅",
    startTime: "06:00",
    steps: [
      { name: "Despertar gradual", icon: "☀️", duration: 5, type: "task", isOptional: false },
      { name: "Beber água", icon: "💧", duration: 2, type: "habit", isOptional: false },
      { name: "Alongamento leve", icon: "🤸", duration: 10, type: "task", isOptional: false },
      { name: "Meditação / Respiração", icon: "🧘", duration: 10, type: "habit", isOptional: true },
      { name: "Banho revigorante", icon: "🚿", duration: 15, type: "task", isOptional: false },
      { name: "Skincare manhã", icon: "🧴", duration: 5, type: "task", isOptional: true },
      { name: "Café da manhã nutritivo", icon: "🍳", duration: 20, type: "task", isOptional: false },
      { name: "Revisar agenda do dia", icon: "📅", duration: 10, type: "task", isOptional: false },
      { name: "Definir 3 prioridades", icon: "🎯", duration: 5, type: "task", isOptional: false },
      { name: "Preparar ambiente de trabalho", icon: "💻", duration: 5, type: "task", isOptional: false },
    ],
  },
  {
    name: "Noite de Descanso",
    description: "Desacelere para um sono reparador. Do jantar à cama.",
    type: "evening",
    color: "#8b5cf6",
    icon: "🌙",
    startTime: "20:00",
    steps: [
      { name: "Jantar leve", icon: "🥗", duration: 30, type: "task", isOptional: false },
      { name: "Caminhada leve / Digestão", icon: "🚶", duration: 15, type: "task", isOptional: true },
      { name: "Desligar telas", icon: "📵", duration: 1, type: "task", isOptional: false },
      { name: "Preparar roupa do dia seguinte", icon: "👔", duration: 5, type: "task", isOptional: true },
      { name: "Chá relaxante", icon: "🍵", duration: 10, type: "task", isOptional: true },
      { name: "Skincare noite", icon: "✨", duration: 10, type: "task", isOptional: false },
      { name: "Escovar dentes", icon: "🦷", duration: 3, type: "task", isOptional: false },
      { name: "Leitura relaxante", icon: "📖", duration: 20, type: "habit", isOptional: false },
      { name: "Gratidão / Journaling", icon: "📝", duration: 5, type: "habit", isOptional: true },
      { name: "Meditação para dormir", icon: "😴", duration: 10, type: "habit", isOptional: true },
      { name: "Apagar luzes", icon: "🌑", duration: 1, type: "task", isOptional: false },
    ],
  },
  {
    name: "Deep Work - Foco Total",
    description: "Blocos de trabalho profundo intercalados com pausas estratégicas.",
    type: "work",
    color: "#3b82f6",
    icon: "💻",
    startTime: "09:00",
    steps: [
      { name: "Revisar agenda e metas", icon: "📋", duration: 10, type: "task", isOptional: false },
      { name: "Limpar notificações", icon: "🔔", duration: 5, type: "task", isOptional: false },
      { name: "🔥 Deep Work Bloco 1", icon: "🎯", duration: 90, type: "timeblock", isOptional: false },
      { name: "Pausa ativa (alongar)", icon: "🧘", duration: 10, type: "break", isOptional: false },
      { name: "Hidratação + Snack", icon: "☕", duration: 10, type: "break", isOptional: false },
      { name: "🔥 Deep Work Bloco 2", icon: "🎯", duration: 90, type: "timeblock", isOptional: false },
      { name: "Almoço mindful", icon: "🍽️", duration: 45, type: "break", isOptional: false },
      { name: "Caminhada / Descanso", icon: "🚶", duration: 15, type: "break", isOptional: true },
      { name: "🔥 Deep Work Bloco 3", icon: "🎯", duration: 60, type: "timeblock", isOptional: true },
      { name: "Revisar progresso do dia", icon: "✅", duration: 10, type: "task", isOptional: false },
      { name: "Planejar amanhã", icon: "📅", duration: 10, type: "task", isOptional: false },
    ],
  },
  {
    name: "Treino Completo",
    description: "Do aquecimento ao recovery. Treino estruturado para resultados.",
    type: "workout",
    color: "#22c55e",
    icon: "💪",
    startTime: "07:00",
    steps: [
      { name: "Pré-treino (café/suplemento)", icon: "⚡", duration: 10, type: "task", isOptional: true },
      { name: "Vestir roupa de treino", icon: "👟", duration: 5, type: "task", isOptional: false },
      { name: "Aquecimento articular", icon: "🔄", duration: 5, type: "task", isOptional: false },
      { name: "Aquecimento cardio leve", icon: "🏃", duration: 5, type: "task", isOptional: false },
      { name: "Alongamento dinâmico", icon: "🤸", duration: 5, type: "task", isOptional: false },
      { name: "🔥 Treino Principal", icon: "💪", duration: 45, type: "task", isOptional: false },
      { name: "Cardio / HIIT", icon: "❤️‍🔥", duration: 15, type: "task", isOptional: true },
      { name: "Alongamento estático", icon: "🧘", duration: 10, type: "task", isOptional: false },
      { name: "Shake proteico", icon: "🥤", duration: 5, type: "task", isOptional: false },
      { name: "Banho pós-treino", icon: "🚿", duration: 15, type: "task", isOptional: false },
      { name: "Registrar treino", icon: "📝", duration: 5, type: "task", isOptional: true },
    ],
  },
  {
    name: "Domingo Regenerativo",
    description: "Um dia para descansar, refletir e se preparar para a semana.",
    type: "custom",
    color: "#ec4899",
    icon: "🌸",
    startTime: "09:00",
    steps: [
      { name: "Acordar sem alarme", icon: "😴", duration: 0, type: "task", isOptional: false },
      { name: "Café da manhã especial", icon: "🥐", duration: 30, type: "task", isOptional: false },
      { name: "Limpeza leve da casa", icon: "🧹", duration: 30, type: "task", isOptional: true },
      { name: "Autocuidado (banho longo)", icon: "🛁", duration: 30, type: "task", isOptional: false },
      { name: "Hobby / Lazer pessoal", icon: "🎨", duration: 60, type: "task", isOptional: false },
      { name: "Almoço especial", icon: "🍝", duration: 45, type: "task", isOptional: false },
      { name: "Descanso / Cochilo", icon: "😴", duration: 30, type: "break", isOptional: true },
      { name: "Natureza / Passeio", icon: "🌳", duration: 60, type: "task", isOptional: true },
      { name: "Revisar semana passada", icon: "📊", duration: 15, type: "task", isOptional: false },
      { name: "Planejar semana", icon: "📅", duration: 20, type: "task", isOptional: false },
      { name: "Preparar para segunda", icon: "👔", duration: 15, type: "task", isOptional: false },
    ],
  },
];
