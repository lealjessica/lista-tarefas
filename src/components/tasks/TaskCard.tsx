import React from 'react';
import {
  Calendar,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { CustomCheckbox } from '../common/CustomCheckbox';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { formatDueDateDisplay } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTask, openEditModal, requestDeleteTask } = useTasks();

  const dueInfo = formatDueDateDisplay(task.dueDate);

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-65'
          : 'bg-white border-slate-200/80 shadow-subtle hover:shadow-card hover:border-slate-300'
      }`}
    >
      {/* 1. Checkbox Customizado no lado esquerdo */}
      <div className="pt-0.5 shrink-0">
        <CustomCheckbox
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          ariaLabel={`Marcar "${task.title}" como ${task.completed ? 'pendente' : 'concluída'}`}
        />
      </div>

      {/* 2. Conteúdo Central: Título, Descrição, Tags e Data */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1.5">
          {/* Título da tarefa */}
          <h3
            onClick={() => toggleTask(task.id)}
            className={`text-base font-semibold text-slate-800 tracking-tight leading-snug cursor-pointer select-none transition-all ${
              task.completed ? 'line-through text-slate-400 font-normal' : 'hover:text-indigo-600'
            }`}
          >
            {task.title}
          </h3>

          {/* Descrição opcional */}
          {task.description && (
            <p
              className={`text-xs leading-relaxed text-slate-500 line-clamp-2 transition-all ${
                task.completed ? 'line-through text-slate-400/80' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta Tags: Categoria, Prioridade, Data de Vencimento */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            {/* Tag de Categoria */}
            <CategoryBadge category={task.category} size="sm" />

            {/* Tag de Prioridade */}
            <PriorityBadge priority={task.priority} size="sm" />

            {/* Data de Vencimento com Ícone de Calendário */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                  task.completed
                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                    : dueInfo.isOverdue
                    ? 'bg-red-50 text-red-700 border-red-200 font-semibold'
                    : dueInfo.isToday
                    ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {dueInfo.isOverdue && !task.completed ? (
                  <AlertCircle size={12} className="text-red-500 shrink-0" />
                ) : (
                  <Calendar size={12} className="shrink-0 text-slate-400" />
                )}
                <span>{dueInfo.text}</span>
              </span>
            )}

            {/* Selo Concluída */}
            {task.completed && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 size={11} />
                <span>Concluída</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Ações no Canto Direito: Editar e Excluir (Trash) */}
      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {/* Botão de Edição */}
        <button
          type="button"
          onClick={() => openEditModal(task)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
          title="Editar tarefa"
          aria-label={`Editar ${task.title}`}
        >
          <Edit3 size={16} />
        </button>

        {/* Botão de Lixeira (Trash) para Exclusão */}
        <button
          type="button"
          onClick={() => requestDeleteTask(task)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Excluir tarefa"
          aria-label={`Excluir ${task.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
