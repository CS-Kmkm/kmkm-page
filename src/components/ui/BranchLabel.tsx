/**
 * BranchLabel component for displaying career entry information
 */

'use client';

import { ExtendedCareerEntry } from '@/types';

export interface BranchLabelProps {
  entry: ExtendedCareerEntry;
  position: { x: number; y: number };
  alignment: 'left' | 'right';
  color: string;
  isHighlighted?: boolean;
  fontSize?: number;
}

/**
 * Format date for display
 * @param dateStr - ISO date string
 * @returns Formatted date string (YYYY-MM-DD)
 */
function formatDate(dateStr: string): string {
  return dateStr; // Already in YYYY-MM-DD format
}

/**
 * BranchLabel component
 * Displays organization, role, dates, and description next to a node
 */
export default function BranchLabel({
  entry,
  position,
  alignment,
  color,
  isHighlighted = false,
  fontSize = 14,
}: BranchLabelProps) {
  const labelOffset = 20;
  const labelX = alignment === 'right' ? position.x + labelOffset : position.x - labelOffset;
  const textAnchor = alignment === 'right' ? 'start' : 'end';

  const startDate = formatDate(entry.startDate);
  const endDate = entry.endDate ? formatDate(entry.endDate) : '現在';
  const dateRange = `${startDate} - ${endDate}`;

  return (
    <g
      className="branch-label-group"
      aria-describedby={`branch-${entry.id}-details`}
    >
      {/* Background for better readability */}
      <rect
        x={alignment === 'right' ? labelX - 8 : labelX - 200}
        y={position.y - 35}
        width={200}
        height={entry.description ? 90 : 70}
        fill="white"
        fillOpacity={isHighlighted ? 0.95 : 0.9}
        rx={8}
        ry={8}
        stroke={color}
        strokeWidth={isHighlighted ? 2 : 1}
        strokeOpacity={0.3}
        className="transition-all duration-300"
      />

      {/* Organization name */}
      <text
        x={labelX}
        y={position.y - 15}
        textAnchor={textAnchor}
        fontSize={fontSize}
        fontWeight="600"
        fill="#1F2937"
        className="transition-all duration-300"
      >
        {entry.organization.length > 25
          ? `${entry.organization.substring(0, 25)}...`
          : entry.organization}
      </text>

      {/* Role */}
      <text
        x={labelX}
        y={position.y + 2}
        textAnchor={textAnchor}
        fontSize={fontSize - 2}
        fontWeight="500"
        fill="#4B5563"
        className="transition-all duration-300"
      >
        {entry.role.length > 30
          ? `${entry.role.substring(0, 30)}...`
          : entry.role}
      </text>

      {/* Date range */}
      <text
        x={labelX}
        y={position.y + 18}
        textAnchor={textAnchor}
        fontSize={fontSize - 3}
        fill="#6B7280"
        className="transition-all duration-300"
      >
        {dateRange}
      </text>

      {/* Description (if available) */}
      {entry.description && (
        <text
          x={labelX}
          y={position.y + 35}
          textAnchor={textAnchor}
          fontSize={fontSize - 4}
          fill="#9CA3AF"
          className="transition-all duration-300"
        >
          {entry.description.length > 35
            ? `${entry.description.substring(0, 35)}...`
            : entry.description}
        </text>
      )}

      {/* Hidden details for screen readers */}
      <desc id={`branch-${entry.id}-details`}>
        {entry.organization}、{entry.role}。
        期間: {startDate}から{endDate}まで。
        {entry.description && entry.description}
      </desc>
    </g>
  );
}
