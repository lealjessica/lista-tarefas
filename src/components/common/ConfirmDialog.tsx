import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-3 py-2">
        {isDestructive && (
          <div className="p-2.5 rounded-full bg-red-50 text-red-600 shrink-0">
            <AlertTriangle size={22} />
          </div>
        )}
        <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-100'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-indigo-100'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
