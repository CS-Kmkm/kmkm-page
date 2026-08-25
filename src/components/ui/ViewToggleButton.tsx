'use client';

import type { KeyboardEvent } from 'react';
import { useI18n } from '@/lib/i18n';

export type ViewMode = 'timeline' | 'list';

export interface ViewToggleButtonProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

const tabClassName = (isActive: boolean) => [
  'relative min-h-11 border-0 bg-transparent px-0.5 pb-2 text-xs font-semibold transition-colors sm:px-1 sm:pb-3 sm:text-sm',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
  isActive
    ? 'text-blue-700 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-blue-600 dark:text-blue-300 dark:after:bg-blue-400'
    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
].join(' ');

const VIEW_ORDER: readonly ViewMode[] = ['timeline', 'list'];

export default function ViewToggleButton({
  currentView,
  onViewChange,
  className = ''
}: ViewToggleButtonProps) {
  const { locale, messages } = useI18n();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const currentIndex = VIEW_ORDER.indexOf(currentView);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? VIEW_ORDER.length - 1
        : event.key === 'ArrowLeft'
          ? (currentIndex - 1 + VIEW_ORDER.length) % VIEW_ORDER.length
          : (currentIndex + 1) % VIEW_ORDER.length;
    const nextView = VIEW_ORDER[nextIndex];
    onViewChange(nextView);
    requestAnimationFrame(() => {
      document.getElementById(`career-${nextView}-tab`)?.focus();
    });
  };

  return (
    <div
      className={`flex flex-shrink-0 gap-4 border-b border-gray-200 dark:border-gray-700 sm:gap-6 ${className}`}
      role="tablist"
      aria-label={locale === 'en' ? 'Career view' : '経歴の表示'}
    >
      {VIEW_ORDER.map((view) => {
        const isActive = currentView === view;
        return (
          <button
            key={view}
            id={`career-${view}-tab`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`career-${view}-panel`}
            tabIndex={isActive ? 0 : -1}
            className={tabClassName(isActive)}
            onClick={() => onViewChange(view)}
            onKeyDown={handleKeyDown}
          >
            {view === 'timeline' ? messages.timelineView : messages.listView}
          </button>
        );
      })}
    </div>
  );
}
