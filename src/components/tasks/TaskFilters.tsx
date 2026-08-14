import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { FilterStatus, Priority, SortOption } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

export const TaskFilters: React.FC = () => {
  const {
    filterStatus,
    setFilterStatus,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    stats,
  } = useTasks();

  const statusOptions: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'todas', label: 'Todas', count: stats.total },
    { id: 'pendentes', label: 'Pendentes', count: stats.pending },
    { id: 'concluidas', label: 'Concluídas', count: stats.completed },
  ];

  const hasActiveFilters =
    filterStatus !== 'todas' ||
    selectedCategory !== 'todas' ||
    selectedPriority !== 'todas' ||
    searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setFilterStatus('todas');
    setSelectedCategory('todas');
    setSelectedPriority('todas');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
      {/* Linha Superior: Botões de Filtro de Status + Barra de Pesquisa */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Botões de Filtro: 'Todas', 'Pendentes', 'Concluídas' */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto">
          {statusOptions.map((opt) => {
            const isActive = filterStatus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilterStatus(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Pesquisa em Tempo Real */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar tarefas por título ou descrição..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Limpar pesquisa"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Linha Inferior: Filtros de Categoria, Prioridade e Ordenação */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Categorias e Prioridade */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Categoria */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              <option value="todas">Todas as Categorias</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Prioridade */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Prioridade:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | 'todas')}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
            >
              <option value="todas">Todas as Prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Botão para Limpar Filtros se houver algum ativo */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg font-semibold transition-colors"
            >
              <X size={13} />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown size={14} className="text-slate-400" />
          <span className="text-slate-400 font-medium hidden sm:inline">Ordenar por:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
          >
            <option value="dueDate_asc">Vencimento (Mais Próximo)</option>
            <option value="dueDate_desc">Vencimento (Mais Distante)</option>
            <option value="priority_desc">Prioridade (Alta → Baixa)</option>
            <option value="createdAt_desc">Criadas Recentemente</option>
            <option value="title_asc">Ordem Alfabética (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
