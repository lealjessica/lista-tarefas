<div align="center">

# 📋 TaskFlow Pro

**Aplicativo moderno e completo de gerenciamento de tarefas e produtividade**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/Licença-MIT-22C55E?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Visão Geral

O **TaskFlow Pro** é uma aplicação web de produtividade construída com as tecnologias mais modernas do ecossistema React. Com uma interface elegante e responsiva, ele oferece uma experiência completa para organizar tarefas do dia a dia — com suporte a categorias, prioridades, prazos, análises e visualização em calendário.

Os dados são persistidos localmente via **LocalStorage**, e a arquitetura já está preparada para integração futura com **Supabase** (banco de dados em nuvem).

---

## 🚀 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| ✅ **CRUD Completo** | Criar, editar, concluir e excluir tarefas com confirmação |
| 🏷️ **Categorias** | Trabalho, Pessoal, Estudos, Finanças e Saúde |
| 🔥 **Prioridades** | Alta, Média e Baixa com ordenação automática |
| 📅 **Prazos Inteligentes** | Formatação "Hoje", "Amanhã" e alertas de atraso |
| 🔍 **Busca e Filtros** | Filtro em tempo real por título, categoria, prioridade e status |
| 📊 **Dashboard de Análises** | Métricas de produtividade e taxa de conclusão |
| 📆 **Calendário Mensal** | Visualização das tarefas mapeadas por data de vencimento |
| 💾 **Persistência Local** | Dados salvos automaticamente no LocalStorage |
| 🎉 **Micro-animações** | Feedbacks visuais com confetti e toasts |
| 🔐 **Sistema de Auth** | Login e logout com perfil de usuário |
| 📱 **Responsivo** | Layout adaptado para mobile, tablet e desktop |

---

## 🛠️ Stack Tecnológica

- **[React 18](https://react.dev)** — Biblioteca principal de UI com Hooks
- **[TypeScript 5](https://www.typescriptlang.org)** — Tipagem estática para maior segurança
- **[Vite 6](https://vitejs.dev)** — Bundler ultrarrápido para desenvolvimento
- **[Tailwind CSS 3](https://tailwindcss.com)** — Estilização utility-first
- **[Lucide React](https://lucide.dev)** — Ícones modernos e consistentes
- **[canvas-confetti](https://github.com/catdad/canvas-confetti)** — Efeito de celebração ao concluir tarefas

---

## 📁 Estrutura do Projeto

```
lista-tarefas/
├── public/                     # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── analytics/          # Dashboard de métricas
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── StatCard.tsx
│   │   ├── auth/               # Autenticação
│   │   │   ├── LoginView.tsx
│   │   │   └── LogoutModal.tsx
│   │   ├── calendar/           # Calendário mensal
│   │   │   ├── CalendarView.tsx
│   │   │   └── DayTaskModal.tsx
│   │   ├── common/             # Componentes reutilizáveis
│   │   │   ├── Badge.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/             # Estrutura da página
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── tasks/              # Módulo principal de tarefas
│   │       ├── TaskList.tsx
│   │       └── TaskModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx      # Estado global de autenticação
│   │   └── TaskContext.tsx      # Estado global de tarefas
│   ├── services/
│   │   ├── localStorageService.ts  # Implementação com LocalStorage
│   │   ├── supabaseService.ts      # Implementação preparada para Supabase
│   │   └── taskService.ts          # Interface e factory do serviço
│   ├── types/
│   │   └── task.ts             # Tipagens TypeScript
│   ├── utils/                  # Funções utilitárias
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Ponto de entrada
│   └── index.css               # Estilos globais
├── .env.example                # Template de variáveis de ambiente
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) versão **18** ou superior
- [Git](https://git-scm.com)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/lealjessica/lista-tarefas.git

# 2. Entre na pasta do projeto
cd lista-tarefas

# 3. Instale as dependências
npm install

# 4. Copie o arquivo de variáveis de ambiente (opcional, para Supabase)
cp .env.example .env

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **[http://localhost:5173](http://localhost:5173)**

### Outros Comandos

```bash
npm run build    # Gera o build de produção em /dist
npm run preview  # Pré-visualiza o build de produção localmente
```

---

## 🔌 Integração com Supabase (Opcional)

A arquitetura do projeto é baseada no **Service Pattern** e já está pronta para migração ao Supabase sem alterar os componentes de UI:

1. Instale o SDK:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Configure o arquivo `.env` com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

3. Em `src/services/taskService.ts`, altere a factory para retornar `new SupabaseTaskService()`.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Faça um **fork** do repositório
2. Crie uma **branch** para sua feature: `git checkout -b feat/minha-feature`
3. Faça o **commit**: `git commit -m 'feat: adiciona minha feature'`
4. Faça o **push**: `git push origin feat/minha-feature`
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com ❤️ por [**lealjessica**](https://github.com/lealjessica)

</div>
