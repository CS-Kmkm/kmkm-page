'use client';

import type { KeyboardEvent } from 'react';
import { useI18n } from '@/lib/i18n';
import { getTabClasses } from '@/lib/theme/tokens';

export type ViewMode = 'timeline' | 'list';

export interface ViewToggleButtonProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}


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
            className={getTabClasses(isActive)}
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
