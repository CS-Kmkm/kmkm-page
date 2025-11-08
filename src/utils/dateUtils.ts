/**
 * Date utility functions for display date filtering
 */

import { DateFilterOptions } from '@/types';

/**
 * Get current date in YYYY-MM-DD format
 * @returns Current date string in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse display date string safely
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Date object or null if parsing fails
 */
export function parseDisplayDate(dateStr: string): Date | null {
  try {
    // Add time to ensure local timezone interpretation
    const date = new Date(dateStr + 'T00:00:00');
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Check if content should be displayed based on display date
 * @param displayDate Display date string in YYYY-MM-DD format
 * @param referenceDate Reference date string (defaults to current date)
 * @returns True if content should be displayed, false otherwise
 */
export function isDisplayable(displayDate: string, referenceDate?: string): boolean {
  const dispDate = parseDisplayDate(displayDate);
  const refDate = parseDisplayDate(referenceDate || getCurrentDate());
  
  // If parsing fails, treat as displayable (fail-safe approach)
  if (!dispDate || !refDate) {
    console.warn(`Date parsing error: displayDate=${displayDate}, referenceDate=${referenceDate}`);
    return true;
  }
  
  return dispDate <= refDate;
}

/**
 * Filter items by display date
 * @param items Array of items with displayDate field
 * @param options Filtering options
 * @returns Filtered array of items
 */
export function filterByDisplayDate<T extends { displayDate: string; toBeAppear?: boolean }>(
  items: T[],
  options: DateFilterOptions = {}
): T[] {
  const { referenceDate, includeToday = true } = options;
  const refDate = referenceDate || getCurrentDate();
  
  return items.filter(item => {
    // If toBeAppear is true, always include the item regardless of displayDate
    if (item.toBeAppear === true) {
      return true;
    }
    
    const dispDate = parseDisplayDate(item.displayDate);
    const refDateObj = parseDisplayDate(refDate);
    
    // If parsing fails, include the item (fail-safe approach)
    if (!dispDate || !refDateObj) {
      console.warn(`Date parsing error for item: displayDate=${item.displayDate}, referenceDate=${refDate}`);
      return true;
    }
    
    if (includeToday) {
      return dispDate <= refDateObj;
    } else {
      return dispDate < refDateObj;
    }
  });
}