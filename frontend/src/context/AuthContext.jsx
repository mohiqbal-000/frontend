import { createContext, useContext, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ideaforge_user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (authResponse) => {
    localStorage.setItem('ideaforge_token', authResponse.token);
    localStorage.setItem('ideaforge_user', JSON.stringify({
      userId: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
    }));
    setUser({ userId: authResponse.userId, name: authResponse.name, email: authResponse.email });
  };

  const login = useCallback(async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    persist(data);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await client.post('/auth/register', { name, email, password });
    persist(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ideaforge_token');
    localStorage.removeItem('ideaforge_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
