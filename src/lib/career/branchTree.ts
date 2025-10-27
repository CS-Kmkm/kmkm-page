/**
 * Branch tree construction logic for Git-style career timeline
 */

import { ExtendedCareerEntry, BranchNode, BranchTree } from '@/types';

/**
 * Build a branch tree structure from career entries
 * @param entries - Array of extended career entries
 * @returns Branch tree with main branch and all branches mapped by ID
 */
export function buildBranchTree(entries: ExtendedCareerEntry[]): BranchTree {
  // Create a map of all entries by ID for quick lookup
  const entryMap = new Map<string, ExtendedCareerEntry>();
  entries.forEach(entry => {
    entryMap.set(entry.id, entry);
  });

  // Create branch nodes
  const nodeMap = new Map<string, BranchNode>();
  entries.forEach(entry => {
    nodeMap.set(entry.id, {
      entry,
      parent: null,
      children: [],
      level: 0,
      color: '',
    });
  });

  // Build parent-child relationships
  let mainBranch: BranchNode | null = null;
  const rootNodes: BranchNode[] = [];

  entries.forEach(entry => {
    const node = nodeMap.get(entry.id)!;

    if (!entry.parentId) {
      // This is a root node (branches from main)
      rootNodes.push(node);
      node.level = 1;
    } else {
      // This node has a parent
      const parentNode = nodeMap.get(entry.parentId);
      if (parentNode) {
        node.parent = parentNode;
        parentNode.children.push(node);
        node.level = parentNode.level + 1;
      }
    }
  });

  // Calculate levels for all nodes
  function calculateLevels(node: BranchNode, level: number): void {
    node.level = level;
    node.children.forEach(child => calculateLevels(child, level + 1));
  }

  rootNodes.forEach(node => calculateLevels(node, 1));

  return {
    mainBranch,
    allBranches: nodeMap,
  };
}

/**
 * Get all root nodes (nodes without parents)
 * @param tree - Branch tree
 * @returns Array of root branch nodes
 */
export function getRootNodes(tree: BranchTree): BranchNode[] {
  const roots: BranchNode[] = [];
  tree.allBranches.forEach(node => {
    if (!node.parent) {
      roots.push(node);
    }
  });
  return roots;
}

/**
 * Get all leaf nodes (nodes without children)
 * @param tree - Branch tree
 * @returns Array of leaf branch nodes
 */
export function getLeafNodes(tree: BranchTree): BranchNode[] {
  const leaves: BranchNode[] = [];
  tree.allBranches.forEach(node => {
    if (node.children.length === 0) {
      leaves.push(node);
    }
  });
  return leaves;
}

/**
 * Get all nodes at a specific level
 * @param tree - Branch tree
 * @param level - Level to filter by
 * @returns Array of branch nodes at the specified level
 */
export function getNodesByLevel(tree: BranchTree, level: number): BranchNode[] {
  const nodes: BranchNode[] = [];
  tree.allBranches.forEach(node => {
    if (node.level === level) {
      nodes.push(node);
    }
  });
  return nodes;
}

/**
 * Get the maximum depth of the tree
 * @param tree - Branch tree
 * @returns Maximum depth (number of levels)
 */
export function getMaxDepth(tree: BranchTree): number {
  let maxDepth = 0;
  tree.allBranches.forEach(node => {
    if (node.level > maxDepth) {
      maxDepth = node.level;
    }
  });
  return maxDepth;
}

/**
 * Sort entries by start date (oldest first)
 * @param entries - Array of career entries
 * @returns Sorted array of career entries
 */
export function sortEntriesByDate(entries: ExtendedCareerEntry[]): ExtendedCareerEntry[] {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Get the date range of all entries
 * @param entries - Array of career entries
 * @returns Object with min and max dates
 */
export function getDateRange(entries: ExtendedCareerEntry[]): { min: Date; max: Date } {
  if (entries.length === 0) {
    const now = new Date();
    return { min: now, max: now };
  }

  let minDate = new Date(entries[0].startDate);
  let maxDate = new Date(entries[0].endDate || new Date());

  entries.forEach(entry => {
    const startDate = new Date(entry.startDate);
    const endDate = new Date(entry.endDate || new Date());

    if (startDate < minDate) minDate = startDate;
    if (endDate > maxDate) maxDate = endDate;
  });

  return { min: minDate, max: maxDate };
}
