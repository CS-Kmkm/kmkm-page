/**
 * BranchNode component for rendering nodes in Git-style timeline
 */

'use client';

import { useState } from 'react';
import { ExtendedCareerEntry, ComputedBranch } from '@/types';

export interface BranchNodeProps {
  branch: ComputedBranch;
  entry: ExtendedCareerEntry;
  color: string;
  position: { x: number; y: number };
  type: 'start' | 'end' | 'milestone';
  isActive?: boolean;
  radius?: number;
  onHover?: (entry: ExtendedCareerEntry) => void;
  onFocus?: (entry: ExtendedCareerEntry) => void;
}

/**
 * BranchNode component
 * Renders a node (circle) on the timeline with hover and focus effects
 */
export default function BranchNode({
  branch,
  entry,
  color,
  position,
  type,
  isActive = false,
  radius = 8,
  onHover,
  onFocus,
}: BranchNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(entry);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.(entry);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isHighlighted = isHovered || isFocused || isActive;
  const currentRadius = isHighlighted ? radius * 1.3 : radius;

  // Generate ARIA label based on node type
  const getAriaLabel = (): string => {
    const dateStr = new Date(entry.startDate).toLocaleDateString('ja-JP');
    switch (type) {
      case 'start':
        return `${dateStr}に${entry.organization}に入学/入社`;
      case 'end':
        return `${entry.endDate ? new Date(entry.endDate).toLocaleDateString('ja-JP') : '現在'}に${entry.organization}を卒業/退職`;
      case 'milestone':
        return `${dateStr}の${entry.organization}でのマイルストーン`;
      default:
        return `${entry.organization} - ${entry.role}`;
    }
  };

  return (
    <g
      className="branch-node-group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer glow effect when highlighted */}
      {isHighlighted && (
        <circle
          cx={position.x}
          cy={position.y}
          r={currentRadius + 4}
          fill={color}
          opacity={0.3}
          className="transition-all duration-300"
        />
      )}

      {/* Main node circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={currentRadius}
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={2}
        role="img"
        aria-label={getAriaLabel()}
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="transition-all duration-300 cursor-pointer focus:outline-none"
        style={{
          filter: isHighlighted ? 'drop-shadow(0 0 8px currentColor)' : 'none',
        }}
      />

      {/* Inner dot for visual interest */}
      <circle
        cx={position.x}
        cy={position.y}
        r={currentRadius * 0.3}
        fill="#FFFFFF"
        className="transition-all duration-300 pointer-events-none"
      />

      {/* Focus ring for keyboard navigation */}
      {isFocused && (
        <circle
          cx={position.x}
          cy={position.y}
          r={currentRadius + 6}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={3}
          opacity={0.6}
          className="animate-pulse"
        />
      )}
    </g>
  );
}
