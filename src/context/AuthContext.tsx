import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY } from '../api/client';
import * as authApi from '../api/auth';
import type { CurrentUser } from '../types';

export interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (d: { email: string; password: string }) => Promise<void>;
  register: (d: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(({ token, user: nextUser }: { token: string; user: CurrentUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (data: { email: string; password: string }) => persist(await authApi.login(data)),
    [persist],
  );

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => persist(await authApi.register(data)),
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    setUser(await authApi.me());
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
