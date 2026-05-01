/**
 * UpdatesList - Component for displaying a list of updates
 * Refactored to use generic ListItem and Modal components with English labels
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { UpdatesListProps, UpdateItem } from '@/types';
import { Modal } from './Modal';
import { ListItem } from './ListItem';
import { getUpdateCategoryConfig } from '@/lib/constants/categories';
import { HEADING_LABELS, UI_LABELS } from '@/lib/constants/labels';
import { EMPTY_STATE_MESSAGES, COUNT_MESSAGES } from '@/lib/constants/messages';
import { tokens } from '@/lib/theme/tokens';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function UpdateModal({ update, onClose }: { update: UpdateItem | null; onClose: () => void }) {
  if (!update) return null;

  return (
    <Modal
      isOpen={!!update}
      onClose={onClose}
      title={update.title}
      description={update.description}
      size="md"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors}`}
          >
            {UI_LABELS.close}
          </button>
        </div>
      }
    >
      {/* Date and Category */}
      <div className="flex items-center gap-3 mb-4">
        <time 
          dateTime={update.date}
          className={`text-sm ${tokens.text.muted} font-medium`}
        >
          {formatDate(update.date)}
        </time>
      </div>

      {/* Description */}
      <div className={`${tokens.text.secondary} leading-relaxed whitespace-pre-line`}>
        {update.description}
      </div>
    </Modal>
  );
}

export default function UpdatesList({ 
  updates, 
  maxItems = 5,
  showScrollable = false,
  autoFitToViewport = false,
  moreItemsHref,
  className = ''
}: UpdatesListProps & { showScrollable?: boolean; className?: string }) {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);
  const [autoFitItems, setAutoFitItems] = useState(() => Math.max(1, maxItems));
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const measurementRef = useRef<HTMLDivElement | null>(null);
  const moreMessageMeasureRef = useRef<HTMLDivElement | null>(null);
  const isAutoFitEnabled = autoFitToViewport && !showScrollable;

  // Sort updates by date (newest first)
  const sortedUpdates = [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const calculateAutoFitItems = useCallback(() => {
    if (!isAutoFitEnabled || sortedUpdates.length === 0) return;

    const listElement = listRef.current;
    const measurementElement = measurementRef.current;
    if (!listElement || !measurementElement) return;

    const measuredItems = Array.from(
      measurementElement.querySelectorAll<HTMLElement>('[data-update-measure-item]')
    );
    if (measuredItems.length === 0) return;

    const listTop = listElement.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    const bottomPadding = 16;
    const availableHeight = Math.max(0, viewportHeight - listTop - bottomPadding);
    const gap = Number.parseFloat(window.getComputedStyle(listElement).rowGap || '0') || 0;
    const moreMessageHeight = moreMessageMeasureRef.current
      ? moreMessageMeasureRef.current.getBoundingClientRect().height
      : 0;
    const moreMessageMargin = moreMessageMeasureRef.current
      ? Number.parseFloat(window.getComputedStyle(moreMessageMeasureRef.current).marginTop || '0') || 0
      : 0;
    const hiddenMessageHeight = moreMessageHeight + moreMessageMargin;

    let nextCount = 1;
    let accumulatedHeight = 0;

    for (let index = 0; index < measuredItems.length; index += 1) {
      const itemHeight = measuredItems[index].getBoundingClientRect().height;
      const candidateHeight = accumulatedHeight + (index > 0 ? gap : 0) + itemHeight;
      const hiddenItemsHeight = index + 1 < measuredItems.length ? hiddenMessageHeight : 0;

      if (candidateHeight + hiddenItemsHeight <= availableHeight || index === 0) {
        accumulatedHeight = candidateHeight;
        nextCount = index + 1;
      } else {
        break;
      }
    }

    setAutoFitItems((currentCount) => (
      currentCount === nextCount ? currentCount : nextCount
    ));
  }, [isAutoFitEnabled, sortedUpdates.length]);

  useEffect(() => {
    if (!isAutoFitEnabled) return;

    calculateAutoFitItems();

    const frameId = window.requestAnimationFrame(calculateAutoFitItems);
    const resizeObserver = new ResizeObserver(calculateAutoFitItems);

    if (sectionRef.current) resizeObserver.observe(sectionRef.current);
    if (measurementRef.current) resizeObserver.observe(measurementRef.current);
    if (moreMessageMeasureRef.current) resizeObserver.observe(moreMessageMeasureRef.current);

    window.addEventListener('resize', calculateAutoFitItems);
    window.addEventListener('orientationchange', calculateAutoFitItems);
    document.fonts?.ready.then(calculateAutoFitItems).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateAutoFitItems);
      window.removeEventListener('orientationchange', calculateAutoFitItems);
    };
  }, [calculateAutoFitItems, isAutoFitEnabled]);

  if (sortedUpdates.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className={tokens.text.muted}>{EMPTY_STATE_MESSAGES.noUpdates}</p>
      </div>
    );
  }

  const visibleItemCount = isAutoFitEnabled ? autoFitItems : maxItems;

  // Display logic: show a compact subset unless scrollable display is explicitly requested
  const displayUpdates = showScrollable ? sortedUpdates : sortedUpdates.slice(0, visibleItemCount);
  const hiddenUpdateCount = updates.length - displayUpdates.length;

  return (
    <>
      <section ref={sectionRef} className={`relative ${className}`} aria-labelledby="updates-heading">
        <h2
          id="updates-heading"
          className={`text-lg sm:text-xl font-bold ${tokens.text.primary} mb-2`}
        >
          {HEADING_LABELS.latestUpdates}
        </h2>

        <div
          ref={listRef}
          className={`space-y-1.5 ${showScrollable ? 'max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' : ''}`}
          style={showScrollable ? { scrollbarWidth: 'thin' } : undefined}
        >
          {displayUpdates.map((update) => {
            const categoryConfig = getUpdateCategoryConfig(update.category);
            
            return (
              <div key={update.id} data-visible-update-item>
                <ListItem
                  title={update.title}
                  className="p-1.5 sm:p-2"
                  compact
                  meta={
                    <time dateTime={update.date}>
                      {formatDate(update.date)}
                    </time>
                  }
                  badge={{
                    label: categoryConfig.label,
                    variant: categoryConfig.variant,
                    icon: categoryConfig.icon,
                    ariaLabel: categoryConfig.ariaLabel,
                  }}
                  onClick={() => setSelectedUpdate(update)}
                />
              </div>
            );
          })}
        </div>

        {isAutoFitEnabled && (
          <>
            <div
              ref={measurementRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-0 -z-10 h-0 w-full space-y-1.5 overflow-hidden"
            >
              {sortedUpdates.map((update) => {
                const categoryConfig = getUpdateCategoryConfig(update.category);

                return (
                  <div key={update.id} data-update-measure-item>
                    <ListItem
                      title={update.title}
                      titleId={`measure-update-${update.id}`}
                      className="p-1.5 sm:p-2"
                      compact
                      meta={
                        <time dateTime={update.date}>
                          {formatDate(update.date)}
                        </time>
                      }
                      badge={{
                        label: categoryConfig.label,
                        variant: categoryConfig.variant,
                        icon: categoryConfig.icon,
                        ariaLabel: categoryConfig.ariaLabel,
                      }}
                      onClick={() => undefined}
                    />
                  </div>
                );
              })}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-0 -z-10 h-0 w-full overflow-hidden"
            >
              <div ref={moreMessageMeasureRef} className="mt-3 text-center">
                <p className={`text-sm ${tokens.text.muted}`}>
                  {COUNT_MESSAGES.moreItems(sortedUpdates.length)}
                </p>
              </div>
            </div>
          </>
        )}

        {!showScrollable && hiddenUpdateCount > 0 && (
          <div className="mt-3 text-center" data-visible-update-more>
            {moreItemsHref ? (
              <Link
                href={moreItemsHref}
                className={`inline-flex rounded-md px-2 py-1 text-sm ${tokens.text.muted} hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                aria-label={`${COUNT_MESSAGES.moreItems(hiddenUpdateCount)}を経歴リストで表示`}
              >
                {COUNT_MESSAGES.moreItems(hiddenUpdateCount)}
              </Link>
            ) : (
              <p className={`text-sm ${tokens.text.muted}`}>
                {COUNT_MESSAGES.moreItems(hiddenUpdateCount)}
              </p>
            )}
          </div>
        )}
      </section>

      <UpdateModal 
        update={selectedUpdate} 
        onClose={() => setSelectedUpdate(null)} 
      />
    </>
  );
}
