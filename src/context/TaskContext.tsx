import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  CategoryInfo,
  Priority,
  FilterStatus,
  SortOption,
  ViewTab,
  TaskStats,
  ToastMessage,
} from '../types/task';
import { getTaskService } from '../services/taskService';
import { DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../utils/constants';
import { parseDateString, getTodayDateString } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: CategoryInfo[];
  loading: boolean;
  
  // Filtros e Visualização
  filterStatus: FilterStatus;
  selectedCategory: string;
  selectedPriority: Priority | 'todas';
  searchQuery: string;
  sortOption: SortOption;
  currentTab: ViewTab;
  
  // Setters de Filtro
  setFilterStatus: (status: FilterStatus) => void;
  setSelectedCategory: (catId: string) => void;
  setSelectedPriority: (priority: Priority | 'todas') => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setCurrentTab: (tab: ViewTab) => void;
  
  // Ações CRUD
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTask: (id: string) => Promise<void>;
  
  // Modal de Tarefa
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  selectedDateForNewTask: string | null;
  openCreateModal: (defaultDate?: string) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  
  // Confirmação de Exclusão
  taskToDelete: Task | null;
  requestDeleteTask: (task: Task) => void;
  confirmDeleteTask: () => Promise<void>;
  cancelDeleteTask: () => void;
  
  // Notificações Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Estatísticas
  stats: TaskStats;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskService = getTaskService();

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<CategoryInfo[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('dueDate_asc');
  const [currentTab, setCurrentTab] = useState<ViewTab>('tarefas');
  
  // Estado dos Modais
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Carregar tarefas na montagem
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Falha ao carregar tarefas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const addToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { ...toastData, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // CRUD Operations
  const addTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const created = await taskService.createTask(data);
    setTasks((prev) => [created, ...prev]);
    addToast({
      title: 'Tarefa criada com sucesso!',
      message: `"${created.title}" foi adicionada à sua lista.`,
      type: 'success',
    });
    return created;
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> => {
    const updated = await taskService.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    addToast({
      title: 'Tarefa atualizada!',
      message: `As alterações em "${updated.title}" foram salvas.`,
      type: 'info',
    });
    return updated;
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return false;

    const success = await taskService.deleteTask(id);
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      
      addToast({
        title: 'Tarefa excluída',
        message: `"${target.title}" foi removida.`,
        type: 'warning',
        action: {
          label: 'Desfazer',
          onClick: () => {
            if (target) {
              const { id: _oldId, createdAt: _c, updatedAt: _u, ...rest } = target;
              addTask(rest);
            }
          },
        },
      });
    }
    return success;
  };

  const toggleTask = async (id: string): Promise<void> => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const updated = await taskService.toggleComplete(id);
    
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

    if (willBeCompleted) {
      // Verificar se agora todas as tarefas ativas estão concluídas
      const otherPending = tasks.filter((t) => t.id !== id && !t.completed).length;
      if (otherPending === 0 && tasks.length > 1) {
        // Disparar celebração de confetes!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
          });
        } catch {
          // fallback silencioso
        }
      }
    }
  };

  // Modais
  const openCreateModal = (defaultDate?: string) => {
    setEditingTask(null);
    setSelectedDateForNewTask(defaultDate || null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setSelectedDateForNewTask(null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setSelectedDateForNewTask(null);
  };

  const requestDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  // Filtragem e Ordenação
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filtro por Status
    if (filterStatus === 'pendentes') {
      result = result.filter((t) => !t.completed);
    } else if (filterStatus === 'concluidas') {
      result = result.filter((t) => t.completed);
    }

    // Filtro por Categoria
    if (selectedCategory !== 'todas') {
      result = result.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filtro por Prioridade
    if (selectedPriority !== 'todas') {
      result = result.filter((t) => t.priority === selectedPriority);
    }

    // Busca textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Ordenação
    result.sort((a, b) => {
      // Tarefas não concluídas primeiro por padrão para boa usabilidade
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortOption) {
        case 'dueDate_asc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        case 'dueDate_desc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        case 'priority_desc': {
          const weightA = PRIORITY_CONFIG[a.priority]?.weight || 0;
          const weightB = PRIORITY_CONFIG[b.priority]?.weight || 0;
          return weightB - weightA;
        }
        case 'createdAt_desc': {
          return b.createdAt.localeCompare(a.createdAt);
        }
        case 'title_asc': {
          return a.title.localeCompare(b.title);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filterStatus, selectedCategory, selectedPriority, searchQuery, sortOption]);

  // Estatísticas calculadas
  const stats = useMemo<TaskStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const todayStr = getTodayDateString();
    let overdue = 0;
    let dueToday = 0;

    const byCategory: Record<string, { total: number; completed: number }> = {};
    DEFAULT_CATEGORIES.forEach((c) => {
      byCategory[c.id] = { total: 0, completed: 0 };
    });

    const byPriority: Record<Priority, { total: number; completed: number }> = {
      alta: { total: 0, completed: 0 },
      media: { total: 0, completed: 0 },
      baixa: { total: 0, completed: 0 },
    };

    tasks.forEach((t) => {
      // Categorias
      if (!byCategory[t.category]) {
        byCategory[t.category] = { total: 0, completed: 0 };
      }
      byCategory[t.category].total += 1;
      if (t.completed) {
        byCategory[t.category].completed += 1;
      }

      // Prioridades
      if (byPriority[t.priority]) {
        byPriority[t.priority].total += 1;
        if (t.completed) {
          byPriority[t.priority].completed += 1;
        }
      }

      // Vencimento
      if (t.dueDate && !t.completed) {
        if (t.dueDate === todayStr) {
          dueToday += 1;
        } else {
          const d = parseDateString(t.dueDate);
          const todayDate = parseDateString(todayStr);
          if (d && todayDate && d.getTime() < todayDate.getTime()) {
            overdue += 1;
          }
        }
      }
    });

    return {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      completionRate,
      byCategory,
      byPriority,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        loading,
        filterStatus,
        selectedCategory,
        selectedPriority,
        searchQuery,
        sortOption,
        currentTab,
        setFilterStatus,
        setSelectedCategory,
        setSelectedPriority,
        setSearchQuery,
        setSortOption,
        setCurrentTab,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        isTaskModalOpen,
        editingTask,
        selectedDateForNewTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        taskToDelete,
        requestDeleteTask,
        confirmDeleteTask,
        cancelDeleteTask,
        toasts,
        addToast,
        removeToast,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de um TaskProvider');
  }
  return context;
}
