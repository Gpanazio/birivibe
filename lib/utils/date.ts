/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
export function getLocalDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Retorna a data "efetiva" considerando que refeições entre meia-noite e 3h
 * devem ser contadas como do dia anterior (padrão do Biridiet)
 */
export function getEffectiveDateString(): string {
  const now = new Date();
  const hour = now.getHours();
  
  // Se for entre 0h e 3h, considera como dia anterior
  if (hour < 3) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }
  
  return now.toISOString().split("T")[0];
}

/**
 * Formata uma data para exibição (DD/MM/YYYY)
 */
export function formatDateBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

/**
 * Retorna o início da semana (segunda-feira)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
