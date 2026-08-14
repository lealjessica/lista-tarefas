export type Priority = 'baixa' | 'media' | 'alta';

export interface CategoryInfo {
  id: string;
  name: string;
  color: {
    bg: string;
    text: string;
    border: string;
    dot: string;
    badgeBg: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string; // Formato YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type FilterStatus = 'todas' | 'pendentes' | 'concluidas';

export type SortOption = 
  | 'dueDate_asc' 
  | 'dueDate_desc' 
  | 'priority_desc' 
  | 'createdAt_desc' 
  | 'title_asc';

export type ViewTab = 'tarefas' | 'analises' | 'calendario';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completionRate: number; // 0 - 100
  byCategory: Record<string, { total: number; completed: number }>;
  byPriority: Record<Priority, { total: number; completed: number }>;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}
