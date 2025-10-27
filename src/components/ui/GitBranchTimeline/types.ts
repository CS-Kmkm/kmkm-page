/**
 * Type definitions for Git Branch Timeline
 */

import type { ExtendedCareerEntry, MergeTarget } from '@/types';

export interface LayoutNode {
  entry: ExtendedCareerEntry;
  x: number;
  y: number;
  startY: number;
  endY: number;
  lane: number;
  color: string;
  parentId: string | null;
  mergeTargets?: MergeTarget[];
  labelY?: number;
  labelX?: number;
  branchLineStartY?: number;
  branchLineEndY?: number;
}

export interface PlacedLabel {
  node: LayoutNode;
  x: number;
  y: number;
  yStart: number;
  yEnd: number;
}

export interface Tick {
  x: number;
  y: number;
}

export interface YearLabel {
  y: number;
  label: string;
}

export interface LabelCandidate {
  x: number;
  y: number;
  column: number;
}
