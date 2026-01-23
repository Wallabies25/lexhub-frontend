import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'user' | 'lawyer' | null;

interface UserContextType {
  isLoggedIn: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType & {
  user?: any;
  updateUser?: (updates: Partial<any>) => Promise<void>;
} | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>({
    displayName: 'Chandramukhiee',
    bio: 'Legal enthusiast. Passionate about IP law.',
    photo: '/default-avatar.png',
    email: 'john.doe@email.com',
  });

  const login = (newRole: UserRole) => {
    setIsLoggedIn(true);
    setRole(newRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  const updateUser = async (updates: Partial<any>) => {
    setUser((prev: any) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, role, setRole, login, logout, user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
