import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthState } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check credentials against environment variables
    const validUsername = import.meta.env.VITE_AUTH_USERNAME;
    const validPassword = import.meta.env.VITE_AUTH_PASSWORD;

    if (username === validUsername && password === validPassword) {
      setAuth({
        isAuthenticated: true,
        username,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      username: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
