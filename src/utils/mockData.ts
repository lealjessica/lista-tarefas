import { Task } from '../types/task';
import { getTodayDateString } from './dateUtils';

export function getInitialMockTasks(): Task[] {
  const today = new Date();
  
  const formatDate = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const now = new Date().toISOString();

  return [
    {
      id: 'task-1',
      title: 'Apresentar relatório trimestral para a diretoria',
      description: 'Revisar métricas de conversão e preparar os slides no Figma/PowerPoint.',
      completed: false,
      priority: 'alta',
      category: 'trabalho',
      dueDate: getTodayDateString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-2',
      title: 'Estudar arquitetura de microsserviços em Go',
      description: 'Capítulo 4 e 5 do livro de padrões de sistemas distribuídos.',
      completed: false,
      priority: 'media',
      category: 'estudos',
      dueDate: formatDate(1),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-3',
      title: 'Agendar consulta com cardiologista',
      description: 'Checkup anual de rotina e exames laboratoriais.',
      completed: true,
      priority: 'baixa',
      category: 'saude',
      dueDate: formatDate(-1),
      createdAt: now,
      updatedAt: now,
      completedAt: now,
    },
    {
      id: 'task-4',
      title: 'Revisar planejamento orçamentário mensal',
      description: 'Categorizar gastos do cartão de crédito e verificar aportes em investimentos.',
      completed: false,
      priority: 'alta',
      category: 'financas',
      dueDate: formatDate(3),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-5',
      title: 'Comprar presente de aniversário da Luísa',
      description: 'Procurar livros de design ou fone bluetooth sem fio.',
      completed: false,
      priority: 'media',
      category: 'pessoal',
      dueDate: formatDate(2),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'task-6',
      title: 'Revisar Pull Requests no GitHub do projeto',
      description: 'Aprovar refatoração de autenticação e validações de formulário.',
      completed: true,
      priority: 'alta',
      category: 'trabalho',
      dueDate: getTodayDateString(),
      createdAt: now,
      updatedAt: now,
      completedAt: now,
    }
  ];
}
