import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authAPI } from '../api/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authAPI.getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authAPI.login(email, password);
    setUser(u);
  };

  const register = async (name: string, email: string, password: string) => {
    const u = await authAPI.register(name, email, password);
    setUser(u);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateUser = (u: User) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
