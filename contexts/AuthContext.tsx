import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(true); // Can be used later for async checks

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // useMemo is used to prevent the context value from changing on every render
  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
    logout,
    isLoading
  }), [currentUser, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
