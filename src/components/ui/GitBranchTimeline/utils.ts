/**
 * Utility functions for Git Branch Timeline
 */

import type { ExtendedCareerEntry } from '@/types';
import { LAYOUT } from './constants';

/**
 * Format date to YYYY.MM format
 */
export function formatYearMonth(date: string | undefined | null): string {
  if (!date) return '現在';
  const [year, month] = date.split('-');
  if (!year || !month) return date;
  return `${year}.${month}`;
}

/**
 * Format entry date range
 */
export function formatRange(entry: ExtendedCareerEntry): string {
  const start = formatYearMonth(entry.startDate);
  const end = entry.endDate ? formatYearMonth(entry.endDate) : '現在';
  return `${start} - ${end}`;
}

/**
 * Calculate years difference between two dates
 */
export function getYearsDiff(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

/**
 * Calculate Y coordinate for start date
 */
export function calculateStartY(startDate: string, minDate: Date): number {
  const entryDate = new Date(startDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return LAYOUT.TOP_PADDING + (yearsDiff * LAYOUT.PIXELS_PER_YEAR);
}

/**
 * Calculate Y coordinate for end date
 */
export function calculateEndY(
  endDate: string | null,
  minDate: Date,
  maxDate: Date
): number {
  if (!endDate || endDate === 'null') {
    const yearsDiff = getYearsDiff(maxDate, minDate);
    return LAYOUT.TOP_PADDING + (yearsDiff * LAYOUT.PIXELS_PER_YEAR);
  }
  
  const entryDate = new Date(endDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return LAYOUT.TOP_PADDING + (yearsDiff * LAYOUT.PIXELS_PER_YEAR);
}

/**
 * Extract year from date string
 */
export function extractYear(dateStr: string): string {
  const [year] = dateStr.split('-');
  return year ?? '';
}

/**
 * Check if two time periods overlap
 */
export function periodsOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return !(end1 <= start2 || start1 >= end2);
}
