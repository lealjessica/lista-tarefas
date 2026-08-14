import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types/task';
import {
  getCalendarGrid,
  MONTH_NAMES_PT,
  WEEKDAY_NAMES_PT,
} from '../../utils/dateUtils';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { DayTaskModal } from './DayTaskModal';

export const CalendarView: React.FC = () => {
  const { tasks } = useTasks();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Estado para o modal do dia selecionado
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Navegação de mês
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Grade de dias gerada
  const calendarDays = useMemo(
    () => getCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Mapeamento de tarefas por data YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (task.dueDate) {
        const list = map.get(task.dueDate) || [];
        list.push(task);
        map.set(task.dueDate, list);
      }
    });
    return map;
  }, [tasks]);

  const handleDayClick = (dateString: string) => {
    setSelectedDayDate(dateString);
    setIsDayModalOpen(true);
  };

  const selectedDayTasks = selectedDayDate ? tasksByDate.get(selectedDayDate) || [] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header do Módulo de Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/5 to-transparent p-5 sm:p-6 rounded-3xl border border-emerald-100/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Visão em Calendário
            </h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Planejamento
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualize os prazos e organize suas entregas ao longo do mês.
          </p>
        </div>

        {/* Controles de Navegação de Mês */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-subtle transition-all"
          >
            Hoje
          </button>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-subtle p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[130px] text-center">
              {MONTH_NAMES_PT[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grade do Calendário */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden p-4 sm:p-6">
        {/* Cabeçalho dos Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {WEEKDAY_NAMES_PT.map((dayName, idx) => (
            <div
              key={dayName}
              className={`py-2 text-xs font-bold uppercase tracking-wider ${
                idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Dias do Mês */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const dayTasks = tasksByDate.get(day.dateString) || [];

            return (
              <div
                key={day.dateString}
                onClick={() => handleDayClick(day.dateString)}
                className={`min-h-[85px] sm:min-h-[110px] p-1.5 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  day.isToday
                    ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-100 shadow-sm'
                    : day.isCurrentMonth
                    ? 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/70 hover:shadow-subtle'
                    : 'bg-slate-50/40 border-slate-100/60 text-slate-300 opacity-60'
                }`}
              >
                {/* Número do Dia + Indicador */}
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      day.isToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : day.isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Miniaturas de Tarefas */}
                <div className="space-y-1 my-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((task) => {
                    const cat = DEFAULT_CATEGORIES.find(
                      (c) => c.id.toLowerCase() === task.category.toLowerCase()
                    );
                    const dotClass = cat?.color?.dot || 'bg-slate-400';

                    return (
                      <div
                        key={task.id}
                        className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md truncate font-medium flex items-center gap-1 ${
                          task.completed
                            ? 'line-through bg-slate-100 text-slate-400'
                            : 'bg-slate-100/80 text-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}

                  {dayTasks.length > 2 && (
                    <div className="text-[9px] font-semibold text-slate-400 pl-1">
                      +{dayTasks.length - 2} mais
                    </div>
                  )}
                </div>

                {/* Ação rápida hover */}
                <div className="hidden group-hover:flex items-center justify-end text-[10px] text-indigo-600 font-semibold pt-1">
                  <span>Ver dia</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de tarefas do dia selecionado */}
      <DayTaskModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        dateString={selectedDayDate}
        tasksForDay={selectedDayTasks}
      />
    </div>
  );
};
