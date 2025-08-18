import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, type UserProfile } from '../services/api';

interface AuthContextType {
  user: UserProfile['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<string>;
  register: (userData: any) => Promise<void>;
  registerLawyer: (lawyerData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const savedToken = localStorage.getItem('lexhub_token');
    if (savedToken) {
      setToken(savedToken);
      // Validate token and get user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      setUser(profile.user);
    } catch (error) {
      // Token might be invalid, clear it
      localStorage.removeItem('lexhub_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    console.log('AuthContext: Attempting login with', credentials.email);
    try {
      const response = await apiService.login(credentials);
      console.log('AuthContext: Login response', response);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('lexhub_token', response.token);
      
      // Return user role for navigation purposes
      return response.user.role;
    } catch (error) {
      console.error('AuthContext: Login error', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    // Register user but don't auto-login
    await apiService.register(userData);
    // Don't set user or token - user needs to login separately
  };

  const registerLawyer = async (lawyerData: any) => {
    // Register lawyer but don't auto-login
    await apiService.registerLawyer(lawyerData);
    // Don't set user or token - user needs to login separately
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lexhub_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        registerLawyer,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}