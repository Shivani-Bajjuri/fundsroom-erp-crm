import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<User>;
  signup: (data: { name: string; email: string; password: string; role: Role }) => Promise<User>;
  logout: (message?: string) => void;
  isAuthenticated: boolean;
  authError: string | null;
  setAuthError: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('erp_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('erp_user');
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('erp_token'));
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      document.body.className = `bg-dark-900 text-slate-100 font-sans antialiased min-h-screen role-${user.role.toLowerCase()}`;
    } else {
      document.body.className = 'bg-dark-900 text-slate-100 font-sans antialiased min-h-screen';
    }
  }, [user, token]);

  const login = async (email: string, password?: string): Promise<User> => {
    setAuthError(null);
    try {
      const result = await AuthService.login(email, password);
      if (!result || !result.user || !result.token) {
        throw new Error('Invalid response from authentication server.');
      }
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('erp_user', JSON.stringify(result.user));
      localStorage.setItem('erp_token', result.token);
      return result.user;
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (data: { name: string; email: string; password: string; role: Role }): Promise<User> => {
    setAuthError(null);
    try {
      const result = await AuthService.signup(data);
      if (!result || !result.user || !result.token) {
        throw new Error('Registration response was invalid.');
      }
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('erp_user', JSON.stringify(result.user));
      localStorage.setItem('erp_token', result.token);
      return result.user;
    } catch (err: any) {
      const msg = err.message || 'Account registration failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = (message?: string) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
    if (message) {
      setAuthError(message);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      isAuthenticated,
      authError,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
