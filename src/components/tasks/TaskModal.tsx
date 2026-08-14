import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useTasks } from '../../context/TaskContext';
import { Priority } from '../../types/task';
import { DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    selectedDateForNewTask,
    addTask,
    updateTask,
  } = useTasks();

  const isEditing = !!editingTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('trabalho');
  const [priority, setPriority] = useState<Priority>('media');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sincronizar estado quando o modal abre para edição ou criação
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || getTodayDateString());
      setCompleted(editingTask.completed);
    } else {
      setTitle('');
      setDescription('');
      setCategory('trabalho');
      setPriority('media');
      setDueDate(selectedDateForNewTask || getTodayDateString());
      setCompleted(false);
    }
    setError('');
  }, [editingTask, selectedDateForNewTask, isTaskModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && editingTask) {
        await updateTask(editingTask.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          priority,
          dueDate: dueDate || undefined,
          completed,
        });
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          priority,
          dueDate: dueDate || undefined,
          completed,
        });
      }

      closeTaskModal();
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
      setError('Ocorreu um erro ao salvar a tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
      subtitle={
        isEditing
          ? 'Atualize as informações da tarefa selecionada.'
          : 'Preencha os dados abaixo para organizar sua nova atividade.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Título da Tarefa */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Título da Tarefa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ex: Entregar relatório de desempenho..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Descrição / Notas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Descrição / Detalhes (Opcional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione links, observações ou subtarefas..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Seleção de Categoria e Prioridade lado a lado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <div className="space-y-1.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-700 cursor-pointer transition-all"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['baixa', 'media', 'alta'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const config = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      isSelected
                        ? `${config.bg} ${config.text} ${config.border} ring-2 ring-indigo-200 scale-100 shadow-sm`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data de Vencimento e Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Data de Conclusão / Vencimento */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Data de Vencimento
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm text-slate-700 cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Estado de Conclusão (Se editando) */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status Atual
              </label>
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                  completed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{completed ? 'Concluída' : 'Pendente'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Botões do Rodapé do Modal */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeTaskModal}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
