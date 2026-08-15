import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  KeyRound,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AuthTab = 'login' | 'register';
type ViewMode = 'auth' | 'forgot-password' | 'check-email' | 'check-reset';

// ─── Sub-componentes de campo ─────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  error?: string;
  autoComplete?: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, type, value, onChange, placeholder, icon, error, autoComplete, suffix, disabled,
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full pl-10 pr-${suffix ? '10' : '4'} py-2.5 rounded-xl border text-sm transition-all outline-none bg-white
          ${error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {suffix}
        </span>
      )}
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// ─── Componente de erro geral ─────────────────────────────────────────────────

const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-slide-down">
    <AlertCircle size={16} className="shrink-0 mt-0.5" />
    <span>{message}</span>
  </div>
);

// ─── Formulário de Login ──────────────────────────────────────────────────────

const LoginForm: React.FC<{ onForgotPassword: () => void }> = ({ onForgotPassword }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const authError = await signIn(email.trim(), password);

    if (authError) {
      if (authError.message.includes('Invalid login credentials') || authError.message.includes('invalid_credentials')) {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.');
      } else {
        setError(authError.message);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <InputField
        id="login-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="seu@email.com"
        icon={<Mail size={16} />}
        autoComplete="email"
        disabled={loading}
      />

      <InputField
        id="login-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon={<Lock size={16} />}
        autoComplete="current-password"
        disabled={loading}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      <div className="flex justify-end -mt-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
        >
          Esqueci minha senha
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all group mt-2"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Entrando...</>
        ) : (
          <><span>Entrar</span><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
        )}
      </button>
    </form>
  );
};

// ─── Formulário de Cadastro ───────────────────────────────────────────────────

const RegisterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido.';
    if (password.length < 6) e.password = 'A senha deve ter pelo menos 6 caracteres.';
    if (password !== confirmPassword) e.confirmPassword = 'As senhas não coincidem.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const { error: authError, needsConfirmation } = await signUp(email.trim(), password, name.trim());

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (needsConfirmation) {
      onSuccess();
    }
    // Se não precisar de confirmação, o onAuthStateChange já cuidará do login
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <InputField
        id="reg-name"
        label="Nome Completo"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Seu nome"
        icon={<User size={16} />}
        error={errors.name}
        autoComplete="name"
        disabled={loading}
      />

      <InputField
        id="reg-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="seu@email.com"
        icon={<Mail size={16} />}
        error={errors.email}
        autoComplete="email"
        disabled={loading}
      />

      <InputField
        id="reg-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        placeholder="Mínimo 6 caracteres"
        icon={<Lock size={16} />}
        error={errors.password}
        autoComplete="new-password"
        disabled={loading}
        suffix={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      <InputField
        id="reg-confirm"
        label="Confirmar Senha"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Repita a senha"
        icon={<Lock size={16} />}
        error={errors.confirmPassword}
        autoComplete="new-password"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all group mt-2"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Criando conta...</>
        ) : (
          <><span>Criar Conta Gratuita</span><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
        )}
      </button>
    </form>
  );
};

// ─── Tela de Verificação de E-mail ────────────────────────────────────────────

const CheckEmailScreen: React.FC<{ onBack: () => void; type: 'register' | 'reset' }> = ({ onBack, type }) => (
  <div className="text-center py-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-5">
      <Mail size={32} />
    </div>
    <h2 className="text-lg font-bold text-slate-900 mb-2">
      {type === 'register' ? 'Confirme seu e-mail' : 'E-mail enviado!'}
    </h2>
    <p className="text-sm text-slate-500 leading-relaxed mb-6">
      {type === 'register'
        ? 'Enviamos um link de confirmação para o seu e-mail. Acesse a sua caixa de entrada e clique no link para ativar sua conta.'
        : 'Enviamos instruções de recuperação para o seu e-mail. Verifique também a pasta de spam.'}
    </p>
    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 mb-6 text-left flex items-start gap-2">
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span>Não recebeu? Aguarde alguns minutos e verifique a pasta de spam ou lixo eletrônico.</span>
    </div>
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 mx-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
    >
      <ChevronLeft size={15} /> Voltar ao login
    </button>
  </div>
);

// ─── Formulário de Recuperação de Senha ───────────────────────────────────────

const ForgotPasswordForm: React.FC<{ onBack: () => void; onSent: () => void }> = ({ onBack, onSent }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const authError = await resetPassword(email.trim());

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSent();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium mb-5 transition-colors"
      >
        <ChevronLeft size={14} /> Voltar ao login
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <KeyRound size={16} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Recuperar Senha</h2>
        </div>
        <p className="text-sm text-slate-500 ml-10.5">
          Informe seu e-mail e enviaremos um link para você criar uma nova senha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}

        <InputField
          id="reset-email"
          label="Seu E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          icon={<Mail size={16} />}
          autoComplete="email"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all group"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Enviando...</>
          ) : (
            <><span>Enviar Link de Recuperação</span><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export const LoginView: React.FC = () => {
  const [tab, setTab] = useState<AuthTab>('login');
  const [view, setView] = useState<ViewMode>('auth');

  const goToForgot = () => setView('forgot-password');
  const goToAuth = () => setView('auth');
  const goToCheckEmail = () => setView('check-email');
  const goToCheckReset = () => setView('check-reset');

  const features = [
    { icon: <Zap size={14} />, text: 'Sincronizado em tempo real' },
    { icon: <ShieldCheck size={14} />, text: 'Dados criptografados' },
    { icon: <Sparkles size={14} />, text: 'Acesse de qualquer lugar' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">TaskFlow Pro</h1>
                <p className="text-xs text-indigo-300 mt-0.5">Gerenciador Inteligente de Tarefas</p>
              </div>
            </div>

            {/* Features */}
            <div className="flex items-center gap-4 flex-wrap">
              {features.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-indigo-200/70">
                  <span className="text-indigo-400">{f.icon}</span>
                  {f.text}
                </span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {/* Abas (apenas no modo 'auth') */}
            {view === 'auth' && (
              <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/10">
                {(['login', 'register'] as AuthTab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      tab === t
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-indigo-200/60 hover:text-indigo-100'
                    }`}
                  >
                    {t === 'login' ? 'Entrar' : 'Criar conta'}
                  </button>
                ))}
              </div>
            )}

            {/* Conteúdo por view */}
            {view === 'auth' && tab === 'login' && (
              <LoginForm onForgotPassword={goToForgot} />
            )}

            {view === 'auth' && tab === 'register' && (
              <RegisterForm onSuccess={goToCheckEmail} />
            )}

            {view === 'forgot-password' && (
              <ForgotPasswordForm onBack={goToAuth} onSent={goToCheckReset} />
            )}

            {view === 'check-email' && (
              <CheckEmailScreen onBack={goToAuth} type="register" />
            )}

            {view === 'check-reset' && (
              <CheckEmailScreen onBack={goToAuth} type="reset" />
            )}
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs text-indigo-300/50 mt-6">
          Powered by{' '}
          <span className="text-indigo-300/80 font-medium">Supabase Auth</span>
          {' '}·{' '}
          <span className="text-indigo-300/80 font-medium">TaskFlow Pro</span>
        </p>
      </div>
    </div>
  );
};
