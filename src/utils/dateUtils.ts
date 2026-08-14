export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export function formatDueDateDisplay(dateStr?: string): {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!dateStr) {
    return { text: 'Sem data', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const targetDate = parseDateString(dateStr);
  if (!targetDate) {
    return { text: dateStr, isOverdue: false, isToday: false, isTomorrow: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const isToday = target.getTime() === today.getTime();
  const isTomorrow = target.getTime() === tomorrow.getTime();
  const isYesterday = target.getTime() === yesterday.getTime();
  const isOverdue = target.getTime() < today.getTime();

  if (isToday) {
    return { text: 'Hoje', isOverdue: false, isToday: true, isTomorrow: false };
  }
  if (isTomorrow) {
    return { text: 'Amanhã', isOverdue: false, isToday: false, isTomorrow: true };
  }
  if (isYesterday) {
    return { text: 'Ontem (Atrasada)', isOverdue: true, isToday: false, isTomorrow: false };
  }

  // Format: "15 de Ago" ou "15 de Ago, 2026"
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const day = target.getDate();
  const month = months[target.getMonth()];
  const year = target.getFullYear();
  const currentYear = today.getFullYear();

  const formatted = year === currentYear ? `${day} de ${month}` : `${day} de ${month}, ${year}`;

  return {
    text: formatted,
    isOverdue,
    isToday,
    isTomorrow,
  };
}

export function getCalendarGrid(year: number, month: number) {
  // month: 0-indexed (0 = Jan, 11 = Dec)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 0 = Domingo, 1 = Segunda, etc.
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const days: Array<{
    dateString: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  const todayStr = getTodayDateString();

  // Dias do mês anterior para preencher a primeira semana
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const mStr = String(prevMonth + 1).padStart(2, '0');
    const dStr = String(prevDay).padStart(2, '0');
    const dateString = `${prevYear}-${mStr}-${dStr}`;

    days.push({
      dateString,
      dayNumber: prevDay,
      isCurrentMonth: false,
      isToday: dateString === todayStr,
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= totalDays; i++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    const dateString = `${year}-${mStr}-${dStr}`;

    days.push({
      dateString,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateString === todayStr,
    });
  }

  // Dias do próximo mês para completar grade de 35 ou 42 células
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const mStr = String(nextMonth + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    const dateString = `${nextYear}-${mStr}-${dStr}`;

    days.push({
      dateString,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateString === todayStr,
    });
  }

  return days;
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAY_NAMES_PT = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];
