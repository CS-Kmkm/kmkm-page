/**
 * Project list display utilities.
 */

import type { CSSProperties } from 'react';

type ProjectListStyle = CSSProperties & {
  '--project-list-max-height': string;
};

/**
 * Get CSS variables for responsive project list containers.
 * Mobile lists use normal page scrolling; desktop can opt into this viewport-aware cap.
 */
export const getProjectListStyle = (): ProjectListStyle => ({
  '--project-list-max-height': 'min(72vh, 48rem)',
});
