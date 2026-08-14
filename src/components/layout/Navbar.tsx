import React, { useState } from 'react';
import {
  CheckSquare,
  BarChart3,
  Calendar,
  LogOut,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { ViewTab } from '../../types/task';

export const Navbar: React.FC = () => {
  const { currentTab, setCurrentTab, openCreateModal, stats } = useTasks();
  const { user, openLogoutModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: ViewTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'tarefas',
      label: 'Tarefas',
      icon: <CheckSquare size={18} />,
      badge: stats.pending > 0 ? stats.pending : undefined,
    },
    {
      id: 'analises',
      label: 'Análises',
      icon: <BarChart3 size={18} />,
    },
    {
      id: 'calendario',
      label: 'Calendário',
      icon: <Calendar size={18} />,
      badge: stats.dueToday > 0 ? stats.dueToday : undefined,
    },
  ];

  const handleTabClick = (tab: ViewTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-100">
              <CheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">TaskFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Gerenciador de Tarefas</p>
            </div>
          </div>

          {/* Abas de Navegação Central (Desktop) */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Ações da Direita: Nova Tarefa + Perfil + Sair */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openCreateModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>Nova Tarefa</span>
            </button>

            {/* Divisor */}
            <div className="h-6 w-px bg-slate-200" />

            {/* Usuário e Botão Sair */}
            <div className="flex items-center gap-2.5">
              {user && (
                <div className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              )}

              <button
                onClick={openLogoutModal}
                title="Sair da Conta"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Botão Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => openCreateModal()}
              className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm"
              aria-label="Criar nova tarefa"
            >
              <Plus size={18} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Expansível */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 animate-slide-down">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLogoutModal();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
