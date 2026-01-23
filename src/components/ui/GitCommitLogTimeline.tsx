'use client';

import React, { useMemo } from 'react';
import { ExtendedCareerEntry } from '@/types';

// Colors
const BRANCH_COLORS = [
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
];
const MAIN_BRANCH_COLOR = '#3B82F6';

interface GitCommitLogTimelineProps {
  entries: ExtendedCareerEntry[];
  isReversed?: boolean;
}

// Layout constants
const LANE_WIDTH = 28;
const LEFT_MARGIN = 70;
const MAIN_LANE_X = LEFT_MARGIN;
const NODE_RADIUS = 6;
const ROW_HEIGHT = 80; // Slightly taller for better curve visibility
const TOP_PADDING = 40;
const BOTTOM_PADDING = 40;
const LABEL_OFFSET = 30;

interface LayoutEntry extends ExtendedCareerEntry {
  lane: number;
  color: string;
  rowIndex: number;
  yCenter: number;
  parentEntry?: LayoutEntry;
  colorIndex: number;
}

function parseDate(dateStr: string): number {
  const d = new Date(dateStr);
  return d.getFullYear() + d.getMonth() / 12;
}

function calculateLayout(entries: ExtendedCareerEntry[], isReversed: boolean): {
  layoutEntries: LayoutEntry[];
  svgHeight: number;
  maxLane: number;
} {
  if (entries.length === 0) {
    return { layoutEntries: [], svgHeight: 200, maxLane: 1 };
  }

  // Sort by start date (chronological for layout logic)
  const sorted = [...entries].sort((a, b) => {
    return parseDate(a.startDate) - parseDate(b.startDate);
  });

  const entryMap = new Map<string, LayoutEntry>();
  let colorCounter = 0;
  
  // Track active lanes: laneIdx -> lastEntry
  const activeLanes = new Map<number, LayoutEntry>();
  
  const layoutEntries: LayoutEntry[] = sorted.map((entry) => {
    const startTime = parseDate(entry.startDate);

    // Find parent
    let parentEntry: LayoutEntry | undefined;
    if (entry.parentId && entryMap.has(entry.parentId)) {
      parentEntry = entryMap.get(entry.parentId);
    }

    // Lane assignment logic:
    // 1. If non-overlapping with previous in some lane, reuse lane (priority to lower indices)
    let assignedLane = 1;
    let foundLane = false;

    // Check existing lines for reuse
    const laneIndices = Array.from(activeLanes.keys()).sort((a, b) => a - b);
    for (const laneIdx of laneIndices) {
      const lastEntry = activeLanes.get(laneIdx)!;
      const lastEndTime = lastEntry.endDate ? parseDate(lastEntry.endDate) : Infinity;
      
      // If this entry starts after the last entry in this lane ended, reuse it
      if (startTime >= lastEndTime) {
        assignedLane = laneIdx;
        foundLane = true;
        break;
      }
    }

    if (!foundLane) {
      // Find first empty lane index
      assignedLane = 1;
      while (activeLanes.has(assignedLane)) {
        assignedLane++;
      }
    }

    // Update active lanes
    const colorIndex = colorCounter;
    colorCounter = (colorCounter + 1) % BRANCH_COLORS.length;

    const layoutEntry: LayoutEntry = {
      ...entry,
      lane: assignedLane,
      color: BRANCH_COLORS[colorIndex],
      colorIndex,
      rowIndex: 0, // placeholder
      yCenter: 0,   // placeholder
      parentEntry,
    };

    activeLanes.set(assignedLane, layoutEntry);
    entryMap.set(entry.id, layoutEntry);
    return layoutEntry;
  });

  // Finalize rowIndex and yCenter based on display order (isReversed)
  const displaySorted = isReversed ? [...layoutEntries].reverse() : [...layoutEntries];
  displaySorted.forEach((entry, idx) => {
    entry.rowIndex = idx;
    entry.yCenter = TOP_PADDING + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
  });

  const svgHeight = TOP_PADDING + layoutEntries.length * ROW_HEIGHT + BOTTOM_PADDING;
  const maxLane = Math.max(...layoutEntries.map(e => e.lane), 1);

  return { layoutEntries: displaySorted, svgHeight, maxLane };
}

function formatDateCompact(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate);
  const startStr = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(2, '0')}`;
  if (!endDate) return `${startStr} - 現在`;
  const end = new Date(endDate);
  const endStr = `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, '0')}`;
  return `${startStr} - ${endStr}`;
}

/**
 * Creates an S-curve path string for SVG
 */
function createSCurve(x1: number, y1: number, x2: number, y2: number): string {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export default function GitCommitLogTimeline({ 
  entries, 
  isReversed = false 
}: GitCommitLogTimelineProps) {
  const { layoutEntries, svgHeight, maxLane } = useMemo(
    () => calculateLayout(entries, isReversed),
    [entries, isReversed]
  );

  const svgWidth = LEFT_MARGIN + (maxLane + 1) * LANE_WIDTH + 450;

  return (
    <div className="overflow-auto bg-white dark:bg-gray-900/50">
      <svg width={svgWidth} height={svgHeight} className="text-sm">
        {/* Main branch line background */}
        <line
          x1={MAIN_LANE_X}
          y1={TOP_PADDING - 20}
          x2={MAIN_LANE_X}
          y2={svgHeight - BOTTOM_PADDING + 20}
          stroke="#E2E8F0"
          strokeWidth={2}
          strokeDasharray="4,4"
          className="dark:stroke-gray-700"
        />

        {/* Draw each entry branch */}
        {layoutEntries.map((entry) => {
          const laneX = LEFT_MARGIN + entry.lane * LANE_WIDTH;
          const parentX = entry.parentEntry 
            ? LEFT_MARGIN + entry.parentEntry.lane * LANE_WIDTH 
            : MAIN_LANE_X;
          const parentY = entry.parentEntry?.yCenter || entry.yCenter;

          // Branch start offset for curve
          const curveOffset = isReversed ? -25 : 25;
          
          return (
            <g key={entry.id}>
              {/* Year Label on the far left */}
              <text
                x={LEFT_MARGIN - 20}
                y={entry.yCenter}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-gray-400 dark:fill-gray-500 text-[10px] font-mono"
              >
                {new Date(entry.startDate).getFullYear()}
              </text>

              {/* Fork curve from parent node to this branch lane */}
              <path
                d={createSCurve(parentX, parentY, laneX, entry.yCenter - curveOffset)}
                fill="none"
                stroke={entry.color}
                strokeWidth={2}
                opacity={0.4}
              />

              {/* Continuous vertical line for membership duration */}
              <line
                x1={laneX}
                y1={entry.yCenter - 30}
                x2={laneX}
                y2={entry.yCenter + 30}
                stroke={entry.color}
                strokeWidth={3}
                opacity={0.8}
                strokeLinecap="round"
              />

              {/* Merge back logic */}
              {entry.endDate && (
                <path
                  d={createSCurve(laneX, entry.yCenter + curveOffset, MAIN_LANE_X, entry.yCenter + curveOffset * 2)}
                  fill="none"
                  stroke={entry.color}
                  strokeWidth={2}
                  opacity={0.3}
                />
              )}

              {/* Central Node */}
              <circle
                cx={laneX}
                cy={entry.yCenter}
                r={NODE_RADIUS}
                fill={entry.color}
                stroke="white"
                strokeWidth={2}
                className="dark:stroke-gray-900"
              />

              {/* Fork point marker on parent */}
              {entry.parentEntry && (
                <circle
                  cx={parentX}
                  cy={parentY}
                  r={2.5}
                  fill={entry.parentEntry.color}
                  stroke="white"
                  strokeWidth={1}
                />
              )}

              {/* Entry labels */}
              <g transform={`translate(${LEFT_MARGIN + (maxLane + 1) * LANE_WIDTH + LABEL_OFFSET}, ${entry.yCenter})`}>
                <rect
                  x={-15}
                  y={-12}
                  width={4}
                  height={24}
                  rx={2}
                  fill={entry.color}
                  opacity={0.8}
                />
                
                <text
                  x={0}
                  y={-4}
                  dominantBaseline="middle"
                  className="fill-gray-900 dark:fill-gray-100 text-sm font-bold"
                >
                  {entry.organization}
                </text>
                <text
                  x={0}
                  y={14}
                  dominantBaseline="middle"
                  className="fill-gray-500 dark:fill-gray-400 text-xs"
                >
                  {entry.role} · {formatDateCompact(entry.startDate, entry.endDate)}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
