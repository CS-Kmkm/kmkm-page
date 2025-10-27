/**
 * Data validation logic for career entries
 */

import { ExtendedCareerEntry, ValidationError } from '@/types';

/**
 * Validate career data and return any errors found
 * @param entries - Array of extended career entries
 * @returns Array of validation errors
 */
export function validateCareerData(entries: ExtendedCareerEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const entryIds = new Set(entries.map(e => e.id));

  entries.forEach(entry => {
    // Check required fields
    if (!entry.id || !entry.organization || !entry.role || !entry.startDate) {
      errors.push({
        type: 'missing_field',
        entryId: entry.id || 'unknown',
        message: '必須フィールドが不足しています',
      });
    }

    // Validate date logic
    if (entry.startDate && entry.endDate) {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      if (start > end) {
        errors.push({
          type: 'invalid_date',
          entryId: entry.id,
          message: '開始日が終了日より後になっています',
        });
      }
    }

    // Check parent entry exists
    if (entry.parentId && !entryIds.has(entry.parentId)) {
      errors.push({
        type: 'invalid_parent',
        entryId: entry.id,
        message: `親エントリー ${entry.parentId} が見つかりません`,
      });
    }

    // Validate merge targets
    if (entry.mergeTargets) {
      entry.mergeTargets.forEach(target => {
        if (target.type === 'entry') {
          if (!target.id) {
            errors.push({
              type: 'invalid_merge_target',
              entryId: entry.id,
              message: 'マージ対象エントリーIDが指定されていません',
            });
          } else if (!entryIds.has(target.id)) {
            errors.push({
              type: 'invalid_merge_target',
              entryId: entry.id,
              message: `マージ対象 ${target.id} が見つかりません`,
            });
          }
        }
      });
    }
  });

  // Check for circular references
  const circularRefs = detectCircularReferences(entries);
  circularRefs.forEach(entryId => {
    errors.push({
      type: 'circular_reference',
      entryId,
      message: '循環参照が検出されました',
    });
  });

  return errors;
}

/**
 * Detect circular references in parent-child relationships
 * @param entries - Array of extended career entries
 * @returns Array of entry IDs that are part of circular references
 */
export function detectCircularReferences(entries: ExtendedCareerEntry[]): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const circular: string[] = [];

  function dfs(entryId: string): boolean {
    visited.add(entryId);
    recursionStack.add(entryId);

    const entry = entries.find(e => e.id === entryId);
    if (entry?.parentId) {
      if (!visited.has(entry.parentId)) {
        if (dfs(entry.parentId)) return true;
      } else if (recursionStack.has(entry.parentId)) {
        circular.push(entryId);
        return true;
      }
    }

    recursionStack.delete(entryId);
    return false;
  }

  entries.forEach(entry => {
    if (!visited.has(entry.id)) {
      dfs(entry.id);
    }
  });

  return circular;
}

/**
 * Check if date string is in valid ISO 8601 format (YYYY-MM-DD)
 * @param dateStr - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDate(dateStr: string | null | undefined): boolean {
  if (dateStr === null || dateStr === undefined) return true; // null is valid for endDate
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate that branch levels don't exceed maximum depth
 * @param entries - Array of extended career entries
 * @param maxDepth - Maximum allowed depth (default: 3)
 * @returns Array of entry IDs that exceed max depth
 */
export function validateMaxDepth(entries: ExtendedCareerEntry[], maxDepth: number = 3): string[] {
  const exceededIds: string[] = [];
  const entryMap = new Map(entries.map(e => [e.id, e]));

  function getDepth(entryId: string, visited = new Set<string>()): number {
    if (visited.has(entryId)) return 0; // Circular reference
    visited.add(entryId);

    const entry = entryMap.get(entryId);
    if (!entry || !entry.parentId) return 1;

    return 1 + getDepth(entry.parentId, visited);
  }

  entries.forEach(entry => {
    const depth = getDepth(entry.id);
    if (depth > maxDepth) {
      exceededIds.push(entry.id);
    }
  });

  return exceededIds;
}
