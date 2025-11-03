/**
 * Utility functions for timeline events
 */

import { TimelineEventEntry, YearEventGroup, TimelineEventValidationError, EventPointPosition } from '@/types';

/**
 * Validate timeline event data and return any errors found
 * @param events - Array of timeline event entries
 * @returns Array of validation errors
 */
export function validateEventData(events: TimelineEventEntry[]): TimelineEventValidationError[] {
  const errors: TimelineEventValidationError[] = [];
  const seenIds = new Set<string>();

  events.forEach(event => {
    // Check required fields
    if (!event.id || !event.title || !event.date || !event.description) {
      errors.push({
        type: 'missing_field',
        eventId: event.id || 'unknown',
        message: '必須フィールドが不足しています'
      });
    }

    // Validate date format and validity
    if (event.date && isNaN(new Date(event.date).getTime())) {
      errors.push({
        type: 'invalid_date',
        eventId: event.id,
        message: '無効な日付形式です'
      });
    }

    // Check for duplicate IDs
    if (seenIds.has(event.id)) {
      errors.push({
        type: 'duplicate_id',
        eventId: event.id,
        message: 'IDが重複しています'
      });
    }
    seenIds.add(event.id);
  });

  return errors;
}

/**
 * Group events by year and sort them chronologically
 * @param events - Array of timeline event entries
 * @returns Array of year event groups
 */
export function groupEventsByYear(events: TimelineEventEntry[]): YearEventGroup[] {
  // Group events by year
  const yearGroups = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = { year, events: [] };
    }
    acc[year].events.push({ ...event, year });
    return acc;
  }, {} as Record<string, YearEventGroup>);

  // Sort events within each year by date
  Object.values(yearGroups).forEach(group => {
    group.events.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  // Return years sorted chronologically
  return Object.values(yearGroups).sort((a, b) => 
    parseInt(a.year) - parseInt(b.year)
  );
}

/**
 * Calculate event point position on the timeline
 * @param year - Year string
 * @param minDate - Minimum date for timeline calculation
 * @param pixelsPerYear - Pixels per year for positioning
 * @param mainLineX - X coordinate of the main branch line
 * @param topPadding - Top padding for the timeline
 * @returns Position coordinates
 */
export function calculateEventPointPosition(
  year: string,
  minDate: Date,
  pixelsPerYear: number,
  mainLineX: number,
  topPadding: number
): { x: number; y: number } {
  // Calculate position at the middle of the year (July 1st)
  const yearDate = new Date(`${year}-07-01`);
  const yearsDiff = (yearDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const y = topPadding + (yearsDiff * pixelsPerYear);

  return {
    x: mainLineX,
    y: y
  };
}

/**
 * Calculate positions for all event points
 * @param yearGroups - Array of year event groups
 * @param minDate - Minimum date for timeline calculation
 * @param pixelsPerYear - Pixels per year for positioning
 * @param mainLineX - X coordinate of the main branch line
 * @param topPadding - Top padding for the timeline
 * @returns Array of event point positions
 */
export function calculateEventPointPositions(
  yearGroups: YearEventGroup[],
  minDate: Date,
  pixelsPerYear: number,
  mainLineX: number,
  topPadding: number
): EventPointPosition[] {
  return yearGroups.map(yearGroup => {
    const position = calculateEventPointPosition(
      yearGroup.year,
      minDate,
      pixelsPerYear,
      mainLineX,
      topPadding
    );

    return {
      yearGroup,
      ...position
    };
  });
}

/**
 * Format date for display
 * @param dateStr - Date string in ISO format
 * @returns Formatted date string
 */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Extract year from date string
 * @param dateStr - Date string in ISO format
 * @returns Year as string
 */
export function extractEventYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

/**
 * Check if date string is in valid ISO 8601 format (YYYY-MM-DD)
 * @param dateStr - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidEventDate(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Generate screen reader description for event point
 * @param yearGroup - Year event group
 * @returns Accessible description string
 */
export function generateEventPointDescription(yearGroup: YearEventGroup): string {
  if (yearGroup.events.length === 1) {
    const event = yearGroup.events[0];
    return `${yearGroup.year}年のイベント: ${event.title}。クリックして詳細を表示。`;
  } else {
    return `${yearGroup.year}年に${yearGroup.events.length}件のイベント。クリックしてリストを表示。`;
  }
}