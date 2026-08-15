import { supabase } from '../lib/supabase';
import { Task, Priority } from '../types/task';
import { ITaskService } from './taskService';

// ─── Mapeamento Banco → TypeScript ──────────────────────────────────────────

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  category: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    completed: row.completed,
    priority: row.priority,
    category: row.category,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? undefined,
  };
}

// ─── Serviço Supabase ────────────────────────────────────────────────────────

export class SupabaseTaskService implements ITaskService {
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar tarefas: ${error.message}`);
    }

    return (data as TaskRow[]).map(rowToTask);
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        description: taskData.description ?? null,
        completed: taskData.completed,
        priority: taskData.priority,
        category: taskData.category,
        due_date: taskData.dueDate ?? null,
        completed_at: taskData.completed ? now : null,
        user_id: userData.user?.id ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`);
    }

    return rowToTask(data as TaskRow);
  }

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const now = new Date().toISOString();

    // Monta o objeto de atualização apenas com os campos enviados
    const updatePayload: Record<string, unknown> = { updated_at: now };

    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.description !== undefined) updatePayload.description = updates.description ?? null;
    if (updates.priority !== undefined) updatePayload.priority = updates.priority;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.dueDate !== undefined) updatePayload.due_date = updates.dueDate ?? null;

    if (updates.completed !== undefined) {
      updatePayload.completed = updates.completed;
      updatePayload.completed_at = updates.completed ? (updates.completedAt ?? now) : null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    }

    return rowToTask(data as TaskRow);
  }

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir tarefa: ${error.message}`);
    }

    return true;
  }

  async toggleComplete(id: string): Promise<Task> {
    // Busca o estado atual para inverter
    const { data: current, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      throw new Error(`Tarefa com ID ${id} não encontrada`);
    }

    const willBeCompleted = !(current as { completed: boolean }).completed;
    const now = new Date().toISOString();

    return this.updateTask(id, {
      completed: willBeCompleted,
      completedAt: willBeCompleted ? now : undefined,
    });
  }

  async reorderTasks(_taskIds: string[]): Promise<boolean> {
    // Reordenação não aplicável com ordenação por created_at no banco.
    // Mantido para compatibilidade com a interface ITaskService.
    return true;
  }
}
