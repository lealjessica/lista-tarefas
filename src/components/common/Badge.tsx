import React from 'react';
import { Priority } from '../../types/task';
import { DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../../utils/constants';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const cat = DEFAULT_CATEGORIES.find(
    (c) => c.id.toLowerCase() === category.toLowerCase()
  ) || {
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    color: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
      badgeBg: 'bg-slate-100',
    },
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${cat.color.bg} ${cat.color.text} ${cat.color.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cat.color.dot}`} />
      <span className="tracking-wide uppercase text-[10px] font-semibold">{cat.name}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.baixa;
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="tracking-wider uppercase text-[10px] font-bold">{config.label}</span>
    </span>
  );
};
