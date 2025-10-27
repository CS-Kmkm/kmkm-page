/**
 * Layout calculation logic for Git-style career timeline
 */

import { useState, useEffect } from 'react';
import { ExtendedCareerEntry, ComputedBranch, BranchNode } from '@/types';

/**
 * Layout configuration constants
 */
export const LAYOUT_CONFIG = {
  BASE_X: 100,              // Main branch X position
  BRANCH_SPACING: 120,      // Spacing between branch levels (reduced from 200)
  PIXELS_PER_YEAR: 50,      // Vertical pixels per year
  TOP_PADDING: 50,          // Top padding
  NODE_RADIUS: 8,           // Default node radius
  MOBILE_BRANCH_SPACING: 80,
  TABLET_BRANCH_SPACING: 100,
  DESKTOP_BRANCH_SPACING: 120,
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 0,      // 0-767px
  tablet: 768,    // 768-1023px
  desktop: 1024,  // 1024px+
};

/**
 * Responsive layout configuration
 */
export interface ResponsiveLayout {
  branchSpacing: number;
  fontSize: number;
  nodeRadius: number;
}

/**
 * Hook for responsive layout configuration
 * @returns Current layout configuration based on window width
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const [layout, setLayout] = useState<ResponsiveLayout>({
    branchSpacing: LAYOUT_CONFIG.DESKTOP_BRANCH_SPACING,
    fontSize: 16,
    nodeRadius: 8,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.tablet) {
        setLayout({
          branchSpacing: LAYOUT_CONFIG.MOBILE_BRANCH_SPACING,
          fontSize: 12,
          nodeRadius: 6,
        });
      } else if (width < BREAKPOINTS.desktop) {
        setLayout({
          branchSpacing: LAYOUT_CONFIG.TABLET_BRANCH_SPACING,
          fontSize: 14,
          nodeRadius: 7,
        });
      } else {
        setLayout({
          branchSpacing: LAYOUT_CONFIG.DESKTOP_BRANCH_SPACING,
          fontSize: 16,
          nodeRadius: 8,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return layout;
}

/**
 * Calculate X offset for a branch based on its level
 * @param level - Branch level (0 = main, 1+ = branches)
 * @param branchIndex - Index among siblings at the same level
 * @param branchSpacing - Spacing between branches
 * @returns X coordinate
 */
export function calculateXOffset(
  level: number,
  branchIndex: number = 0,
  branchSpacing: number = LAYOUT_CONFIG.BRANCH_SPACING
): number {
  if (level === 0) return LAYOUT_CONFIG.BASE_X;
  return LAYOUT_CONFIG.BASE_X + (level * branchSpacing) + (branchIndex * 50);
}

/**
 * Assign lanes to branches to avoid overlapping
 * Branches with non-overlapping time periods can share the same lane
 * @param entries - Array of career entries
 * @returns Map of entry ID to lane number
 */
export function assignLanes(entries: ExtendedCareerEntry[]): Map<string, number> {
  const laneMap = new Map<string, number>();
  const lanes: Array<{ endDate: Date | null; entries: string[] }> = [];

  // Sort entries by start date
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  sortedEntries.forEach(entry => {
    const startDate = new Date(entry.startDate);
    const endDate = entry.endDate ? new Date(entry.endDate) : null;

    // Find a lane where this entry doesn't overlap
    let assignedLane = -1;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      // If lane is free (previous entry ended before this one starts)
      if (lane.endDate && lane.endDate <= startDate) {
        assignedLane = i;
        lane.endDate = endDate;
        lane.entries.push(entry.id);
        break;
      }
    }

    // If no suitable lane found, create a new one
    if (assignedLane === -1) {
      assignedLane = lanes.length;
      lanes.push({
        endDate: endDate,
        entries: [entry.id],
      });
    }

    laneMap.set(entry.id, assignedLane);
  });

  return laneMap;
}

/**
 * Calculate X offset based on lane assignment
 * @param lane - Lane number
 * @param branchSpacing - Spacing between lanes
 * @returns X coordinate
 */
export function calculateXOffsetByLane(
  lane: number,
  branchSpacing: number = LAYOUT_CONFIG.BRANCH_SPACING
): number {
  return LAYOUT_CONFIG.BASE_X + ((lane + 1) * branchSpacing);
}

/**
 * Calculate Y position based on date
 * @param date - Date string (ISO 8601 format)
 * @param minDate - Minimum date in the timeline
 * @param pixelsPerYear - Pixels per year
 * @returns Y coordinate
 */
export function calculateYPosition(
  date: string,
  minDate: Date,
  pixelsPerYear: number = LAYOUT_CONFIG.PIXELS_PER_YEAR
): number {
  const entryDate = new Date(date);
  const yearsDiff = (entryDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return LAYOUT_CONFIG.TOP_PADDING + (yearsDiff * pixelsPerYear);
}

/**
 * Calculate computed branch data with layout information
 * @param node - Branch node
 * @param minDate - Minimum date in the timeline
 * @param branchSpacing - Spacing between branches
 * @param branchIndex - Index among siblings
 * @returns Computed branch with layout data
 */
export function calculateBranchLayout(
  node: BranchNode,
  minDate: Date,
  branchSpacing: number = LAYOUT_CONFIG.BRANCH_SPACING,
  branchIndex: number = 0
): ComputedBranch {
  const xOffset = calculateXOffset(node.level, branchIndex, branchSpacing);
  const startY = calculateYPosition(node.entry.startDate, minDate);
  const endY = node.entry.endDate
    ? calculateYPosition(node.entry.endDate, minDate)
    : startY + 100; // Default height for ongoing entries

  const computed: ComputedBranch = {
    id: node.entry.id,
    entry: node.entry,
    color: node.color,
    level: node.level,
    xOffset,
    yPosition: startY,
    childBranches: [],
    startY,
    endY,
  };

  // Recursively calculate child branches
  computed.childBranches = node.children.map((child, index) =>
    calculateBranchLayout(child, minDate, branchSpacing, index)
  );

  // Set parent reference
  computed.childBranches.forEach(child => {
    child.parentBranch = computed;
  });

  return computed;
}

/**
 * Calculate the total height needed for the SVG canvas
 * @param entries - Array of career entries
 * @param minDate - Minimum date
 * @param maxDate - Maximum date
 * @returns Total height in pixels
 */
export function calculateCanvasHeight(
  entries: ExtendedCareerEntry[],
  minDate: Date,
  maxDate: Date
): number {
  const yearsDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return LAYOUT_CONFIG.TOP_PADDING + (yearsDiff * LAYOUT_CONFIG.PIXELS_PER_YEAR) + 150;
}

/**
 * Calculate the total width needed for the SVG canvas
 * @param maxLevel - Maximum branch level
 * @param branchSpacing - Spacing between branches
 * @returns Total width in pixels
 */
export function calculateCanvasWidth(
  maxLevel: number,
  branchSpacing: number = LAYOUT_CONFIG.BRANCH_SPACING
): number {
  return LAYOUT_CONFIG.BASE_X + (maxLevel * branchSpacing) + 200;
}

/**
 * Get the position for a label based on branch position
 * @param xOffset - Branch X offset
 * @param yPosition - Branch Y position
 * @param alignment - Label alignment ('left' or 'right')
 * @returns Label position { x, y }
 */
export function getLabelPosition(
  xOffset: number,
  yPosition: number,
  alignment: 'left' | 'right' = 'right'
): { x: number; y: number } {
  const labelOffset = 20; // Distance from node
  return {
    x: alignment === 'right' ? xOffset + labelOffset : xOffset - labelOffset,
    y: yPosition,
  };
}
