'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/common';
import GitBranchTimeline from '@/components/ui/GitBranchTimeline';
import { getCareerEntries, getTimelineEvents } from '@/data';
import { ExtendedCareerEntry, TimelineEventEntry } from '@/types';

// Constants
const DEFAULT_REVERSED_STATE = true;
const PAGE_TITLE = '経歴';
const TIMELINE_HEADING_ID = 'timeline-heading';

// Component for breadcrumb navigation
function BreadcrumbNavigation() {
  return (
    <nav aria-label="パンくずナビゲーション" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link
            href="/"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="トップページに戻る"
          >
            トップ
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-400 dark:text-gray-500">/</li>
        <li className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
          {PAGE_TITLE}
        </li>
      </ol>
    </nav>
  );
}

// Component for page header with reverse toggle
interface PageHeaderProps {
  isReversed: boolean;
  onToggleReverse: () => void;
}

function PageHeader({ isReversed, onToggleReverse }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
        {PAGE_TITLE}
      </h1>
      <button
        onClick={onToggleReverse}
        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors min-h-[44px] self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="ブランチの順序を反転"
        type="button"
      >
        {isReversed ? "↓" : "↑"} 順序反転
      </button>
    </div>
  );
}

// Component for empty state
function EmptyState() {
  return (
    <div className="text-center py-8 sm:py-12">
      <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
        経歴情報が見つかりませんでした。
      </p>
    </div>
  );
}

// Component for timeline section
interface TimelineSectionProps {
  careerEntries: ExtendedCareerEntry[];
  timelineEvents: TimelineEventEntry[];
  isReversed: boolean;
}

function TimelineSection({ careerEntries, timelineEvents, isReversed }: TimelineSectionProps) {
  const hasCareerData = careerEntries.length > 0;

  return (
    <section aria-labelledby={TIMELINE_HEADING_ID}>
      <h2 id={TIMELINE_HEADING_ID} className="sr-only">
        経歴タイムライン
      </h2>

      {hasCareerData ? (
        <GitBranchTimeline
          entries={careerEntries}
          events={timelineEvents}
          enableEventPoints={true}
          className="px-2 sm:px-4"
          isReversed={isReversed}
        />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

// Custom hook for career data
function useCareerData() {
  return useMemo(() => {
    const careerEntries = getCareerEntries() as ExtendedCareerEntry[];
    const timelineEvents = getTimelineEvents();
    
    return {
      careerEntries,
      timelineEvents
    };
  }, []);
}

// Custom hook for reverse state management
function useReverseState() {
  const [isReversed, setIsReversed] = useState(DEFAULT_REVERSED_STATE);
  
  const toggleReverse = () => {
    setIsReversed(prev => !prev);
  };

  return {
    isReversed,
    toggleReverse
  };
}

// Main component
export default function CareerPage() {
  const { careerEntries, timelineEvents } = useCareerData();
  const { isReversed, toggleReverse } = useReverseState();

  return (
    <PageLayout
      title={PAGE_TITLE}
      className="max-w-6xl mx-auto"
    >
      <BreadcrumbNavigation />
      
      <PageHeader 
        isReversed={isReversed} 
        onToggleReverse={toggleReverse} 
      />
      
      <TimelineSection
        careerEntries={careerEntries}
        timelineEvents={timelineEvents}
        isReversed={isReversed}
      />
    </PageLayout>
  );
}