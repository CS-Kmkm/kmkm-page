/**
 * BranchLine component for rendering branch connections in Git-style timeline
 */

'use client';

import { ComputedBranch } from '@/types';

export interface BranchLineProps {
  branch: ComputedBranch;
  parentBranch?: ComputedBranch;
  type: 'branch' | 'merge' | 'connection';
  color: string;
  animated?: boolean;
}

/**
 * Create SVG path for branch line (parent to child)
 * Parent side is straight, child side has smooth curve
 * @param parentX - Parent X coordinate
 * @param parentY - Parent Y coordinate
 * @param childX - Child X coordinate
 * @param childY - Child Y coordinate
 * @returns SVG path string
 */
export function createBranchPath(
  parentX: number,
  parentY: number,
  childX: number,
  childY: number
): string {
  const dx = childX - parentX;
  const dy = childY - parentY;
  
  if (Math.abs(dx) < 5) {
    // Same column - straight line
    return `M ${parentX} ${parentY} L ${childX} ${childY}`;
  }
  
  // Parent side straight, child side curved
  const curveRadius = 15;
  const verticalSegment = Math.abs(dy) * 0.3;
  const turn1Y = parentY + verticalSegment;
  
  if (dx > 0) {
    // Branching right
    return `
      M ${parentX} ${parentY}
      L ${parentX} ${turn1Y}
      L ${childX - curveRadius} ${turn1Y}
      Q ${childX} ${turn1Y}, ${childX} ${turn1Y + curveRadius}
      L ${childX} ${childY}
    `;
  } else {
    // Branching left
    return `
      M ${parentX} ${parentY}
      L ${parentX} ${turn1Y}
      L ${childX + curveRadius} ${turn1Y}
      Q ${childX} ${turn1Y}, ${childX} ${turn1Y + curveRadius}
      L ${childX} ${childY}
    `;
  }
}

/**
 * Create SVG path for merge line (child to parent)
 * Child side has smooth curve, parent side is straight
 * @param childX - Child X coordinate
 * @param childY - Child Y coordinate
 * @param parentX - Parent X coordinate
 * @param parentY - Parent Y coordinate
 * @returns SVG path string
 */
export function createMergePath(
  childX: number,
  childY: number,
  parentX: number,
  parentY: number
): string {
  const dx = parentX - childX;
  const dy = parentY - childY;
  
  if (Math.abs(dx) < 5) {
    // Same column - straight line
    return `M ${childX} ${childY} L ${parentX} ${parentY}`;
  }
  
  // Child side curved, parent side straight
  const curveRadius = 15;
  const verticalSegment = Math.abs(dy) * 0.3;
  const turn1Y = childY + verticalSegment;
  
  if (dx < 0) {
    // Merging left
    return `
      M ${childX} ${childY}
      L ${childX} ${turn1Y - curveRadius}
      Q ${childX} ${turn1Y}, ${childX + dx + curveRadius} ${turn1Y}
      L ${parentX} ${turn1Y}
      L ${parentX} ${parentY}
    `;
  } else {
    // Merging right
    return `
      M ${childX} ${childY}
      L ${childX} ${turn1Y - curveRadius}
      Q ${childX} ${turn1Y}, ${childX + curveRadius} ${turn1Y}
      L ${parentX} ${turn1Y}
      L ${parentX} ${parentY}
    `;
  }
}

/**
 * Create SVG path for connection line (straight vertical line)
 * @param x - X coordinate
 * @param y1 - Start Y coordinate
 * @param y2 - End Y coordinate
 * @returns SVG path string
 */
export function createConnectionPath(
  x: number,
  y1: number,
  y2: number
): string {
  return `M ${x} ${y1} L ${x} ${y2}`;
}

/**
 * BranchLine component
 * Renders SVG paths for branch connections
 */
export default function BranchLine({
  branch,
  parentBranch,
  type,
  color,
  animated = false,
}: BranchLineProps) {
  let pathData = '';

  switch (type) {
    case 'branch':
      if (parentBranch) {
        pathData = createBranchPath(
          parentBranch.xOffset,
          parentBranch.startY,
          branch.xOffset,
          branch.startY
        );
      }
      break;

    case 'merge':
      if (parentBranch) {
        pathData = createMergePath(
          branch.xOffset,
          branch.endY,
          parentBranch.xOffset,
          parentBranch.endY
        );
      }
      break;

    case 'connection':
      pathData = createConnectionPath(
        branch.xOffset,
        branch.startY,
        branch.endY
      );
      break;
  }

  if (!pathData) return null;

  return (
    <path
      d={pathData}
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`
        transition-all duration-300
        ${animated ? 'animate-draw-line' : ''}
      `}
      style={{
        opacity: 0.9,
      }}
    />
  );
}
