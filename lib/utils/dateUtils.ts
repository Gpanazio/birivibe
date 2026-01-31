export function getLocalDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function getEffectiveDateString(): string {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 3) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }
  
  return now.toISOString().split("T")[0];
}

export function formatDateBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return d.toLocaleDateString("pt-BR");
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
