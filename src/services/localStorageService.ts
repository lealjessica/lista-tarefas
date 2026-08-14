import { Task } from '../types/task';
import { ITaskService } from './taskService';
import { getInitialMockTasks } from '../utils/mockData';

const STORAGE_KEY = 'taskflow_tasks_v1';

export class LocalStorageTaskService implements ITaskService {
  private getStoredTasks(): Task[] {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) {
        const initial = getInitialMockTasks();
        this.saveStoredTasks(initial);
        return initial;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Erro ao ler tarefas do LocalStorage:', error);
      return getInitialMockTasks();
    }
  }

  private saveStoredTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no LocalStorage:', error);
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.getStoredTasks();
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = this.getStoredTasks();
    const now = new Date().toISOString();
    
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: now,
      updatedAt: now,
      completedAt: taskData.completed ? now : undefined,
    };

    tasks.unshift(newTask);
    this.saveStoredTasks(tasks);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const tasks = this.getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Tarefa com ID ${id} não encontrada`);
    }

    const now = new Date().toISOString();
    const existing = tasks[index];

    let completedAt = existing.completedAt;
    if (updates.completed !== undefined) {
      completedAt = updates.completed ? now : undefined;
    }

    const updatedTask: Task = {
      ...existing,
      ...updates,
      updatedAt: now,
      completedAt,
    };

    tasks[index] = updatedTask;
    this.saveStoredTasks(tasks);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = this.getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) {
      return false;
    }
    this.saveStoredTasks(filtered);
    return true;
  }

  async toggleComplete(id: string): Promise<Task> {
    const tasks = this.getStoredTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Tarefa com ID ${id} não encontrada`);
    }
    return this.updateTask(id, { completed: !task.completed });
  }

  async reorderTasks(taskIds: string[]): Promise<boolean> {
    const tasks = this.getStoredTasks();
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const reordered: Task[] = [];

    for (const id of taskIds) {
      const item = taskMap.get(id);
      if (item) {
        reordered.push(item);
        taskMap.delete(id);
      }
    }

    // Adiciona quaisquer tarefas que sobraram
    for (const remaining of taskMap.values()) {
      reordered.push(remaining);
    }

    this.saveStoredTasks(reordered);
    return true;
  }
}
