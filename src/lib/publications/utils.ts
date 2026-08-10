import { PublicationEntry } from '@/types';

/**
 * Format authors - returns plain string or JSX for highlighting first author
 * Note: This function is meant to be used in React components
 */
export const formatAuthorsString = (authors: string[]): string => {
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
  const {
    showFirstAuthor,
    showCoAuthor,
    showPeerReviewed,
    showNonPeerReviewed
  } = filters;
  
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
