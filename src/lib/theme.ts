/**
 * Theme system configuration and utilities
 */

import { Theme, ResolvedTheme, StoredThemePreference } from '@/types';

/**
 * Theme configuration constants
 */
export const themeConfig = {
  storageKey: 'portfolio-theme-preference',
  defaultTheme: 'system' as Theme,
  themes: ['light', 'dark', 'system'] as const,
  transitionDuration: '200ms',
  storageVersion: '1.0.0',
} as const;

/**
 * CSS custom properties mapping for theme colors
 */
export const cssVariables = {
  light: {
    '--color-background': '#ffffff',
    '--color-foreground': '#171717',
    '--color-primary': '#3b82f6',
    '--color-secondary': '#6b7280',
    '--color-accent': '#f3f4f6',
    '--color-border': '#e5e7eb',
    '--color-muted': '#9ca3af',
    '--color-card': '#ffffff',
    '--color-card-hover': '#f9fafb',
  },
  dark: {
    '--color-background': '#0a0a0a',
    '--color-foreground': '#ededed',
    '--color-primary': '#60a5fa',
    '--color-secondary': '#9ca3af',
    '--color-accent': '#1f2937',
    '--color-border': '#374151',
    '--color-muted': '#6b7280',
    '--color-card': '#111827',
    '--color-card-hover': '#1f2937',
  },
} as const;

/**
 * Validates if a value is a valid theme
 */
export const validateTheme = (value: unknown): Theme | null => {
  if (typeof value === 'string' && themeConfig.themes.includes(value as Theme)) {
    return value as Theme;
  }
  return null;
};

/**
 * Validates and parses stored theme preference
 */
export const validateStoredPreference = (
  stored: unknown
): StoredThemePreference | null => {
  try {
    if (typeof stored === 'string') {
      const parsed = JSON.parse(stored);
      
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        validateTheme(parsed.theme) &&
        typeof parsed.timestamp === 'number' &&
        typeof parsed.version === 'string'
      ) {
        return parsed as StoredThemePreference;
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored theme preference:', error);
  }
  
  return null;
};

/**
 * Gets the system color scheme preference
 */
export const getSystemPreference = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR
  }
  
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system preference:', error);
    return 'light';
  }
};

/**
 * Resolves a theme to its actual value (handles 'system' theme)
 */
export const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return getSystemPreference();
  }
  return theme;
};

/**
 * Stores theme preference in localStorage
 */
export const storeThemePreference = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const preference: StoredThemePreference = {
      theme,
      timestamp: Date.now(),
      version: themeConfig.storageVersion,
    };
    
    localStorage.setItem(themeConfig.storageKey, JSON.stringify(preference));
  } catch (error) {
    console.warn('Failed to store theme preference:', error);
  }
};

/**
 * Retrieves theme preference from localStorage
 */
export const getStoredThemePreference = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(themeConfig.storageKey);
    if (!stored) return null;
    
    const preference = validateStoredPreference(stored);
    return preference?.theme || null;
  } catch (error) {
    console.warn('Failed to retrieve theme preference:', error);
    return null;
  }
};

/**
 * Clears stored theme preference
 */
export const clearStoredThemePreference = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(themeConfig.storageKey);
  } catch (error) {
    console.warn('Failed to clear theme preference:', error);
  }
};

/**
 * Applies CSS variables to document root
 */
export const applyCSSVariables = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === 'undefined') return;
  
  const variables = cssVariables[resolvedTheme];
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Creates a media query listener for system preference changes
 */
export const createSystemPreferenceListener = (
  callback: (preference: ResolvedTheme) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {}; // No-op for SSR
  }
  
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      callback(event.matches ? 'dark' : 'light');
    };
    
    // Use addEventListener if available (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  } catch (error) {
    console.warn('Failed to create system preference listener:', error);
    return () => {};
  }
};

/**
 * Checks if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    console.warn('Failed to detect reduced motion preference:', error);
    return false;
  }
};