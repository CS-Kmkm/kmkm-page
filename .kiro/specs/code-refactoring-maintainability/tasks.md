# Implementation Plan

- [x] 1. Set up Design Token foundation


  - Create extended CSS variables in `globals.css` for semantic color tokens (surface, text, border, interactive, status colors)
  - Update existing CSS variables to align with the new token naming convention
  - Ensure both light and dark mode variables are properly defined
  - _Requirements: 3.1, 3.2, 3.3_



- [x] 2. Create constants and label system

  - [x] 2.1 Create `src/lib/constants/labels.ts` with ARIA labels and UI labels

    - Define ARIA_LABELS object with all accessibility labels in English
    - Define UI_LABELS object with all user-facing button and action labels
    - Export as const for type safety
    - _Requirements: 1.1, 1.2, 1.3_
  

  - [x] 2.2 Create `src/lib/constants/categories.ts` with category configurations

    - Define EventCategory enum with English identifiers
    - Create CATEGORY_CONFIG object mapping categories to labels, colors, and icons
    - Define UpdateCategory enum and configuration
    - Export type definitions for category-related interfaces
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 2.3 Create `src/lib/constants/messages.ts` with user-facing messages


    - Define common messages (empty states, errors, success messages)
    - Define navigation and instruction messages
    - Export as const with proper TypeScript types
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Create Design Token utility system



  - [x] 3.1 Create `src/lib/theme/tokens.ts` with color token utilities

    - Define colorTokens object with semantic token mappings
    - Implement getColorToken utility function with fallback support
    - Define spacing, typography, and shadow tokens
    - Export TypeScript types for token categories
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.2 Update `src/lib/ui/listItemStyles.ts` to use Design Tokens


    - Replace hardcoded Tailwind classes with semantic token references
    - Update badge variants to use token-based colors
    - Maintain existing function signatures for backward compatibility
    - Add JSDoc comments explaining token usage
    - _Requirements: 3.3, 4.1, 4.2, 4.3_
  
  - [x] 3.3 Update `src/lib/ui/modalStyles.ts` to use Design Tokens


    - Replace hardcoded Tailwind classes with semantic token references
    - Update backdrop, container, and button styles to use tokens
    - Maintain existing function signatures for backward compatibility
    - Add JSDoc comments explaining token usage
    - _Requirements: 3.3, 4.1, 4.2, 4.3_

- [x] 4. Create generic Modal component




  - [x] 4.1 Implement `src/components/ui/Modal.tsx` base component

    - Create Modal component with props interface (isOpen, onClose, title, children, size, footer)
    - Implement keyboard navigation (Escape key, Tab trap)
    - Implement focus management (auto-focus on open, restore on close)
    - Add Framer Motion animations with reduced motion support
    - Implement backdrop click to close functionality
    - Add proper ARIA attributes (role, aria-modal, aria-labelledby, aria-describedby)
    - Use Design Tokens for all styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 4.2 Create ModalHeader, ModalContent, ModalFooter sub-components


    - Implement ModalHeader with title and close button
    - Implement ModalContent with scrollable content area
    - Implement ModalFooter with action buttons
    - Use composition pattern for flexibility
    - Apply Design Tokens for consistent styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Migrate existing modals to use generic Modal component




  - [x] 5.1 Refactor EventModal to use new Modal component

    - Replace custom modal implementation with Modal wrapper
    - Move event-specific content to Modal children
    - Update all Japanese text to use constants from labels.ts
    - Replace hardcoded colors with Design Tokens
    - Verify keyboard navigation and accessibility
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_
  

  - [x] 5.2 Refactor EventDetailModal to use new Modal component

    - Replace custom modal implementation with Modal wrapper
    - Update category labels to use CATEGORY_CONFIG
    - Replace Japanese aria-labels with English from ARIA_LABELS
    - Update navigation button labels to use UI_LABELS
    - Replace hardcoded colors with Design Tokens
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_
  

  - [x] 5.3 Refactor EventListModal to use new Modal component

    - Replace custom modal implementation with Modal wrapper
    - Update Japanese title and description to English
    - Replace Japanese aria-labels with English from ARIA_LABELS
    - Update instruction text to use constants
    - Replace hardcoded colors with Design Tokens
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_
  
  - [x] 5.4 Refactor ProjectModal to use new Modal component


    - Replace custom modal implementation with Modal wrapper
    - Update aria-labels to English
    - Replace hardcoded colors with Design Tokens
    - Maintain existing project-specific layout
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_

- [x] 6. Create generic ListItem component



  - [x] 6.1 Implement `src/components/ui/ListItem.tsx` base component

    - Create ListItem component with props interface (title, description, meta, badge, icon, onClick)
    - Implement keyboard interaction (Enter and Space key support)
    - Add proper ARIA attributes and roles
    - Use Design Tokens from listItemStyles for styling
    - Support both button and link variants
    - Ensure minimum touch target size (44x44px)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  
  - [x] 6.2 Create Badge sub-component


    - Implement Badge component with variant support
    - Use CATEGORY_CONFIG for category-based badges
    - Apply Design Tokens for colors
    - Support icon display
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [-] 7. Update list components to use generic ListItem


  - [x] 7.1 Refactor UpdatesList to use ListItem component

    - Replace UpdateCard with ListItem wrapper
    - Update category configuration to use CATEGORY_CONFIG from constants
    - Replace Japanese labels with English from constants
    - Update modal to use new Modal component
    - Replace hardcoded colors with Design Tokens
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_
  
  - [ ] 7.2 Refactor EventList to use ListItem component
    - Replace custom list item implementation with ListItem
    - Update category labels to use CATEGORY_CONFIG
    - Replace Japanese aria-labels with English
    - Apply Design Tokens for styling
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_
  
  - [ ] 7.3 Refactor PublicationList to use ListItem component
    - Replace custom list item implementation with ListItem
    - Update publication type labels to English
    - Replace Japanese aria-labels with English
    - Apply Design Tokens for styling
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.5_

- [x] 8. Update data files with English content



  - [x] 8.1 Update `src/data/career.json` with English text

    - Replace Japanese role names with English equivalents
    - Update description fields to English
    - Maintain existing data structure and IDs
    - Verify data integrity after changes
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 8.2 Update other data files if needed

    - Review and update tech-experience.json if it contains Japanese text
    - Update any other JSON files with Japanese content
    - Ensure consistency across all data files
    - _Requirements: 1.1, 1.2, 1.3_

- [-] 9. Update remaining components with English labels



  - [ ] 9.1 Update TimelineView component
    - Replace Japanese aria-labels with English from ARIA_LABELS
    - Update button text to use UI_LABELS
    - Replace hardcoded colors with Design Tokens
    - _Requirements: 1.1, 1.4, 3.1_

  
  - [x] 9.2 Update ListView component

    - Replace Japanese aria-labels with English from ARIA_LABELS
    - Update heading text to English
    - Apply Design Tokens for styling
    - _Requirements: 1.1, 1.4, 3.1_
  
  - [ ] 9.3 Update BranchNode component
    - Replace Japanese aria-label generation with English
    - Update getAriaLabel function to use English descriptions
    - Apply Design Tokens if applicable
    - _Requirements: 1.1, 1.4_
  
  - [ ] 9.4 Update SocialLinks component
    - Replace Japanese aria-labels with English from ARIA_LABELS
    - Update any Japanese text in the component
    - Apply Design Tokens for styling
    - _Requirements: 1.1, 1.4, 3.1_
  
  - [ ] 9.5 Update FilterModal component
    - Replace Japanese labels with English
    - Update publication type labels to use constants
    - Replace hardcoded colors with Design Tokens
    - _Requirements: 1.1, 1.4, 3.1_

- [ ] 10. Update EventDetailModal helper functions
  - Replace getCategoryLabel function to use CATEGORY_CONFIG
  - Update getCategoryColor to use Design Tokens
  - Replace Japanese labels in the function with English
  - _Requirements: 1.1, 1.4, 3.1_

- [-] 11. Verify and test all changes

  - [x] 11.1 Run TypeScript type checking



    - Execute `npm run type-check` or `tsc --noEmit`
    - Fix any type errors that arise from refactoring
    - Ensure all imports are correctly resolved
    - _Requirements: 5.4_
  
  - [ ] 11.2 Run existing tests
    - Execute `npm test` to run all unit tests
    - Execute `npm run test:e2e` to run Playwright tests
    - Fix any failing tests due to text changes
    - _Requirements: 5.5_
  
  - [ ] 11.3 Manual testing of all pages
    - Test homepage with UpdatesList
    - Test career page with timeline and modals
    - Test publications page with filters and modals
    - Test dev-experience page
    - Verify all modals open and close correctly
    - Verify all keyboard navigation works
    - Test both light and dark modes
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 11.4 Accessibility verification
    - Run axe-core accessibility tests
    - Verify all aria-labels are in English and meaningful
    - Test keyboard navigation on all interactive elements
    - Verify focus management in modals
    - Check color contrast ratios with Design Tokens
    - _Requirements: 5.3_

- [ ] 12. Documentation and cleanup
  - [ ] 12.1 Update component documentation
    - Add JSDoc comments to new components (Modal, ListItem, Badge)
    - Document Design Token usage in style utilities
    - Update README if necessary with new architecture
    - _Requirements: 2.4, 3.1_
  
  - [ ] 12.2 Remove deprecated code
    - Identify and remove any unused old modal implementations
    - Clean up unused imports
    - Remove commented-out code
    - _Requirements: 2.5_
