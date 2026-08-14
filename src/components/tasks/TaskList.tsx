import React from 'react';
import {
  Plus,
  Sparkles,
  Inbox,
  FilterX,
  CalendarCheck,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { QuickAddTask } from './QuickAddTask';

export const TaskList: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    filterStatus,
    searchQuery,
    selectedCategory,
    selectedPriority,
    openCreateModal,
    stats,
  } = useTasks();

  const isFiltered =
    filterStatus !== 'todas' ||
    searchQuery.trim() !== '' ||
    selectedCategory !== 'todas' ||
    selectedPriority !== 'todas';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header do Painel com Resumo e Botão Criar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-5 sm:p-6 rounded-3xl border border-indigo-100/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Minhas Tarefas
            </h1>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
              {stats.pending} pendentes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie, priorize e acompanhe suas atividades diárias com clareza.
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow transition-all group shrink-0"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          <span>Criar Tarefa</span>
        </button>
      </div>

      {/* 2. Barra de Inserção Rápida */}
      <QuickAddTask />

      {/* 3. Barra de Filtros e Busca */}
      <TaskFilters />

      {/* 4. Lista de Tarefas ou Estados Vazios */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          /* Estados Vazios Elegantes */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-subtle my-4">
            {isFiltered ? (
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <FilterX size={24} />
                </div>
                <h2 className="text-base font-bold text-slate-800">Nenhuma tarefa encontrada</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Não encontramos nenhuma tarefa correspondente aos filtros e termos de pesquisa aplicados.
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Inbox size={24} />
                </div>
                <h2 className="text-base font-bold text-slate-800">Sua lista está limpa!</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você não tem nenhuma tarefa cadastrada no momento. Adicione uma nova atividade para começar o seu dia com foco.
                </p>
                <button
                  onClick={() => openCreateModal()}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  <Plus size={15} />
                  Adicionar Primeira Tarefa
                </button>
              </div>
            ) : (
              /* Todas as tarefas concluídas! */
              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CalendarCheck size={28} />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <Sparkles size={16} />
                  <span>Tudo pronto por aqui!</span>
                </div>
                <h2 className="text-base font-bold text-slate-800">Todas as tarefas concluídas</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Excelente trabalho! Você concluiu todas as tarefas da sua lista. Aproveite o descanso ou crie novas metas.
                </p>
                <button
                  onClick={() => openCreateModal()}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                >
                  <Plus size={15} />
                  Nova Atividade
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
