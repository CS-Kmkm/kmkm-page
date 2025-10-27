/**
 * GitBranchTimeline - Git graph style branch view
 */

'use client';

import { useMemo, useState } from 'react';
import type { ExtendedCareerEntry, BranchNode, MergeTarget } from '@/types';
import {
  buildBranchTree,
  validateCareerData,
  assignBranchColors,
  getRootNodes,
  sortEntriesByDate,
} from '@/lib/career';
import Timeline from './Timeline';
import { createBranchPath, createMergePath } from './BranchLine';

export interface GitBranchTimelineProps {
  entries: ExtendedCareerEntry[];
  className?: string;
  isReversed?: boolean;
}

interface LayoutNode {
  entry: ExtendedCareerEntry;
  x: number;
  y: number;
  startY: number;
  endY: number;
  lane: number;
  color: string;
  parentId: string | null;
  mergeTargets?: MergeTarget[];
  labelY?: number; // ラベル表示用のY座標（重なり回避用）
  labelX?: number; // ラベル表示用のX座標（重なり回避用）
  branchLineStartY?: number; // ブランチ縦線の開始Y座標（曲線調整用）
  branchLineEndY?: number; // ブランチ縦線の終了Y座標（曲線調整用）
}

const MAIN_LINE_X = 70;
// 横方向の広がりを抑えるためレーン幅を狭くする
const LANE_WIDTH = 30;
const SIBLING_OFFSET = 30; // 兄弟ブランチ間のオフセット（LANE_WIDTHと同じ）
const TOP_PADDING = 80;
const PIXELS_PER_YEAR = 50; // 1年あたりのピクセル数
const MIN_NODE_SPACING = 100; // ノード間の最小間隔（ラベルが重ならないように）
const NODE_RADIUS = 7;

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

function formatYearMonth(date: string | undefined | null): string {
  if (!date) return '現在';
  const [year, month] = date.split('-');
  if (!year || !month) return date;
  return `${year}.${month}`;
}

function formatRange(entry: ExtendedCareerEntry): string {
  const start = formatYearMonth(entry.startDate);
  const end = entry.endDate ? formatYearMonth(entry.endDate) : '現在';
  return `${start} - ${end}`;
}

function getYearLabel(entry: ExtendedCareerEntry, at: 'start' | 'end' = 'end'): string {
  if (entry.year) {
    const parts = entry.year.split('-');
    const targetPart = at === 'start' ? parts[0] : parts[parts.length - 1];
    const match = targetPart.match(/\d{4}/);
    if (match) {
      return match[0];
    }
    const fallbackMatch = parts[0]?.match(/\d{4}/);
    return fallbackMatch ? fallbackMatch[0] : parts[0] ?? '';
  }

  const dateStr = at === 'start'
    ? entry.startDate
    : entry.endDate ?? entry.startDate;

  if (!dateStr) return '';
  const [year] = dateStr.split('-');
  return year ?? '';
}



/**
 * 日付から年数の差分を計算
 */
function getYearsDiff(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

/**
 * 開始日に対応するY座標を計算
 */
function calculateStartY(startDate: string, minDate: Date): number {
  const entryDate = new Date(startDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return TOP_PADDING + (yearsDiff * PIXELS_PER_YEAR);
}

/**
 * 終了日に対応するY座標を計算
 */
function calculateEndY(endDate: string | null, minDate: Date, maxDate: Date): number {
  if (!endDate || endDate === 'null') {
    // 終了日がない場合は現在（maxDate）まで
    const yearsDiff = getYearsDiff(maxDate, minDate);
    return TOP_PADDING + (yearsDiff * PIXELS_PER_YEAR);
  }
  
  const entryDate = new Date(endDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return TOP_PADDING + (yearsDiff * PIXELS_PER_YEAR);
}

// レーン割り当ては「深さ」をベースにする（同じ親を持つブランチは同じ横幅＝同じレーン）
// 例: main直下(深さ1)の全ブランチは同じX、さらにその子(深さ2)も同じX。
// 既存の「兄弟ごとに横方向へずらす」ロジックは意図的に廃止。

function computeLayout(entries: ExtendedCareerEntry[]): LayoutNode[] {
  if (entries.length === 0) {
    return [];
  }

  const branchTree = buildBranchTree(entries);
  const rootNodes = getRootNodes(branchTree);
  assignBranchColors(rootNodes);

  const sortedEntries = sortEntriesByDate(entries);

  // 最小日付と最大日付を取得
  const dates = sortedEntries.flatMap(e => {
    const dates = [new Date(e.startDate)];
    if (e.endDate && e.endDate !== 'null') {
      dates.push(new Date(e.endDate));
    }
    return dates;
  });
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  
  // 最大日付：終了日がないエントリーがある場合は固定の未来日付、それ以外は最大の終了日
  const hasOngoingEntry = sortedEntries.some(e => !e.endDate || e.endDate === 'null');
  
  // ハイドレーションエラーを避けるため、固定の日付を使用
  const fixedFutureDate = new Date('2028-12-31');
  
  const maxDate = hasOngoingEntry 
    ? fixedFutureDate
    : new Date(Math.max(...dates.map(d => d.getTime())));

  // 時期が重複する兄弟ブランチのみにオフセットを適用
  const siblingOffsetMap = new Map<string, number>();
  const parentChildrenMap = new Map<string | null, ExtendedCareerEntry[]>();
  
  // 親ごとに子をグループ化
  sortedEntries.forEach(entry => {
    const parentKey = entry.parentId ?? null;
    const children = parentChildrenMap.get(parentKey) ?? [];
    children.push(entry);
    parentChildrenMap.set(parentKey, children);
  });
  
  // 各親グループ内で時期が重複する子を検出してオフセットを割り当て
  parentChildrenMap.forEach((children) => {
    if (children.length <= 1) {
      // 子が1つだけならオフセット不要
      siblingOffsetMap.set(children[0].id, 0);
      return;
    }
    
    // 時期が重複するかチェック
    const overlappingGroups: ExtendedCareerEntry[][] = [];
    
    children.forEach(child => {
      const childStart = new Date(child.startDate).getTime();
      const childEnd = child.endDate && child.endDate !== 'null' 
        ? new Date(child.endDate).getTime() 
        : Infinity;
      
      // 既存のグループと重複するか確認
      let addedToGroup = false;
      for (const group of overlappingGroups) {
        const overlaps = group.some(sibling => {
          const siblingStart = new Date(sibling.startDate).getTime();
          const siblingEnd = sibling.endDate && sibling.endDate !== 'null'
            ? new Date(sibling.endDate).getTime()
            : Infinity;
          
          // 時期が重複しているか判定
          return !(childEnd <= siblingStart || childStart >= siblingEnd);
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
    
    // 各グループ内でオフセットを割り当て
    overlappingGroups.forEach(group => {
      if (group.length === 1) {
        // 重複していない場合はオフセット0
        siblingOffsetMap.set(group[0].id, 0);
      } else {
        // 重複している場合はインデックスに応じてオフセット
        group.forEach((entry, index) => {
          siblingOffsetMap.set(entry.id, index * SIBLING_OFFSET);
        });
      }
    });
  });

  // 実際の年数に基づいてY座標を計算（調整なし）
  const nodes: LayoutNode[] = sortedEntries.map((entry) => {
    // ブランチの「深さ」をそのままレーンとして使用
    const level = branchTree.allBranches.get(entry.id)?.level ?? 1;
    const lane = level;
    
    // 時期が重複する兄弟ブランチのみオフセットを適用
    const siblingOffset = siblingOffsetMap.get(entry.id) ?? 0;
    
    // 実際の年数に基づいてY座標を計算
    const startY = calculateStartY(entry.startDate, minDate);
    const endY = calculateEndY(entry.endDate ?? null, minDate, maxDate);

    // 曲線調整用の計算
    const curveRadius = 15;
    const dy = endY - startY;
    const verticalSegment = Math.abs(dy) * 0.3;
    const branchLineStartY = startY + verticalSegment + curveRadius;
    const branchLineEndY = entry.endDate ? endY - verticalSegment - curveRadius : endY;

    return {
      entry,
      x: MAIN_LINE_X + lane * LANE_WIDTH + siblingOffset,
      y: startY,
      startY,
      endY,
      lane,
      color: branchTree.allBranches.get(entry.id)?.color ?? '#6B7280',
      parentId: entry.parentId ?? null,
      mergeTargets: entry.mergeTargets,
      branchLineStartY,
      branchLineEndY,
    };
  });

  // 同一の終了日を持つ（かつ親子関係にある）系列は終了Yをそろえる
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

  // ラベルの表示位置を計算（重なりを回避）
  const maxX = Math.max(...nodes.map(n => n.x));
  const baseX = maxX + 18;
  const LABEL_HEIGHT = 50; // ラベル1つあたりの高さ（3行分）
  const COLUMN_WIDTH = 200; // カラムの幅
  const VERTICAL_OFFSET = 30; // 上下にずらす量
  
  const sortedForLabels = [...nodes].sort((a, b) => {
    const aMidY = (a.startY + a.endY) / 2;
    const bMidY = (b.startY + b.endY) / 2;
    return aMidY - bMidY;
  });

  // 全カラムに配置されたラベルを追跡
  interface PlacedLabel {
    node: LayoutNode;
    x: number;
    y: number;
    yStart: number;
    yEnd: number;
  }
  const allPlacedLabels: PlacedLabel[] = [];
  
  sortedForLabels.forEach((node) => {
    const idealY = (node.startY + node.endY) / 2;
    
    // 配置候補を生成（右上、右下、さらに右上、さらに右下...）
    const candidates: Array<{ x: number; y: number; column: number }> = [];
    
    // 基本位置
    candidates.push({ x: baseX, y: idealY, column: 0 });
    
    // 右上・右下の組み合わせ
    for (let col = 0; col < 4; col++) {
      const x = baseX + col * COLUMN_WIDTH;
      candidates.push({ x, y: idealY - VERTICAL_OFFSET, column: col }); // 右上
      candidates.push({ x, y: idealY + VERTICAL_OFFSET, column: col }); // 右下
    }
    
    // 最適な配置を探す
    let bestCandidate = candidates[0];
    let bestScore = Infinity;
    
    for (const candidate of candidates) {
      const candidateStart = candidate.y - LABEL_HEIGHT / 2;
      const candidateEnd = candidate.y + LABEL_HEIGHT / 2;
      
      // 既存のラベルと重なりをチェック
      let hasOverlap = false;
      for (const placed of allPlacedLabels) {
        // 同じカラム（X座標が近い）で重なりをチェック
        if (Math.abs(placed.x - candidate.x) < COLUMN_WIDTH * 0.8) {
          if (!(candidateEnd < placed.yStart || candidateStart > placed.yEnd)) {
            hasOverlap = true;
            break;
          }
        }
      }
      
      if (!hasOverlap) {
        // 重ならない場合、理想位置からの距離でスコアリング
        const distanceFromIdeal = Math.abs(candidate.y - idealY);
        const columnPenalty = candidate.column * 30; // 右のカラムほどペナルティ
        const score = distanceFromIdeal + columnPenalty;
        
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }
    }
    
    // 配置を確定
    node.labelY = bestCandidate.y;
    node.labelX = bestCandidate.x;
    allPlacedLabels.push({
      node,
      x: bestCandidate.x,
      y: bestCandidate.y,
      yStart: bestCandidate.y - LABEL_HEIGHT / 2,
      yEnd: bestCandidate.y + LABEL_HEIGHT / 2,
    });
  });

  return nodes;
}

function groupNodesByLane(nodes: LayoutNode[]): Map<number, LayoutNode[]> {
  const laneGroups = new Map<number, LayoutNode[]>();

  nodes.forEach(node => {
    const list = laneGroups.get(node.lane) ?? [];
    list.push(node);
    laneGroups.set(node.lane, list);
  });

  laneGroups.forEach(list => list.sort((a, b) => a.y - b.y));

  return laneGroups;
}

/**
 * GitBranchTimeline component
 * Renders career timeline as a Git branch graph
 */
export default function GitBranchTimeline({ entries, className = '', isReversed = false }: GitBranchTimelineProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const errors = useMemo(() => validateCareerData(entries), [entries]);

  if (errors.length > 0) {
    return (
      <div className={className}>
        <ErrorDisplay errors={errors} />
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

  const maxLane = nodes.reduce((max, node) => Math.max(max, node.lane), 1);
  const maxEndY = nodes.reduce((max, node) => Math.max(max, node.endY), 0);
  const maxLabelX = nodes.reduce((max, node) => Math.max(max, node.labelX ?? 0), 0);
  const svgWidth = Math.max(MAIN_LINE_X + (maxLane + 1) * LANE_WIDTH + 320, maxLabelX + 250);
  const svgHeight = maxEndY + 20; // 最小限の下部余白
  const mainLineY1 = Math.max(TOP_PADDING - 60, 20);
  const mainLineY2 = maxEndY; // 現在まで続く所属の終端点に合わせる

  // mainブランチの左側に表示する年数ラベルを収集
  const yearLabels: Array<{ y: number; label: string }> = [];
  const yearLabelMap = new Map<string, number>(); // 重複を避けるため

  nodes.forEach(node => {
    // 開始年を追加
    const startYear = node.entry.startDate.split('-')[0];
    if (startYear && !yearLabelMap.has(startYear)) {
      yearLabelMap.set(startYear, node.startY);
      yearLabels.push({ y: node.startY, label: startYear });
    }

    // 終了年を追加（終了日がある場合）
    if (node.entry.endDate && node.entry.endDate !== 'null') {
      const endYear = node.entry.endDate.split('-')[0];
      if (endYear && !yearLabelMap.has(endYear)) {
        yearLabelMap.set(endYear, node.endY);
        yearLabels.push({ y: node.endY, label: endYear });
      }
    }
  });

  // Y座標でソート
  yearLabels.sort((a, b) => a.y - b.y);

  // 親ブランチに開始・終了の目盛りを描く
  // 親がいない場合はメインブランチを親とみなす
  type Tick = { x: number; y: number };
  const startTickMap = new Map<string, Tick>();
  const endTickMap = new Map<string, Tick>();

  nodes.forEach(n => {
    const parentX = n.parentId ? (nodeMap.get(n.parentId)?.x ?? MAIN_LINE_X) : MAIN_LINE_X;
    const yStart = Math.round(n.startY);
    const keyStart = `${parentX}_${yStart}`;
    if (!startTickMap.has(keyStart)) startTickMap.set(keyStart, { x: parentX, y: yStart });

    if (n.entry.endDate) {
      const yEnd = Math.round(n.endY);
      const keyEnd = `${parentX}_${yEnd}`;
      if (!endTickMap.has(keyEnd)) endTickMap.set(keyEnd, { x: parentX, y: yEnd });
    }
  });
  const startTicks = Array.from(startTickMap.values());
  const endTicks = Array.from(endTickMap.values());

  // 親と子の endDate が同じ場合は、子→親の自動合流と親→mainのマージを避け、子→main へ一本の曲線を描く
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

  return (
    <div className={className}>
      <div className="overflow-x-auto p-6">
        <svg width={svgWidth} height={svgHeight} className="min-w-full">
          <g transform={isReversed ? `scale(1, -1) translate(0, -${svgHeight})` : undefined}>
          {/* メインライン */}
          <line
            x1={MAIN_LINE_X}
            y1={mainLineY1}
            x2={MAIN_LINE_X}
            y2={mainLineY2}
            stroke="#9CA3AF"
            strokeWidth={2}
            opacity={0.5}
          />

          {/* メインラインの年ラベル */}
          {yearLabels.map(({ y, label }, index) => (
            <text
              key={`year-label-${label}-${index}`}
              x={MAIN_LINE_X - 16}
              y={y + 4}
              textAnchor="end"
              className="text-xs font-medium fill-slate-500"
              transform={isReversed ? `translate(0, ${2 * (y + 4)}) scale(1, -1)` : undefined}
            >
              {label}年
            </text>
          ))}

          {/* 親ブランチに開始目盛り（薄め） */}
          {startTicks.map((t, idx) => (
            <line
              key={`start-tick-${idx}-${t.x}-${t.y}`}
              x1={t.x - 7}
              y1={t.y}
              x2={t.x + 7}
              y2={t.y}
              stroke="#6B7280"
              strokeWidth={2}
              opacity={0.45}
            />
          ))}

          {/* 親ブランチに終了目盛り（濃いめ） */}
          {endTicks.map((t, idx) => (
            <line
              key={`end-tick-${idx}-${t.x}-${t.y}`}
              x1={t.x - 8}
              y1={t.y}
              x2={t.x + 8}
              y2={t.y}
              stroke="#6B7280"
              strokeWidth={2}
              opacity={0.8}
            />
          ))}

          {/* 各レーンの縦線 */}
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
                  opacity={0.7}
                />
              );
            })
          )}

          {/* 親から子への分岐 */}
          {nodes.map(node => {
            if (!node.parentId) {
              const path = createBranchPath(MAIN_LINE_X, node.startY, node.x, node.startY);
              return (
                <path
                  key={`branch-main-${node.entry.id}`}
                  d={path}
                  stroke={node.color}
                  strokeWidth={2}
                  fill="none"
                  opacity={0.8}
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
                opacity={0.8}
              />
            );
          })}

          {/* マージライン */}
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
                    opacity={0.8}
                  />
                );
              }

              if (target.type === 'main') {
                // 親子同日終了の親ノードは main へのマージ線を抑制（子→main一本化のため）
                if (combinedParentIds.has(node.entry.id)) return null;
                const mergeY = target.at === 'start' ? node.startY : node.endY;
                const path = createMergePath(node.x, node.endY, MAIN_LINE_X, mergeY);

                return (
                  <path
                    key={`merge-${node.entry.id}-main-${index}`}
                    d={path}
                    stroke={node.color}
                    strokeWidth={2}
                    fill="none"
                    opacity={0.8}
                  />
                );
              }

              return null;
            }).filter(Boolean);
          })}

          {/* 終了時に親ブランチへ戻るライン（開始時の分岐と同様の見た目） */}
          {nodes.map(node => {
            if (!node.entry.endDate) return null;
            // 親子同日終了の子ノードは、子→親の自動合流を描かず、後段の子→main 一本合流に任せる
            if (combinedChildIds.has(node.entry.id)) return null;
            const parent = node.parentId ? nodeMap.get(node.parentId) : undefined;
            const targetX = parent ? parent.x : MAIN_LINE_X;
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
                opacity={0.75}
              />
            );
          })}

          {/* 親子同日終了ケースの子→main 一本合流 */}
          {Array.from(combinedChildIds).map((childId) => {
            const child = nodeMap.get(childId);
            if (!child) return null;
            const y = child.endY;
            const path = createMergePath(child.x, child.endY, MAIN_LINE_X, y);
            return (
              <path
                key={`combined-merge-${childId}`}
                d={path}
                stroke={child.color}
                strokeWidth={2}
                fill="none"
                opacity={0.85}
              />
            );
          })}

          {/* メインライン上のポイント（中央位置） */}
          {nodes
            .filter(node => !node.parentId)
            .map(node => (
              <circle
                key={`mainpoint-${node.entry.id}`}
                cx={MAIN_LINE_X}
                cy={(node.startY + node.endY) / 2}
                r={3}
                fill="#9CA3AF"
                opacity={0.6}
              />
            ))}

          {/* ノードとラベル */}
          {nodes.map(node => {
            const midY = (node.startY + node.endY) / 2;
            const labelY = node.labelY ?? midY; // ラベル用のY座標（重なり回避済み）
            const labelX = node.labelX ?? (Math.max(...nodes.map(n => n.x)) + 18); // ラベル用のX座標

            return (
              <g key={`node-${node.entry.id}`}>
                <circle
                  cx={node.x}
                  cy={midY}
                  r={NODE_RADIUS}
                  fill={node.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  style={{ cursor: node.entry.description ? 'pointer' : 'default' }}
                  onClick={() => node.entry.description && setSelectedNodeId(
                    selectedNodeId === node.entry.id ? null : node.entry.id
                  )}
                />

                {/* ノードとラベルを接続線で結ぶ */}
                {(Math.abs(labelY - midY) > 5 || Math.abs(labelX - node.x - 18) > 5) && (
                  <line
                    x1={node.x + NODE_RADIUS}
                    y1={midY}
                    x2={labelX - 2}
                    y2={labelY}
                    stroke={node.color}
                    strokeWidth={1}
                    strokeDasharray="2,2"
                    opacity={0.4}
                  />
                )}

                <text
                  x={labelX}
                  y={isReversed ? labelY + 18 : labelY - 14}
                  className="text-sm font-semibold fill-slate-900"
                  transform={isReversed ? `translate(0, ${2 * (labelY + 18)}) scale(1, -1)` : undefined}
                >
                  {node.entry.organization}
                </text>
                <text
                  x={labelX}
                  y={isReversed ? labelY + 2 : labelY + 2}
                  className="text-xs fill-slate-500"
                  transform={isReversed ? `translate(0, ${2 * (labelY + 2)}) scale(1, -1)` : undefined}
                >
                  {node.entry.role}
                </text>
                <text
                  x={labelX}
                  y={isReversed ? labelY - 14 : labelY + 18}
                  className="text-xs fill-slate-400"
                  transform={isReversed ? `translate(0, ${2 * (labelY - 14)}) scale(1, -1)` : undefined}
                >
                  {formatRange(node.entry)}
                </text>

                {node.entry.description && selectedNodeId === node.entry.id && (
                  <text
                    x={labelX}
                    y={isReversed ? labelY - 30 : labelY + 34}
                    className="text-xs fill-slate-600"
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
    </div>
  );
}
