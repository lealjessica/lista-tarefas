import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  ariaLabel = 'Marcar tarefa como concluída',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 rounded',
    md: 'w-5 h-5 rounded-md',
    lg: 'w-6 h-6 rounded-lg',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 select-none group cursor-pointer ${sizeClasses} ${
        checked
          ? 'bg-emerald-500 text-white border-transparent shadow-sm hover:bg-emerald-600 scale-100'
          : 'bg-white border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 text-transparent'
      }`}
    >
      <Check
        size={iconSizes}
        strokeWidth={3}
        className={`transition-all duration-200 transform ${
          checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:opacity-40 group-hover:text-indigo-400'
        }`}
      />
    </button>
  );
};
