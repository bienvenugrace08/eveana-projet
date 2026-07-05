import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(username, email, password, 'user');
      navigate('/user');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-stretch">
      {/* Colonne Formulaire (Gauche) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-card p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-origami-icon lucide-origami"><path d="M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025"/><path d="m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009"/><path d="m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"/></svg>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">EVANA</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Créer un compte</h1>
            <p className="text-xs text-slate-400">Rejoignez la communauté EVANA et commencez votre aventure.</p>
          </div>

          {error && (
            <div className="p-3 bg-danger-light text-danger-dark text-xs font-semibold rounded-xl border border-danger/10 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Nom d'utilisateur
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition duration-150">
                <User className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nom d'utilisateur"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Adresse email
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition duration-150">
                <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Mot de passe
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition duration-150">
                <Lock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Confirmer le mot de passe
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition duration-150">
                <Lock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={loading}>
              Créer le compte
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
            Vous avez déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-bold hover:underline"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>

      {/* Colonne Visuel (Droite) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-slate-950 to-secondary/15" />
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-start px-16 space-y-6 max-w-xl">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider">
            Rejoignez-nous
          </span>
          <h2 className="text-4xl font-extrabold leading-tight">
            Accédez à un univers d'événements exclusifs.
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm">
            En créant votre compte, vous pourrez suivre vos achats, gérer vos favoris et accéder à des offres exclusives réservées à nos membres.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;