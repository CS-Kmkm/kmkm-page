'use client';

import React from 'react';

export type ViewMode = 'timeline' | 'list';

export interface ViewToggleButtonProps {
  currentView: ViewMode;
  onToggle: () => void;
  className?: string;
}

const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({
  currentView,
  onToggle,
  className = ''
}) => {
  const isTimeline = currentView === 'timeline';

  return (
    <button
      onClick={onToggle}
      className={`
        px-4 py-2 text-sm font-medium
        text-slate-700 dark:text-gray-300
        bg-white dark:bg-gray-700
        border border-slate-300 dark:border-gray-600
        rounded-lg
        hover:bg-slate-50 dark:hover:bg-gray-600
        transition-colors
        min-h-[44px] min-w-[44px]
        w-[44px] sm:w-[180px]
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        focus:ring-offset-2 dark:focus:ring-offset-gray-900
        flex items-center justify-center gap-2
        ${className}
      `}
      aria-label={`表示モードを切り替え: 現在は${isTimeline ? 'タイムライン' : 'リスト'}表示`}
      aria-pressed={false}
      type="button"
    >
      {/* Icon */}
      <span className="flex-shrink-0" aria-hidden="true">
        {isTimeline ? (
          // List icon
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          // Branch/Timeline icon
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"
            />
          </svg>
        )}
      </span>

      {/* Label */}
      <span className="hidden sm:inline whitespace-nowrap">
        {isTimeline ? 'リスト表示' : 'タイムライン表示'}
      </span>
    </button>
  );
};

export default ViewToggleButton;
