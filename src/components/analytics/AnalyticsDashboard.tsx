import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  TrendingUp,
  Award,
  Layers,
  Calendar,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { StatCard } from './StatCard';
import { DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../../utils/constants';

export const AnalyticsDashboard: React.FC = () => {
  const { stats } = useTasks();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header do Módulo de Análises */}
      <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent p-6 rounded-3xl border border-purple-100/70">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Painel de Análises & Produtividade
          </h1>
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
            Tempo Real
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe seu progresso, taxa de conclusão e distribuição de tarefas por categoria e prioridade.
        </p>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Tarefas"
          value={stats.total}
          subtitle="Atividades cadastradas"
          icon={<Layers size={20} />}
          colorClass={{
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-slate-200/80',
            iconBg: 'bg-indigo-50',
          }}
        />

        <StatCard
          title="Concluídas"
          value={stats.completed}
          subtitle={`${stats.completionRate}% de taxa de entrega`}
          icon={<CheckCircle2 size={20} />}
          colorClass={{
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-slate-200/80',
            iconBg: 'bg-emerald-50',
          }}
        />

        <StatCard
          title="Pendentes"
          value={stats.pending}
          subtitle="Aguardando conclusão"
          icon={<Clock size={20} />}
          colorClass={{
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-slate-200/80',
            iconBg: 'bg-amber-50',
          }}
        />

        <StatCard
          title="Atrasadas"
          value={stats.overdue}
          subtitle={stats.overdue > 0 ? 'Requer atenção imediata' : 'Tudo em dia!'}
          icon={<AlertTriangle size={20} />}
          colorClass={{
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-slate-200/80',
            iconBg: 'bg-red-50',
          }}
        />
      </div>

      {/* Seção Central: Progresso Geral & Produtividade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Progresso Geral */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Progresso Geral</h3>
              <Award className="text-indigo-600 w-5 h-5" />
            </div>

            {/* Barra de Progresso Circular em SVG */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Trilha de Fundo */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progresso Dinâmico */}
                  <path
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${stats.completionRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{stats.completionRate}%</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Concluído</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>{stats.completed} entregues</span>
            <span>{stats.pending} restantes</span>
          </div>
        </div>

        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Distribuição por Categoria</h3>
              <p className="text-xs text-slate-500 mt-0.5">Volume de tarefas em cada área</p>
            </div>
            <Layers className="text-slate-400 w-5 h-5" />
          </div>

          <div className="space-y-3.5">
            {DEFAULT_CATEGORIES.map((cat) => {
              const catStat = stats.byCategory[cat.id] || { total: 0, completed: 0 };
              const percent = stats.total > 0 ? Math.round((catStat.total / stats.total) * 100) : 0;
              const completedPercent =
                catStat.total > 0 ? Math.round((catStat.completed / catStat.total) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.color.dot}`} />
                      <span className="text-slate-700">{cat.name}</span>
                    </div>
                    <span className="text-slate-500">
                      {catStat.completed}/{catStat.total} concluídas ({percent}%)
                    </span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${cat.color.dot} transition-all duration-500`}
                      style={{ width: `${completedPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Distribuição por Prioridade & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Prioridade */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Distribuição por Prioridade</h3>
              <p className="text-xs text-slate-500 mt-0.5">Urgência das tarefas cadastradas</p>
            </div>
            <Flame className="text-amber-500 w-5 h-5" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['alta', 'media', 'baixa'] as const).map((p) => {
              const pConfig = PRIORITY_CONFIG[p];
              const pStat = stats.byPriority[p] || { total: 0, completed: 0 };
              const pendingCount = pStat.total - pStat.completed;

              return (
                <div
                  key={p}
                  className={`p-4 rounded-2xl border ${pConfig.border} ${pConfig.bg} text-center space-y-1.5`}
                >
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${pConfig.text}`}>
                    {pConfig.label}
                  </span>
                  <div className="text-2xl font-black text-slate-900">{pStat.total}</div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-emerald-700">{pStat.completed} prontas</span>
                    <span className="mx-1">•</span>
                    <span>{pendingCount} pendentes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights de Produtividade */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Insights de Produtividade</h3>
              <TrendingUp className="text-indigo-600 w-5 h-5" />
            </div>

            <div className="space-y-3 text-xs">
              {stats.overdue > 0 ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Atenção a prazos:</span> Você tem{' '}
                    <strong>{stats.overdue} tarefa(s) atrasada(s)</strong>. Priorize-as para não acumular pendências.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Prazos em dia:</span> Nenhuma tarefa em atraso no momento. Continue com o ótimo ritmo!
                  </div>
                </div>
              )}

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 flex items-start gap-2.5">
                <Calendar size={16} className="shrink-0 mt-0.5 text-indigo-600" />
                <div>
                  <span className="font-bold">Hoje:</span> Você tem <strong>{stats.dueToday} tarefa(s)</strong> agendadas com vencimento para o dia de hoje.
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
            Dica: Divida tarefas complexas em itens menores para manter alta velocidade de entrega.
          </p>
        </div>
      </div>
    </div>
  );
};
