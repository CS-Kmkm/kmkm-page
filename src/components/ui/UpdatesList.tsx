/**
 * UpdatesList - Component for displaying a list of updates
 * Refactored to use generic ListItem and Modal components with English labels
 */

'use client';

import { useState } from 'react';
import { UpdatesListProps, UpdateItem } from '@/types';
import { Modal } from './Modal';
import { ListItem } from './ListItem';
import { getUpdateCategoryConfig } from '@/lib/constants/categories';
import { HEADING_LABELS, UI_LABELS } from '@/lib/constants/labels';
import { EMPTY_STATE_MESSAGES, COUNT_MESSAGES } from '@/lib/constants/messages';
import { tokens } from '@/lib/theme/tokens';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function UpdateModal({ update, onClose }: { update: UpdateItem | null; onClose: () => void }) {
  if (!update) return null;

  const categoryConfig = getUpdateCategoryConfig(update.category);

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
      <div className={`${tokens.text.secondary} leading-relaxed`}>
        {update.description}
      </div>
    </Modal>
  );
}

export default function UpdatesList({ 
  updates, 
  maxItems = 5,
  showScrollable = false,
  className = ''
}: UpdatesListProps & { showScrollable?: boolean; className?: string }) {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);

  // Sort updates by date (newest first)
  const sortedUpdates = [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedUpdates.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className={tokens.text.muted}>{EMPTY_STATE_MESSAGES.noUpdates}</p>
      </div>
    );
  }

  // Display logic: show maxItems initially, or all if not scrollable
  const displayUpdates = showScrollable ? sortedUpdates : sortedUpdates.slice(0, maxItems);

  return (
    <>
      <section className={className} aria-labelledby="updates-heading">
        <h2 
          id="updates-heading" 
          className={`text-2xl font-bold ${tokens.text.primary} mb-6`}
        >
          {HEADING_LABELS.latestUpdates}
        </h2>
        
        <div 
          className={`space-y-4 ${showScrollable ? 'max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' : ''}`}
          style={showScrollable ? { scrollbarWidth: 'thin' } : undefined}
        >
          {displayUpdates.map((update) => {
            const categoryConfig = getUpdateCategoryConfig(update.category);
            
            return (
              <ListItem
                key={update.id}
                title={update.title}
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
            );
          })}
        </div>

        {!showScrollable && updates.length > maxItems && (
          <div className="mt-6 text-center">
            <p className={`text-sm ${tokens.text.muted}`}>
              {COUNT_MESSAGES.moreItems(updates.length - maxItems)}
            </p>
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
