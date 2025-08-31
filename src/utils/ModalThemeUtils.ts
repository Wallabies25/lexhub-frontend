// This utility forces modals to inherit the current theme
// Helps with dynamically created modals that might not inherit dark mode properly

import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * A hook that can be used inside modal components to ensure they inherit the current theme
 * Particularly useful for modals that are portaled outside of the main React tree
 */
export const useModalTheme = (modalRef: React.RefObject<HTMLElement>) => {
  const { currentTheme } = useTheme();
  
  useEffect(() => {
    if (modalRef.current) {
      if (currentTheme === 'dark') {
        modalRef.current.classList.add('dark');
        modalRef.current.classList.remove('light');
      } else {
        modalRef.current.classList.remove('dark');
        modalRef.current.classList.add('light');
      }
    }
  }, [currentTheme, modalRef]);
};

/**
 * A function to apply the current theme to a modal or dialog element
 * Can be used in vanilla JS contexts where hooks aren't available
 */
export const applyThemeToModal = (element: HTMLElement | null) => {
  if (!element) return;
  
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (isDarkMode) {
    element.classList.add('dark');
    element.classList.remove('light');
  } else {
    element.classList.remove('dark');
    element.classList.add('light');
  }
};
