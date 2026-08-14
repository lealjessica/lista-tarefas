import { CategoryInfo, Priority } from '../types/task';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'trabalho',
    name: 'Trabalho',
    color: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
      badgeBg: 'bg-blue-100/70',
    },
  },
  {
    id: 'pessoal',
    name: 'Pessoal',
    color: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100/70',
    },
  },
  {
    id: 'estudos',
    name: 'Estudos',
    color: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
      badgeBg: 'bg-purple-100/70',
    },
  },
  {
    id: 'financas',
    name: 'Finanças',
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-100/70',
    },
  },
  {
    id: 'saude',
    name: 'Saúde',
    color: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      badgeBg: 'bg-rose-100/70',
    },
  },
];

export const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  weight: number;
}> = {
  alta: {
    label: 'Alta',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    weight: 3,
  },
  media: {
    label: 'Média',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    weight: 2,
  },
  baixa: {
    label: 'Baixa',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    weight: 1,
  },
};
