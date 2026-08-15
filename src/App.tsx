import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TaskList } from './components/tasks/TaskList';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { CalendarView } from './components/calendar/CalendarView';
import { TaskModal } from './components/tasks/TaskModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ToastContainer } from './components/common/Toast';
import { LogoutModal } from './components/auth/LogoutModal';
import { LoginView } from './components/auth/LoginView';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentTab, taskToDelete, confirmDeleteTask, cancelDeleteTask } = useTasks();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-indigo-400 animate-spin" />
          <p className="text-sm text-indigo-300/70">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Barra de Navegação Superior Fixa */}
      <Navbar />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'tarefas' && <TaskList />}
        {currentTab === 'analises' && <AnalyticsDashboard />}
        {currentTab === 'calendario' && <CalendarView />}
      </main>

      {/* Rodapé */}
      <Footer />

      {/* Modais Globais e Notificações */}
      <TaskModal />
      <LogoutModal />
      <ToastContainer />

      {/* Diálogo de Confirmação de Exclusão de Tarefa */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={cancelDeleteTask}
        onConfirm={confirmDeleteTask}
        title="Excluir Tarefa"
        message={
          taskToDelete
            ? `Tem certeza de que deseja excluir permanentemente a tarefa "${taskToDelete.title}"?`
            : ''
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isDestructive={true}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
