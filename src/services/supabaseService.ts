/**
 * Implementação preparada para integração com Supabase.
 * 
 * Para ativar o Supabase:
 * 1. Instale: npm install @supabase/supabase-js
 * 2. Configure suas variáveis de ambiente em um arquivo .env:
 *    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 *    VITE_SUPABASE_ANON_KEY=sua-chave-anon
 * 3. Altere a factory em `src/services/taskService.ts` para retornar `new SupabaseTaskService()`.
 */

import { Task } from '../types/task';
import { ITaskService } from './taskService';

export class SupabaseTaskService implements ITaskService {
  async getTasks(): Promise<Task[]> {
    console.warn('SupabaseTaskService ainda não ativado com credenciais. Usando modo mock/preparado.');
    return [];
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    return {
      ...task,
      id: 'supabase_' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const now = new Date().toISOString();
    return {
      id,
      title: updates.title || '',
      completed: updates.completed ?? false,
      priority: updates.priority || 'media',
      category: updates.category || 'trabalho',
      ...updates,
      createdAt: now,
      updatedAt: now,
    };
  }

  async deleteTask(id: string): Promise<boolean> {
    console.log('Excluindo tarefa do Supabase:', id);
    return true;
  }

  async toggleComplete(id: string): Promise<Task> {
    return this.updateTask(id, { completed: true });
  }
}
