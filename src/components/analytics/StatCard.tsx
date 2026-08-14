import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
}) => {
  return (
    <div
      className={`p-5 rounded-3xl bg-white border ${colorClass.border} shadow-subtle hover:shadow-card transition-all flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-2xl ${colorClass.iconBg} ${colorClass.text}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
