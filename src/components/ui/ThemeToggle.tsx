'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggleProps } from '@/types';
import { prefersReducedMotion } from '@/lib/theme';

/**
 * ThemeToggle component for switching between light and dark themes
 * 
 * Features:
 * - Animated icons with smooth transitions
 * - Keyboard accessibility
 * - Screen reader support
 * - Respects reduced motion preferences
 * - Multiple size variants
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { theme, resolvedTheme, toggleTheme, isLoading } = useTheme();
  
  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };
  
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  // Check if animations should be disabled
  const shouldReduceMotion = prefersReducedMotion();
  const transitionClass = shouldReduceMotion ? '' : 'transition-all duration-200';

  /**
   * Handle theme toggle with keyboard support
   */
  const handleToggle = () => {
    if (!isLoading) {
      toggleTheme();
    }
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  /**
   * Get appropriate ARIA label based on current theme
   */
  const getAriaLabel = (): string => {
    if (isLoading) return 'Loading theme toggle';
    
    const currentMode = resolvedTheme === 'dark' ? 'dark' : 'light';
    const nextMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    
    return `Switch from ${currentMode} to ${nextMode} mode. Current theme: ${theme}`;
  };

  /**
   * Sun icon for light mode
   */
  const SunIcon = () => (
    <svg
      className={`${iconSizes[size]} ${transitionClass}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  /**
   * Moon icon for dark mode
   */
  const MoonIcon = () => (
    <svg
      className={`${iconSizes[size]} ${transitionClass}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  /**
   * Loading spinner
   */
  const LoadingIcon = () => (
    <svg
      className={`${iconSizes[size]} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]}
          inline-flex items-center justify-center
          rounded-lg
          text-gray-700 dark:text-gray-200
          bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${transitionClass}
          ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
        `}
        aria-label={getAriaLabel()}
        title={getAriaLabel()}
      >
        {isLoading ? (
          <LoadingIcon />
        ) : resolvedTheme === 'dark' ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {isLoading ? 'Loading...' : `${resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode`}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;