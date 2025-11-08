/**
 * Custom hook for theme management
 * 
 * This hook provides a convenient interface for components to interact
 * with the theme system without directly accessing the context.
 */

import { useThemeContext } from '@/contexts/ThemeContext';
import { Theme, ResolvedTheme } from '@/types';

/**
 * Return type for useTheme hook
 */
export interface UseThemeReturn {
  /** Current theme setting ('light', 'dark', or 'system') */
  theme: Theme;
  /** Resolved theme ('light' or 'dark') - handles 'system' resolution */
  resolvedTheme: ResolvedTheme;
  /** Function to set a specific theme */
  setTheme: (theme: Theme) => void;
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
  /** Current system preference ('light' or 'dark') */
  systemPreference: ResolvedTheme;
  /** Whether the theme system is still loading */
  isLoading: boolean;
  /** Whether the current theme is dark */
  isDark: boolean;
  /** Whether the current theme is light */
  isLight: boolean;
  /** Whether the theme is set to follow system preference */
  isSystemTheme: boolean;
}

/**
 * Custom hook for accessing and managing theme state
 * 
 * @returns Theme state and control functions
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme, isDark } = useTheme();
 *   
 *   return (
 *     <div className={isDark ? 'dark-styles' : 'light-styles'}>
 *       <button onClick={toggleTheme}>
 *         Switch to {isDark ? 'light' : 'dark'} mode
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const context = useThemeContext();
  
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemPreference,
    isLoading,
  } = context;

  // Computed values for convenience
  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystemTheme = theme === 'system';

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemPreference,
    isLoading,
    isDark,
    isLight,
    isSystemTheme,
  };
};

/**
 * Hook for components that only need to know if the theme is dark
 * Useful for simple conditional rendering based on theme
 * 
 * @returns boolean indicating if current theme is dark
 * 
 * @example
 * ```tsx
 * function SimpleComponent() {
 *   const isDark = useIsDarkTheme();
 *   
 *   return (
 *     <div className={isDark ? 'text-white' : 'text-black'}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsDarkTheme = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook for getting theme-aware CSS classes
 * Provides common class combinations for theme-aware styling
 * 
 * @returns Object with common theme-aware class combinations
 * 
 * @example
 * ```tsx
 * function ThemedCard() {
 *   const classes = useThemeClasses();
 *   
 *   return (
 *     <div className={`${classes.card} p-4 rounded-lg`}>
 *       <h2 className={classes.heading}>Title</h2>
 *       <p className={classes.text}>Content</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useThemeClasses = () => {
  const { isDark } = useTheme();
  
  return {
    // Background classes
    background: isDark ? 'bg-gray-900' : 'bg-white',
    backgroundSecondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
    
    // Text classes
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Border classes
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    borderLight: isDark ? 'border-gray-800' : 'border-gray-100',
    
    // Card classes
    card: isDark 
      ? 'bg-gray-800 border-gray-700 text-gray-100' 
      : 'bg-white border-gray-200 text-gray-900',
    cardHover: isDark
      ? 'hover:bg-gray-700'
      : 'hover:bg-gray-50',
    
    // Button classes
    button: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    buttonPrimary: isDark
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-500 hover:bg-blue-600 text-white',
  };
};