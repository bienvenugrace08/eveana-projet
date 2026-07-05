import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

type Role = 'admin' | 'user' | null;

interface AuthState {
  isAuthenticated: boolean;
  id: string | null;
  role: Role;
  username: string | null;
  email: string | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: 'admin' | 'user') => Promise<void>;
  updateProfile: (data: { username?: string; phone?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'evana_auth';

const EMPTY_STATE: AuthState = {
  isAuthenticated: false,
  id: null,
  role: null,
  username: null,
  email: null,
  token: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>(EMPTY_STATE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthState;
        setAuth(parsed);
      } catch (e) {
        console.error('Erreur de parsing evana_auth', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    const newState: AuthState = {
      isAuthenticated: true,
      id: data.user.id,
      role: data.user.roles[0] as Role,
      username: data.user.username,
      email: data.user.email,
      token: data.accessToken,
    };
    setAuth(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const logout = () => {
    setAuth(EMPTY_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (username: string, email: string, password: string, role: 'admin' | 'user') => {
    const data = await api.auth.register({ username, email, password, role });
    const newState: AuthState = {
      isAuthenticated: true,
      id: data.user.id,
      role: data.user.roles[0] as Role,
      username: data.user.username,
      email: data.user.email,
      token: data.accessToken,
    };
    setAuth(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  // Met à jour le profil (téléphone, mot de passe...) via PUT /users/:id, puis rafraîchit l'état local
  const updateProfile = async (data: { username?: string; phone?: string; password?: string }) => {
    if (!auth.id || !auth.token) {
      throw new Error('Vous devez être connecté pour modifier votre profil.');
    }
    const updated = await api.users.update(auth.id, data, auth.token);
    const newState: AuthState = {
      ...auth,
      username: updated.username ?? auth.username,
    };
    setAuth(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
