import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setupThemeChangeListener, applyDarkModeToElements, applyThemeToExternalLibraries } from '../utils/ThemeUtils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark'; // The actual applied theme (resolves 'system')
  setThemeDirectly: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to system
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'system';
  });

  // Track the actual applied theme (resolving 'system' to either light or dark)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Function to check if system prefers dark mode
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Function to check if there's a scheduled theme override
  const getScheduledTheme = (): 'light' | 'dark' | null => {
    const isAutoTheme = localStorage.getItem('autoTheme') === 'true';
    if (!isAutoTheme) return null;
    
    const hour = new Date().getHours();
    return hour >= 19 || hour < 7 ? 'dark' : 'light';
  };

  // Function to directly set a theme
  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Function to toggle between light, dark, and system themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };  
  
  // Update localStorage and apply theme to HTML element when theme changes
  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Determine which theme to actually apply (scheduled > system > preference)
    const scheduledTheme = getScheduledTheme();
    const systemTheme = getSystemTheme();
    const applyTheme = scheduledTheme || (theme === 'system' ? systemTheme : theme);
    
    setCurrentTheme(applyTheme);
    
    // Apply or remove dark class from document element
    if (applyTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Apply theme to elements that don't automatically get styled with Tailwind
    applyDarkModeToElements();
    
    // Apply theme to external libraries and components
    applyThemeToExternalLibraries(applyTheme);
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    // Only attach listener if theme is 'system' or autoTheme is enabled
    if (theme !== 'system' && localStorage.getItem('autoTheme') !== 'true') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check
    const scheduledTheme = getScheduledTheme();
    if (scheduledTheme) {
      // Scheduled theme takes precedence
      setCurrentTheme(scheduledTheme);
      document.documentElement.classList.toggle('dark', scheduledTheme === 'dark');
      document.documentElement.classList.toggle('light', scheduledTheme === 'light');
    } else if (mediaQuery.matches) {
      setCurrentTheme('dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setCurrentTheme('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Add listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      // Check if there's a scheduled theme that should override
      const scheduledOverride = getScheduledTheme();
      if (scheduledOverride) {
        setCurrentTheme(scheduledOverride);
        
        if (scheduledOverride === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      } else {
        const newTheme = e.matches ? 'dark' : 'light';
        setCurrentTheme(newTheme);
        
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      }
      
      // Apply to elements that don't automatically get styled with Tailwind
      applyDarkModeToElements();
      
      // Apply to external libraries and components
      applyThemeToExternalLibraries(scheduledOverride || (e.matches ? 'dark' : 'light'));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);  
  
  // Apply the theme change listener on component mount
  useEffect(() => {
    const cleanup = setupThemeChangeListener();
    
    // Check for scheduled theme changes every hour
    const scheduleChecker = setInterval(() => {
      const scheduledTheme = getScheduledTheme();
      if (scheduledTheme) {
        setCurrentTheme(scheduledTheme);
        
        if (scheduledTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        
        // Apply to elements that don't automatically get styled with Tailwind
        applyDarkModeToElements();
        
        // Apply to external libraries and components
        applyThemeToExternalLibraries(scheduledTheme);
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => {
      cleanup();
      clearInterval(scheduleChecker);
    };
  }, []);

  const value = {
    theme,
    toggleTheme,
    currentTheme,
    setThemeDirectly,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
