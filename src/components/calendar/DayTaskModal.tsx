import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { formatDueDateDisplay } from '../../utils/dateUtils';

interface DayTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateString: string | null;
  tasksForDay: Task[];
}

export const DayTaskModal: React.FC<DayTaskModalProps> = ({
  isOpen,
  onClose,
  dateString,
  tasksForDay,
}) => {
  const { openCreateModal } = useTasks();

  if (!isOpen || !dateString) return null;

  const dueInfo = formatDueDateDisplay(dateString);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tarefas para ${dueInfo.text}`}
      subtitle={`${tasksForDay.length} tarefa(s) agendada(s) para este dia`}
      maxWidth="lg"
    >
      <div className="space-y-4 py-2">
        {/* Ação para Adicionar Tarefa Direto no Dia */}
        <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <Calendar size={15} className="text-indigo-600" />
            <span>Data selecionada: {dateString}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              openCreateModal(dateString);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus size={14} />
            <span>Adicionar neste dia</span>
          </button>
        </div>

        {/* Lista de Tarefas do Dia */}
        {tasksForDay.length > 0 ? (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {tasksForDay.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200/60">
            <p className="text-xs text-slate-500 font-medium">
              Nenhuma tarefa agendada para esta data.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
