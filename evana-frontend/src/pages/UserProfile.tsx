import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Shield, Key, Save } from 'lucide-react';
import Button from '../components/ui/Button';

const UserProfile: React.FC = () => {
  const { username, email, updateProfile } = useAuth();
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ phone });
      setSuccess('Informations mises à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Note : le backend ne vérifie pas currentPassword ici (l'utilisateur est déjà authentifié par JWT)
      await updateProfile({ password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setSuccess('Mot de passe changé avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-12 md:py-16 container mx-auto px-4 lg:px-6 max-w-4xl space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Mon Profil</h1>
          <p className="text-xs text-slate-400">Gérez vos informations de compte et vos préférences.</p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-primary" /> Membre EVANA
        </span>
      </div>

      {success && (
        <div className="p-4 bg-success-light text-success-dark text-sm rounded-xl font-semibold border border-success/20">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-danger-light text-danger-dark text-sm rounded-xl font-semibold border border-danger/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Volet gauche : Avatar & Informations rapides */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center space-y-4 shadow-soft">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shadow-soft">
            {username ? username[0].toUpperCase() : '?'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{username}</h3>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
        </div>

        {/* Volet droit : Formulaires */}
        <div className="md:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <form onSubmit={handleSaveInfo} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Informations personnelles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  disabled
                  value={username || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Adresse email
              </label>
              <input
                type="email"
                disabled
                value={email || ''}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-slate-400">L'adresse email ne peut pas être modifiée pour le moment.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
                Sauvegarder
              </Button>
            </div>
          </form>

          {/* Mot de passe */}
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Sécurité du compte
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" variant="outline" isLoading={saving}>
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
