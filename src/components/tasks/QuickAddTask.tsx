import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Priority } from '../../types/task';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';

export const QuickAddTask: React.FC = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('trabalho');
  const [priority, setPriority] = useState<Priority>('media');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addTask({
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || undefined,
        completed: false,
      });

      setTitle('');
      // Mantém a categoria para facilitar inserções em lote
    } catch (err) {
      console.error('Erro ao adicionar tarefa rápida:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => setIsExpanded(true)}
      className={`bg-white rounded-2xl border transition-all duration-200 ${
        isExpanded
          ? 'border-indigo-300 shadow-card ring-4 ring-indigo-50/50 p-4 sm:p-5'
          : 'border-slate-200/90 shadow-subtle p-3 sm:p-4 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Plus size={18} />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="O que você precisa fazer hoje? (Pressione Enter para adicionar)"
          className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none font-medium"
        />

        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            title.trim() && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Adicionar
        </button>
      </div>

      {/* Opções Rápidas Expansíveis */}
      {isExpanded && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 animate-slide-down text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Categoria */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
              <Tag size={13} className="text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
              <AlertCircle size={13} className="text-slate-400" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer"
              >
                <option value="alta">Prioridade Alta</option>
                <option value="media">Prioridade Média</option>
                <option value="baixa">Prioridade Baixa</option>
              </select>
            </div>

            {/* Data de Vencimento */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent text-slate-700 font-medium outline-none cursor-pointer text-xs"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-slate-600 font-medium ml-auto"
          >
            Fechar detalhes
          </button>
        </div>
      )}
    </form>
  );
};
