import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  // Check for token in localStorage or sessionStorage to determine if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  });
  
  // Get role from storage
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('user_role') as UserRole) || 
           (sessionStorage.getItem('user_role') as UserRole) || 
           null;
  });
  
  // Get user details from storage
  const [user, setUser] = useState<any>(() => {
    return {
      displayName: localStorage.getItem('user_name') || sessionStorage.getItem('user_name') || 'Guest',
      email: localStorage.getItem('user_email') || sessionStorage.getItem('user_email') || '',
      bio: localStorage.getItem('user_bio') || sessionStorage.getItem('user_bio') || 'LexHub IP user',
      photo: localStorage.getItem('user_photo') || sessionStorage.getItem('user_photo') || '/default-avatar.png',
    };
  });
  // Update state when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token') || !!sessionStorage.getItem('token'));
      setRole((localStorage.getItem('user_role') as UserRole) || 
              (sessionStorage.getItem('user_role') as UserRole) || 
              null);
      setUser({
        displayName: localStorage.getItem('user_name') || sessionStorage.getItem('user_name') || 'Guest',
        email: localStorage.getItem('user_email') || sessionStorage.getItem('user_email') || '',
        bio: localStorage.getItem('user_bio') || sessionStorage.getItem('user_bio') || 'LexHub IP user',
        photo: localStorage.getItem('user_photo') || sessionStorage.getItem('user_photo') || '/default-avatar.png',
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const login = (newRole: UserRole) => {
    setIsLoggedIn(true);
    setRole(newRole);
    localStorage.setItem('user_role', newRole || '');
    
    // Dispatch an event to notify components about the login
    window.dispatchEvent(new Event('storage'));
  };
  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_bio');
    localStorage.removeItem('user_photo');
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_bio');
    sessionStorage.removeItem('user_photo');
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
  };

  const updateUser = async (updates: Partial<any>) => {
    const newUser = { ...user, ...updates };
    setUser(newUser);
    
    // Update localStorage
    if (updates.displayName) localStorage.setItem('user_name', updates.displayName);
    if (updates.email) localStorage.setItem('user_email', updates.email);
    if (updates.bio) localStorage.setItem('user_bio', updates.bio);
    if (updates.photo) localStorage.setItem('user_photo', updates.photo);
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
