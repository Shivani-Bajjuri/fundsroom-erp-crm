import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<User>;
  signup: (data: { name: string; email: string; password: string; role: Role }) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('erp_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('erp_token'));

  useEffect(() => {
    if (user) {
      document.body.className = `bg-dark-900 text-slate-100 font-sans antialiased min-h-screen role-${user.role.toLowerCase()}`;
    } else {
      document.body.className = 'bg-dark-900 text-slate-100 font-sans antialiased min-h-screen';
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<User> => {
    const result = await AuthService.login(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('erp_user', JSON.stringify(result.user));
    localStorage.setItem('erp_token', result.token);
    return result.user;
  };

  const signup = async (data: { name: string; email: string; password: string; role: Role }): Promise<User> => {
    const result = await AuthService.signup(data);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('erp_user', JSON.stringify(result.user));
    localStorage.setItem('erp_token', result.token);
    return result.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      isAuthenticated: !!user
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
