/**
 * Project list display constants and utilities
 */

// Constants for project list display
export const PROJECT_LIST_CONSTANTS = {
  MAX_VISIBLE_PROJECTS: 10,
  PROJECT_ITEM_HEIGHT: 120, // px
} as const;

/**
 * Calculate the maximum height for project list container
 * @param projectCount - Number of projects to display
 * @returns Maximum height in pixels
 */
export const calculateProjectListHeight = (projectCount: number): number => {
  const visibleCount = Math.min(PROJECT_LIST_CONSTANTS.MAX_VISIBLE_PROJECTS, projectCount);
  return visibleCount * PROJECT_LIST_CONSTANTS.PROJECT_ITEM_HEIGHT;
};

/**
 * Get inline style object for project list container
 * @param projectCount - Number of projects to display
 * @returns Style object with maxHeight property
 */
export const getProjectListStyle = (projectCount: number): React.CSSProperties => ({
  maxHeight: `${calculateProjectListHeight(projectCount)}px`,
});