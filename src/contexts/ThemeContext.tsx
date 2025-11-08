'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  Theme, 
  ResolvedTheme, 
  ThemeContextType 
} from '@/types';
import {
  themeConfig,
  getSystemPreference,
  resolveTheme,
  storeThemePreference,
  getStoredThemePreference,
  applyCSSVariables,
  createSystemPreferenceListener,
} from '@/lib/theme';

/**
 * Theme Context for managing application-wide theme state
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Props for ThemeProvider component
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * ThemeProvider component that manages theme state and provides context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = themeConfig.defaultTheme 
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Compute resolved theme based on current theme and system preference
  const resolvedTheme = React.useMemo(() => {
    if (theme === 'system') {
      return systemPreference;
    }
    return theme as ResolvedTheme;
  }, [theme, systemPreference]);

  /**
   * Initialize theme on component mount
   */
  useEffect(() => {
    const initializeTheme = () => {
      try {
        console.log('Initializing theme...');
        
        // Get system preference
        const systemPref = getSystemPreference();
        console.log('System preference:', systemPref);
        setSystemPreference(systemPref);

        // Try to load stored preference
        const storedTheme = getStoredThemePreference();
        console.log('Stored theme:', storedTheme);
        
        if (storedTheme) {
          setThemeState(storedTheme);
        } else {
          // Use default theme if no stored preference
          setThemeState(defaultTheme);
        }
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        setThemeState('light'); // Fallback to light theme
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [defaultTheme]);

  /**
   * Apply CSS variables when resolved theme changes
   */
  useEffect(() => {
    if (!isLoading) {
      console.log('Applying theme:', resolvedTheme);
      applyCSSVariables(resolvedTheme);
      
      // Update document class for Tailwind dark mode
      const root = document.documentElement;
      if (resolvedTheme === 'dark') {
        console.log('Adding dark class to root');
        root.classList.add('dark');
      } else {
        console.log('Removing dark class from root');
        root.classList.remove('dark');
      }
      console.log('Root classes:', root.className);
    }
  }, [resolvedTheme, isLoading]);

  /**
   * Listen for system preference changes
   */
  useEffect(() => {
    const cleanup = createSystemPreferenceListener((newPreference) => {
      setSystemPreference(newPreference);
      
      // If current theme is 'system', CSS variables will update automatically
      // due to the resolvedTheme dependency in the previous useEffect
    });

    return cleanup;
  }, []);

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = useCallback((newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      storeThemePreference(newTheme);
    } catch (error) {
      console.warn('Failed to set theme:', error);
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    console.log('Toggle theme called. Current theme:', theme, 'Resolved:', resolvedTheme);
    const newTheme: Theme = resolvedTheme === 'light' ? 'dark' : 'light';
    console.log('Setting new theme:', newTheme);
    setTheme(newTheme);
  }, [theme, resolvedTheme, setTheme]);

  /**
   * Context value
   */
  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemPreference,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};