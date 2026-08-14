import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState('Alexandre Silva');
  const [email, setEmail] = useState('alexandre.silva@exemplo.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim(), email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-modal border border-slate-100 p-8 sm:p-10 animate-slide-down">
        {/* Logo & Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-glow mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TaskFlow Pro</h1>
          <p className="text-sm text-slate-500 mt-1">Gerenciador Inteligente de Tarefas & Produtividade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Seu Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
              placeholder="Ex: Alexandre Silva"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              E-mail de Acesso
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all group mt-6"
          >
            <span>Acessar Meu Painel</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Dados Locais Seguros
          </span>
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" />
            Design Moderno
          </span>
        </div>
      </div>
    </div>
  );
};
