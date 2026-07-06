import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'user';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { isAuthenticated, role, token, id: currentUserId } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.users.findAll(token);
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (userId: string) => {
    if (userId === currentUserId) {
      alert('Vous ne pouvez pas supprimer votre propre compte administrateur.');
      return;
    }
    if (!window.confirm('Voulez-vous vraiment supprimer ce compte ? Cette action est irréversible.')) return;
    try {
      await api.users.remove(userId, token as string);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression du compte.');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    if (userId === currentUserId) {
      alert('Vous ne pouvez pas modifier votre propre rôle.');
      return;
    }
    setUpdatingId(userId);
    try {
      await api.users.update(userId, { role: newRole }, token as string);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      alert(err.message || 'Erreur lors du changement de rôle.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  return (
    <div className="py-10 md:py-14 container mx-auto px-4 lg:px-6 max-w-6xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Gestion des Utilisateurs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {loading ? 'Chargement...' : `${users.length} compte(s) inscrit(s) sur EVANA.`}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary font-bold text-sm">
          <UsersIcon className="w-4 h-4" />
          {loading ? '—' : users.length} utilisateur(s)
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-light text-danger-dark rounded-xl border border-danger/20 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-slate-400 text-center">Chargement des utilisateurs...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <UsersIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rôle</th>
                  <th className="px-6 py-3">Inscrit le</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {u.username} {isSelf && <span className="text-xs text-slate-400">(vous)</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-350">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          disabled={isSelf || updatingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'user')}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                        {u.role === 'admin' && (
                          <Badge variant="secondary" className="ml-2">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Admin
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={isSelf}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger-light text-danger-dark text-xs font-semibold hover:bg-danger/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;