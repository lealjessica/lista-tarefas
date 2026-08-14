import { Task } from '../types/task';
import { LocalStorageTaskService } from './localStorageService';

export interface ITaskService {
  getTasks(): Promise<Task[]>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  toggleComplete(id: string): Promise<Task>;
  reorderTasks?(taskIds: string[]): Promise<boolean>;
}

// Service Factory para permitir alternar facilmente para Supabase quando desejado
export function getTaskService(): ITaskService {
  // Padrão atual: LocalStorage
  return new LocalStorageTaskService();
}
