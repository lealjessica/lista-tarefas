import React from 'react';
import { LogOut, CheckCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, closeLogoutModal, logout, user } = useAuth();

  if (!isLogoutModalOpen) return null;

  return (
    <Modal
      isOpen={isLogoutModalOpen}
      onClose={closeLogoutModal}
      title="Encerrar Sessão"
      subtitle="Tem certeza de que deseja sair da sua conta?"
      maxWidth="sm"
    >
      <div className="py-3">
        {user && (
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 mb-2">
          <CheckCircle size={14} className="shrink-0" />
          <span>Suas tarefas estão salvas com segurança no armazenamento local.</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={closeLogoutModal}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Permanecer
        </button>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    </Modal>
  );
};
