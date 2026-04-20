'use client';

import React, { useMemo, useId, useEffect, useRef, useState } from 'react';
import type { ExtendedCareerEntry, EventEntry, YearEventGroup, TimelineEventEntry } from '@/types';
import EventListModal from './EventListModal';
import EventModal from './EventModal';

/**
 * Git-style Career Timeline - Complete Implementation
 * 
 * Requirements met:
 * 1. Main "life" branch (blue) always visible
 * 2. Sub-branches fork from parent nodes with smooth curves
 * 3. Non-overlapping entries share same lane
 * 4. Overlapping entries offset to the right
 * 5. 5-color rotation independent of lane
 * 6. Branch lines continue during entire membership period
 * 7. Smooth merge back at end
 * 8. Year labels on left
 * 9. Default text color (no coloring)
 * 10. Parent-child relationships from data
 */

const BRANCH_COLORS = [
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
];

const MAIN_BRANCH_COLOR = '#3B82F6';

const DEFAULT_ROW_HEIGHT = 32;
const MIN_FIT_ROW_HEIGHT = 18;
const NODE_RADIUS = 8;
const LANE_WIDTH = 32;
const LEFT_PADDING = 28;
const YEAR_WIDTH = 108;
const MAIN_X = LEFT_PADDING;
const STATUS_COLUMN_WIDTH = 124;

interface GitCommitLogTimelineProps {
  entries: ExtendedCareerEntry[];
  events?: EventEntry[];
  isReversed?: boolean;
  rowHeight?: number;
  fitToViewport?: boolean;
  viewportBottomOffset?: number;
}

interface ProcessedEntry {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | null;
  parentId: string | null;
  startTime: number;
  endTime: number;
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
  midMonth: number;
  lane: number;
  color: string;
  isOngoing: boolean;
  isAlignedTransitionStart: boolean;
  isAlignedTransitionEnd: boolean;
  parentLane?: number;
}
const TRANSITION_EVENT_OFFSET_PX = 5;

interface TimelineRow {
  monthIndex: number;
  year: number;
  month: number;
  showYear: boolean;
  isFirstMonthRow: boolean;
  entry: ProcessedEntry | null;
}

function getMonthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function monthIndexToParts(monthIndex: number): { year: number; month: number } {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  return { year, month };
}

function getNextDateString(dateStr: string): string | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);

  const nextYear = date.getUTCFullYear();
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getUTCDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function processEntries(entries: ExtendedCareerEntry[]): ProcessedEntry[] {
  const sorted = [...entries].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const processed: ProcessedEntry[] = [];
  const entryMap = new Map<string, ProcessedEntry>();
  let colorIndex = 0;
  const now = new Date();
  const nowMonth = getMonthIndex(now);

  // Align contiguous transitions (end date + 1 day === next start date)
  // on the same branch so merge/start share a single visual pivot.
  const startMonthByBranchAndDate = new Map<string, number>();
  const startEntryIdsByBranchAndDate = new Map<string, string[]>();
  entries.forEach((entry) => {
    const branchKey = entry.parentId ?? '__main__';
    const monthIndex = getMonthIndex(new Date(entry.startDate));
    const key = `${branchKey}|${entry.startDate}`;
    startMonthByBranchAndDate.set(key, monthIndex);
    const ids = startEntryIdsByBranchAndDate.get(key) ?? [];
    ids.push(entry.id);
    startEntryIdsByBranchAndDate.set(key, ids);
  });

  const alignedEndMonthById = new Map<string, number>();
  const alignedTransitionEndIds = new Set<string>();
  const alignedTransitionStartIds = new Set<string>();
  entries.forEach((entry) => {
    if (!entry.endDate) return;

    const nextDate = getNextDateString(entry.endDate);
    if (!nextDate) return;

    const branchKey = entry.parentId ?? '__main__';
    const key = `${branchKey}|${nextDate}`;
    const successorStartMonth = startMonthByBranchAndDate.get(key);
    const successorEntryIds = startEntryIdsByBranchAndDate.get(key) ?? [];

    if (successorStartMonth !== undefined && successorEntryIds.length > 0) {
      alignedEndMonthById.set(entry.id, successorStartMonth);
      alignedTransitionEndIds.add(entry.id);

      // Apply the same start offset to all same-day successors so
      // they remain fully coincident with each other and with the split marker.
      successorEntryIds.forEach((id) => alignedTransitionStartIds.add(id));
    }
  });

  sorted.forEach((entry) => {
    const startTime = new Date(entry.startDate).getTime();
    const endTime = entry.endDate
      ? new Date(entry.endDate).getTime()
      : now.getTime();
    
    const startYear = new Date(entry.startDate).getFullYear();
    const endYear = entry.endDate 
      ? new Date(entry.endDate).getFullYear()
      : now.getFullYear();

    const startMonth = getMonthIndex(new Date(entry.startDate));
    const rawEndMonth = entry.endDate
      ? getMonthIndex(new Date(entry.endDate))
      : nowMonth;
    const endMonth = alignedEndMonthById.get(entry.id) ?? rawEndMonth;

    // Get parent lane if exists
    let parentLane: number | undefined;
    if (entry.parentId && entryMap.has(entry.parentId)) {
      parentLane = entryMap.get(entry.parentId)!.lane;
    }

    // Find overlapping entries
    const overlapping = processed.filter(p => 
      p.startTime < endTime && p.endTime > startTime
    );
    
    // Find first available lane
    const usedLanes = new Set(overlapping.map(p => p.lane));
    // Lane policy:
    // - If no overlap, reuse lane 1 (keeps timeline compact)
    // - If overlap exists, allocate the leftmost available lane
    // - If it has a parent, start searching from parentLane + 1 to express branching
    const minLane = parentLane !== undefined ? parentLane + 1 : 1;
    let lane = minLane;
    while (usedLanes.has(lane)) {
      lane++;
    }

    const processedEntry: ProcessedEntry = {
      id: entry.id,
      organization: entry.organization,
      role: entry.role,
      startDate: entry.startDate,
      endDate: entry.endDate ?? null,
      parentId: entry.parentId ?? null,
      startTime,
      endTime,
      startYear,
      endYear,
      startMonth,
      endMonth,
      midMonth: Math.floor((startMonth + endMonth) / 2),
      lane,
      color: BRANCH_COLORS[colorIndex % BRANCH_COLORS.length],
      isOngoing: !entry.endDate,
      isAlignedTransitionStart: alignedTransitionStartIds.has(entry.id),
      isAlignedTransitionEnd: alignedTransitionEndIds.has(entry.id),
      parentLane,
    };

    colorIndex++;
    processed.push(processedEntry);
    entryMap.set(entry.id, processedEntry);
  });

  return processed;
}

function buildRows(entries: ProcessedEntry[], isReversed: boolean, eventYears: Set<number>): TimelineRow[] {
  if (entries.length === 0) return [];

  // Event-driven approach: only create rows for months where events (start/end) occur
  // This keeps the timeline compact while preserving the order and overlap relationships
  const eventMonths = new Set<number>();
  entries.forEach((entry) => {
    eventMonths.add(entry.startMonth);
    eventMonths.add(entry.endMonth);
  });

  // For entries where start and end are adjacent months in the event list,
  // we need to add an intermediate row to show the vertical line properly
  // Find entries that need an intermediate row
  const sortedEventMonths = Array.from(eventMonths).sort((a, b) => a - b);
  entries.forEach((entry) => {
    const startIdx = sortedEventMonths.indexOf(entry.startMonth);
    const endIdx = sortedEventMonths.indexOf(entry.endMonth);
    // If start and end are adjacent in the event months list and they are different months
    if (entry.startMonth !== entry.endMonth && endIdx === startIdx + 1) {
      // Add an intermediate month (midpoint between start and end)
      const midMonth = Math.floor((entry.startMonth + entry.endMonth) / 2);
      if (midMonth !== entry.startMonth && midMonth !== entry.endMonth) {
        eventMonths.add(midMonth);
      }
    }
  });

  const sortedMonths = Array.from(eventMonths).sort((a, b) => a - b);
  const orderedMonths = isReversed ? [...sortedMonths].reverse() : sortedMonths;

  const startsByMonth = new Map<number, ProcessedEntry[]>();
  entries.forEach((entry) => {
    const list = startsByMonth.get(entry.startMonth) ?? [];
    list.push(entry);
    startsByMonth.set(entry.startMonth, list);
  });

  // Track which months have fork/merge events for year label alignment
  const endsByMonth = new Map<number, ProcessedEntry[]>();
  entries.forEach((entry) => {
    if (!entry.isOngoing) {
      const list = endsByMonth.get(entry.endMonth) ?? [];
      list.push(entry);
      endsByMonth.set(entry.endMonth, list);
    }
  });

  const rows: TimelineRow[] = [];
  const displayedYears = new Set<number>();

  orderedMonths.forEach((monthIndex) => {
    const { year, month } = monthIndexToParts(monthIndex);
    const startEntries = startsByMonth.get(monthIndex) ?? [];
    const endEntries = endsByMonth.get(monthIndex) ?? [];
    const hasYearEvents = eventYears.has(year);
    const hasForkOrMerge = startEntries.length > 0 || endEntries.length > 0;

    if (startEntries.length === 0) {
      // This is an end-only month or intermediate month (no new entries start here)
      // Show year only if there's a merge event and year hasn't been shown
      const showYear = (hasForkOrMerge || hasYearEvents) && !displayedYears.has(year);
      if (showYear) {
        displayedYears.add(year);
      }
      rows.push({
        monthIndex,
        year,
        month,
        showYear,
        isFirstMonthRow: true,
        entry: null,
      });
      return;
    }

    startEntries.forEach((entry, idx) => {
      // Show year on each fork row if not already shown
      const showYear = !displayedYears.has(year);
      if (showYear) {
        displayedYears.add(year);
      }
      rows.push({
        monthIndex,
        year,
        month,
        showYear,
        isFirstMonthRow: idx === 0,
        entry,
      });
    });
  });

  return rows;
}

function formatYearMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDateRangeLabel(startDate: string, endDate: string | null): string {
  const startStr = formatYearMonth(startDate);
  if (!endDate) {
    return `${startStr}-現在`;
  }
  return `${startStr}-${formatYearMonth(endDate)}`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export default function GitCommitLogTimeline({
  entries,
  events = [],
  isReversed = false,
  rowHeight = DEFAULT_ROW_HEIGHT,
  fitToViewport = false,
  viewportBottomOffset = 24,
}: GitCommitLogTimelineProps) {
  const clipBaseId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolvedRowHeight, setResolvedRowHeight] = useState(rowHeight);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isEventListModalOpen, setIsEventListModalOpen] = useState(false);
  const [selectedYearGroup, setSelectedYearGroup] = useState<YearEventGroup | null>(null);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventEntry | null>(null);

  const processedEntries = useMemo(
    () => processEntries(entries),
    [entries]
  );

  const yearEventGroups = useMemo(() => {
    const grouped = new Map<number, YearEventGroup>();

    events.forEach((event) => {
      const timelineEvent: TimelineEventEntry = {
        id: event.id,
        title: event.title,
        date: event.date,
        description: event.description,
        category: event.category,
        year: String(event.year),
      };

      const existing = grouped.get(event.year);
      if (existing) {
        existing.events.push(timelineEvent);
      } else {
        grouped.set(event.year, {
          year: String(event.year),
          events: [timelineEvent],
        });
      }
    });

    grouped.forEach((group) => {
      group.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return grouped;
  }, [events]);

  const eventYears = useMemo(
    () => new Set<number>(Array.from(yearEventGroups.keys())),
    [yearEventGroups]
  );

  const rows = useMemo(
    () => buildRows(processedEntries, isReversed, eventYears),
    [processedEntries, isReversed, eventYears]
  );

  const maxLane = useMemo(
    () => Math.max(...processedEntries.map(e => e.lane), 1),
    [processedEntries]
  );

  const graphWidth = LEFT_PADDING + (maxLane + 1) * LANE_WIDTH + 20;
  const firstRowIndexByMonth = useMemo(() => {
    const map = new Map<number, number>();
    rows.forEach((row, rowIndex) => {
      if (!map.has(row.monthIndex)) {
        map.set(row.monthIndex, rowIndex);
      }
    });
    return map;
  }, [rows]);

  const hasMergeAtMonth = useMemo(() => {
    const merged = new Set<number>();
    processedEntries.forEach((entry) => {
      if (!entry.isOngoing) {
        merged.add(entry.endMonth);
      }
    });
    return merged;
  }, [processedEntries]);

  useEffect(() => {
    const updateLayoutMetrics = () => {
      if (!containerRef.current) {
        setContainerWidth(0);
        setResolvedRowHeight(rowHeight);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      setContainerWidth(rect.width);

      if (!fitToViewport || rows.length === 0) {
        setResolvedRowHeight(rowHeight);
        return;
      }

      const footerHeight = document.querySelector('footer')?.getBoundingClientRect().height ?? 0;
      const availableHeight = window.innerHeight - rect.top - footerHeight - viewportBottomOffset;
      if (availableHeight <= 0) {
        setResolvedRowHeight(rowHeight);
        return;
      }

      const fittedHeight = Math.floor(availableHeight / rows.length);
      setResolvedRowHeight(Math.max(MIN_FIT_ROW_HEIGHT, fittedHeight));
    };

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateLayoutMetrics();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateLayoutMetrics);
      resizeObserver?.disconnect();
    };
  }, [fitToViewport, rowHeight, rows.length, viewportBottomOffset]);

  const entryLabelOffsetY = resolvedRowHeight * 1.5 * (isReversed ? -1 : 1) + resolvedRowHeight * 0.5;
  const isCompactRow = resolvedRowHeight <= 24;

  const openYearEventModal = (year: number) => {
    const yearGroup = yearEventGroups.get(year);
    if (!yearGroup) return;

    setSelectedYearGroup(yearGroup);
    setIsEventListModalOpen(true);
  };

  const closeYearEventModal = () => {
    setIsEventListModalOpen(false);
    setTimeout(() => {
      setSelectedYearGroup(null);
    }, 200);
  };

  const openEventDetailModal = (event: TimelineEventEntry) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  const closeEventDetailModal = () => {
    setIsEventDetailModalOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 200);
  };

  return (
    <>
      <div ref={containerRef} className="text-sm font-sans">
      {rows.map((row, rowIndex) => {
        const clipId = `${clipBaseId}-row-clip-${rowIndex}`;
        const entry = row.entry;
        const startDateText = entry
          ? formatYearMonth(entry.startDate)
          : '';
        const endDateText = entry?.endDate
          ? formatYearMonth(entry.endDate)
          : '';
        const fullDateText = entry
          ? formatDateRangeLabel(entry.startDate, entry.endDate)
          : '';
        const trailingReservedWidth = entry
          ? STATUS_COLUMN_WIDTH
          : 96;
        const infoAreaWidth = Math.max(containerWidth - YEAR_WIDTH - graphWidth - trailingReservedWidth, 0);
        const shouldShowFullOrganization = infoAreaWidth >= 560;
        const organizationMaxLength = isCompactRow
          ? 16
          : infoAreaWidth >= 460
            ? 30
            : infoAreaWidth >= 320
              ? 24
              : 18;
        const roleMaxLength = isCompactRow
          ? 9
          : infoAreaWidth >= 460
            ? 20
            : 14;
        const shouldShowFullRole = shouldShowFullOrganization;
        const organizationText = entry
          ? (shouldShowFullOrganization
            ? entry.organization
            : truncateText(entry.organization, organizationMaxLength))
          : '';
        const roleText = entry
          ? (shouldShowFullRole
            ? entry.role
            : truncateText(entry.role, roleMaxLength))
          : '';
        const yearGroup = yearEventGroups.get(row.year);
        const hasYearEvents = Boolean(yearGroup && yearGroup.events.length > 0);
        const showYearEventButton = hasYearEvents && row.showYear;
        const activeEntries = processedEntries.filter(e =>
          row.monthIndex >= e.startMonth && row.monthIndex <= e.endMonth
        );
        const hasStartAndMergeOnSameRow = Boolean(
          row.entry && row.isFirstMonthRow && hasMergeAtMonth.has(row.monthIndex)
        );
        const mainIndicatorYs = hasStartAndMergeOnSameRow
          ? [
              resolvedRowHeight / 2 - TRANSITION_EVENT_OFFSET_PX,
              resolvedRowHeight / 2 + TRANSITION_EVENT_OFFSET_PX,
            ]
          : [resolvedRowHeight / 2];
        const showMainIndicator = Boolean(
          row.entry || (row.isFirstMonthRow && hasMergeAtMonth.has(row.monthIndex))
        );

        return (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
            style={{ height: resolvedRowHeight }}
          >
            {/* Year Label */}
            <div
              className="flex-shrink-0 flex items-center justify-end pr-4"
              style={{ width: YEAR_WIDTH }}
            >
              {row.showYear && (
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                    {row.year}
                  </span>
                  {showYearEventButton && yearGroup && (
                    <button
                      type="button"
                      onClick={() => openYearEventModal(row.year)}
                      className="inline-flex min-w-6 h-6 items-center justify-center px-1.5 rounded-full text-[11px] font-semibold text-white bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                      aria-label={`${row.year}年のイベント${yearGroup.events.length}件を表示`}
                      title={`${row.year}年のイベント`}
                    >
                      {yearGroup.events.length}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Branch Graph */}
            <div
              className="flex-shrink-0 relative"
              style={{ width: graphWidth, height: resolvedRowHeight }}
            >
              <svg
                width={graphWidth}
                height={resolvedRowHeight}
                className="absolute inset-0"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect
                      x={0}
                      y={0}
                      width={graphWidth}
                      height={resolvedRowHeight}
                    />
                  </clipPath>
                </defs>

                <g clipPath={`url(#${clipId})`}>
                {/* Main branch */}
                <line
                  x1={MAIN_X}
                  y1={0}
                  x2={MAIN_X}
                  y2={resolvedRowHeight}
                  stroke={MAIN_BRANCH_COLOR}
                  strokeWidth={4}
                  strokeLinecap="butt"
                />

                {/* Main branch indicator */}
                {showMainIndicator && (
                  <>
                    {mainIndicatorYs.map((y, i) => (
                      <circle
                        key={`main-indicator-${rowIndex}-${i}`}
                        cx={MAIN_X}
                        cy={y}
                        r={4}
                        fill={MAIN_BRANCH_COLOR}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </>
                )}

                {/* Active branch lines */}
                {activeEntries.map((e) => {
                  const laneX = LEFT_PADDING + e.lane * LANE_WIDTH;
                  // isStartRow: this is the first row of the entry's start month
                  // All entries starting in the same month will fork from this single row
                  const isStartRow = row.isFirstMonthRow && row.monthIndex === e.startMonth;
                  const isEndRow = row.isFirstMonthRow && !e.isOngoing && row.monthIndex === e.endMonth;
                  // isInStartMonth: this row is in the start month but not the first row
                  const isInStartMonth = !row.isFirstMonthRow && row.monthIndex === e.startMonth;
                  // isInEndMonth: this row is in the end month but not the first row
                  const isInEndMonth = !row.isFirstMonthRow && !e.isOngoing && row.monthIndex === e.endMonth;
                  const isNodeRow = rowIndex === firstRowIndexByMonth.get(e.midMonth);
                  const forkFromX = e.parentLane !== undefined
                    ? LEFT_PADDING + e.parentLane * LANE_WIDTH
                    : MAIN_X;
                  const mergeToX = MAIN_X;
                  const midY = resolvedRowHeight / 2;
                  const cornerR = midY;
                  const hasUpperConnector = midY - cornerR > 0.5;
                  const hasLowerConnector = resolvedRowHeight - (midY + cornerR) > 0.5;
                  const transitionOffsetY = TRANSITION_EVENT_OFFSET_PX;
                  const startEventY = e.isAlignedTransitionStart
                    ? (isReversed ? midY - transitionOffsetY : midY + transitionOffsetY)
                    : midY;
                  const endEventY = e.isAlignedTransitionEnd
                    ? (isReversed ? midY + transitionOffsetY : midY - transitionOffsetY)
                    : midY;

                  // Determine vertical line range and whether to draw fork/merge
                  // The fork/merge curves already draw the vertical portions near the curve
                  // So we only need to draw the remaining portion to avoid overlap at the circle
                  let lineY1 = 0;
                  let lineY2 = resolvedRowHeight;
                  let skipVerticalLine = false;
                  let skipFork = false;
                  let skipMerge = false;

                  if (isInStartMonth) {
                    // This row is in the start month but not the first row
                    // Direction-aware handling:
                    // - reversed (new -> old): do not draw older-side segment for start month
                    // - normal (old -> new): keep vertical continuity to newer rows
                    if (isReversed) {
                      skipVerticalLine = true;
                    } else {
                      lineY1 = 0;
                      lineY2 = resolvedRowHeight;
                    }
                    skipFork = true;
                  } else if (isInEndMonth) {
                    // This row is in the end month but not the first row
                    // Direction-aware handling:
                    // - reversed (new -> old): keep continuity to older rows
                    // - normal (old -> new): do not draw newer-side segment after end
                    if (isReversed) {
                      lineY1 = 0;
                      lineY2 = resolvedRowHeight;
                    } else {
                      skipVerticalLine = true;
                    }
                    skipMerge = true;
                  } else if (isStartRow && isEndRow) {
                    // Both start and end in same row - skip vertical line, curves handle it
                    skipVerticalLine = true;
                  } else if (isStartRow) {
                    // Fork row: only draw the portion not covered by the fork curve
                    if (isReversed) {
                      // Fork curve goes up (0 to midY-cornerR), draw below (midY+cornerR to rowHeight)
                      lineY1 = midY + cornerR;
                      lineY2 = resolvedRowHeight;
                    } else {
                      // Fork curve goes down (midY+cornerR to rowHeight), draw above (0 to midY-cornerR)
                      lineY1 = 0;
                      lineY2 = midY - cornerR;
                    }
                  } else if (isEndRow) {
                    // Merge row: only draw the portion not covered by the merge curve
                    if (isReversed) {
                      // Merge curve goes down (midY+cornerR to rowHeight), draw above (0 to midY-cornerR)
                      lineY1 = 0;
                      lineY2 = midY - cornerR;
                    } else {
                      // Merge curve goes up (0 to midY-cornerR), draw below (midY+cornerR to rowHeight)
                      lineY1 = midY + cornerR;
                      lineY2 = resolvedRowHeight;
                    }
                  }
                  // For normal rows (not start or end), line goes full height (0 to rowHeight)

                  return (
                    <g key={`branch-${e.id}`}>
                      {/* Continuous vertical line for this lane */}
                      {!skipVerticalLine && lineY2 > lineY1 && (
                        <line
                          x1={laneX}
                          y1={lineY1}
                          x2={laneX}
                          y2={lineY2}
                          stroke={e.color}
                          strokeWidth={4}
                          strokeLinecap="butt"
                        />
                      )}

                      {/* This is the entry's start row - draw fork */}
                      {/* Straight line from parent + quarter arc to this lane */}
                      {isStartRow && !skipFork && (
                        <>
                          {/* Horizontal line from parent to near this lane */}
                          <line
                            x1={forkFromX}
                            y1={startEventY}
                            x2={laneX - cornerR}
                            y2={startEventY}
                            stroke={e.color}
                            strokeWidth={4}
                            strokeLinecap="butt"
                          />
                          {isReversed ? (
                            <>
                              {/* Quarter arc: from horizontal to vertical (going up) */}
                              <path
                                d={`M ${laneX - cornerR} ${startEventY}
                                    A ${cornerR} ${cornerR} 0 0 0 ${laneX} ${startEventY - cornerR}`}
                                fill="none"
                                stroke={e.color}
                                strokeWidth={4}
                                strokeLinecap="butt"
                              />
                              {/* Short vertical line from top of row to arc start */}
                              {hasUpperConnector && (
                                <line
                                  x1={laneX}
                                  y1={0}
                                  x2={laneX}
                                  y2={midY - cornerR}
                                  stroke={e.color}
                                  strokeWidth={4}
                                  strokeLinecap="butt"
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {/* Quarter arc: from horizontal to vertical (going down) */}
                              <path
                                d={`M ${laneX - cornerR} ${startEventY}
                                    A ${cornerR} ${cornerR} 0 0 1 ${laneX} ${startEventY + cornerR}`}
                                fill="none"
                                stroke={e.color}
                                strokeWidth={4}
                                strokeLinecap="butt"
                              />
                              {/* Short vertical line from arc end to bottom of row */}
                              {hasLowerConnector && (
                                <line
                                  x1={laneX}
                                  y1={midY + cornerR}
                                  x2={laneX}
                                  y2={resolvedRowHeight}
                                  stroke={e.color}
                                  strokeWidth={4}
                                  strokeLinecap="butt"
                                />
                              )}
                            </>
                          )}
                        </>
                      )}

                      {/* End row - merge back to main */}
                      {/* Quarter arc from this lane + straight line to main */}
                      {isEndRow && !skipMerge && (
                        <>
                          {/* Horizontal line from main to near this lane */}
                          <line
                            x1={mergeToX}
                            y1={endEventY}
                            x2={laneX - cornerR}
                            y2={endEventY}
                            stroke={e.color}
                            strokeWidth={4}
                            strokeLinecap="butt"
                          />
                          {isReversed ? (
                            <>
                              {/* Quarter arc: from horizontal to vertical (going down) */}
                              <path
                                d={`M ${laneX - cornerR} ${endEventY}
                                    A ${cornerR} ${cornerR} 0 0 1 ${laneX} ${endEventY + cornerR}`}
                                fill="none"
                                stroke={e.color}
                                strokeWidth={4}
                                strokeLinecap="butt"
                              />
                              {/* Short vertical line from arc end to bottom of row */}
                              {hasLowerConnector && (
                                <line
                                  x1={laneX}
                                  y1={midY + cornerR}
                                  x2={laneX}
                                  y2={resolvedRowHeight}
                                  stroke={e.color}
                                  strokeWidth={4}
                                  strokeLinecap="butt"
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {/* Quarter arc: from horizontal to vertical (going up) */}
                              <path
                                d={`M ${laneX - cornerR} ${endEventY}
                                    A ${cornerR} ${cornerR} 0 0 0 ${laneX} ${endEventY - cornerR}`}
                                fill="none"
                                stroke={e.color}
                                strokeWidth={4}
                                strokeLinecap="butt"
                              />
                              {/* Short vertical line from top of row to arc start */}
                              {hasUpperConnector && (
                                <line
                                  x1={laneX}
                                  y1={0}
                                  x2={laneX}
                                  y2={midY - cornerR}
                                  stroke={e.color}
                                  strokeWidth={4}
                                  strokeLinecap="butt"
                                />
                              )}
                            </>
                          )}
                        </>
                      )}

                      {/* Entry node at mid-span */}
                      {isNodeRow && (
                        <>
                          <circle
                            cx={laneX}
                            cy={resolvedRowHeight / 2}
                            r={NODE_RADIUS}
                            fill={e.color}
                            stroke="white"
                            strokeWidth={3}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
                </g>
              </svg>
            </div>

            {/* Entry Information */}
            <div
              className="flex-1 flex items-center gap-4 pl-4 pr-0 min-w-0"
              style={entry ? { transform: `translateY(${entryLabelOffsetY}px)` } : undefined}
            >
              {entry && (
                <>
                  <div
                    className={`w-1.5 ${isCompactRow ? 'h-6' : 'h-10'} rounded-full flex-shrink-0`}
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`font-semibold text-gray-900 dark:text-gray-100 leading-tight min-w-0 ${
                          shouldShowFullOrganization ? 'whitespace-nowrap' : 'truncate'
                        }`}
                        title={entry.organization}
                      >
                        {organizationText}
                      </span>
                      <span
                        className={`text-xs text-gray-500 dark:text-gray-400 leading-tight ${
                          shouldShowFullRole
                            ? 'whitespace-nowrap'
                            : 'truncate max-w-[6.5rem] sm:max-w-[10rem]'
                        }`}
                        title={entry.role}
                      >
                        {roleText}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-auto w-[15ch] -mr-2">
                    <div
                      className="grid grid-cols-[8ch_7ch] items-center text-xs text-gray-500 dark:text-gray-400 font-mono"
                      title={fullDateText}
                    >
                      <span className="text-left whitespace-nowrap">{startDateText}-</span>
                      {entry.isOngoing ? (
                        <span className="flex justify-center">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] leading-none font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                            現在
                          </span>
                        </span>
                      ) : (
                        <span className="text-center whitespace-nowrap">
                          {endDateText}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
      </div>

      <EventListModal
        isOpen={isEventListModalOpen}
        onClose={closeYearEventModal}
        yearGroup={selectedYearGroup}
        onEventSelect={openEventDetailModal}
      />

      <EventModal
        isOpen={isEventDetailModalOpen}
        onClose={closeEventDetailModal}
        event={selectedEvent}
      />
    </>
  );
}

