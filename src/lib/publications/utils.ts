import { PublicationEntry } from '@/types';

/**
 * Publication type labels mapping
 */
export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
  preprint: 'Preprint',
  other: 'Other'
};

/**
 * Publication type color classes mapping
 */
export const PUBLICATION_TYPE_COLORS: Record<string, string> = {
  journal: 'bg-blue-100 text-blue-900 border border-blue-200',
  conference: 'bg-green-100 text-green-900 border border-green-200',
  workshop: 'bg-yellow-100 text-yellow-900 border border-yellow-200',
  preprint: 'bg-gray-100 text-gray-900 border border-gray-200',
  other: 'bg-purple-100 text-purple-900 border border-purple-200'
};

/**
 * Get publication type label
 */
export const getPublicationTypeLabel = (type: string): string => {
  return PUBLICATION_TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Get publication type color classes
 */
export const getPublicationTypeColor = (type: string): string => {
  return PUBLICATION_TYPE_COLORS[type] || 'bg-gray-100 text-gray-900 border border-gray-200';
};

/**
 * Format authors - returns plain string or JSX for highlighting first author
 * Note: This function is meant to be used in React components
 */
export const formatAuthorsString = (authors: string[], isFirstAuthor: boolean): string => {
  if (authors.length === 0) return '';
  return authors.join(', ');
};

/**
 * Sort publications by date (descending), then by year, then by ID
 */
export const sortPublications = (publications: PublicationEntry[]): PublicationEntry[] => {
  return [...publications].sort((a, b) => {
    // If both have dates, sort by date
    if (a.date && b.date) {
      return b.date.localeCompare(a.date);
    }
    // If only one has a date, prioritize the one with date
    if (a.date) return -1;
    if (b.date) return 1;
    // If neither has a date, sort by year
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // Finally, sort by ID for stability
    return a.id.localeCompare(b.id);
  });
};

/**
 * Filter publications based on authorship and peer review status
 */
export const filterPublications = (
  publications: PublicationEntry[],
  filters: {
    showFirstAuthor: boolean;
    showCoAuthor: boolean;
    showPeerReviewed: boolean;
    showNonPeerReviewed: boolean;
  }
): PublicationEntry[] => {
  const { showFirstAuthor, showCoAuthor, showPeerReviewed, showNonPeerReviewed } = filters;
  
  let result = [...publications];
  
  // Check if any filter is active in each category
  const hasAuthorshipFilter = showFirstAuthor || showCoAuthor;
  const hasPeerReviewedFilter = showPeerReviewed || showNonPeerReviewed;
  
  // Apply authorship filter
  if (hasAuthorshipFilter) {
    result = result.filter(pub => {
      if (showFirstAuthor && pub.isFirstAuthor) return true;
      if (showCoAuthor && !pub.isFirstAuthor) return true;
      return false;
    });
  }
  
  // Apply peer reviewed filter
  if (hasPeerReviewedFilter) {
    result = result.filter(pub => {
      if (showPeerReviewed && pub.isPeerReviewed) return true;
      if (showNonPeerReviewed && !pub.isPeerReviewed) return true;
      return false;
    });
  }
  
  return sortPublications(result);
};
