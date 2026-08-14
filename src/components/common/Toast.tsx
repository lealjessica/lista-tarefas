import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Undo2 } from 'lucide-react';
import { ToastMessage } from '../../types/task';
import { useTasks } from '../../context/TaskContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTasks();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notificações do sistema" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </aside>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      border: 'border-emerald-200',
      bg: 'bg-white',
      bar: 'bg-emerald-500',
    },
    info: {
      icon: <Info className="w-5 h-5 text-indigo-600" />,
      border: 'border-indigo-200',
      bg: 'bg-white',
      bar: 'bg-indigo-500',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      border: 'border-amber-200',
      bg: 'bg-white',
      bar: 'bg-amber-500',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      border: 'border-red-200',
      bg: 'bg-white',
      bar: 'bg-red-500',
    },
  }[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-card border ${config.border} ${config.bg} animate-slide-down relative overflow-hidden transition-all`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-sm font-semibold text-slate-800 tracking-tight">{toast.title}</h4>
        {toast.message && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onClose();
            }}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Undo2 size={13} />
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Fechar notificação"
      >
        <X size={15} />
      </button>
    </div>
  );
};
