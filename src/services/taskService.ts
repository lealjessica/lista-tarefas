import { Task } from '../types/task';
import { SupabaseTaskService } from './supabaseService';

export interface ITaskService {
  getTasks(): Promise<Task[]>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  toggleComplete(id: string): Promise<Task>;
  reorderTasks?(taskIds: string[]): Promise<boolean>;
}

// Factory: retorna o serviço de persistência ativo
export function getTaskService(): ITaskService {
  return new SupabaseTaskService();
}
