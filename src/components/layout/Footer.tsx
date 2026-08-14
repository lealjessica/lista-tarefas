import React from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const Footer: React.FC = () => {
  const { stats } = useTasks();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
            <CheckCircle2 size={12} />
          </div>
          <span className="font-semibold text-slate-700">TaskFlow Pro</span>
          <span className="text-slate-300">•</span>
          <span>Produtividade Simplificada</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <Database size={12} className="text-emerald-500" />
            <span>Persistência: <strong>LocalStorage</strong></span>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="text-slate-500">
            {stats.completed} de {stats.total} tarefas concluídas ({stats.completionRate}%)
          </span>
        </div>
      </div>
    </footer>
  );
};
