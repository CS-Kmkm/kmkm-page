/**
 * EventPoint - Interactive point on the Git timeline for events
 */

'use client';

import { useState } from 'react';
import { EventPointProps } from '@/types';

/**
 * EventPoint component for displaying clickable event points on the timeline
 */
export default function EventPoint({
  x,
  y,
  eventCount,
  isMultiple,
  onClick,
  onHover,
  isReversed = false,
  className = ''
}: EventPointProps & { isReversed?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  // Unified style for all events
  const baseRadius = 10; // Same size for all events
  const hoverRadius = 12;
  const radius = isHovered ? hoverRadius : baseRadius;

  const baseColor = '#9CA3AF'; // Same as main line color (gray)
  const strokeColor = '#FFFFFF';
  const strokeWidth = 2;

  // Generate accessible label
  const ariaLabel = eventCount === 1
    ? `${eventCount}件のイベント。クリックして詳細を表示`
    : `${eventCount}件のイベント。クリックしてリストを表示`;

  return (
    <g className={`event-point ${className}`}>
      {/* Main event point circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={baseColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="cursor-pointer transition-all duration-200 ease-out"
        style={{
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(156, 163, 175, 0.6))' : 'none',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transformOrigin: `${x}px ${y}px`
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={ariaLabel}
        tabIndex={0}
      />

      {/* Event count text for all events */}
      <text
        x={x}
        y={isReversed ? y - 3 : y + 3}
        textAnchor="middle"
        className="text-xs font-bold fill-white pointer-events-none select-none"
        style={{ fontSize: '10px' }}
        transform={isReversed ? `translate(0, ${2 * (y - 3)}) scale(1, -1)` : undefined}
      >
        {eventCount}
      </text>

      {/* Pulse animation for hover effect */}
      {isHovered && (
        <circle
          cx={x}
          cy={y}
          r={radius + 4}
          fill="none"
          stroke={baseColor}
          strokeWidth={1}
          opacity={0.3}
          className="pointer-events-none animate-ping"
        />
      )}
    </g>
  );
}

/**
 * EventPointGroup - Container for multiple event points with collision detection
 */
interface EventPointGroupProps {
  points: Array<{
    x: number;
    y: number;
    eventCount: number;
    isMultiple: boolean;
    onClick: () => void;
  }>;
  onHover?: (pointIndex: number, isHovered: boolean) => void;
  className?: string;
}

export function EventPointGroup({
  points,
  onHover,
  className = ''
}: EventPointGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Adjust positions to avoid overlapping
  const adjustedPoints = points.map((point, index) => {
    let adjustedY = point.y;

    // Check for collisions with previous points
    for (let i = 0; i < index; i++) {
      const prevPoint = points[i];
      const distance = Math.abs(adjustedY - prevPoint.y);
      const minDistance = 20; // Minimum distance between points

      if (distance < minDistance) {
        adjustedY = prevPoint.y + minDistance;
      }
    }

    return {
      ...point,
      y: adjustedY
    };
  });

  const handlePointHover = (pointIndex: number, isHovered: boolean) => {
    setHoveredIndex(isHovered ? pointIndex : null);
    onHover?.(pointIndex, isHovered);
  };

  return (
    <g className={`event-point-group ${className}`}>
      {adjustedPoints.map((point, index) => (
        <EventPoint
          key={index}
          x={point.x}
          y={point.y}
          eventCount={point.eventCount}
          isMultiple={point.isMultiple}
          onClick={point.onClick}
          onHover={(isHovered) => handlePointHover(index, isHovered)}
          className={hoveredIndex === index ? 'hovered' : ''}
        />
      ))}
    </g>
  );
}