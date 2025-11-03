/**
 * GitBranchTimeline - Git graph style branch view
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import type { ExtendedCareerEntry, TimelineEventEntry, YearEventGroup, EventPointPosition } from '@/types';
import { validateCareerData } from '@/lib/career';
import { groupEventsByYear, calculateEventPointPositions, validateEventData } from '@/lib/career/eventUtils';
import Timeline from '../Timeline';
import { computeLayout, groupNodesByLane } from './layoutEngine';
import { formatRange, extractYear } from './utils';
import { LAYOUT, MOBILE_LAYOUT, COLORS, OPACITY } from './constants';
import { createBranchPath, createMergePath } from '../BranchLine';
import EventPoint from '../EventPoint';
import EventModal from '../EventModal';
import EventListModal from '../EventListModal';
import type { LayoutNode, Tick, YearLabel } from './types';

export interface GitBranchTimelineProps {
  entries: ExtendedCareerEntry[];
  events?: TimelineEventEntry[];
  enableEventPoints?: boolean;
  className?: string;
  isReversed?: boolean;
}

/**
 * Error display component
 */
function ErrorDisplay({ errors }: { errors: Array<{ entryId: string; message: string }> }) {
  if (errors.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="mb-2 font-semibold text-red-800">
        経歴データにエラーがあります
      </h3>
      <ul className="list-inside list-disc space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-700">
            {error.entryId}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Collect year labels for timeline
 */
function collectYearLabels(nodes: LayoutNode[]): YearLabel[] {
  const yearLabels: YearLabel[] = [];
  const yearLabelMap = new Map<string, number>();

  nodes.forEach(node => {
    const startYear = extractYear(node.entry.startDate);
    if (startYear && !yearLabelMap.has(startYear)) {
      yearLabelMap.set(startYear, node.startY);
      yearLabels.push({ y: node.startY, label: startYear });
    }

    if (node.entry.endDate && node.entry.endDate !== 'null') {
      const endYear = extractYear(node.entry.endDate);
      if (endYear && !yearLabelMap.has(endYear)) {
        yearLabelMap.set(endYear, node.endY);
        yearLabels.push({ y: node.endY, label: endYear });
      }
    }
  });

  return yearLabels.sort((a, b) => a.y - b.y);
}

/**
 * Collect tick marks for branches
 */
function collectTicks(
  nodes: LayoutNode[],
  nodeMap: Map<string, LayoutNode>,
  isMobile: boolean
): { startTicks: Tick[]; endTicks: Tick[] } {
  const startTickMap = new Map<string, Tick>();
  const endTickMap = new Map<string, Tick>();

  nodes.forEach(n => {
    const mainLineX = isMobile ? MOBILE_LAYOUT.MAIN_LINE_X : LAYOUT.MAIN_LINE_X;
    const parentX = n.parentId ? (nodeMap.get(n.parentId)?.x ?? mainLineX) : mainLineX;
    const yStart = Math.round(n.startY);
    const keyStart = `${parentX}_${yStart}`;
    if (!startTickMap.has(keyStart)) {
      startTickMap.set(keyStart, { x: parentX, y: yStart });
    }

    if (n.entry.endDate) {
      const yEnd = Math.round(n.endY);
      const keyEnd = `${parentX}_${yEnd}`;
      if (!endTickMap.has(keyEnd)) {
        endTickMap.set(keyEnd, { x: parentX, y: yEnd });
      }
    }
  });

  return {
    startTicks: Array.from(startTickMap.values()),
    endTicks: Array.from(endTickMap.values()),
  };
}

/**
 * Find combined parent-child pairs (same end date)
 */
function findCombinedPairs(
  nodes: LayoutNode[],
  nodeMap: Map<string, LayoutNode>
): { combinedChildIds: Set<string>; combinedParentIds: Set<string> } {
  const combinedChildIds = new Set<string>();
  const combinedParentIds = new Set<string>();

  nodes.forEach(n => {
    if (!n.parentId) return;
    const p = nodeMap.get(n.parentId);
    if (!p) return;
    const cEnd = n.entry.endDate ?? null;
    const pEnd = p.entry.endDate ?? null;
    if (cEnd && pEnd && cEnd === pEnd) {
      combinedChildIds.add(n.entry.id);
      combinedParentIds.add(p.entry.id);
    }
  });

  return { combinedChildIds, combinedParentIds };
}

/**
 * GitBranchTimeline component
 */
export default function GitBranchTimeline({
  entries,
  events = [],
  enableEventPoints = true,
  className = '',
  isReversed = false
}: GitBranchTimelineProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Event modal states
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventEntry | null>(null);
  const [selectedYearGroup, setSelectedYearGroup] = useState<YearEventGroup | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventListModalOpen, setIsEventListModalOpen] = useState(false);
  
  const errors = useMemo(() => validateCareerData(entries), [entries]);
  const eventErrors = useMemo(() => validateEventData(events), [events]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use mobile or desktop layout constants
  const layoutConstants = isMobile ? MOBILE_LAYOUT : LAYOUT;

  if (errors.length > 0 || eventErrors.length > 0) {
    return (
      <div className={className}>
        {errors.length > 0 && <ErrorDisplay errors={errors} />}
        {eventErrors.length > 0 && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-800">
              イベントデータにエラーがあります
            </h3>
            <ul className="list-inside list-disc space-y-1">
              {eventErrors.map((error, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  {error.eventId}: {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Timeline entries={entries} />
      </div>
    );
  }

  const nodes = useMemo(() => computeLayout(entries), [entries]);
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.entry.id, node])), [nodes]);
  const laneGroups = useMemo(() => groupNodesByLane(nodes), [nodes]);

  if (nodes.length === 0) {
    return null;
  }

  // Calculate dimensions
  const maxLane = nodes.reduce((max, node) => Math.max(max, node.lane), 1);
  const maxEndY = nodes.reduce((max, node) => Math.max(max, node.endY), 0);
  const maxLabelX = nodes.reduce((max, node) => Math.max(max, node.labelX ?? 0), 0);
  const svgWidth = Math.max(
    layoutConstants.MAIN_LINE_X + (maxLane + 1) * layoutConstants.LANE_WIDTH + (isMobile ? 250 : 320),
    maxLabelX + (isMobile ? 200 : 250)
  );
  const svgHeight = maxEndY + 20;
  const mainLineY1 = Math.max(layoutConstants.TOP_PADDING - 60, 20);
  const mainLineY2 = maxEndY;

  const yearLabels = collectYearLabels(nodes);
  const { startTicks, endTicks } = collectTicks(nodes, nodeMap, isMobile);
  const { combinedChildIds, combinedParentIds } = findCombinedPairs(nodes, nodeMap);

  // Process events for timeline
  const { eventPointPositions, eventHandlers } = useMemo(() => {
    if (!enableEventPoints || events.length === 0) {
      return { eventPointPositions: [], eventHandlers: {} };
    }

    const yearEventGroups = groupEventsByYear(events);
    
    if (yearEventGroups.length === 0 || yearLabels.length === 0) {
      return { eventPointPositions: [], eventHandlers: {} };
    }

    // Create a map of year to Y position from year labels
    const yearToYMap = new Map<string, number>();
    yearLabels.forEach(({ y, label }) => {
      yearToYMap.set(label, y);
    });

    // Calculate positions for each year group
    const positions = yearEventGroups.map(yearGroup => {
      const yearY = yearToYMap.get(yearGroup.year);
      if (yearY !== undefined) {
        return {
          yearGroup,
          x: layoutConstants.MAIN_LINE_X,
          y: yearY
        };
      }

      // Fallback calculation for years not in labels
      const minDate = new Date(Math.min(...nodes.map(n => new Date(n.entry.startDate).getTime())));
      const maxDate = new Date(Math.max(...nodes.map(n => 
        n.entry.endDate ? new Date(n.entry.endDate).getTime() : Date.now()
      )));
      const timeSpan = maxDate.getTime() - minDate.getTime();
      const pixelsPerYear = (maxEndY - layoutConstants.TOP_PADDING) / (timeSpan / (1000 * 60 * 60 * 24 * 365.25));
      
      const yearDate = new Date(`${yearGroup.year}-07-01`);
      const yearsDiff = (yearDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      const y = layoutConstants.TOP_PADDING + (yearsDiff * pixelsPerYear);

      return {
        yearGroup,
        x: layoutConstants.MAIN_LINE_X,
        y: y
      };
    }).filter(Boolean);

    // Event handlers
    const handlers = {
      handleEventPointClick: (yearGroup: YearEventGroup) => {
        if (yearGroup.events.length === 1) {
          setSelectedEvent(yearGroup.events[0]);
          setIsEventModalOpen(true);
        } else {
          setSelectedYearGroup(yearGroup);
          setIsEventListModalOpen(true);
        }
      },
      handleEventSelect: (event: TimelineEventEntry) => {
        setIsEventListModalOpen(false);
        setSelectedEvent(event);
        setIsEventModalOpen(true);
      },
      handleEventModalClose: () => {
        setIsEventModalOpen(false);
        setTimeout(() => setSelectedEvent(null), 300);
      },
      handleEventListModalClose: () => {
        setIsEventListModalOpen(false);
        setTimeout(() => setSelectedYearGroup(null), 300);
      }
    };

    return { eventPointPositions: positions, eventHandlers: handlers };
  }, [events, enableEventPoints, yearLabels, layoutConstants, nodes, maxEndY]);

  return (
    <div className={className}>
      <div className="overflow-x-auto p-3 sm:p-6">
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          className="min-w-full"
          viewBox={isMobile ? `0 0 ${svgWidth} ${svgHeight}` : undefined}
          preserveAspectRatio={isMobile ? "xMinYMin meet" : undefined}
        >
          <g transform={isReversed ? `scale(1, -1) translate(0, -${svgHeight})` : undefined}>
            {/* Main line */}
            <line
              x1={layoutConstants.MAIN_LINE_X}
              y1={mainLineY1}
              x2={layoutConstants.MAIN_LINE_X}
              y2={mainLineY2}
              stroke={COLORS.MAIN_LINE}
              strokeWidth={2}
              opacity={OPACITY.MAIN_LINE}
            />

            {/* Year labels */}
            {yearLabels.map(({ y, label }, index) => (
              <text
                key={`year-label-${label}-${index}`}
                x={layoutConstants.MAIN_LINE_X - (isMobile ? 12 : 16)}
                y={y + 4}
                textAnchor="end"
                className={isMobile ? "text-[10px] font-medium fill-slate-500" : "text-xs font-medium fill-slate-500"}
                transform={isReversed ? `translate(0, ${2 * (y + 4)}) scale(1, -1)` : undefined}
              >
                {label}年
              </text>
            ))}

            {/* Start ticks */}
            {startTicks.map((t, idx) => (
              <line
                key={`start-tick-${idx}-${t.x}-${t.y}`}
                x1={t.x - 7}
                y1={t.y}
                x2={t.x + 7}
                y2={t.y}
                stroke={COLORS.TICK}
                strokeWidth={2}
                opacity={OPACITY.START_TICK}
              />
            ))}

            {/* End ticks */}
            {endTicks.map((t, idx) => (
              <line
                key={`end-tick-${idx}-${t.x}-${t.y}`}
                x1={t.x - 8}
                y1={t.y}
                x2={t.x + 8}
                y2={t.y}
                stroke={COLORS.TICK}
                strokeWidth={2}
                opacity={OPACITY.END_TICK}
              />
            ))}

            {/* Lane lines */}
            {Array.from(laneGroups.entries()).map(([lane, laneNodes]) =>
              laneNodes.map((node) => {
                if (node.endY <= node.startY) return null;
                return (
                  <line
                    key={`lane-${lane}-${node.entry.id}`}
                    x1={node.x}
                    y1={node.startY}
                    x2={node.x}
                    y2={node.endY}
                    stroke={node.color}
                    strokeWidth={2}
                    opacity={OPACITY.BRANCH_LINE}
                  />
                );
              })
            )}

            {/* Branch paths */}
            {nodes.map(node => {
              if (!node.parentId) {
                const path = createBranchPath(layoutConstants.MAIN_LINE_X, node.startY, node.x, node.startY);
                return (
                  <path
                    key={`branch-main-${node.entry.id}`}
                    d={path}
                    stroke={node.color}
                    strokeWidth={2}
                    fill="none"
                    opacity={OPACITY.BRANCH_PATH}
                  />
                );
              }

              const parent = nodeMap.get(node.parentId);
              if (!parent) return null;

              const originY = Math.min(Math.max(node.startY, parent.startY), parent.endY);
              const path = createBranchPath(parent.x, originY, node.x, node.startY);

              return (
                <path
                  key={`branch-${node.entry.id}`}
                  d={path}
                  stroke={node.color}
                  strokeWidth={2}
                  fill="none"
                  opacity={OPACITY.BRANCH_PATH}
                />
              );
            })}

            {/* Merge lines */}
            {nodes.flatMap(node => {
              if (!node.mergeTargets) return [];

              return node.mergeTargets.map((target, index) => {
                if (target.type === 'entry' && target.id) {
                  const targetNode = nodeMap.get(target.id);
                  if (!targetNode) return null;

                  const mergeY = target.at === 'start' ? targetNode.startY : targetNode.endY;
                  const path = createMergePath(node.x, node.endY, targetNode.x, mergeY);

                  return (
                    <path
                      key={`merge-${node.entry.id}-${target.id}-${index}`}
                      d={path}
                      stroke={node.color}
                      strokeWidth={2}
                      fill="none"
                      opacity={OPACITY.MERGE_PATH}
                    />
                  );
                }

                if (target.type === 'main') {
                  if (combinedParentIds.has(node.entry.id)) return null;
                  const mergeY = target.at === 'start' ? node.startY : node.endY;
                  const path = createMergePath(node.x, node.endY, layoutConstants.MAIN_LINE_X, mergeY);

                  return (
                    <path
                      key={`merge-${node.entry.id}-main-${index}`}
                      d={path}
                      stroke={node.color}
                      strokeWidth={2}
                      fill="none"
                      opacity={OPACITY.MERGE_PATH}
                    />
                  );
                }

                return null;
              }).filter(Boolean);
            })}

            {/* Auto-merge to parent */}
            {nodes.map(node => {
              if (!node.entry.endDate) return null;
              if (combinedChildIds.has(node.entry.id)) return null;
              
              const parent = node.parentId ? nodeMap.get(node.parentId) : undefined;
              const targetX = parent ? parent.x : layoutConstants.MAIN_LINE_X;
              const targetY = parent
                ? Math.min(Math.max(node.endY, parent.startY), parent.endY)
                : node.endY;
              const path = createMergePath(node.x, node.endY, targetX, targetY);
              
              return (
                <path
                  key={`auto-merge-parent-${node.entry.id}`}
                  d={path}
                  stroke={node.color}
                  strokeWidth={2}
                  fill="none"
                  opacity={OPACITY.AUTO_MERGE}
                />
              );
            })}

            {/* Combined merge to main */}
            {Array.from(combinedChildIds).map((childId) => {
              const child = nodeMap.get(childId);
              if (!child) return null;
              const path = createMergePath(child.x, child.endY, layoutConstants.MAIN_LINE_X, child.endY);
              return (
                <path
                  key={`combined-merge-${childId}`}
                  d={path}
                  stroke={child.color}
                  strokeWidth={2}
                  fill="none"
                  opacity={OPACITY.COMBINED_MERGE}
                />
              );
            })}

            {/* Main line points */}
            {nodes
              .filter(node => !node.parentId)
              .map(node => (
                <circle
                  key={`mainpoint-${node.entry.id}`}
                  cx={layoutConstants.MAIN_LINE_X}
                  cy={(node.startY + node.endY) / 2}
                  r={3}
                  fill={COLORS.MAIN_LINE}
                  opacity={OPACITY.MAIN_POINT}
                />
              ))}

            {/* Event Points */}
            {enableEventPoints && eventPointPositions.map((position) => (
              <EventPoint
                key={`event-point-${position.yearGroup.year}`}
                x={position.x}
                y={position.y}
                eventCount={position.yearGroup.events.length}
                isMultiple={position.yearGroup.events.length > 1}
                isReversed={isReversed}
                onClick={() => eventHandlers.handleEventPointClick?.(position.yearGroup)}
              />
            ))}

            {/* Nodes and labels */}
            {nodes.map(node => {
              const midY = (node.startY + node.endY) / 2;
              const labelY = node.labelY ?? midY;
              const labelX = node.labelX ?? (Math.max(...nodes.map(n => n.x)) + 18);

              return (
                <g key={`node-${node.entry.id}`}>
                  <circle
                    cx={node.x}
                    cy={midY}
                    r={layoutConstants.NODE_RADIUS}
                    fill={node.color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    style={{ cursor: node.entry.description ? 'pointer' : 'default' }}
                    onClick={() => node.entry.description && setSelectedNodeId(
                      selectedNodeId === node.entry.id ? null : node.entry.id
                    )}
                  />

                  {/* Connector line */}
                  {(Math.abs(labelY - midY) > 5 || Math.abs(labelX - node.x - 18) > 5) && (
                    <line
                      x1={node.x + layoutConstants.NODE_RADIUS}
                      y1={midY}
                      x2={labelX - 2}
                      y2={labelY}
                      stroke={node.color}
                      strokeWidth={1}
                      strokeDasharray="2,2"
                      opacity={OPACITY.CONNECTOR_LINE}
                    />
                  )}

                  {/* Organization */}
                  <text
                    x={labelX}
                    y={isReversed ? labelY + 18 : labelY - 14}
                    className={isMobile ? "text-xs font-semibold fill-slate-900" : "text-sm font-semibold fill-slate-900"}
                    transform={isReversed ? `translate(0, ${2 * (labelY + 18)}) scale(1, -1)` : undefined}
                  >
                    {node.entry.organization}
                  </text>

                  {/* Role */}
                  <text
                    x={labelX}
                    y={labelY + 2}
                    className={isMobile ? "text-[10px] fill-slate-500" : "text-xs fill-slate-500"}
                    transform={isReversed ? `translate(0, ${2 * (labelY + 2)}) scale(1, -1)` : undefined}
                  >
                    {node.entry.role}
                  </text>

                  {/* Date range */}
                  <text
                    x={labelX}
                    y={isReversed ? labelY - 14 : labelY + 18}
                    className={isMobile ? "text-[10px] fill-slate-400" : "text-xs fill-slate-400"}
                    transform={isReversed ? `translate(0, ${2 * (labelY - 14)}) scale(1, -1)` : undefined}
                  >
                    {formatRange(node.entry)}
                  </text>

                  {/* Description */}
                  {node.entry.description && selectedNodeId === node.entry.id && (
                    <text
                      x={labelX}
                      y={isReversed ? labelY - 30 : labelY + 34}
                      className={isMobile ? "text-[10px] fill-slate-600" : "text-xs fill-slate-600"}
                      transform={isReversed ? `translate(0, ${2 * (labelY - 30)}) scale(1, -1)` : undefined}
                    >
                      {node.entry.description}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Event Modals */}
      {enableEventPoints && (
        <>
          <EventModal
            isOpen={isEventModalOpen}
            onClose={eventHandlers.handleEventModalClose}
            event={selectedEvent}
          />
          
          <EventListModal
            isOpen={isEventListModalOpen}
            onClose={eventHandlers.handleEventListModalClose}
            yearGroup={selectedYearGroup}
            onEventSelect={eventHandlers.handleEventSelect}
          />
        </>
      )}
    </div>
  );
}
