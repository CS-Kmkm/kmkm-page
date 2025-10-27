/**
 * Color assignment logic for branch visualization
 */

import { BranchNode } from '@/types';

/**
 * Branch color palette with accessibility-compliant colors
 */
export const BRANCH_COLORS = [
  { name: 'blue', value: '#3B82F6', contrast: 'high' },      // Blue
  { name: 'green', value: '#10B981', contrast: 'high' },     // Green
  { name: 'purple', value: '#8B5CF6', contrast: 'high' },    // Purple
  { name: 'orange', value: '#F59E0B', contrast: 'high' },    // Orange
  { name: 'red', value: '#EF4444', contrast: 'high' },       // Red
  { name: 'pink', value: '#EC4899', contrast: 'high' },      // Pink
  { name: 'teal', value: '#14B8A6', contrast: 'high' },      // Teal
  { name: 'indigo', value: '#6366F1', contrast: 'high' },    // Indigo
  { name: 'yellow', value: '#EAB308', contrast: 'high' },    // Yellow
  { name: 'cyan', value: '#06B6D4', contrast: 'high' },      // Cyan
];

/**
 * Main branch color (gray)
 */
export const MAIN_BRANCH_COLOR = '#6B7280';

/**
 * Assign colors to all branches in the tree
 * Ensures adjacent branches have different colors
 * @param branches - Array of branch nodes to assign colors to
 */
export function assignBranchColors(branches: BranchNode[]): void {
  let colorIndex = 0;
  const usedColors = new Map<string, string>();

  /**
   * Recursively assign colors using depth-first search
   * @param branch - Current branch node
   * @param adjacentColors - Set of colors used by adjacent branches
   */
  function assignColor(branch: BranchNode, adjacentColors: Set<string>): void {
    // Main branch (level 0) gets gray color
    if (branch.level === 0) {
      branch.color = MAIN_BRANCH_COLOR;
      usedColors.set(branch.entry.id, MAIN_BRANCH_COLOR);
      return;
    }

    // Find a color that's not used by adjacent branches
    let selectedColor = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];
    let attempts = 0;
    
    while (adjacentColors.has(selectedColor.value) && attempts < BRANCH_COLORS.length) {
      colorIndex++;
      selectedColor = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];
      attempts++;
    }

    // Assign the selected color
    branch.color = selectedColor.value;
    branch.entry.branchColor = selectedColor.value;
    usedColors.set(branch.entry.id, selectedColor.value);
    colorIndex++;

    // Recursively assign colors to children
    // Children should avoid their parent's color and siblings' colors
    const childAdjacentColors = new Set([selectedColor.value]);
    
    branch.children.forEach((child, index) => {
      // Add sibling colors to adjacent set
      if (index > 0) {
        branch.children.slice(0, index).forEach(sibling => {
          if (sibling.color) {
            childAdjacentColors.add(sibling.color);
          }
        });
      }
      
      assignColor(child, childAdjacentColors);
    });
  }

  // Assign colors to all root branches
  const rootBranches = branches.filter(b => !b.parent);
  const rootAdjacentColors = new Set<string>();
  
  rootBranches.forEach((branch, index) => {
    // Add previous siblings' colors to adjacent set
    if (index > 0) {
      rootBranches.slice(0, index).forEach(sibling => {
        if (sibling.color) {
          rootAdjacentColors.add(sibling.color);
        }
      });
    }
    
    assignColor(branch, rootAdjacentColors);
  });
}

/**
 * Get color by branch level (fallback method)
 * @param level - Branch level (0 = main, 1+ = branches)
 * @returns Color hex code
 */
export function getColorByLevel(level: number): string {
  if (level === 0) return MAIN_BRANCH_COLOR;
  return BRANCH_COLORS[(level - 1) % BRANCH_COLORS.length].value;
}

/**
 * Get color by index (for simple sequential coloring)
 * @param index - Color index
 * @returns Color hex code
 */
export function getColorByIndex(index: number): string {
  return BRANCH_COLORS[index % BRANCH_COLORS.length].value;
}

/**
 * Check if a color meets WCAG AA contrast requirements
 * @param color - Hex color code
 * @param background - Background hex color code (default: white)
 * @returns True if contrast ratio is >= 4.5:1
 */
export function meetsContrastRequirements(
  color: string,
  background: string = '#FFFFFF'
): boolean {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(color);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio >= 4.5;
}

/**
 * Validate that all branch colors meet accessibility standards
 * @param branches - Array of branch nodes
 * @returns True if all colors meet standards
 */
export function validateBranchColors(branches: BranchNode[]): boolean {
  return branches.every(branch => {
    if (!branch.color) return false;
    return meetsContrastRequirements(branch.color);
  });
}
