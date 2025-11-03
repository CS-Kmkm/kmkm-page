/**
 * EventPoint - Interactive point on the Git timeline for events
 */

'use client';

import { useState, useMemo } from 'react';
import { EventPointProps } from '@/types';

// Constants for consistent styling
const EVENT_POINT_STYLES = {
  BASE_RADIUS: 10,
  HOVER_RADIUS: 12,
  COLOR: '#9CA3AF', // Same as main line color
  STROKE_COLOR: '#FFFFFF',
  STROKE_WIDTH: 2,
  TEXT_OFFSET: 3,
  PULSE_OFFSET: 4,
  FONT_SIZE: '10px'
} as const;

interface EventPointComponentProps extends EventPointProps {
  isReversed?: boolean;
}

/**
 * EventPoint component for displaying clickable event points on the timeline
 */
export default function EventPoint({
  x,
  y,
  eventCount,
  onClick,
  onHover,
  isReversed = false,
  className = ''
}: EventPointComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Memoized calculations
  const radius = useMemo(() => 
    isHovered ? EVENT_POINT_STYLES.HOVER_RADIUS : EVENT_POINT_STYLES.BASE_RADIUS,
    [isHovered]
  );

  const textY = useMemo(() => 
    isReversed ? y - EVENT_POINT_STYLES.TEXT_OFFSET : y + EVENT_POINT_STYLES.TEXT_OFFSET,
    [y, isReversed]
  );

  const textTransform = useMemo(() => 
    isReversed ? `translate(0, ${2 * textY}) scale(1, -1)` : undefined,
    [isReversed, textY]
  );

  const ariaLabel = useMemo(() => 
    eventCount === 1
      ? `${eventCount}件のイベント。クリックして詳細を表示`
      : `${eventCount}件のイベント。クリックしてリストを表示`,
    [eventCount]
  );

  // Event handlers
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

  return (
    <g className={`event-point ${className}`}>
      {/* Main event point circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={EVENT_POINT_STYLES.COLOR}
        stroke={EVENT_POINT_STYLES.STROKE_COLOR}
        strokeWidth={EVENT_POINT_STYLES.STROKE_WIDTH}
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

      {/* Event count text */}
      <text
        x={x}
        y={textY}
        textAnchor="middle"
        className="text-xs font-bold fill-white pointer-events-none select-none"
        style={{ fontSize: EVENT_POINT_STYLES.FONT_SIZE }}
        transform={textTransform}
      >
        {eventCount}
      </text>

      {/* Pulse animation for hover effect */}
      {isHovered && (
        <circle
          cx={x}
          cy={y}
          r={radius + EVENT_POINT_STYLES.PULSE_OFFSET}
          fill="none"
          stroke={EVENT_POINT_STYLES.COLOR}
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
interface EventPointData {
  x: number;
  y: number;
  eventCount: number;
  onClick: () => void;
}

interface EventPointGroupProps {
  points: EventPointData[];
  onHover?: (pointIndex: number, isHovered: boolean) => void;
  isReversed?: boolean;
  className?: string;
}

const MIN_POINT_DISTANCE = 20;

/**
 * Adjusts Y positions to prevent overlapping event points
 */
function adjustPointPositions(points: EventPointData[]): EventPointData[] {
  return points.map((point, index) => {
    let adjustedY = point.y;

    // Check for collisions with previous points
    for (let i = 0; i < index; i++) {
      const prevPoint = points[i];
      const distance = Math.abs(adjustedY - prevPoint.y);

      if (distance < MIN_POINT_DISTANCE) {
        adjustedY = prevPoint.y + MIN_POINT_DISTANCE;
      }
    }

    return {
      ...point,
      y: adjustedY
    };
  });
}

export function EventPointGroup({
  points,
  onHover,
  isReversed = false,
  className = ''
}: EventPointGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const adjustedPoints = useMemo(() => adjustPointPositions(points), [points]);

  const handlePointHover = (pointIndex: number, isHovered: boolean) => {
    setHoveredIndex(isHovered ? pointIndex : null);
    onHover?.(pointIndex, isHovered);
  };

  return (
    <g className={`event-point-group ${className}`}>
      {adjustedPoints.map((point, index) => (
        <EventPoint
          key={`event-point-${index}`}
          x={point.x}
          y={point.y}
          eventCount={point.eventCount}
          isMultiple={point.eventCount > 1}
          onClick={point.onClick}
          onHover={(isHovered) => handlePointHover(index, isHovered)}
          isReversed={isReversed}
          className={hoveredIndex === index ? 'hovered' : ''}
        />
      ))}
    </g>
  );
}