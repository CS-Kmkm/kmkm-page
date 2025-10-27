/**
 * Layout calculation engine for Git Branch Timeline
 */

import type { ExtendedCareerEntry } from '@/types';
import {
  buildBranchTree,
  assignBranchColors,
  getRootNodes,
  sortEntriesByDate,
} from '@/lib/career';
import { LAYOUT, COLORS } from './constants';
import {
  calculateStartY,
  calculateEndY,
  periodsOverlap,
} from './utils';
import type { LayoutNode, PlacedLabel, LabelCandidate } from './types';

/**
 * Calculate sibling offsets for overlapping branches
 */
function calculateSiblingOffsets(
  sortedEntries: ExtendedCareerEntry[]
): Map<string, number> {
  const siblingOffsetMap = new Map<string, number>();
  const parentChildrenMap = new Map<string | null, ExtendedCareerEntry[]>();
  
  // Group children by parent
  sortedEntries.forEach(entry => {
    const parentKey = entry.parentId ?? null;
    const children = parentChildrenMap.get(parentKey) ?? [];
    children.push(entry);
    parentChildrenMap.set(parentKey, children);
  });
  
  // Detect overlapping siblings and assign offsets
  parentChildrenMap.forEach((children) => {
    if (children.length <= 1) {
      siblingOffsetMap.set(children[0].id, 0);
      return;
    }
    
    const overlappingGroups: ExtendedCareerEntry[][] = [];
    
    children.forEach(child => {
      const childStart = new Date(child.startDate).getTime();
      const childEnd = child.endDate && child.endDate !== 'null' 
        ? new Date(child.endDate).getTime() 
        : Infinity;
      
      let addedToGroup = false;
      for (const group of overlappingGroups) {
        const overlaps = group.some(sibling => {
          const siblingStart = new Date(sibling.startDate).getTime();
          const siblingEnd = sibling.endDate && sibling.endDate !== 'null'
            ? new Date(sibling.endDate).getTime()
            : Infinity;
          
          return periodsOverlap(childStart, childEnd, siblingStart, siblingEnd);
        });
        
        if (overlaps) {
          group.push(child);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        overlappingGroups.push([child]);
      }
    });
    
    // Assign offsets within each group
    overlappingGroups.forEach(group => {
      if (group.length === 1) {
        siblingOffsetMap.set(group[0].id, 0);
      } else {
        group.forEach((entry, index) => {
          siblingOffsetMap.set(entry.id, index * LAYOUT.SIBLING_OFFSET);
        });
      }
    });
  });

  return siblingOffsetMap;
}

/**
 * Align end Y coordinates for entries with same end date
 */
function alignEndDates(nodes: LayoutNode[]): void {
  const byEndDate = new Map<string, LayoutNode[]>();
  
  nodes.forEach(n => {
    if (n.entry.endDate && n.entry.endDate !== 'null') {
      const key = n.entry.endDate;
      const arr = byEndDate.get(key) ?? [];
      arr.push(n);
      byEndDate.set(key, arr);
    }
  });

  byEndDate.forEach(group => {
    if (group.length < 2) return;
    const commonEndY = Math.max(...group.map(n => n.endY));
    group.forEach(n => {
      n.endY = commonEndY;
    });
  });
}

/**
 * Calculate label positions to avoid overlaps
 */
function calculateLabelPositions(nodes: LayoutNode[]): void {
  const maxX = Math.max(...nodes.map(n => n.x));
  const baseX = maxX + 18;
  
  const sortedForLabels = [...nodes].sort((a, b) => {
    const aMidY = (a.startY + a.endY) / 2;
    const bMidY = (b.startY + b.endY) / 2;
    return aMidY - bMidY;
  });

  const allPlacedLabels: PlacedLabel[] = [];
  
  sortedForLabels.forEach((node) => {
    const idealY = (node.startY + node.endY) / 2;
    const candidates: LabelCandidate[] = [];
    
    // Generate placement candidates
    candidates.push({ x: baseX, y: idealY, column: 0 });
    
    for (let col = 0; col < 4; col++) {
      const x = baseX + col * LAYOUT.COLUMN_WIDTH;
      candidates.push({ x, y: idealY - LAYOUT.VERTICAL_OFFSET, column: col });
      candidates.push({ x, y: idealY + LAYOUT.VERTICAL_OFFSET, column: col });
    }
    
    // Find best placement
    let bestCandidate = candidates[0];
    let bestScore = Infinity;
    
    for (const candidate of candidates) {
      const candidateStart = candidate.y - LAYOUT.LABEL_HEIGHT / 2;
      const candidateEnd = candidate.y + LAYOUT.LABEL_HEIGHT / 2;
      
      // Check for overlaps
      let hasOverlap = false;
      for (const placed of allPlacedLabels) {
        if (Math.abs(placed.x - candidate.x) < LAYOUT.COLUMN_WIDTH * 0.8) {
          if (periodsOverlap(candidateStart, candidateEnd, placed.yStart, placed.yEnd)) {
            hasOverlap = true;
            break;
          }
        }
      }
      
      if (!hasOverlap) {
        const distanceFromIdeal = Math.abs(candidate.y - idealY);
        const columnPenalty = candidate.column * 30;
        const score = distanceFromIdeal + columnPenalty;
        
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }
    }
    
    // Finalize placement
    node.labelY = bestCandidate.y;
    node.labelX = bestCandidate.x;
    allPlacedLabels.push({
      node,
      x: bestCandidate.x,
      y: bestCandidate.y,
      yStart: bestCandidate.y - LAYOUT.LABEL_HEIGHT / 2,
      yEnd: bestCandidate.y + LAYOUT.LABEL_HEIGHT / 2,
    });
  });
}

/**
 * Compute layout for all nodes
 */
export function computeLayout(entries: ExtendedCareerEntry[]): LayoutNode[] {
  if (entries.length === 0) {
    return [];
  }

  const branchTree = buildBranchTree(entries);
  const rootNodes = getRootNodes(branchTree);
  assignBranchColors(rootNodes);

  const sortedEntries = sortEntriesByDate(entries);

  // Calculate date range
  const dates = sortedEntries.flatMap(e => {
    const dates = [new Date(e.startDate)];
    if (e.endDate && e.endDate !== 'null') {
      dates.push(new Date(e.endDate));
    }
    return dates;
  });
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  
  const hasOngoingEntry = sortedEntries.some(e => !e.endDate || e.endDate === 'null');
  const fixedFutureDate = new Date('2028-12-31');
  const maxDate = hasOngoingEntry 
    ? fixedFutureDate
    : new Date(Math.max(...dates.map(d => d.getTime())));

  // Calculate sibling offsets
  const siblingOffsetMap = calculateSiblingOffsets(sortedEntries);

  // Create layout nodes
  const nodes: LayoutNode[] = sortedEntries.map((entry) => {
    const level = branchTree.allBranches.get(entry.id)?.level ?? 1;
    const lane = level;
    const siblingOffset = siblingOffsetMap.get(entry.id) ?? 0;
    
    const startY = calculateStartY(entry.startDate, minDate);
    const endY = calculateEndY(entry.endDate ?? null, minDate, maxDate);

    const dy = endY - startY;
    const verticalSegment = Math.abs(dy) * 0.3;
    const branchLineStartY = startY + verticalSegment + LAYOUT.CURVE_RADIUS;
    const branchLineEndY = entry.endDate ? endY - verticalSegment - LAYOUT.CURVE_RADIUS : endY;

    return {
      entry,
      x: LAYOUT.MAIN_LINE_X + lane * LAYOUT.LANE_WIDTH + siblingOffset,
      y: startY,
      startY,
      endY,
      lane,
      color: branchTree.allBranches.get(entry.id)?.color ?? COLORS.DEFAULT_BRANCH,
      parentId: entry.parentId ?? null,
      mergeTargets: entry.mergeTargets,
      branchLineStartY,
      branchLineEndY,
    };
  });

  // Post-process layout
  alignEndDates(nodes);
  calculateLabelPositions(nodes);

  return nodes;
}

/**
 * Group nodes by lane
 */
export function groupNodesByLane(nodes: LayoutNode[]): Map<number, LayoutNode[]> {
  const laneGroups = new Map<number, LayoutNode[]>();

  nodes.forEach(node => {
    const list = laneGroups.get(node.lane) ?? [];
    list.push(node);
    laneGroups.set(node.lane, list);
  });

  laneGroups.forEach(list => list.sort((a, b) => a.y - b.y));

  return laneGroups;
}
